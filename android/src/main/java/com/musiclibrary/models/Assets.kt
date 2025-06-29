package com.musiclibrary.models

data class Track(
  val id: String,
  val title: String,
  val artist: String? = null,
  val artwork: String? = null,
  val album: String? = null,
  val duration: Double,
  val url: String,
  val createdAt: Long? = null,
  val modifiedAt: Long? = null,
  val fileSize: Long,
)

data class TrackMetadata(
  val id: String,
  
  // AudioHeader
  val duration: Double? = null,
  val bitrate: Long? = null,
  val sampleRate: Int? = null,
  val channels: String? = null,
  val format: String? = null,
  
  // Tag
  val title: String? = null,
  val artist: String? = null,
  val album: String? = null,
  val year: Int? = null,
  val genre: String? = null,
  val track: Int? = null,
  val disc: Int? = null,
  val composer: String? = null,
  val lyricist: String? = null,
  val lyrics: String? = null,
  val albumArtist: String? = null,
  val comment: String? = null
)

data class Album(
  val id: String,
  val title: String,
  val artist: String,
  val artwork: String? = null,
  val trackCount: Int,
  val year: Int? = null,
)

data class Artist(
  val id: String,
  val title: String,
  val albumCount: Int,
  val trackCount: Int,
)

data class Genre(
  val id: String,
  val title: String,
  val trackCount: Int,
)
