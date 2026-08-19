package com.musiclibrary.tracks

import android.content.ContentResolver
import com.musiclibrary.models.PaginatedResult
import com.musiclibrary.models.Track
import com.musiclibrary.models.TrackOptions

object GetTracksByArtistQuery {
  fun getTracksByArtist(
    contentResolver: ContentResolver,
    artistId: String,
    options: TrackOptions,
  ): PaginatedResult<Track> {
    return TrackQuery.getPaginatedTracks(
      contentResolver = contentResolver,
      filter = TrackQueryFilter.Artist(artistId),
      options = options
    )
  }
}
