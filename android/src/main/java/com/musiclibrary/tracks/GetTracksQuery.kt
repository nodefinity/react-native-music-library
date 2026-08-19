package com.musiclibrary.tracks

import android.content.ContentResolver
import com.musiclibrary.models.PaginatedResult
import com.musiclibrary.models.Track
import com.musiclibrary.models.TrackOptions

object GetTracksQuery {
  fun getTracks(
    contentResolver: ContentResolver,
    options: TrackOptions,
  ): PaginatedResult<Track> {
    return TrackQuery.getPaginatedTracks(
      contentResolver = contentResolver,
      options = options
    )
  }
}
