package com.musiclibrary.genres

import android.content.Context
import com.facebook.react.bridge.Promise
import com.musiclibrary.models.AssetsOptions

internal class GetGenres(
  private val context: Context,
  private val options: AssetsOptions,
  private val promise: Promise
) {
  
  fun execute() {
    try {
      // TODO: implement
      promise.resolve(null)
    } catch (e: Exception) {
      promise.reject("QUERY_ERROR", "Failed to query genres: ${e.message}", e)
    }
  }
} 