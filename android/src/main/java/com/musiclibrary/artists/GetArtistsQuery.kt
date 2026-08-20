package com.musiclibrary.artists

import android.content.ContentResolver
import android.provider.MediaStore
import android.net.Uri
import android.provider.DocumentsContract
import com.musiclibrary.models.*
import com.musiclibrary.utils.readCursorPage
import androidx.core.net.toUri

object GetArtistsQuery {
  fun getArtists(
    contentResolver: ContentResolver,
    options: ArtistOptions,
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

    val totalCount = cursor.count

    return cursor.use { c ->
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

      val maxItems = options.first.coerceAtMost(1000) // Limit the maximum number of queries
      val page = readCursorPage(
        canReadFirst = foundAfter,
        maxItems = maxItems,
        readItem = {
          val id = c.getLong(idColumn)
          val artistName = c.getString(artistColumn) ?: ""
          val albumCount = c.getInt(albumCountColumn)
          val trackCount = c.getInt(trackCountColumn)

          // Skip invalid artists
          if (artistName.isEmpty() || trackCount == 0) {
            null
          } else {
            // Create an Artist
            Artist(
              id = id.toString(),
              title = artistName,
              albumCount = albumCount,
              trackCount = trackCount
            )
          }
        },
        moveToNext = c::moveToNext,
        isAfterLast = { c.isAfterLast },
      )

      PaginatedResult(
        items = page.items,
        hasNextPage = page.hasNextPage,
        endCursor = page.items.lastOrNull()?.id,
        totalCount = totalCount
      )
    }
  }

  private fun buildSelection(options: ArtistOptions): String {
    val conditions = mutableListOf<String>()

    // Only query artists that have tracks
    conditions.add("${MediaStore.Audio.Artists.NUMBER_OF_TRACKS} > 0")

    return conditions.joinToString(" AND ")
  }

  private fun buildSelectionArgs(options: ArtistOptions): Array<String>? {
    return null
  }

  private fun buildSortOrder(sortBy: List<SortOption>): String {
    if (sortBy.isEmpty()) {
      return "${MediaStore.Audio.Artists.ARTIST} ASC"
    }

    return sortBy.joinToString(", ") { sortOption ->
      val column = when (sortOption.key.lowercase()) {
        "default" -> MediaStore.Audio.Artists.ARTIST
        "title" -> MediaStore.Audio.Artists.ARTIST
        "trackcount" -> MediaStore.Audio.Artists.NUMBER_OF_TRACKS
        "albumcount" -> MediaStore.Audio.Artists.NUMBER_OF_ALBUMS
        else -> throw IllegalArgumentException("Unsupported SortKey for artists: ${sortOption.key}")
      }

      val order = if (sortOption.ascending) "ASC" else "DESC"
      "$column $order"
    }
  }
}
