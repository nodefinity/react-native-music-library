import Foundation
import MediaPlayer

internal class GetAlbumsByArtistQuery {

  static func getAlbumsByArtist(artistId: String) -> [Album] {
    guard MPMediaLibrary.authorizationStatus() == .authorized else {
      return []
    }

    let query = MPMediaQuery.albums()
    let artistPredicate = MPMediaPropertyPredicate(
      value: NSNumber(value: UInt64(artistId) ?? 0),
      forProperty: MPMediaItemPropertyArtistPersistentID
    )
    query.filterPredicates = Set([artistPredicate])

    guard let collections = query.collections else {
      return []
    }

    return collections
      .compactMap { GetAlbumsQuery.buildAlbum($0) }
      .sorted { $0.title < $1.title }
  }
}
