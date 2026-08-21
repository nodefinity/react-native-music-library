package com.musiclibrary.albums

import android.content.ContentResolver
import android.provider.MediaStore
import com.musiclibrary.models.*
import com.musiclibrary.utils.moveToPageStart
import com.musiclibrary.utils.readCursorPage
import com.musiclibrary.utils.validatePageSize

object GetAlbumsQuery {
  fun getAlbums(
    contentResolver: ContentResolver,
    options: AlbumOptions,
  ): PaginatedResult<Album> {
    validatePageSize(options.first)

    val projection = arrayOf(
      MediaStore.Audio.Albums._ID,
      MediaStore.Audio.Albums.ALBUM,
      MediaStore.Audio.Albums.ARTIST,
      MediaStore.Audio.Albums.NUMBER_OF_SONGS,
      MediaStore.Audio.Albums.FIRST_YEAR,
    )

    val selection = buildSelection(options)
    val selectionArgs = buildSelectionArgs(options)
    val sortOrder = buildAlbumSortOrder(options.sortBy)

    val cursor = contentResolver.query(
      MediaStore.Audio.Albums.EXTERNAL_CONTENT_URI,
      projection,
      selection,
      selectionArgs,
      sortOrder
    ) ?: throw RuntimeException("Failed to query MediaStore: cursor is null")

    val totalCount = cursor.count

    return cursor.use { c ->
      val idColumn = c.getColumnIndexOrThrow(MediaStore.Audio.Albums._ID)
      val albumColumn = c.getColumnIndexOrThrow(MediaStore.Audio.Albums.ALBUM)
      val artistColumn = c.getColumnIndexOrThrow(MediaStore.Audio.Albums.ARTIST)
      val trackCountColumn = c.getColumnIndexOrThrow(MediaStore.Audio.Albums.NUMBER_OF_SONGS)
      val firstYearColumn = c.getColumnIndexOrThrow(MediaStore.Audio.Albums.FIRST_YEAR)

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
          val albumTitle = c.getString(albumColumn) ?: ""
          val artist = c.getString(artistColumn) ?: ""
          val trackCount = c.getInt(trackCountColumn)
          val firstYear = c.getInt(firstYearColumn)

          // Skip invalid albums
          if (albumTitle.isEmpty() || trackCount == 0) {
            null
          } else {
            // Get artwork URI
            // Create an Album
            Album(
              id = id.toString(),
              title = albumTitle,
              artist = artist,
              artwork = "content://media/external/audio/albumart/$id",
              trackCount = trackCount,
              year = if (firstYear > 0) firstYear else null
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

  private fun buildSelection(options: AlbumOptions): String {
    val conditions = mutableListOf<String>()

    // Only query albums that have tracks
    conditions.add("${MediaStore.Audio.Albums.NUMBER_OF_SONGS} > 0")

    return conditions.joinToString(" AND ")
  }

  private fun buildSelectionArgs(options: AlbumOptions): Array<String>? {
    return null
  }

  internal fun buildAlbumSortOrder(sortBy: List<SortOption>): String {
    val options = sortBy.ifEmpty { listOf(SortOption("default", true)) }
    val descriptors = options.map { sortOption ->
      val column = when (sortOption.key.lowercase()) {
        "default" -> MediaStore.Audio.Albums.ALBUM
        "title" -> MediaStore.Audio.Albums.ALBUM
        "artist" -> MediaStore.Audio.Albums.ARTIST
        "trackcount" -> MediaStore.Audio.Albums.NUMBER_OF_SONGS
        "year" -> MediaStore.Audio.Albums.FIRST_YEAR
        else -> throw IllegalArgumentException("Unsupported SortKey for albums: ${sortOption.key}")
      }

      val order = if (sortOption.ascending) "ASC" else "DESC"
      "$column $order"
    }

    return (descriptors + "${MediaStore.Audio.Albums._ID} ASC").joinToString(", ")
  }
}
