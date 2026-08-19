import Foundation

internal class GetTracksByAlbumQuery {
  static func getTracksByAlbum(albumId: String) -> [Track] {
    return TrackQuery.getTracks(filter: .album(albumId), sortPolicy: .albumTrackNumber)
  }
}
