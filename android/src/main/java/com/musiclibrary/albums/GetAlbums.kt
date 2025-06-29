package com.musiclibrary.albums

import android.content.Context
import com.facebook.react.bridge.Promise
import com.musiclibrary.models.AssetsOptions
import com.musiclibrary.utils.DataConverter

internal class GetAlbums(
  private val context: Context,
  private val options: AssetsOptions,
  private val promise: Promise
) {

  fun execute() {
    try {
      val contentResolver = context.contentResolver
      val result = GetAlbumsQuery.getAlbums(contentResolver, options)
      
      val writableMap = DataConverter.paginatedResultToWritableMap(result) { album ->
        DataConverter.albumToWritableMap(album)
      }

      promise.resolve(writableMap)
    } catch (e: Exception) {
      promise.reject("QUERY_ERROR", "Failed to query albums: ${e.message}", e)
    }
  }
}
