package com.musiclibrary.utils

import com.facebook.react.bridge.ReadableMap
import com.musiclibrary.models.TrackOptions
import com.musiclibrary.models.AlbumOptions
import com.musiclibrary.models.ArtistOptions

object ReadableMapMapper {
  fun ReadableMap.toTrackOptions(): TrackOptions {
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

    return TrackOptions(after, first, sortBy, directory)
  }

  fun ReadableMap.toAlbumOptions(): AlbumOptions {
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

    return AlbumOptions(after, first, sortBy)
  }

  fun ReadableMap.toArtistOptions(): ArtistOptions {
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

    return ArtistOptions(after, first, sortBy)
  }
}
