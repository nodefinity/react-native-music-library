package com.musiclibrary.utils

import com.facebook.react.bridge.ReadableMap
import com.musiclibrary.models.AssetsOptions
import com.musiclibrary.models.SortBy
import com.musiclibrary.models.SortKey

object ReadableMapMapper {
  fun ReadableMap.toAssetsOptions(): AssetsOptions {
    val after = if (hasKey("after") && !isNull("after")) getString("after") else null
    val first = if (hasKey("first") && !isNull("first")) getInt("first") else 20

    val sortBy = if (hasKey("sortBy") && !isNull("sortBy")) {
      val array = getArray("sortBy")
      if (array != null && array.size() > 0) {
        val sortString = array.getString(0) ?: "default DESC"
        parseSortString(sortString)
      } else {
        SortBy.Single(SortKey.DEFAULT)
      }
    } else {
      SortBy.Single(SortKey.DEFAULT)
    }

    val directory =
      if (hasKey("directory") && !isNull("directory")) getString("directory") else null

    return AssetsOptions(after, first, sortBy, directory)
  }

  private fun parseSortString(sortString: String): SortBy {
    val parts = sortString.split(" ")
    if (parts.size >= 2) {
      val key = parseSortKey(parts[0])
      val ascending = parts[1].uppercase() == "ASC"
      return SortBy.WithOrder(key, ascending)
    } else {
      val key = parseSortKey(parts[0])
      return SortBy.Single(key)
    }
  }

  private fun parseSortKey(keyString: String): SortKey {
    return when (keyString.lowercase()) {
      "default" -> SortKey.DEFAULT
      "artist" -> SortKey.ARTIST
      "album" -> SortKey.ALBUM
      "duration" -> SortKey.DURATION
      "createdAt" -> SortKey.CREATED_AT
      "modifiedAt" -> SortKey.MODIFIED_AT
      "genre" -> SortKey.GENRE
      "trackCount" -> SortKey.TRACK_COUNT
      else -> SortKey.DEFAULT
    }
  }
}
