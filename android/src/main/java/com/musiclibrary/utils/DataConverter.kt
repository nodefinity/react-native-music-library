package com.musiclibrary.utils

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.musiclibrary.models.*

object DataConverter {

  fun trackToWritableMap(track: Track): WritableMap {
    val map = Arguments.createMap()
    map.putString("id", track.id)
    map.putString("title", track.title)
    putNullableString(map, "artist", track.artist)
    putNullableString(map, "artwork", track.artwork)
    putNullableString(map, "album", track.album)
    map.putDouble("duration", track.duration)
    map.putString("url", track.url)
    track.contentUri?.let { map.putString("contentUri", it) }
    map.putLong("fileSize", track.fileSize)

    putNullableLong(map, "createdAt", track.createdAt)
    putNullableLong(map, "modifiedAt", track.modifiedAt)

    return map
  }

  fun albumToWritableMap(album: Album): WritableMap {
    val map = Arguments.createMap()
    map.putString("id", album.id)
    map.putString("title", album.title)
    map.putString("artist", album.artist)
    putNullableString(map, "artwork", album.artwork)
    map.putInt("trackCount", album.trackCount)
    if (album.year == null) map.putNull("year") else map.putInt("year", album.year)

    return map
  }

  fun artistToWritableMap(artist: Artist): WritableMap {
    val map = Arguments.createMap()
    map.putString("id", artist.id)
    map.putString("title", artist.title)
    map.putInt("albumCount", artist.albumCount)
    map.putInt("trackCount", artist.trackCount)

    return map
  }

  fun genreToWritableMap(genre: Genre): WritableMap {
    val map = Arguments.createMap()
    map.putString("id", genre.id)
    map.putString("title", genre.title)
    map.putInt("trackCount", genre.trackCount)

    return map
  }

  fun <T> paginatedResultToWritableMap(
    result: PaginatedResult<T>,
    itemConverter: (T) -> WritableMap
  ): WritableMap {
    val map = Arguments.createMap()

    val itemsArray = Arguments.createArray()
    result.items.forEach { item ->
      itemsArray.pushMap(itemConverter(item))
    }

    map.putArray("items", itemsArray)
    map.putBoolean("hasNextPage", result.hasNextPage)
    result.endCursor?.let { map.putString("endCursor", it) }
    result.totalCount?.let { map.putInt("totalCount", it) }

    return map
  }

  fun trackMetadataToWritableMap(metadata: TrackMetadata): WritableMap {
    val map = Arguments.createMap()
    map.putString("id", metadata.id)
    putNullableDouble(map, "duration", metadata.duration)
    putNullableLong(map, "bitrate", metadata.bitrate)
    putNullableInt(map, "sampleRate", metadata.sampleRate)
    putNullableString(map, "channels", metadata.channels)
    putNullableString(map, "format", metadata.format)
    putNullableString(map, "title", metadata.title)
    putNullableString(map, "artist", metadata.artist)
    putNullableString(map, "album", metadata.album)
    putNullableInt(map, "year", metadata.year)
    putNullableString(map, "genre", metadata.genre)
    putNullableInt(map, "track", metadata.track)
    putNullableInt(map, "disc", metadata.disc)
    putNullableString(map, "composer", metadata.composer)
    putNullableString(map, "lyricist", metadata.lyricist)
    putNullableString(map, "lyrics", metadata.lyrics)
    putNullableString(map, "albumArtist", metadata.albumArtist)
    putNullableString(map, "comment", metadata.comment)
    return map
  }

  private fun putNullableString(map: WritableMap, key: String, value: String?) {
    if (value == null) map.putNull(key) else map.putString(key, value)
  }

  private fun putNullableInt(map: WritableMap, key: String, value: Int?) {
    if (value == null) map.putNull(key) else map.putInt(key, value)
  }

  private fun putNullableLong(map: WritableMap, key: String, value: Long?) {
    if (value == null) map.putNull(key) else map.putDouble(key, value.toDouble())
  }

  private fun putNullableDouble(map: WritableMap, key: String, value: Double?) {
    if (value == null) map.putNull(key) else map.putDouble(key, value)
  }
}
