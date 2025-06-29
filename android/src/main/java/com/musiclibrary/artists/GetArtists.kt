package com.musiclibrary.artists

import android.content.Context
import com.facebook.react.bridge.Promise
import com.musiclibrary.models.AssetsOptions
import com.musiclibrary.utils.DataConverter

internal class GetArtists(
  private val context: Context,
  private val options: AssetsOptions,
  private val promise: Promise
) {
  
  fun execute() {
    try {
      val contentResolver = context.contentResolver
      val result = GetArtistsQuery.getArtists(contentResolver, options)
      
      // Convert result to React Native bridge format
      val resultMap = DataConverter.paginatedResultToWritableMap(result) { artist ->
        DataConverter.artistToWritableMap(artist)
      }

      promise.resolve(resultMap)
    } catch (e: Exception) {
      promise.reject("QUERY_ERROR", "Failed to query artists: ${e.message}", e)
    }
  }
}
