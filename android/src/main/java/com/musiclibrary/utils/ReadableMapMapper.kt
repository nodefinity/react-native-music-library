package com.musiclibrary.utils

import com.facebook.react.bridge.ReadableMap
import com.musiclibrary.models.TrackOptions
import com.musiclibrary.models.AlbumOptions
import com.musiclibrary.models.ArtistOptions
import com.musiclibrary.models.SortOption

object ReadableMapMapper {
  fun ReadableMap.toTrackOptions(): TrackOptions {
    val after = if (hasKey("after") && !isNull("after")) getString("after") else null
    val first = if (hasKey("first") && !isNull("first")) getInt("first") else 20
    val sortBy = toSortOptions()

    val directory =
      if (hasKey("directory") && !isNull("directory")) getString("directory") else null

    return TrackOptions(after, first, sortBy, directory)
  }

  fun ReadableMap.toAlbumOptions(): AlbumOptions {
    val after = if (hasKey("after") && !isNull("after")) getString("after") else null
    val first = if (hasKey("first") && !isNull("first")) getInt("first") else 20
    val sortBy = toSortOptions()

    return AlbumOptions(after, first, sortBy)
  }

  fun ReadableMap.toArtistOptions(): ArtistOptions {
    val after = if (hasKey("after") && !isNull("after")) getString("after") else null
    val first = if (hasKey("first") && !isNull("first")) getInt("first") else 20
    val sortBy = toSortOptions()

    return ArtistOptions(after, first, sortBy)
  }

  private fun ReadableMap.toSortOptions(): List<SortOption> {
    if (!hasKey("sortBy") || isNull("sortBy")) {
      return listOf(DEFAULT_SORT)
    }

    val array = getArray("sortBy") ?: return listOf(DEFAULT_SORT)
    if (array.size() == 0) {
      return listOf(DEFAULT_SORT)
    }

    return (0 until array.size()).map { index ->
      val map = array.getMap(index)
      SortOption(
        key = map?.getString("key") ?: DEFAULT_SORT.key,
        ascending = if (map?.hasKey("ascending") == true && !map.isNull("ascending")) {
          map.getBoolean("ascending")
        } else {
          DEFAULT_SORT.ascending
        }
      )
    }
  }

  private val DEFAULT_SORT = SortOption("default", true)
}
