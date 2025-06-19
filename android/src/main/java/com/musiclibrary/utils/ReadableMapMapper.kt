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

    // 解析文件扩展名列表
    val extensions = if (hasKey("extensions") && !isNull("extensions")) {
      val array = getArray("extensions")
      if (array != null && array.size() > 0) {
        (0 until array.size()).mapNotNull { 
          val ext = array.getString(it)
          // 确保扩展名以点开头
          if (ext != null && ext.isNotEmpty()) {
            if (ext.startsWith(".")) ext else ".$ext"
          } else null
        }
      } else null
    } else null

    // 解析是否扫描全局
    val scanGlobal = if (hasKey("scanGlobal") && !isNull("scanGlobal")) {
      getBoolean("scanGlobal")
    } else false

    return AssetsOptions(after, first, sortBy, directory, extensions, scanGlobal)
  }
}
