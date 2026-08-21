package com.musiclibrary.albums

import android.content.Context
import com.facebook.react.bridge.Promise
import com.musiclibrary.models.AlbumOptions
import com.musiclibrary.utils.DataConverter
import com.musiclibrary.utils.rejectQueryError

internal class GetAlbums(
  private val context: Context,
  private val options: AlbumOptions,
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
      promise.rejectQueryError(e, "Failed to query albums")
    }
  }
}
