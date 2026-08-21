package com.musiclibrary.utils

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class CursorPageReaderTest {
  @Test
  fun skipsInvalidRowsAndContinuesReading() {
    val rows = listOf<String?>(null, "album-1", null, "album-2")
    var position = 0

    val page = readCursorPage(
      canReadFirst = true,
      maxItems = 2,
      readItem = { rows[position] },
      moveToNext = {
        position++
        position < rows.size
      },
      isAfterLast = { position >= rows.size },
    )

    assertEquals(listOf("album-1", "album-2"), page.items)
    assertFalse(page.hasNextPage)
    assertEquals(rows.size, position)
  }

  @Test
  fun advancesAfterConversionFailure() {
    val rows = listOf("broken", "artist-1")
    var position = 0
    var reads = 0

    val page = readCursorPage(
      canReadFirst = true,
      maxItems = 1,
      readItem = {
        reads++
        if (rows[position] == "broken") {
          throw IllegalStateException("Cannot convert row")
        }
        rows[position]
      },
      moveToNext = {
        position++
        position < rows.size
      },
      isAfterLast = { position >= rows.size },
    )

    assertEquals(listOf("artist-1"), page.items)
    assertEquals(2, reads)
    assertEquals(rows.size, position)
    assertFalse(page.hasNextPage)
  }

  @Test
  fun reportsAnotherPageAfterFillingTheCurrentPage() {
    val rows = listOf("artist-1", "artist-2")
    var position = 0

    val page = readCursorPage(
      canReadFirst = true,
      maxItems = 1,
      readItem = { rows[position] },
      moveToNext = {
        position++
        position < rows.size
      },
      isAfterLast = { position >= rows.size },
    )

    assertEquals(listOf("artist-1"), page.items)
    assertEquals(1, position)
    assertTrue(page.hasNextPage)
  }
}
