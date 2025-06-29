package com.musiclibrary.albums

import android.content.ContentResolver
import android.provider.MediaStore
import android.net.Uri
import com.musiclibrary.models.Album
import androidx.core.net.toUri

object GetAlbumsByArtistQuery {
  fun getAlbumsByArtist(
    contentResolver: ContentResolver,
    artistId: String,
  ): List<Album> {
    val projection = arrayOf(
      MediaStore.Audio.Albums._ID,
      MediaStore.Audio.Albums.ALBUM,
      MediaStore.Audio.Albums.ARTIST,
      MediaStore.Audio.Albums.NUMBER_OF_SONGS,
      MediaStore.Audio.Albums.FIRST_YEAR,
    )

    val selection = "${MediaStore.Audio.Albums.ARTIST_ID} = ? AND ${MediaStore.Audio.Albums.NUMBER_OF_SONGS} > 0"
    val selectionArgs = arrayOf(artistId)
    val sortOrder = "${MediaStore.Audio.Albums.ALBUM} ASC"

    val cursor = contentResolver.query(
      MediaStore.Audio.Albums.EXTERNAL_CONTENT_URI,
      projection,
      selection,
      selectionArgs,
      sortOrder
    ) ?: throw RuntimeException("Failed to query MediaStore: cursor is null")

    val albums = mutableListOf<Album>()

    cursor.use { c ->
      val idColumn = c.getColumnIndexOrThrow(MediaStore.Audio.Albums._ID)
      val albumColumn = c.getColumnIndexOrThrow(MediaStore.Audio.Albums.ALBUM)
      val artistColumn = c.getColumnIndexOrThrow(MediaStore.Audio.Albums.ARTIST)
      val trackCountColumn = c.getColumnIndexOrThrow(MediaStore.Audio.Albums.NUMBER_OF_SONGS)
      val firstYearColumn = c.getColumnIndexOrThrow(MediaStore.Audio.Albums.FIRST_YEAR)

      while (c.moveToNext()) {
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
        } catch (e: Exception) {
          continue
        }
      }
    }

    return albums
  }
}
