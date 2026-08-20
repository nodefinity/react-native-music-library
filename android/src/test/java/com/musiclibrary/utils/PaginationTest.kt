package com.musiclibrary.utils

import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class PaginationTest {
  @Test
  fun `missing cursor starts at the first item`() {
    val ids = listOf("1", "2")
    var index = -1

    val canRead = moveToPageStart(
      after = null,
      moveToFirst = { index = 0; ids.isNotEmpty() },
      currentId = { ids[index] },
      moveToNext = { index++; index < ids.size },
    )

    assertTrue(canRead)
    assertTrue(index == 0)
  }

  @Test(expected = InvalidCursorException::class)
  fun `malformed cursor is rejected`() {
    moveToPageStart(
      after = "not-an-id",
      moveToFirst = { false },
      currentId = { error("not called") },
      moveToNext = { false },
    )
  }

  @Test(expected = InvalidCursorException::class)
  fun `cursor above unsigned 64 bit range is rejected`() {
    moveToPageStart(
      after = "18446744073709551616",
      moveToFirst = { false },
      currentId = { error("not called") },
      moveToNext = { false },
    )
  }

  @Test(expected = CursorNotFoundException::class)
  fun `unknown cursor is rejected`() {
    locate(listOf("1", "2"), after = "3")
  }

  @Test
  fun `final cursor produces a normal empty page`() {
    assertFalse(locate(listOf("1", "2"), after = "2"))
  }

  @Test
  fun `empty result without a cursor is normal`() {
    assertFalse(locate(emptyList(), after = null))
  }

  @Test(expected = InvalidPageSizeException::class)
  fun `zero page size is rejected`() {
    validatePageSize(0)
  }

  @Test(expected = InvalidPageSizeException::class)
  fun `page size above the cap is rejected`() {
    validatePageSize(1001)
  }

  @Test
  fun `page size boundaries are accepted`() {
    validatePageSize(1)
    validatePageSize(1000)
  }

  private fun locate(ids: List<String>, after: String?): Boolean {
    var index = -1
    return moveToPageStart(
      after = after,
      moveToFirst = { index = 0; ids.isNotEmpty() },
      currentId = { ids[index] },
      moveToNext = { index++; index < ids.size },
    )
  }
}
