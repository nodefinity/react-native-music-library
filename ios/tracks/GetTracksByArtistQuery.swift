import Foundation

internal class GetTracksByArtistQuery {
  static func getTracksByArtist(artistId: String, options: TrackOptions) throws -> PaginatedResult<Track> {
    return try TrackQuery.getPaginatedTracks(filter: .artist(artistId), options: options)
  }
}
