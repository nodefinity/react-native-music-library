package com.musiclibrary.tracks

import android.content.ContentResolver
import android.content.ContentUris
import android.database.Cursor
import android.provider.MediaStore
import com.musiclibrary.models.PaginatedResult
import com.musiclibrary.models.SortOption
import com.musiclibrary.models.Track
import com.musiclibrary.models.TrackOptions
import com.musiclibrary.utils.moveToPageStart
import com.musiclibrary.utils.validatePageSize

internal sealed class TrackQueryFilter {
  object All : TrackQueryFilter()
  data class Album(val albumId: String) : TrackQueryFilter()
  data class Artist(val artistId: String) : TrackQueryFilter()
}

internal enum class TrackSortPolicy {
  Options,
  AlbumTrackNumber,
}

internal object TrackQuery {
  fun getPaginatedTracks(
    contentResolver: ContentResolver,
    filter: TrackQueryFilter = TrackQueryFilter.All,
    options: TrackOptions,
  ): PaginatedResult<Track> {
    validatePageSize(options.first)

    val cursor = queryTracks(
      contentResolver = contentResolver,
      filter = filter,
      directory = options.directory,
      sortOrder = buildTrackSortOrder(TrackSortPolicy.Options, options.sortBy)
    )

    cursor.use { c ->
      val columns = TrackColumns.from(c)
      val tracks = mutableListOf<Track>()
      var endCursor: String? = null
      val canReadFirst = moveToPageStart(
        after = options.after,
        moveToFirst = c::moveToFirst,
        currentId = { c.getLong(columns.id).toString() },
        moveToNext = c::moveToNext,
      )
      val maxItems = options.first
      var count = 0

      while (canReadFirst && count < maxItems) {
        readTrack(c, columns)?.let { track ->
          tracks.add(track)
          endCursor = track.id
          count++
        }

        if (!c.moveToNext()) {
          break
        }
      }

      return PaginatedResult(
        items = tracks,
        hasNextPage = !c.isAfterLast,
        endCursor = endCursor,
        totalCount = c.count
      )
    }
  }

  fun getTracks(
    contentResolver: ContentResolver,
    filter: TrackQueryFilter,
    sortPolicy: TrackSortPolicy = TrackSortPolicy.AlbumTrackNumber,
  ): List<Track> {
    val cursor = queryTracks(
      contentResolver = contentResolver,
      filter = filter,
      directory = null,
      sortOrder = buildTrackSortOrder(sortPolicy, emptyList())
    )

    cursor.use { c ->
      val columns = TrackColumns.from(c)
      val tracks = mutableListOf<Track>()

      while (c.moveToNext()) {
        readTrack(c, columns)?.let { tracks.add(it) }
      }

      return tracks
    }
  }

  private fun queryTracks(
    contentResolver: ContentResolver,
    filter: TrackQueryFilter,
    directory: String?,
    sortOrder: String,
  ): Cursor {
    val directorySelection = TrackDirectoryFilter.resolve(directory)
    return contentResolver.query(
      MediaStore.Audio.Media.EXTERNAL_CONTENT_URI,
      TRACK_PROJECTION,
      buildSelection(filter, directorySelection),
      buildSelectionArgs(filter, directorySelection),
      sortOrder
    ) ?: throw RuntimeException("Failed to query MediaStore: cursor is null")
  }

  private fun readTrack(cursor: Cursor, columns: TrackColumns): Track? {
    return try {
      val id = cursor.getLong(columns.id)
      val data = cursor.getString(columns.data)?.takeIf { it.isNotEmpty() }
      val contentUri = ContentUris.withAppendedId(
        MediaStore.Audio.Media.EXTERNAL_CONTENT_URI,
        id,
      ).toString()

      val title = cursor.getString(columns.title) ?: ""
      val artist = cursor.getString(columns.artist)
      val album = cursor.getString(columns.album)
      val duration = cursor.getLong(columns.duration) / 1000.0
      val dateAdded = cursor.getLong(columns.dateAdded)
      val dateModified = cursor.getLong(columns.dateModified)
      val fileSize = cursor.getLong(columns.size)

      Track(
        id = id.toString(),
        title = title,
        artist = artist,
        artwork = artworkUri(id),
        album = album,
        duration = duration,
        url = selectTrackUrl(contentUri, data),
        contentUri = contentUri,
        createdAt = dateAdded,
        modifiedAt = dateModified,
        fileSize = fileSize
      )
    } catch (_: Exception) {
      null
    }
  }

