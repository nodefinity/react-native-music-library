package com.musiclibrary.tracks

import com.musiclibrary.models.TrackMetadata
import java.io.File
import org.jaudiotagger.audio.AudioFileIO
import org.jaudiotagger.tag.FieldKey

internal object AudioMetadataExtractor {
  fun extract(source: TrackMetadataSource): TrackMetadata {
    val filePath = source.filePath
    if (filePath.isNullOrEmpty()) {
      return TrackMetadata(id = source.trackId)
    }

    return try {
      val audioFile = AudioFileIO.read(File(filePath))
      val header = audioFile.audioHeader
      val tag = audioFile.tag

      TrackMetadata(
        id = source.trackId,
        duration = header.trackLength.toDouble(),
        bitrate = header.bitRateAsNumber,
        sampleRate = header.sampleRateAsNumber,
        channels = header.channels,
        format = header.format,
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
    } catch (_: Exception) {
      TrackMetadata(id = source.trackId)
    }
  }
}
