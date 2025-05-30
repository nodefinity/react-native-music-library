package com.musiclibrary.models

enum class SortKey {
  DEFAULT, TITLE, ARTIST, ALBUM, DURATION, CREATED_AT, GENRE, TRACK_COUNT, NAME
}

sealed class SortBy {
  data class Single(val key: SortKey) : SortBy()
  data class WithOrder(val key: SortKey, val ascending: Boolean) : SortBy()
}

data class AssetsOptions(
  val after: String? = null,
  val first: Int = 20,
  val searchQuery: String? = null,
  val sortBy: SortBy? = null,
  val directory: String? = null,
)
