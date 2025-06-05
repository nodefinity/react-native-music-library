package com.musiclibrary.tracks

import android.content.ContentResolver
import android.media.MediaMetadataRetriever
import android.os.Build
import android.provider.MediaStore
import android.util.Base64
import com.musiclibrary.models.*
import java.util.concurrent.Executors
import java.util.concurrent.Future
import java.util.concurrent.ThreadPoolExecutor
import java.util.concurrent.TimeUnit

/**
 * GetTracksQuery
 *
 * 1. Split the query and metadata extraction of audio files
 * 2. Use multi-threaded parallel processing of metadata extraction to significantly improve performance
 * 3. Reasonably control the size of the thread pool to avoid resource waste
 * 4. Add timeout mechanism to avoid a single file blocking the entire process
 */
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

    val basicTracks = mutableListOf<Track>()
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

          // Skip invalid data
          if (data.isEmpty()) {
            continue
          }

          val basicTrack = Track(
            id = id.toString(),
            title = title,
            cover = "",
            artist = artist,
            album = album,
            genre = "",
            duration = duration,
            uri = "file://$data",
            createdAt = dateAdded * 1000, // Convert to milliseconds
            modifiedAt = dateAdded * 1000, // Convert to milliseconds
            fileSize = fileSize
          )

          basicTracks.add(basicTrack)
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

    // Use multi-threaded parallel processing of metadata extraction
    val tracks = processTracksMetadata(basicTracks)

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

  /**
   * Use multi-threaded parallel processing of metadata extraction
   *
   * @param basicTracks Track list
   * @return Track list with complete metadata
   */
  private fun processTracksMetadata(basicTracks: List<Track>): List<Track> {
    if (basicTracks.isEmpty()) {
      return emptyList()
    }

    // Create thread pool, optimized for I/O intensive tasks
    val threadCount = minOf(16, maxOf(4, Runtime.getRuntime().availableProcessors() * 4))
    val executor = Executors.newFixedThreadPool(threadCount) as ThreadPoolExecutor

    // Pre-warm thread pool
    executor.prestartAllCoreThreads()

    try {
      // Create Future task list
      val futures = mutableListOf<Future<Track>>()

      // Create asynchronous task for each track
      for (basicTrack in basicTracks) {
        val future = executor.submit<Track> {
          try {
            val meta = getTrackMeta(basicTrack.uri.replace("file://", ""))
            Track(
              id = basicTrack.id,
              title = basicTrack.title,
              cover = meta.cover,
              artist = basicTrack.artist,
              album = basicTrack.album,
              genre = meta.genre,
              duration = basicTrack.duration,
              uri = basicTrack.uri,
              createdAt = basicTrack.createdAt,
              modifiedAt = basicTrack.modifiedAt,
              fileSize = basicTrack.fileSize
            )
          } catch (e: Exception) {
            // If metadata extraction fails, return track without metadata
            Track(
              id = basicTrack.id,
              title = basicTrack.title,
              cover = "",
              artist = basicTrack.artist,
              album = basicTrack.album,
              genre = "",
              duration = basicTrack.duration,
              uri = basicTrack.uri,
              createdAt = basicTrack.createdAt,
              modifiedAt = basicTrack.modifiedAt,
              fileSize = basicTrack.fileSize
            )
          }
        }
        futures.add(future)
      }

      // Collect all results
      val tracks = mutableListOf<Track>()
      for (future in futures) {
        try {
          // Set shorter timeout (maximum 2 seconds per file)
          val track = future.get(2, TimeUnit.SECONDS)
          tracks.add(track)
        } catch (e: Exception) {
          // If the task times out or fails, skip this track
          continue
        }
      }

      return tracks
    } finally {
      // Ensure the thread pool is closed correctly
      executor.shutdown()
      try {
        if (!executor.awaitTermination(30, TimeUnit.SECONDS)) {
          executor.shutdownNow()
        }
      } catch (e: InterruptedException) {
        executor.shutdownNow()
      }
    }
  }

  private fun buildSelectionArgs(options: AssetsOptions): Array<String>? {
    val args = mutableListOf<String>()

    if (!options.directory.isNullOrEmpty()) {
      args.add("${options.directory}%")
    }

    return if (args.isEmpty()) null else args.toTypedArray()
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

  private fun getTrackMeta(data: String): TrackMeta {
    val retriever = MediaMetadataRetriever()
    return try {
      retriever.setDataSource(data)

      val genre = retriever.extractMetadata(MediaMetadataRetriever.METADATA_KEY_GENRE) ?: ""

      val embeddedPicture = retriever.embeddedPicture
      val cover = if (embeddedPicture != null) {
        "data:image/jpeg;base64," + Base64.encodeToString(embeddedPicture, Base64.NO_WRAP)
      } else {
        ""
      }

      TrackMeta(cover, genre)
    } catch (e: Exception) {
      TrackMeta("", "")
    } finally {
      retriever.release()
    }
  }
}
