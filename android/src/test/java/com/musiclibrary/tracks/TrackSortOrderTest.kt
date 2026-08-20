package com.musiclibrary.tracks

import com.musiclibrary.models.SortOption
import org.junit.Assert.assertEquals
import org.junit.Test

class TrackSortOrderTest {
  @Test
  fun `legacy file URL is preserved when MediaStore exposes a path`() {
    assertEquals(
      "file:///storage/emulated/0/Music/track.mp3",
      TrackQuery.selectTrackUrl(
        "content://media/external/audio/media/1",
        "/storage/emulated/0/Music/track.mp3",
      ),
    )
  }

  @Test
  fun `content URI is playable fallback when legacy path is absent`() {
    assertEquals(
      "content://media/external/audio/media/1",
      TrackQuery.selectTrackUrl("content://media/external/audio/media/1", null),
    )
  }

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
