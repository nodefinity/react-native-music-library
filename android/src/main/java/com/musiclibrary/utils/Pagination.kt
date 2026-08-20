package com.musiclibrary.utils

import com.facebook.react.bridge.Promise

internal sealed class PaginationException(
  val code: String,
  message: String,
) : IllegalArgumentException(message)

internal class InvalidCursorException(cursor: String) : PaginationException(
  code = "INVALID_CURSOR",
  message = "Cursor must be a positive decimal ID: $cursor",
)

internal class CursorNotFoundException(cursor: String) : PaginationException(
  code = "CURSOR_NOT_FOUND",
  message = "Cursor is not present in the current query result: $cursor",
)

internal class InvalidPageSizeException(first: Int) : PaginationException(
  code = "INVALID_PAGE_SIZE",
  message = "Page size must be between 1 and 1000: $first",
)

internal fun validatePageSize(first: Int) {
  if (first !in 1..1000) {
    throw InvalidPageSizeException(first)
  }
}

internal fun moveToPageStart(
  after: String?,
  moveToFirst: () -> Boolean,
  currentId: () -> String,
  moveToNext: () -> Boolean,
): Boolean {
  if (after == null) {
    return moveToFirst()
  }

  if (!isValidCursor(after)) {
    throw InvalidCursorException(after)
  }

  if (moveToFirst()) {
    do {
      if (currentId() == after) {
        return moveToNext()
      }
    } while (moveToNext())
  }

  throw CursorNotFoundException(after)
}

private fun isValidCursor(cursor: String): Boolean {
  val maxCursorId = "18446744073709551615"
  return cursor.matches(Regex("[1-9][0-9]*")) &&
    (cursor.length < maxCursorId.length ||
      (cursor.length == maxCursorId.length && cursor <= maxCursorId))
}

internal fun Promise.rejectQueryError(error: Exception, fallbackMessage: String) {
  if (error is PaginationException) {
    reject(error.code, error.message, error)
    return
  }

  reject("QUERY_ERROR", "$fallbackMessage: ${error.message}", error)
}
