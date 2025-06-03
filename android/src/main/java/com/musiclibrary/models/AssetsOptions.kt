package com.musiclibrary.models

data class AssetsOptions(
  val after: String? = null,
  val first: Int,
  val sortBy: List<String>,
  val directory: String? = null,
)
