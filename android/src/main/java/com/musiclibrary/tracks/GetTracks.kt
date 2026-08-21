package com.musiclibrary.tracks

import android.content.Context
import com.facebook.react.bridge.Promise
import com.musiclibrary.models.TrackOptions
import com.musiclibrary.utils.DataConverter
import com.musiclibrary.utils.rejectQueryError

internal class GetTracks(
  private val context: Context,
  private val options: TrackOptions,
  private val promise: Promise
) {

  fun execute() {
    try {
      val contentResolver = context.contentResolver

      val result = GetTracksQuery.getTracks(contentResolver, options)
      val writableMap = DataConverter.paginatedResultToWritableMap(result) { track ->
        DataConverter.trackToWritableMap(track)
      }

      promise.resolve(writableMap)
    } catch (e: Exception) {
      promise.rejectQueryError(e, "Failed to query tracks")
    }
  }
}
