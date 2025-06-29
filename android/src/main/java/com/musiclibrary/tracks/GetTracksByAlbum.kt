package com.musiclibrary.tracks

import android.content.Context
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.Arguments
import com.musiclibrary.utils.DataConverter

internal class GetTracksByAlbum(
  private val context: Context,
  private val albumId: String,
  private val promise: Promise
) {

  fun execute() {
    try {
      val contentResolver = context.contentResolver
      val tracks = GetTracksByAlbumQuery.getTracksByAlbum(contentResolver, albumId)
      
      // Convert tracks to React Native bridge format
      val tracksArray = Arguments.createArray()
      tracks.forEach { track ->
        tracksArray.pushMap(DataConverter.trackToWritableMap(track))
      }

      promise.resolve(tracksArray)
    } catch (e: Exception) {
      promise.reject("QUERY_ERROR", "Failed to query tracks by album: ${e.message}", e)
    }
  }
}
