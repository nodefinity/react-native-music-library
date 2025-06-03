package com.musiclibrary.models

data class TrackMeta(
  val cover: String,
  val genre: String
)

data class Track(
  val id: String,
  val title: String,
  val cover: String,
  val artist: String,
  val album: String,
  val genre: String,
  val duration: Double,
  val uri: String,
  val createdAt: Long? = null,
  val modifiedAt: Long? = null,
  val fileSize: Long,
)

data class Album(
  val id: String,
  val title: String,
  val artist: String,
  val artwork: String? = null,
  val trackCount: Int,
  val duration: Double,
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
