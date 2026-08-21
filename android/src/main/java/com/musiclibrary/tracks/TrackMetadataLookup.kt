package com.musiclibrary.tracks

import android.content.ContentResolver
import android.content.ContentUris
import android.net.Uri
import android.provider.MediaStore

internal data class TrackMetadataSource(
  val trackId: String,
  val contentUri: Uri,
  val displayName: String?,
  val mimeType: String?,
)

internal object TrackMetadataLookup {
  fun findTrack(
    contentResolver: ContentResolver,
    trackId: String,
  ): TrackMetadataSource? {
    val id = trackId.toLongOrNull() ?: return null
    val contentUri = ContentUris.withAppendedId(
      MediaStore.Audio.Media.EXTERNAL_CONTENT_URI,
      id,
    )
    val projection = arrayOf(
      MediaStore.Audio.Media.DISPLAY_NAME,
      MediaStore.Audio.Media.MIME_TYPE,
    )

    val cursor = contentResolver.query(
      contentUri,
      projection,
      null,
      null,
      null
    )

    cursor?.use { c ->
      if (c.moveToFirst()) {
        val displayNameColumn = c.getColumnIndexOrThrow(MediaStore.Audio.Media.DISPLAY_NAME)
        val mimeTypeColumn = c.getColumnIndexOrThrow(MediaStore.Audio.Media.MIME_TYPE)
        return TrackMetadataSource(
          trackId = trackId,
          contentUri = contentUri,
          displayName = c.getString(displayNameColumn),
          mimeType = c.getString(mimeTypeColumn),
        )
      }
    }

    return null
  }
}
