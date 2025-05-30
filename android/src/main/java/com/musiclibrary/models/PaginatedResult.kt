package com.musiclibrary.models

data class PaginatedResult<T>(
  val items: List<T>,
  val hasNextPage: Boolean,
  val endCursor: String? = null,
  val totalCount: Int? = null,
)
