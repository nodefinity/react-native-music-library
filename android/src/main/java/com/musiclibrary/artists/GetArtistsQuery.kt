package com.musiclibrary.artists

import android.content.ContentResolver
import android.provider.MediaStore
import com.musiclibrary.models.*
import com.musiclibrary.utils.moveToPageStart
import com.musiclibrary.utils.readCursorPage
import com.musiclibrary.utils.validatePageSize

object GetArtistsQuery {
  fun getArtists(
    contentResolver: ContentResolver,
    options: ArtistOptions,
  ): PaginatedResult<Artist> {
    validatePageSize(options.first)

    val projection = arrayOf(
      MediaStore.Audio.Artists._ID,
      MediaStore.Audio.Artists.ARTIST,
      MediaStore.Audio.Artists.NUMBER_OF_ALBUMS,
      MediaStore.Audio.Artists.NUMBER_OF_TRACKS,
    )

    val selection = buildSelection(options)
    val selectionArgs = buildSelectionArgs(options)
    val sortOrder = buildArtistSortOrder(options.sortBy)

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

      val foundAfter = moveToPageStart(
        after = options.after,
        moveToFirst = c::moveToFirst,
        currentId = { c.getLong(idColumn).toString() },
        moveToNext = c::moveToNext,
      )

      val page = readCursorPage(
        canReadFirst = foundAfter,
        maxItems = options.first,
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

  internal fun buildArtistSortOrder(sortBy: List<SortOption>): String {
    val options = sortBy.ifEmpty { listOf(SortOption("default", true)) }
    val descriptors = options.map { sortOption ->
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

    return (descriptors + "${MediaStore.Audio.Artists._ID} ASC").joinToString(", ")
  }
}
