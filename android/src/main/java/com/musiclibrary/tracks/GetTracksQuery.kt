package com.musiclibrary.tracks

import android.content.ContentResolver
import android.os.Build
import android.provider.MediaStore
import android.net.Uri
import android.provider.DocumentsContract
import com.musiclibrary.models.*
import androidx.core.net.toUri

object GetTracksQuery {

  fun getTracks(
    contentResolver: ContentResolver,
    options: AssetsOptions,
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
      MediaStore.Audio.Media.ALBUM_ID,
      MediaStore.Audio.Media.GENRE
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
    val totalCount = cursor.count

    cursor.use { c ->
      val idColumn = c.getColumnIndexOrThrow(MediaStore.Audio.Media._ID)
      val titleColumn = c.getColumnIndexOrThrow(MediaStore.Audio.Media.TITLE)
      val artistColumn = c.getColumnIndexOrThrow(MediaStore.Audio.Media.ARTIST)
      val albumColumn = c.getColumnIndexOrThrow(MediaStore.Audio.Media.ALBUM)
      val durationColumn = c.getColumnIndexOrThrow(MediaStore.Audio.Media.DURATION)
      val dataColumn = c.getColumnIndexOrThrow(MediaStore.Audio.Media.DATA)
      val dateAddedColumn = c.getColumnIndexOrThrow(MediaStore.Audio.Media.DATE_ADDED)
      val sizeColumn = c.getColumnIndexOrThrow(MediaStore.Audio.Media.SIZE)
      val genreColumn = c.getColumnIndexOrThrow(MediaStore.Audio.Media.GENRE)
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
          val fileSize = c.getLong(sizeColumn)
          val genre = c.getString(genreColumn) ?: ""
          val albumId = c.getLong(albumIdColumn)
          val artworkUri: Uri = "content://media/external/audio/media/${id}/albumart".toUri()

          // Skip invalid data
          if (data.isEmpty()) {
            continue
          }

          val track = Track(
            id = id.toString(),
            title = title,
            artwork = artworkUri.toString(),
            artist = artist,
            album = album,
            genre = genre,
            duration = duration,
            uri = "file://$data",
            createdAt = dateAdded * 1000, // Convert to milliseconds
            modifiedAt = dateAdded * 1000, // Convert to milliseconds
            fileSize = fileSize
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
      totalCount = totalCount
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
      val dir = if (options.directory.startsWith("content://")) {
        uriToFullPath(options.directory.toUri())
      } else {
        options.directory
      }

      if (!dir.isNullOrEmpty()) {
        args.add("$dir%")
      }
    }

    return if (args.isEmpty()) null else args.toTypedArray()
  }

  private fun uriToFullPath(treeUri: Uri): String? {
    val docId = DocumentsContract.getTreeDocumentId(treeUri) // "primary:Music/abc"
    val parts = docId.split(":")
    if (parts.size < 2) return null

    val type = parts[0]
    val relativePath = parts[1]

    return when (type) {
      "primary" -> "/storage/emulated/0/$relativePath"
      else -> "/storage/$type/$relativePath"
    }
  }

  private fun buildSortOrder(sortBy: List<String>): String {
    if (sortBy.isEmpty()) {
      return "${MediaStore.Audio.Media.DATE_ADDED} DESC"
    }

    return sortBy.joinToString(", ") { sortOption ->
      val parts = sortOption.split(" ")
      require(parts.size == 2) { "sortBy should be 'key order'" }

      val column = when (parts[0].lowercase()) {
        "default" -> MediaStore.Audio.Media.TITLE
        "artist" -> MediaStore.Audio.Media.ARTIST
        "album" -> MediaStore.Audio.Media.ALBUM
        "duration" -> MediaStore.Audio.Media.DURATION
        "created_at" -> MediaStore.Audio.Media.DATE_ADDED
        "modified_at" -> MediaStore.Audio.Media.DATE_MODIFIED
        "genre" -> if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
          MediaStore.Audio.Media.GENRE
        } else {
          null
        }

        "track_count" -> MediaStore.Audio.Media.TRACK
        else -> throw IllegalArgumentException("Unsupported SortKey: ${parts[0]}")
      }

      val order = parts[1].uppercase()
      require(order == "ASC" || order == "DESC") { "Sort By must be ASC or DESC" }

      if (column == null) {
        return@joinToString ""
      }

      "$column $order"
    }
  }
}
