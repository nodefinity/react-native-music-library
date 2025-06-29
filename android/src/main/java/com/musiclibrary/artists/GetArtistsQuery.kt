package com.musiclibrary.artists

import android.content.ContentResolver
import android.provider.MediaStore
import android.net.Uri
import android.provider.DocumentsContract
import com.musiclibrary.models.*
import androidx.core.net.toUri

object GetArtistsQuery {
  fun getArtists(
    contentResolver: ContentResolver,
    options: AssetsOptions,
  ): PaginatedResult<Artist> {
    val projection = arrayOf(
      MediaStore.Audio.Artists._ID,
      MediaStore.Audio.Artists.ARTIST,
      MediaStore.Audio.Artists.NUMBER_OF_ALBUMS,
      MediaStore.Audio.Artists.NUMBER_OF_TRACKS,
    )

    val selection = buildSelection(options)
    val selectionArgs = buildSelectionArgs(options)
    val sortOrder = buildSortOrder(options.sortBy)

    val cursor = contentResolver.query(
      MediaStore.Audio.Artists.EXTERNAL_CONTENT_URI,
      projection,
      selection,
      selectionArgs,
      sortOrder
    ) ?: throw RuntimeException("Failed to query MediaStore: cursor is null")

    val artists = mutableListOf<Artist>()
    var hasNextPage: Boolean
    var endCursor: String? = null
    val totalCount = cursor.count

    cursor.use { c ->
      val idColumn = c.getColumnIndexOrThrow(MediaStore.Audio.Artists._ID)
      val artistColumn = c.getColumnIndexOrThrow(MediaStore.Audio.Artists.ARTIST)
      val albumCountColumn = c.getColumnIndexOrThrow(MediaStore.Audio.Artists.NUMBER_OF_ALBUMS)
      val trackCountColumn = c.getColumnIndexOrThrow(MediaStore.Audio.Artists.NUMBER_OF_TRACKS)

      // Jump to the specified start position
      val foundAfter = if (options.after == null) {
        cursor.moveToFirst() // Move to the first record
        true
      } else {
        var found = false
        if (cursor.moveToFirst()) {
          do {
            val id = cursor.getLong(idColumn).toString()
            if (id == options.after) {
              found = true
              break
            }
          } while (cursor.moveToNext())
        }
        // Move to the next record after the specified after if found
        found && cursor.moveToNext()
      }

      var count = 0
      val maxItems = options.first.coerceAtMost(1000) // Limit the maximum number of queries

      while (foundAfter && count < maxItems) {
        try {
          val id = c.getLong(idColumn)
          val artistName = c.getString(artistColumn) ?: ""
          val albumCount = c.getInt(albumCountColumn)
          val trackCount = c.getInt(trackCountColumn)

          // Skip invalid artists
          if (artistName.isEmpty() || trackCount == 0) {
            continue
          }

          // Create an Artist
          val artist = Artist(
            id = id.toString(),
            title = artistName,
            albumCount = albumCount,
            trackCount = trackCount
          )

          artists.add(artist)
          endCursor = id.toString()
          count++
        } catch (e: Exception) {
          continue
        }

        if (!cursor.moveToNext()) break
      }

      // Check if there are more data
      hasNextPage = !c.isAfterLast
    }

    return PaginatedResult(
      items = artists,
      hasNextPage = hasNextPage,
      endCursor = endCursor,
      totalCount = totalCount
    )
  }

  private fun buildSelection(options: AssetsOptions): String {
    val conditions = mutableListOf<String>()

    // Only query artists that have tracks
    conditions.add("${MediaStore.Audio.Artists.NUMBER_OF_TRACKS} > 0")

    // Directory filtering for artists is more complex since artists don't have direct path
    // We'll need to filter based on tracks by the artist
    if (!options.directory.isNullOrEmpty()) {
      // Filter artists that have tracks in the specified directory
      conditions.add("EXISTS (SELECT 1 FROM ${MediaStore.Audio.Media.EXTERNAL_CONTENT_URI} WHERE ${MediaStore.Audio.Media.ARTIST_ID} = ${MediaStore.Audio.Artists._ID} AND ${MediaStore.Audio.Media.DATA} LIKE ?)")
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
      return "${MediaStore.Audio.Artists.ARTIST} ASC"
    }

    return sortBy.joinToString(", ") { sortOption ->
      val parts = sortOption.split(" ")
      require(parts.size == 2) { "sortBy should be 'key order'" }

      val column = when (parts[0].lowercase()) {
        "default" -> MediaStore.Audio.Artists.ARTIST
        "artist" -> MediaStore.Audio.Artists.ARTIST
        "album_count" -> MediaStore.Audio.Artists.NUMBER_OF_ALBUMS
        "track_count" -> MediaStore.Audio.Artists.NUMBER_OF_TRACKS
        else -> throw IllegalArgumentException("Unsupported SortKey: ${parts[0]}")
      }

      val order = parts[1].uppercase()
      require(order == "ASC" || order == "DESC") { "Sort By must be ASC or DESC" }

      "$column $order"
    }
  }
}
