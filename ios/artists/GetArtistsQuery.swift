import Foundation
import MediaPlayer

internal class GetArtistsQuery {

  static func getArtists(options: ArtistOptions) -> PaginatedResult<Artist> {
    guard MPMediaLibrary.authorizationStatus() == .authorized else {
      return PaginatedResult<Artist>(items: [], hasNextPage: false, totalCount: 0)
    }

    let artistQuery = MPMediaQuery.artists()
    guard let artistCollections = artistQuery.collections else {
      return PaginatedResult<Artist>(items: [], hasNextPage: false, totalCount: 0)
    }

    var artists = artistCollections.compactMap { buildArtist($0) }

    applySortBy(options.sortBy, to: &artists)

    let totalCount = artists.count
    var startIndex = 0
    if let after = options.after {
      if let idx = artists.firstIndex(where: { $0.id == after }) {
        startIndex = idx + 1
      }
    }

    let endIndex = min(startIndex + options.first, artists.count)
    let page = startIndex < artists.count ? Array(artists[startIndex..<endIndex]) : []

    let hasNextPage = endIndex < artists.count
    let endCursor = page.last?.id

    return PaginatedResult<Artist>(
      items: page,
      hasNextPage: hasNextPage,
      endCursor: endCursor,
      totalCount: totalCount
    )
  }

  // MARK: - Helpers

  private static func buildArtist(_ collection: MPMediaItemCollection) -> Artist? {
    guard let representative = collection.representativeItem else { return nil }
    let artistName = representative.artist ?? ""
    guard !artistName.isEmpty else { return nil }

    let artistId = representative.artistPersistentID
    let trackCount = collection.count

    // Count albums for this artist
    let albumQuery = MPMediaQuery.albums()
    let artistPredicate = MPMediaPropertyPredicate(
      value: NSNumber(value: artistId),
      forProperty: MPMediaItemPropertyArtistPersistentID
    )
    albumQuery.filterPredicates = Set([artistPredicate])
    let albumCount = albumQuery.collections?.count ?? 0

    return Artist(
      id: "\(artistId)",
      title: artistName,
      albumCount: albumCount,
      trackCount: trackCount
    )
  }

  private static func applySortBy(_ sortBy: [SortOption], to artists: inout [Artist]) {
    for sortOption in sortBy {
      let ascending = sortOption.ascending
      switch sortOption.key.lowercased() {
      case "default", "title":
        artists.sort { ascending ? $0.title < $1.title : $0.title > $1.title }
      case "trackcount":
        artists.sort { ascending ? $0.trackCount < $1.trackCount : $0.trackCount > $1.trackCount }
      case "albumcount":
        artists.sort { ascending ? $0.albumCount < $1.albumCount : $0.albumCount > $1.albumCount }
      default: break
      }
    }
  }
}
