package com.musiclibrary.artists

import android.content.Context
import com.facebook.react.bridge.Promise
import com.musiclibrary.models.AssetsOptions

internal class GetArtists(
  private val context: Context,
  private val options: AssetsOptions,
  private val promise: Promise
) {
  
  fun execute() {
    try {
      // TODO: implement
      promise.resolve(null)
    } catch (e: Exception) {
      promise.reject("QUERY_ERROR", "Failed to query artists: ${e.message}", e)
    }
  }
} 