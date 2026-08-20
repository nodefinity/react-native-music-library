package com.musiclibrary.tracks

import android.content.Context
import com.facebook.react.bridge.Promise
import com.musiclibrary.models.TrackOptions
import com.musiclibrary.utils.DataConverter
import com.musiclibrary.utils.rejectQueryError

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
      promise.rejectQueryError(e, "Failed to query tracks by artist")
    }
  }
}
