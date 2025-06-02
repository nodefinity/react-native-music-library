package com.musiclibrary.utils

import android.content.ContentResolver
import android.content.ContentUris
import android.database.Cursor
import android.net.Uri
import android.provider.MediaStore
import android.util.Base64
import com.musiclibrary.models.*
import java.io.ByteArrayOutputStream
import java.io.IOException
import java.io.InputStream

object GetTracksQuery {

  fun getTracks(
    contentResolver: ContentResolver,
    options: AssetsOptions
  ): PaginatedResult<Track> {
    val projection = arrayOf(
      MediaStore.Audio.Media._ID,
      MediaStore.Audio.Media.TITLE,
      MediaStore.Audio.Media.ARTIST,
      MediaStore.Audio.Media.ALBUM,
      MediaStore.Audio.Media.DURATION,
      MediaStore.Audio.Media.DATA,
      MediaStore.Audio.Media.DATE_ADDED,
      MediaStore.Audio.Media.SIZE,
      MediaStore.Audio.Media.ALBUM_ID
    )

    val selection = buildSelection(options)
    val selectionArgs = buildSelectionArgs(options)
    val sortOrder = buildSortOrder(options.sortBy)

    val cursor = contentResolver.query(
      MediaStore.Audio.Media.EXTERNAL_CONTENT_URI,
      projection,
      selection,
      selectionArgs,
      sortOrder
    ) ?: throw RuntimeException("Failed to query MediaStore: cursor is null")

    val tracks = mutableListOf<Track>()
    var hasNextPage = false
    var endCursor: String? = null

    cursor.use { c ->
      val idColumn = c.getColumnIndexOrThrow(MediaStore.Audio.Media._ID)
      val titleColumn = c.getColumnIndexOrThrow(MediaStore.Audio.Media.TITLE)
      val artistColumn = c.getColumnIndexOrThrow(MediaStore.Audio.Media.ARTIST)
      val albumColumn = c.getColumnIndexOrThrow(MediaStore.Audio.Media.ALBUM)
      val durationColumn = c.getColumnIndexOrThrow(MediaStore.Audio.Media.DURATION)
      val dataColumn = c.getColumnIndexOrThrow(MediaStore.Audio.Media.DATA)
      val dateAddedColumn = c.getColumnIndexOrThrow(MediaStore.Audio.Media.DATE_ADDED)
      val sizeColumn = c.getColumnIndexOrThrow(MediaStore.Audio.Media.SIZE)
      val albumIdColumn = c.getColumnIndexOrThrow(MediaStore.Audio.Media.ALBUM_ID)

      // Jump to the specified start position
      if (options.after != null) {
        var found = false
        while (c.moveToNext()) {
          val id = c.getLong(idColumn).toString()
          if (id == options.after) {
            found = true
            break
          }
        }
        if (!found && c.count > 0) {
          throw IllegalArgumentException("Invalid cursor position: ${options.after}")
        }
      }

      var count = 0
      val maxItems = options.first.coerceAtMost(1000) // Limit the maximum number of queries

      while (c.moveToNext() && count < maxItems) {
        try {
          val id = c.getLong(idColumn)
          val title = c.getString(titleColumn) ?: ""
          val artist = c.getString(artistColumn) ?: "Unknown Artist"
          val album = c.getString(albumColumn) ?: "Unknown Album"
          val duration = c.getLong(durationColumn) / 1000.0 // Convert to seconds
          val data = c.getString(dataColumn) ?: ""
          val dateAdded = c.getLong(dateAddedColumn)
          val size = c.getLong(sizeColumn)
          val albumId = c.getLong(albumIdColumn)

          // Skip invalid data
          if (data.isEmpty()) {
            continue
          }

          // Get album cover (return empty string if failed)
          val artwork = try {
            // getAlbumArtwork(contentResolver, albumId)
            ""
          } catch (e: Exception) {
            ""
          }

          val track = Track(
            id = id.toString(),
            title = title,
            artwork = artwork,
            artist = artist,
            album = album,
            genre = "", // Get genre from MediaStore requires additional query
            duration = duration,
            uri = "file://$data",
            createdAt = dateAdded * 1000, // Convert to milliseconds
            modifiedAt = dateAdded * 1000, // Convert to milliseconds
          )

          tracks.add(track)
          endCursor = id.toString()
          count++
        } catch (e: Exception) {
          // Continue processing other tracks if a single track fails to parse
          continue
        }
      }

      // Check if there are more data
      hasNextPage = c.moveToNext()
    }

    return PaginatedResult(
      items = tracks,
      hasNextPage = hasNextPage,
      endCursor = endCursor,
      totalCount = null
    )
  }

