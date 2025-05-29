package com.musiclibrary

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = MusicLibraryModule.NAME)
class MusicLibraryModule(reactContext: ReactApplicationContext) :
  NativeMusicLibrarySpec(reactContext) {

  override fun getName(): String {
    return NAME
  }

  override fun getTracksAsync(a: Double, b: Double): Double {
    return a * b
  }

  companion object {
    const val NAME = "MusicLibrary"
  }
}
