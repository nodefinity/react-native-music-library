package com.musiclibrary.tracks

import android.content.Context
import android.content.ContentResolver
import android.provider.MediaStore
import com.facebook.react.bridge.Promise
import com.musiclibrary.models.TrackMetadata
import com.musiclibrary.utils.DataConverter
import java.io.File
import org.jaudiotagger.audio.AudioFileIO
import org.jaudiotagger.tag.FieldKey

internal class GetTrackMetadataQuery(
  private val context: Context,
  private val trackId: String,
  private val promise: Promise
) {
  fun execute() {
    try {
      val contentResolver = context.contentResolver
      val result = getTrackMetadata(contentResolver, trackId)
      val writableMap = DataConverter.trackMetadataToWritableMap(result)
      promise.resolve(writableMap)
    } catch (e: Exception) {
      promise.reject("QUERY_ERROR", "Failed to get track metadata: ${e.message}", e)
    }
  }

  private fun getTrackMetadata(
    contentResolver: ContentResolver,
    trackId: String
  ): TrackMetadata {
    // First try to get the file path from MediaStore
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
        val filePath = c.getString(dataColumn)

        if (!filePath.isNullOrEmpty()) {
          try {
            val audioFile = AudioFileIO.read(File(filePath))
            val header = audioFile.audioHeader
            val tag = audioFile.tag

            return TrackMetadata(
              id = trackId,
              // AudioHeader
              duration = header.trackLength.toDouble(),
              bitrate = header.bitRateAsNumber,
              sampleRate = header.sampleRateAsNumber,
              channels = header.channels,
              format = header.format,
              // Tag
              title = tag?.getFirst(FieldKey.TITLE),
              artist = tag?.getFirst(FieldKey.ARTIST),
              album = tag?.getFirst(FieldKey.ALBUM),
              year = tag?.getFirst(FieldKey.YEAR)?.toIntOrNull(),
              genre = tag?.getFirst(FieldKey.GENRE),
              track = tag?.getFirst(FieldKey.TRACK)?.toIntOrNull(),
              disc = tag?.getFirst(FieldKey.DISC_NO)?.toIntOrNull(),
              composer = tag?.getFirst(FieldKey.COMPOSER),
              lyricist = tag?.getFirst(FieldKey.LYRICIST),
              lyrics = tag?.getFirst(FieldKey.LYRICS),
              albumArtist = tag?.getFirst(FieldKey.ALBUM_ARTIST),
              comment = tag?.getFirst(FieldKey.COMMENT)
            )
          } catch (e: Exception) {
            // If reading the file fails, return empty metadata
          }
        }
      }
    }

    return TrackMetadata(id = trackId)
  }
}