  private fun buildSelection(
    filter: TrackQueryFilter,
    directory: TrackDirectorySelection,
  ): String {
    val conditions = mutableListOf<String>()

    when (filter) {
      is TrackQueryFilter.Album -> conditions.add("${MediaStore.Audio.Media.ALBUM_ID} = ?")
      is TrackQueryFilter.Artist -> conditions.add("${MediaStore.Audio.Media.ARTIST_ID} = ?")
      TrackQueryFilter.All -> Unit
    }

    conditions.add("${MediaStore.Audio.Media.IS_MUSIC} = 1")
    conditions.add("${MediaStore.Audio.Media.DURATION} > 0")

    directory.clause?.let { conditions.add(it) }

    return conditions.joinToString(" AND ")
  }

  private fun buildSelectionArgs(
    filter: TrackQueryFilter,
    directory: TrackDirectorySelection,
  ): Array<String>? {
    val args = mutableListOf<String>()

    when (filter) {
      is TrackQueryFilter.Album -> args.add(filter.albumId)
      is TrackQueryFilter.Artist -> args.add(filter.artistId)
      TrackQueryFilter.All -> Unit
    }

    args.addAll(directory.arguments)

    return if (args.isEmpty()) null else args.toTypedArray()
  }

  internal fun buildTrackSortOrder(sortPolicy: TrackSortPolicy, sortBy: List<SortOption>): String {
    if (sortPolicy == TrackSortPolicy.AlbumTrackNumber) {
      return "${MediaStore.Audio.Media.TRACK} ASC, ${MediaStore.Audio.Media.TITLE} ASC, ${MediaStore.Audio.Media._ID} ASC"
    }

    val options = sortBy.ifEmpty { listOf(SortOption("default", true)) }
    val descriptors = options.map { sortOption ->
      val column = when (sortOption.key.lowercase()) {
        "default" -> MediaStore.Audio.Media.TITLE
        "title" -> MediaStore.Audio.Media.TITLE
        "artist" -> MediaStore.Audio.Media.ARTIST
        "album" -> MediaStore.Audio.Media.ALBUM
        "duration" -> MediaStore.Audio.Media.DURATION
        "createdat" -> MediaStore.Audio.Media.DATE_ADDED
        "modifiedat" -> MediaStore.Audio.Media.DATE_MODIFIED
        "filesize" -> MediaStore.Audio.Media.SIZE
        else -> throw IllegalArgumentException("Unsupported SortKey for tracks: ${sortOption.key}")
      }

      val order = if (sortOption.ascending) "ASC" else "DESC"
      "$column $order"
    }

    return (descriptors + "${MediaStore.Audio.Media._ID} ASC").joinToString(", ")
  }

  private fun artworkUri(id: Long): String {
    return "content://media/external/audio/media/$id/albumart"
  }

  internal fun selectTrackUrl(contentUri: String, filePath: String?): String {
    return filePath?.takeIf { it.isNotEmpty() }?.let { "file://$it" } ?: contentUri
  }

  private data class TrackColumns(
    val id: Int,
    val title: Int,
    val artist: Int,
    val album: Int,
    val duration: Int,
    val data: Int,
    val dateAdded: Int,
    val dateModified: Int,
    val size: Int,
  ) {
    companion object {
      fun from(cursor: Cursor): TrackColumns {
        return TrackColumns(
          id = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media._ID),
          title = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.TITLE),
          artist = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.ARTIST),
          album = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.ALBUM),
          duration = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.DURATION),
          data = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.DATA),
          dateAdded = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.DATE_ADDED),
          dateModified = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.DATE_MODIFIED),
          size = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.SIZE)
        )
      }
    }
  }

  private val TRACK_PROJECTION = arrayOf(
    MediaStore.Audio.Media._ID,
    MediaStore.Audio.Media.TITLE,
    MediaStore.Audio.Media.ARTIST,
    MediaStore.Audio.Media.ALBUM,
    MediaStore.Audio.Media.DURATION,
    MediaStore.Audio.Media.DATA,
    MediaStore.Audio.Media.DATE_ADDED,
    MediaStore.Audio.Media.DATE_MODIFIED,
    MediaStore.Audio.Media.SIZE,
    MediaStore.Audio.Media.ALBUM_ID,
    MediaStore.Audio.Media.TRACK
  )
}
