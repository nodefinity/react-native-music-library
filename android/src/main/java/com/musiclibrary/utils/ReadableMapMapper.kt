package com.musiclibrary.utils

import com.facebook.react.bridge.ReadableMap
import com.musiclibrary.models.AssetsOptions

object ReadableMapMapper {
  fun ReadableMap.toAssetsOptions(): AssetsOptions {
    val after = if (hasKey("after") && !isNull("after")) getString("after") else null
    val first = if (hasKey("first") && !isNull("first")) getInt("first") else 20

    val sortBy = if (hasKey("sortBy") && !isNull("sortBy")) {
      val array = getArray("sortBy")
      if (array != null && array.size() > 0) {
        (0 until array.size()).map { array.getString(it) ?: "default DESC" }
      } else {
        listOf("default DESC")
      }
    } else {
      listOf("default DESC")
    }

    val directory =
      if (hasKey("directory") && !isNull("directory")) getString("directory") else null

    return AssetsOptions(after, first, sortBy, directory)
  }
}
