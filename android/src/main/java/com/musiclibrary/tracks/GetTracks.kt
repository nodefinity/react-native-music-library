package com.musiclibrary.tracks

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.os.Build
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.musiclibrary.models.AssetsOptions
import com.musiclibrary.utils.GetTracksQuery
import com.musiclibrary.utils.DataConverter

internal class GetTracks(
  private val context: Context,
  private val options: AssetsOptions,
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
      promise.reject("QUERY_ERROR", "Failed to query tracks: ${e.message}", e)
    }
  }

  companion object {
    fun throwUnlessPermissionsGranted(
      context: ReactApplicationContext,
      isWrite: Boolean = false,
      block: () -> Unit
    ) {
      if (!hasAudioPermission(context)) {
        throw SecurityException("Audio permission is required. Please grant audio/storage permission first.")
      }
      block()
    }
    
    fun withModuleScope(
      promise: Promise,
      operation: () -> Unit
    ) {
      try {
        operation()
      } catch (e: SecurityException) {
        promise.reject("PERMISSION_DENIED", e.message, e)
      } catch (e: Exception) {
        promise.reject("MODULE_ERROR", "Operation failed: ${e.message}", e)
      }
    }

    private fun hasAudioPermission(context: ReactApplicationContext): Boolean {
      return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
        ContextCompat.checkSelfPermission(
          context, Manifest.permission.READ_MEDIA_AUDIO
        ) == PackageManager.PERMISSION_GRANTED
      } else {
        ContextCompat.checkSelfPermission(
          context, Manifest.permission.READ_EXTERNAL_STORAGE
        ) == PackageManager.PERMISSION_GRANTED
      }
    }
  }
} 