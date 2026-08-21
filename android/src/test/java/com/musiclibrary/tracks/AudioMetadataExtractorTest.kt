package com.musiclibrary.tracks

import org.junit.Assert.assertEquals
import org.junit.Test

class AudioMetadataExtractorTest {
  @Test
  fun `temporary metadata resource preserves safe display-name extension`() {
    assertEquals(
      ".flac",
      AudioMetadataExtractor.fileSuffix("Track.FLAC", "audio/mpeg"),
    )
  }

  @Test
  fun `mime type supplies extension when display name has none`() {
    assertEquals(
      ".mp3",
      AudioMetadataExtractor.fileSuffix("Track", "audio/mpeg"),
    )
  }

  @Test
  fun `unknown resource type receives neutral suffix`() {
    assertEquals(
      ".audio",
      AudioMetadataExtractor.fileSuffix(null, null),
    )
  }
}
