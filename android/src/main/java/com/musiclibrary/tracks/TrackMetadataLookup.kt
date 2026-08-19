package com.musiclibrary.tracks

import android.content.ContentResolver
import android.provider.MediaStore

internal data class TrackMetadataSource(
  val trackId: String,
  val filePath: String?,
)

internal object TrackMetadataLookup {
  fun findTrack(
    contentResolver: ContentResolver,
    trackId: String,
  ): TrackMetadataSource? {
    val projection = arrayOf(MediaStore.Audio.Media.DATA)
    val selection = "${MediaStore.Audio.Media._ID} = ?"
    val selectionArgs = arrayOf(trackId)

    val cursor = contentResolver.query(
      MediaStore.Audio.Media.EXTERNAL_CONTENT_URI,
      projection,
      selection,
      selectionArgs,
      null
    )

    cursor?.use { c ->
      if (c.moveToFirst()) {
        val dataColumn = c.getColumnIndexOrThrow(MediaStore.Audio.Media.DATA)
        return TrackMetadataSource(
          trackId = trackId,
          filePath = c.getString(dataColumn)
        )
      }
    }

    return null
  }
}
