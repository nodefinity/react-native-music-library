package com.musiclibrary.artists

import com.musiclibrary.models.SortOption
import org.junit.Assert.assertEquals
import org.junit.Test

class ArtistSortOrderTest {
  @Test
  fun `multiple sorts preserve declared priority before id`() {
    assertEquals(
      "number_of_albums DESC, artist ASC, _id ASC",
      GetArtistsQuery.buildArtistSortOrder(
        listOf(SortOption("albumCount", false), SortOption("title", true)),
      ),
    )
  }
}
