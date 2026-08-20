package com.musiclibrary.tracks

import android.content.Context
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.Arguments
import com.musiclibrary.utils.DataConverter
import com.musiclibrary.utils.rejectQueryError

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
      promise.rejectQueryError(e, "Failed to query tracks by album")
    }
  }
}
