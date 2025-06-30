package com.musiclibrary.models

// Track-specific options
data class TrackOptions(
  val after: String? = null,
  val first: Int,
  val sortBy: List<String>,
  val directory: String? = null,
)

// Album-specific options
data class AlbumOptions(
  val after: String? = null,
  val first: Int,
  val sortBy: List<String>,
)

// Artist-specific options
data class ArtistOptions(
  val after: String? = null,
  val first: Int,
  val sortBy: List<String>,
)
