import Foundation

internal class GetTracksByArtistQuery {
  static func getTracksByArtist(artistId: String, options: TrackOptions) -> PaginatedResult<Track> {
    return TrackQuery.getPaginatedTracks(filter: .artist(artistId), options: options)
  }
}
