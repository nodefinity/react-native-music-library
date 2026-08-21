package com.musiclibrary.utils

internal data class CursorPage<T>(
  val items: List<T>,
  val hasNextPage: Boolean,
)

internal fun <T> readCursorPage(
  canReadFirst: Boolean,
  maxItems: Int,
  readItem: () -> T?,
  moveToNext: () -> Boolean,
  isAfterLast: () -> Boolean,
): CursorPage<T> {
  val items = mutableListOf<T>()
  var canReadCurrent = canReadFirst

  while (canReadCurrent && items.size < maxItems) {
    try {
      readItem()?.let(items::add)
    } catch (_: Exception) {
      // Skip rows that cannot be converted, but always advance below.
    }

    canReadCurrent = moveToNext()
  }

  return CursorPage(
    items = items,
    hasNextPage = !isAfterLast(),
  )
}
