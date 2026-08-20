package com.musiclibrary.tracks

import com.musiclibrary.models.SortOption
import org.junit.Assert.assertEquals
import org.junit.Test

class TrackSortOrderTest {
  @Test
  fun `default sort is title ascending with stable id tie breaker`() {
    assertEquals(
      "title ASC, _id ASC",
      TrackQuery.buildTrackSortOrder(TrackSortPolicy.Options, emptyList()),
    )
  }

  @Test
  fun `multiple sorts preserve declared priority before id`() {
    assertEquals(
      "artist ASC, title DESC, _id ASC",
      TrackQuery.buildTrackSortOrder(
        TrackSortPolicy.Options,
        listOf(SortOption("artist", true), SortOption("title", false)),
      ),
    )
  }
}
