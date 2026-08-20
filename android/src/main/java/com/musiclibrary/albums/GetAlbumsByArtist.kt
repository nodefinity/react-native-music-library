package com.musiclibrary.albums

import android.content.Context
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.Arguments
import com.musiclibrary.utils.DataConverter
import com.musiclibrary.utils.rejectQueryError

internal class GetAlbumsByArtist(
  private val context: Context,
  private val artistId: String,
  private val promise: Promise
) {

  fun execute() {
    try {
      val contentResolver = context.contentResolver
      val albums = GetAlbumsByArtistQuery.getAlbumsByArtist(contentResolver, artistId)
      
      // Convert albums to React Native bridge format
      val albumsArray = Arguments.createArray()
      albums.forEach { album ->
        albumsArray.pushMap(DataConverter.albumToWritableMap(album))
      }

      promise.resolve(albumsArray)
    } catch (e: Exception) {
      promise.rejectQueryError(e, "Failed to query albums by artist")
    }
  }
}
