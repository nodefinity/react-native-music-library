package com.musiclibrary.tracks

import android.content.Context
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableMap
import com.musiclibrary.models.AssetsOptions
import com.musiclibrary.utils.DataConverter
import com.musiclibrary.utils.ReadableMapMapper.toAssetsOptions

internal class GetTracksByArtist(
  private val context: Context,
  private val artistId: String,
  private val options: ReadableMap,
  private val promise: Promise
) {

  fun execute() {
    try {
      val contentResolver = context.contentResolver
      val assetsOptions = options.toAssetsOptions()
      val result = GetTracksByArtistQuery.getTracksByArtist(contentResolver, artistId, assetsOptions)
      
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