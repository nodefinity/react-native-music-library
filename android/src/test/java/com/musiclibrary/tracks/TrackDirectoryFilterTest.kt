package com.musiclibrary.tracks

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test

class TrackDirectoryFilterTest {
  @Test
  fun `primary tree maps to primary MediaStore volume and relative path`() {
    assertEquals(
      ExternalStorageDirectory("external_primary", "Music/Live/%"),
      TrackDirectoryFilter.parseExternalStorageDocumentId("primary:Music/Live"),
    )
  }

  @Test
  fun `removable tree preserves normalized volume name`() {
    assertEquals(
      ExternalStorageDirectory("1234-abcd", "Audio/%"),
      TrackDirectoryFilter.parseExternalStorageDocumentId("1234-ABCD:Audio"),
    )
  }

  @Test
  fun `volume root covers every relative path`() {
    assertEquals(
      ExternalStorageDirectory("external_primary", null),
      TrackDirectoryFilter.parseExternalStorageDocumentId("primary:"),
    )
  }

  @Test
  fun `missing volume is rejected`() {
    assertNull(TrackDirectoryFilter.parseExternalStorageDocumentId(":"))
  }
}
