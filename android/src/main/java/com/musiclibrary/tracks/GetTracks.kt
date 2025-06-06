package com.musiclibrary.tracks

import android.content.Context
import com.facebook.react.bridge.Promise
import com.musiclibrary.models.AssetsOptions
import com.musiclibrary.utils.DataConverter

internal class GetTracks(
  private val context: Context,
  private val options: AssetsOptions,
  private val promise: Promise
) {

  fun execute() {
    try {
      val contentResolver = context.contentResolver

      val result = GetTracksQuery.getTracks(contentResolver, options, context)
      val writableMap = DataConverter.paginatedResultToWritableMap(result) { track ->
        DataConverter.trackToWritableMap(track)
      }

      promise.resolve(writableMap)
    } catch (e: Exception) {
      promise.reject("QUERY_ERROR", "Failed to query tracks: ${e.message}", e)
    }
  }
}
