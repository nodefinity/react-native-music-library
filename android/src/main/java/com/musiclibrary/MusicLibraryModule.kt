package com.musiclibrary

import android.Manifest
import android.content.pm.PackageManager
import android.os.Build
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = MusicLibraryModule.NAME)
class MusicLibraryModule(reactContext: ReactApplicationContext) :
  NativeMusicLibrarySpec(reactContext) {

  override fun getName(): String {
    return NAME
  }

  /**
   * Check if permission granted.
   */
  private fun hasAudioPermission(): Boolean {
    val context = reactApplicationContext
    
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

  private fun checkPermissionOrReject(promise: Promise): Boolean {
    if (!hasAudioPermission()) {
      promise.reject("PERMISSION_DENIED", "Audio permission is required. Please grant audio/storage permission first.")
      return false
    }
    return true
  }

  override fun getTracksAsync(options: ReadableMap?, promise: Promise) {
    if (!checkPermissionOrReject(promise)) return
    
    promise.resolve(null)
  }

  override fun getAlbumsAsync(options: ReadableMap?, promise: Promise) {
    if (!checkPermissionOrReject(promise)) return
    
    promise.resolve(null)
  }

  override fun getArtistsAsync(options: ReadableMap?, promise: Promise) {
    if (!checkPermissionOrReject(promise)) return
    
    promise.resolve(null)
  }

  override fun getGenresAsync(options: ReadableMap?, promise: Promise) {
    if (!checkPermissionOrReject(promise)) return
    
    promise.resolve(null)
  }

  companion object {
    const val NAME = "MusicLibrary"
  }
}
