package com.musiclibrary.models

data class Track(
  val id: String,
  val title: String,
  val artwork: String,
  val artist: String,
  val album: String,
  val genre: String,
  val duration: Double,
  val uri: String,
  val createdAt: Long? = null,
  val fileSize: Long? = null,
)

data class Album(
  val id: String,
  val name: String,
  val artist: String,
  val artwork: String? = null,
  val trackCount: Int,
  val duration: Double,
  val year: Int? = null,
)

data class Artist(
  val id: String,
  val name: String,
  val albumCount: Int,
  val trackCount: Int,
)

data class Genre(
  val id: String,
  val name: String,
  val trackCount: Int,
)
