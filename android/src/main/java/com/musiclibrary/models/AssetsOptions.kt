package com.musiclibrary.models

data class SortOption(
  val key: String,
  val ascending: Boolean,
)

// Track-specific options
data class TrackOptions(
  val after: String? = null,
  val first: Int,
  val sortBy: List<SortOption>,
  val directory: String? = null,
)

// Album-specific options
data class AlbumOptions(
  val after: String? = null,
  val first: Int,
  val sortBy: List<SortOption>,
)

// Artist-specific options
data class ArtistOptions(
  val after: String? = null,
  val first: Int,
  val sortBy: List<SortOption>,
)
