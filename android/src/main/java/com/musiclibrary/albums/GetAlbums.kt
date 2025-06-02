package com.musiclibrary.albums

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.os.Build
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.musiclibrary.models.AssetsOptions

internal class GetAlbums(
  private val context: Context,
  private val options: AssetsOptions,
  private val promise: Promise
) {
  
  fun execute() {
    try {
      // TODO: implement
      promise.resolve(null)
    } catch (e: Exception) {
      promise.reject("QUERY_ERROR", "Failed to query albums: ${e.message}", e)
    }
  }
} 