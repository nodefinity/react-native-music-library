package com.musiclibrary

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.module.annotations.ReactModule
import com.musiclibrary.models.AssetsOptions
import com.musiclibrary.utils.ReadableMapMapper.toAssetsOptions
import com.musiclibrary.utils.ModuleUtils.throwUnlessPermissionsGranted
import com.musiclibrary.utils.ModuleUtils.withModuleScope
import com.musiclibrary.tracks.GetTracks
import com.musiclibrary.albums.GetAlbums
import com.musiclibrary.artists.GetArtists
import com.musiclibrary.genres.GetGenres

@ReactModule(name = MusicLibraryModule.NAME)
class MusicLibraryModule(reactContext: ReactApplicationContext) :
  NativeMusicLibrarySpec(reactContext) {

  override fun getName(): String {
    return NAME
  }

  override fun getTracksAsync(options: ReadableMap?, promise: Promise) {
    val assetsOptions = options?.toAssetsOptions() ?: AssetsOptions()
    
    throwUnlessPermissionsGranted(reactApplicationContext, isWrite = false) {
      withModuleScope(promise) {
        GetTracks(reactApplicationContext, assetsOptions, promise)
          .execute()
      }
    }
  }

  override fun getAlbumsAsync(options: ReadableMap?, promise: Promise) {
    val assetsOptions = options?.toAssetsOptions() ?: AssetsOptions()
    
    throwUnlessPermissionsGranted(reactApplicationContext, isWrite = false) {
      withModuleScope(promise) {
        GetAlbums(reactApplicationContext, assetsOptions, promise)
          .execute()
      }
    }
  }

  override fun getArtistsAsync(options: ReadableMap?, promise: Promise) {
    val assetsOptions = options?.toAssetsOptions() ?: AssetsOptions()
    
    throwUnlessPermissionsGranted(reactApplicationContext, isWrite = false) {
      withModuleScope(promise) {
        GetArtists(reactApplicationContext, assetsOptions, promise)
          .execute()
      }
    }
  }

  override fun getGenresAsync(options: ReadableMap?, promise: Promise) {
    val assetsOptions = options?.toAssetsOptions() ?: AssetsOptions()
    
    throwUnlessPermissionsGranted(reactApplicationContext, isWrite = false) {
      withModuleScope(promise) {
        GetGenres(reactApplicationContext, assetsOptions, promise)
          .execute()
      }
    }
  }

  companion object {
    const val NAME = "MusicLibrary"
  }
}
