package com.musiclibrary.tracks

import android.content.Context
import com.facebook.react.bridge.Promise
import com.musiclibrary.utils.DataConverter

internal class GetTrackMetadataQuery(
  private val context: Context,
  private val trackId: String,
  private val promise: Promise
) {
  fun execute() {
    try {
      val source = TrackMetadataLookup.findTrack(context.contentResolver, trackId)
        ?: throw TrackNotFoundException(trackId)
      val result = AudioMetadataExtractor.extract(context, source)
      val writableMap = DataConverter.trackMetadataToWritableMap(result)
      promise.resolve(writableMap)
    } catch (e: TrackNotFoundException) {
      promise.reject("TRACK_NOT_FOUND", "Track with id $trackId not found", e)
    } catch (e: Exception) {
      promise.reject("QUERY_ERROR", "Failed to get track metadata: ${e.message}", e)
    }
  }
}

private class TrackNotFoundException(trackId: String) : Exception("Track with id $trackId not found")
