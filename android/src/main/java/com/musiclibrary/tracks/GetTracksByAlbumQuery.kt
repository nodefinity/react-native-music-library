package com.musiclibrary.tracks

import android.content.ContentResolver
import android.provider.MediaStore
import com.musiclibrary.models.Track

object GetTracksByAlbumQuery {
  fun getTracksByAlbum(
    contentResolver: ContentResolver,
    albumId: String,
  ): List<Track> {
    val projection = arrayOf(
      MediaStore.Audio.Media._ID,
      MediaStore.Audio.Media.TITLE,
      MediaStore.Audio.Media.ARTIST,
      MediaStore.Audio.Media.ALBUM,
      MediaStore.Audio.Media.DURATION,
      MediaStore.Audio.Media.DATA,
      MediaStore.Audio.Media.DATE_ADDED,
      MediaStore.Audio.Media.SIZE,
      MediaStore.Audio.Media.TRACK,
    )

    val selection = "${MediaStore.Audio.Media.ALBUM_ID} = ? AND ${MediaStore.Audio.Media.IS_MUSIC} = 1 AND ${MediaStore.Audio.Media.DURATION} > 0"
    val selectionArgs = arrayOf(albumId)
    val sortOrder = "${MediaStore.Audio.Media.TRACK} ASC, ${MediaStore.Audio.Media.TITLE} ASC"

    val cursor = contentResolver.query(
      MediaStore.Audio.Media.EXTERNAL_CONTENT_URI,
      projection,
      selection,
      selectionArgs,
      sortOrder
    ) ?: throw RuntimeException("Failed to query tracks: cursor is null")

    val tracks = mutableListOf<Track>()

    cursor.use { c ->
      val idColumn = c.getColumnIndexOrThrow(MediaStore.Audio.Media._ID)
      val titleColumn = c.getColumnIndexOrThrow(MediaStore.Audio.Media.TITLE)
      val artistColumn = c.getColumnIndexOrThrow(MediaStore.Audio.Media.ARTIST)
      val albumColumn = c.getColumnIndexOrThrow(MediaStore.Audio.Media.ALBUM)
      val durationColumn = c.getColumnIndexOrThrow(MediaStore.Audio.Media.DURATION)
      val dataColumn = c.getColumnIndexOrThrow(MediaStore.Audio.Media.DATA)
      val dateAddedColumn = c.getColumnIndexOrThrow(MediaStore.Audio.Media.DATE_ADDED)
      val sizeColumn = c.getColumnIndexOrThrow(MediaStore.Audio.Media.SIZE)

      while (c.moveToNext()) {
        try {
          val id = c.getLong(idColumn)
          val data = c.getString(dataColumn) ?: ""

          // Skip invalid data
          if (data.isEmpty()) {
            continue
          }

          val title = c.getString(titleColumn) ?: ""
          val artist = c.getString(artistColumn)
          val album = c.getString(albumColumn)
          val duration = c.getLong(durationColumn) / 1000.0 // Convert to seconds
          val dateAdded = c.getLong(dateAddedColumn)
          val fileSize = c.getLong(sizeColumn)
          val artworkUri = "content://media/external/audio/media/${id}/albumart"

          // Create a Track
          val track = Track(
            id = id.toString(),
            title = title,
            artist = artist,
            artwork = artworkUri,
            album = album,
            duration = duration,
            url = "file://$data",
            createdAt = dateAdded * 1000, // Convert to milliseconds
            modifiedAt = dateAdded * 1000, // Convert to milliseconds
            fileSize = fileSize
          )

          tracks.add(track)
        } catch (e: Exception) {
          continue
        }
      }
    }

    return tracks
  }
}
