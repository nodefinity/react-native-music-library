package com.musiclibrary.utils

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.musiclibrary.models.*

object DataConverter {

  fun trackToWritableMap(track: Track): WritableMap {
    val map = Arguments.createMap()
    map.putString("id", track.id)
    map.putString("title", track.title)
    track.artist?.let { map.putString("artist", it) }
    track.artwork?.let { map.putString("artwork", it) }
    track.album?.let { map.putString("album", it) }
    map.putDouble("duration", track.duration)
    map.putString("url", track.url)
    map.putLong("fileSize", track.fileSize)

    track.createdAt?.let { map.putDouble("createdAt", it.toDouble()) }
    track.modifiedAt?.let { map.putDouble("modifiedAt", it.toDouble()) }

    return map
  }

  fun albumToWritableMap(album: Album): WritableMap {
    val map = Arguments.createMap()
    map.putString("id", album.id)
    map.putString("title", album.title)
    map.putString("artist", album.artist)
    album.artwork?.let { map.putString("artwork", it) }
    map.putInt("trackCount", album.trackCount)
    map.putDouble("duration", album.duration)
    album.year?.let { map.putInt("year", it) }

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
    metadata.duration?.let { map.putDouble("duration", it) }
    metadata.bitrate?.let { map.putLong("bitrate", it) }
    metadata.sampleRate?.let { map.putInt("sampleRate", it) }
    metadata.channels?.let { map.putString("channels", it) }
    metadata.format?.let { map.putString("format", it) }
    metadata.title?.let { map.putString("title", it) }
    metadata.artist?.let { map.putString("artist", it) }
    metadata.album?.let { map.putString("album", it) }
    metadata.year?.let { map.putInt("year", it) }
    metadata.genre?.let { map.putString("genre", it) }
    metadata.track?.let { map.putInt("track", it) }
    metadata.disc?.let { map.putInt("disc", it) }
    metadata.composer?.let { map.putString("composer", it) }
    metadata.lyricist?.let { map.putString("lyricist", it) }
    metadata.lyrics?.let { map.putString("lyrics", it) }
    metadata.albumArtist?.let { map.putString("albumArtist", it) }
    metadata.comment?.let { map.putString("comment", it) }
    return map
  }
}
