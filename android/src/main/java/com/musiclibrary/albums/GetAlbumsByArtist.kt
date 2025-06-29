package com.musiclibrary.albums

import android.content.Context
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.Arguments
import com.musiclibrary.utils.DataConverter

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
      promise.reject("QUERY_ERROR", "Failed to query albums by artist: ${e.message}", e)
    }
  }
}
