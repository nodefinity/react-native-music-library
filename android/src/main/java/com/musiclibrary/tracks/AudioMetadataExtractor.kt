package com.musiclibrary.tracks

import android.content.Context
import com.musiclibrary.models.TrackMetadata
import java.io.File
import org.jaudiotagger.audio.AudioFileIO
import org.jaudiotagger.tag.FieldKey

internal object AudioMetadataExtractor {
  fun extract(context: Context, source: TrackMetadataSource): TrackMetadata {
    var temporaryFile: File? = null
    return try {
      val file = File.createTempFile(
        "music-library-metadata-",
        fileSuffix(source.displayName, source.mimeType),
        context.cacheDir,
      )
      temporaryFile = file
      val input = context.contentResolver.openInputStream(source.contentUri)
        ?: return TrackMetadata(id = source.trackId)
      input.use { stream ->
        file.outputStream().use { output -> stream.copyTo(output) }
      }

      val audioFile = AudioFileIO.read(file)
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
    } finally {
      temporaryFile?.delete()
    }
  }

  internal fun fileSuffix(displayName: String?, mimeType: String?): String {
    val extension = displayName
      ?.substringAfterLast('.', missingDelimiterValue = "")
      ?.lowercase()
      ?.takeIf { it.matches(Regex("[a-z0-9]{1,10}")) }

    if (extension != null) {
      return ".$extension"
    }

    return when (mimeType?.lowercase()) {
      "audio/aac", "audio/aacp" -> ".aac"
      "audio/flac" -> ".flac"
      "audio/mp4", "audio/m4a", "audio/x-m4a" -> ".m4a"
      "audio/mpeg" -> ".mp3"
      "audio/ogg" -> ".ogg"
      "audio/wav", "audio/x-wav" -> ".wav"
      else -> ".audio"
    }
  }
}
