package com.musiclibrary.tracks

import android.content.ContentResolver
import com.musiclibrary.models.Track

object GetTracksByAlbumQuery {
  fun getTracksByAlbum(
    contentResolver: ContentResolver,
    albumId: String,
  ): List<Track> {
    return TrackQuery.getTracks(
      contentResolver = contentResolver,
      filter = TrackQueryFilter.Album(albumId),
      sortPolicy = TrackSortPolicy.AlbumTrackNumber
    )
  }
}
