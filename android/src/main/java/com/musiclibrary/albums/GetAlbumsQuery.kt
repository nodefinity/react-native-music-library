package com.musiclibrary.albums

import android.content.ContentResolver
import android.provider.MediaStore
import android.net.Uri
import android.provider.DocumentsContract
import com.musiclibrary.models.*
import androidx.core.net.toUri

object GetAlbumsQuery {
  fun getAlbums(
    contentResolver: ContentResolver,
    options: AlbumOptions,
  ): PaginatedResult<Album> {
    val projection = arrayOf(
      MediaStore.Audio.Albums._ID,
      MediaStore.Audio.Albums.ALBUM,
      MediaStore.Audio.Albums.ARTIST,
      MediaStore.Audio.Albums.NUMBER_OF_SONGS,
      MediaStore.Audio.Albums.FIRST_YEAR,
    )

    val selection = buildSelection(options)
    val selectionArgs = buildSelectionArgs(options)
    val sortOrder = buildSortOrder(options.sortBy)

    val cursor = contentResolver.query(
      MediaStore.Audio.Albums.EXTERNAL_CONTENT_URI,
      projection,
      selection,
      selectionArgs,
      sortOrder
    ) ?: throw RuntimeException("Failed to query MediaStore: cursor is null")

    val albums = mutableListOf<Album>()
    var hasNextPage: Boolean
    var endCursor: String? = null
    val totalCount = cursor.count

    cursor.use { c ->
      val idColumn = c.getColumnIndexOrThrow(MediaStore.Audio.Albums._ID)
      val albumColumn = c.getColumnIndexOrThrow(MediaStore.Audio.Albums.ALBUM)
      val artistColumn = c.getColumnIndexOrThrow(MediaStore.Audio.Albums.ARTIST)
      val trackCountColumn = c.getColumnIndexOrThrow(MediaStore.Audio.Albums.NUMBER_OF_SONGS)
      val firstYearColumn = c.getColumnIndexOrThrow(MediaStore.Audio.Albums.FIRST_YEAR)

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
          val albumTitle = c.getString(albumColumn) ?: ""
          val artist = c.getString(artistColumn) ?: ""
          val trackCount = c.getInt(trackCountColumn)
          val firstYear = c.getInt(firstYearColumn)

          // Skip invalid albums
          if (albumTitle.isEmpty() || trackCount == 0) {
            continue
          }

          // Get artwork URI
          val artworkUri: Uri = "content://media/external/audio/albumart/${id}".toUri()

          // Create an Album
          val album = Album(
            id = id.toString(),
            title = albumTitle,
            artist = artist,
            artwork = artworkUri.toString(),
            trackCount = trackCount,
            year = if (firstYear > 0) firstYear else null
          )

          albums.add(album)
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
      items = albums,
      hasNextPage = hasNextPage,
      endCursor = endCursor,
      totalCount = totalCount
    )
  }

  private fun buildSelection(options: AlbumOptions): String {
    val conditions = mutableListOf<String>()

    // Only query albums that have tracks
    conditions.add("${MediaStore.Audio.Albums.NUMBER_OF_SONGS} > 0")

    return conditions.joinToString(" AND ")
  }

  private fun buildSelectionArgs(options: AlbumOptions): Array<String>? {
    return null
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
      return "${MediaStore.Audio.Albums.ALBUM} ASC"
    }

    return sortBy.joinToString(", ") { sortOption ->
      val parts = sortOption.split(" ")
      require(parts.size == 2) { "sortBy should be 'key order'" }

      val column = when (parts[0].lowercase()) {
        "default" -> MediaStore.Audio.Albums.ALBUM
        "title" -> MediaStore.Audio.Albums.ALBUM
        "artist" -> MediaStore.Audio.Albums.ARTIST
        "trackcount" -> MediaStore.Audio.Albums.NUMBER_OF_SONGS
        "year" -> MediaStore.Audio.Albums.FIRST_YEAR
        else -> throw IllegalArgumentException("Unsupported SortKey for albums: ${parts[0]}")
      }

      val order = parts[1].uppercase()
      require(order == "ASC" || order == "DESC") { "Sort By must be ASC or DESC" }

      "$column $order"
    }
  }
}
