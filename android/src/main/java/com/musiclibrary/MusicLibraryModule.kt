package com.musiclibrary

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.Arguments
import com.facebook.react.module.annotations.ReactModule
import com.musiclibrary.utils.ReadableMapMapper.toAssetsOptions
import com.musiclibrary.utils.ModuleUtils.throwUnlessPermissionsGranted
import com.musiclibrary.utils.ModuleUtils.withModuleScope
import com.musiclibrary.tracks.GetTracks
import com.musiclibrary.tracks.GetTracksByAlbum
import com.musiclibrary.albums.GetAlbums
import com.musiclibrary.albums.GetAlbumsByArtist
import com.musiclibrary.artists.GetArtists
import com.musiclibrary.tracks.GetTrackMetadataQuery

@ReactModule(name = MusicLibraryModule.NAME)
class MusicLibraryModule(reactContext: ReactApplicationContext) :
  NativeMusicLibrarySpec(reactContext) {

  override fun getName(): String {
    return NAME
  }

  override fun getTracksAsync(options: ReadableMap, promise: Promise) {
    throwUnlessPermissionsGranted(reactApplicationContext, isWrite = false) {
      withModuleScope(promise) {
        GetTracks(reactApplicationContext, options.toAssetsOptions(), promise)
          .execute()
      }
    }
  }

  override fun getTrackMetadataAsync(trackId: String, promise: Promise) {
    throwUnlessPermissionsGranted(reactApplicationContext, isWrite = false) {
      withModuleScope(promise) {
        GetTrackMetadataQuery(reactApplicationContext, trackId, promise)
          .execute()
      }
    }
  }

  override fun getTracksByAlbumAsync(albumId: String, promise: Promise) {
    throwUnlessPermissionsGranted(reactApplicationContext, isWrite = false) {
      withModuleScope(promise) {
        GetTracksByAlbum(reactApplicationContext, albumId, promise)
          .execute()
      }
    }
  }

  override fun getAlbumsAsync(options: ReadableMap, promise: Promise) {
    throwUnlessPermissionsGranted(reactApplicationContext, isWrite = false) {
      withModuleScope(promise) {
        GetAlbums(reactApplicationContext, options.toAssetsOptions(), promise)
          .execute()
      }
    }
  }

  override fun getAlbumsByArtistAsync(artistId: String, promise: Promise) {
    throwUnlessPermissionsGranted(reactApplicationContext, isWrite = false) {
      withModuleScope(promise) {
        GetAlbumsByArtist(reactApplicationContext, artistId, promise)
          .execute()
      }
    }
  }

  override fun getArtistsAsync(options: ReadableMap, promise: Promise) {
    throwUnlessPermissionsGranted(reactApplicationContext, isWrite = false) {
      withModuleScope(promise) {
        GetArtists(reactApplicationContext, options.toAssetsOptions(), promise)
          .execute()
      }
    }
  }

  companion object {
    const val NAME = "MusicLibrary"
  }
}
