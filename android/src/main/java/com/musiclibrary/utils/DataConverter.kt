package com.musiclibrary.utils

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.musiclibrary.models.*

object DataConverter {

  fun trackToWritableMap(track: Track): WritableMap {
    val map = Arguments.createMap()
    map.putString("id", track.id)
    map.putString("title", track.title)
    map.putString("artwork", track.artwork)
    map.putString("artist", track.artist)
    map.putString("album", track.album)
    map.putString("genre", track.genre)
    map.putDouble("duration", track.duration)
    map.putString("uri", track.uri)
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
}
