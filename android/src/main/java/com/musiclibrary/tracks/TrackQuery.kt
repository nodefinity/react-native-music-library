package com.musiclibrary.tracks

import android.content.ContentResolver
import android.database.Cursor
import android.net.Uri
import android.provider.DocumentsContract
import android.provider.MediaStore
import androidx.core.net.toUri
import com.musiclibrary.models.PaginatedResult
import com.musiclibrary.models.SortOption
import com.musiclibrary.models.Track
import com.musiclibrary.models.TrackOptions

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
    val cursor = queryTracks(
      contentResolver = contentResolver,
      filter = filter,
      directory = options.directory,
      sortOrder = buildSortOrder(TrackSortPolicy.Options, options.sortBy)
    )

    cursor.use { c ->
      val columns = TrackColumns.from(c)
      val tracks = mutableListOf<Track>()
      var endCursor: String? = null
      val canReadFirst = moveToPageStart(c, columns, options.after)
      val maxItems = options.first.coerceAtMost(1000)
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
      sortOrder = buildSortOrder(sortPolicy, emptyList())
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
    return contentResolver.query(
      MediaStore.Audio.Media.EXTERNAL_CONTENT_URI,
      TRACK_PROJECTION,
      buildSelection(filter, directory),
      buildSelectionArgs(filter, directory),
      sortOrder
    ) ?: throw RuntimeException("Failed to query MediaStore: cursor is null")
  }

  private fun moveToPageStart(cursor: Cursor, columns: TrackColumns, after: String?): Boolean {
    if (after == null) {
      return cursor.moveToFirst()
    }

    if (cursor.moveToFirst()) {
      do {
        val id = cursor.getLong(columns.id).toString()
        if (id == after) {
          return cursor.moveToNext()
        }
      } while (cursor.moveToNext())
    }

    return false
  }

  private fun readTrack(cursor: Cursor, columns: TrackColumns): Track? {
    return try {
      val id = cursor.getLong(columns.id)
      val data = cursor.getString(columns.data) ?: return null

      if (data.isEmpty()) {
        return null
      }

      val title = cursor.getString(columns.title) ?: ""
      val artist = cursor.getString(columns.artist)
      val album = cursor.getString(columns.album)
      val duration = cursor.getLong(columns.duration) / 1000.0
      val dateAdded = cursor.getLong(columns.dateAdded)
      val fileSize = cursor.getLong(columns.size)

      Track(
        id = id.toString(),
        title = title,
        artist = artist,
        artwork = artworkUri(id),
        album = album,
        duration = duration,
        url = "file://$data",
        createdAt = dateAdded * 1000,
        modifiedAt = dateAdded * 1000,
        fileSize = fileSize
      )
    } catch (_: Exception) {
      null
    }
  }

  private fun buildSelection(filter: TrackQueryFilter, directory: String?): String {
    val conditions = mutableListOf<String>()

    when (filter) {
      is TrackQueryFilter.Album -> conditions.add("${MediaStore.Audio.Media.ALBUM_ID} = ?")
      is TrackQueryFilter.Artist -> conditions.add("${MediaStore.Audio.Media.ARTIST_ID} = ?")
      TrackQueryFilter.All -> Unit
    }

    conditions.add("${MediaStore.Audio.Media.IS_MUSIC} = 1")
    conditions.add("${MediaStore.Audio.Media.DURATION} > 0")

    if (!directory.isNullOrEmpty()) {
      conditions.add("${MediaStore.Audio.Media.DATA} LIKE ?")
    }

    return conditions.joinToString(" AND ")
  }

  private fun buildSelectionArgs(filter: TrackQueryFilter, directory: String?): Array<String>? {
    val args = mutableListOf<String>()

    when (filter) {
      is TrackQueryFilter.Album -> args.add(filter.albumId)
      is TrackQueryFilter.Artist -> args.add(filter.artistId)
      TrackQueryFilter.All -> Unit
    }

    if (!directory.isNullOrEmpty()) {
      val dir = if (directory.startsWith("content://")) {
        uriToFullPath(directory.toUri())
      } else {
        directory
      }

      if (!dir.isNullOrEmpty()) {
        args.add("$dir%")
      }
    }

    return if (args.isEmpty()) null else args.toTypedArray()
  }

  private fun buildSortOrder(sortPolicy: TrackSortPolicy, sortBy: List<SortOption>): String {
    if (sortPolicy == TrackSortPolicy.AlbumTrackNumber) {
      return "${MediaStore.Audio.Media.TRACK} ASC, ${MediaStore.Audio.Media.TITLE} ASC"
    }

    val options = sortBy.ifEmpty { listOf(SortOption("default", true)) }
    return options.joinToString(", ") { sortOption ->
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
  }

  private fun uriToFullPath(treeUri: Uri): String? {
    val docId = DocumentsContract.getTreeDocumentId(treeUri)
    val parts = docId.split(":")
    if (parts.size < 2) return null

    val type = parts[0]
    val relativePath = parts[1]

    return when (type) {
      "primary" -> "/storage/emulated/0/$relativePath"
      else -> "/storage/$type/$relativePath"
    }
  }

  private fun artworkUri(id: Long): String {
    return "content://media/external/audio/media/$id/albumart"
  }

  private data class TrackColumns(
    val id: Int,
    val title: Int,
    val artist: Int,
    val album: Int,
    val duration: Int,
    val data: Int,
    val dateAdded: Int,
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
    MediaStore.Audio.Media.SIZE,
    MediaStore.Audio.Media.ALBUM_ID,
    MediaStore.Audio.Media.TRACK
  )
}