  private fun buildSelection(options: AssetsOptions): String {
    val conditions = mutableListOf<String>()
    
    // Only query audio files
    conditions.add("${MediaStore.Audio.Media.IS_MUSIC} = 1")
    
    // Filter out damaged files
    conditions.add("${MediaStore.Audio.Media.DURATION} > 0")
    
    // Directory
    if (!options.directory.isNullOrEmpty()) {
      conditions.add("${MediaStore.Audio.Media.DATA} LIKE ?")
    }
    
    return conditions.joinToString(" AND ")
  }

  private fun buildSelectionArgs(options: AssetsOptions): Array<String>? {
    val args = mutableListOf<String>()
    
    if (!options.directory.isNullOrEmpty()) {
      args.add("${options.directory}%")
    }
    
    return if (args.isEmpty()) null else args.toTypedArray()
  }

  private fun buildSortOrder(sortBy: SortBy?): String {
    return when (sortBy) {
      is SortBy.Single -> {
        val column = getSortColumn(sortBy.key)
        "$column DESC"
      }
      is SortBy.WithOrder -> {
        val column = getSortColumn(sortBy.key)
        val order = if (sortBy.ascending) "ASC" else "DESC"
        "$column $order"
      }
      null -> "${MediaStore.Audio.Media.DATE_ADDED} DESC"
    }
  }

  private fun getSortColumn(sortKey: SortKey): String {
    return when (sortKey) {
      SortKey.DEFAULT -> MediaStore.Audio.Media.TITLE
      SortKey.ARTIST -> MediaStore.Audio.Media.ARTIST
      SortKey.ALBUM -> MediaStore.Audio.Media.ALBUM
      SortKey.DURATION -> MediaStore.Audio.Media.DURATION
      SortKey.CREATED_AT -> MediaStore.Audio.Media.DATE_ADDED
      SortKey.MODIFIED_AT -> MediaStore.Audio.Media.DATE_MODIFIED
      SortKey.GENRE -> MediaStore.Audio.Media.GENRE
      SortKey.TRACK_COUNT -> MediaStore.Audio.Media.TRACK
      else -> MediaStore.Audio.Media.DATE_ADDED
    }
  }

  private fun getAlbumArtwork(contentResolver: ContentResolver, albumId: Long): String {
    val albumArtUri = ContentUris.withAppendedId(
      Uri.parse("content://media/external/audio/albumart"),
      albumId
    )
    
    val inputStream = contentResolver.openInputStream(albumArtUri) ?: return ""
    
    return inputStream.use { stream ->
      val buffer = ByteArrayOutputStream()
      val data = ByteArray(1024)
      var nRead: Int
      while (stream.read(data, 0, data.size).also { nRead = it } != -1) {
        buffer.write(data, 0, nRead)
      }
      buffer.flush()
      val imageBytes = buffer.toByteArray()
      
      // Simple size check
      if (imageBytes.size > 5 * 1024 * 1024) { // 5MB limit
        return ""
      }
      
      "data:image/jpeg;base64," + Base64.encodeToString(imageBytes, Base64.DEFAULT)
    }
  }
} 