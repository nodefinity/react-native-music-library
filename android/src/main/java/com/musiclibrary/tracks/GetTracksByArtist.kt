package com.musiclibrary.tracks

import android.content.Context
import com.facebook.react.bridge.Promise
import com.musiclibrary.models.TrackOptions
import com.musiclibrary.utils.DataConverter

internal class GetTracksByArtist(
  private val context: Context,
  private val artistId: String,
  private val options: TrackOptions,
  private val promise: Promise
) {

  fun execute() {
    try {
      val contentResolver = context.contentResolver
      val result = GetTracksByArtistQuery.getTracksByArtist(contentResolver, artistId, options)
      
      // Convert result to React Native bridge format
      val resultMap = DataConverter.paginatedResultToWritableMap(result) { track ->
        DataConverter.trackToWritableMap(track)
      }

      promise.resolve(resultMap)
    } catch (e: Exception) {
      promise.reject("QUERY_ERROR", "Failed to query tracks by artist: ${e.message}", e)
    }
  }
}
