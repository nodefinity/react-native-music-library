package com.musiclibrary.albums

import com.musiclibrary.models.SortOption
import org.junit.Assert.assertEquals
import org.junit.Test

class AlbumSortOrderTest {
  @Test
  fun `multiple sorts preserve declared priority before id`() {
    assertEquals(
      "artist ASC, album DESC, _id ASC",
      GetAlbumsQuery.buildAlbumSortOrder(
        listOf(SortOption("artist", true), SortOption("title", false)),
      ),
    )
  }
}
