package com.musiclibrary.utils

import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReadableArray
import com.musiclibrary.models.AssetsOptions
import com.musiclibrary.models.SortBy

object ReadableMapMapper {
  fun ReadableMap.toAssetsOptions(): AssetsOptions {
    val after = if (hasKey("after") && !isNull("after")) getString("after") else null
    val first = if (hasKey("first") && !isNull("first")) getInt("first") else null
    val searchQuery =
      if (hasKey("searchQuery") && !isNull("searchQuery")) getString("searchQuery") else null

    val sortBy = if (hasKey("sortBy") && !isNull("sortBy")) {
      when (getType("sortBy")) {
        ReadableType.String -> SortBy(getString("sortBy")!!, false)
        ReadableType.Array -> {
          val array = getArray("sortBy")!!
          val key = array.getString(0) ?: "default"
          val ascending = array.getBoolean(1)
          SortBy(key, ascending)
        }

        else -> null
      }
    } else null

    val directory =
      if (hasKey("directory") && !isNull("directory")) getString("directory") else null

    return AssetsOptions(after, first, searchQuery, sortBy, directory)
  }
}
