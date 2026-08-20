import Foundation
import MediaPlayer

internal class GetArtistsQuery {

  static func getArtists(options: ArtistOptions) throws -> PaginatedResult<Artist> {
    guard MPMediaLibrary.authorizationStatus() == .authorized else {
      return PaginatedResult<Artist>(items: [], hasNextPage: false, totalCount: 0)
    }

    let artistQuery = MPMediaQuery.artists()
    var artists = (artistQuery.collections ?? []).compactMap { buildArtist($0) }

    applySortBy(options.sortBy, to: &artists)

    let page = try paginateById(
      artists,
      first: options.first,
      after: options.after,
      id: { $0.id }
    )

    return PaginatedResult<Artist>(
      items: page.items,
      hasNextPage: page.hasNextPage,
      endCursor: page.endCursor,
      totalCount: artists.count
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
    let options = sortBy.isEmpty ? [SortOption(key: "default", ascending: true)] : sortBy
    artists.sort { lhs, rhs in
      for option in options {
        if let result = compare(lhs, rhs, by: option) {
          return result
        }
      }

      return (UInt64(lhs.id) ?? 0) < (UInt64(rhs.id) ?? 0)
    }
  }

  private static func compare(_ lhs: Artist, _ rhs: Artist, by option: SortOption) -> Bool? {
    switch option.key.lowercased() {
    case "default", "title":
      return compare(lhs.title, rhs.title, ascending: option.ascending)
    case "trackcount":
      return compare(lhs.trackCount, rhs.trackCount, ascending: option.ascending)
    case "albumcount":
      return compare(lhs.albumCount, rhs.albumCount, ascending: option.ascending)
    default:
      return nil
    }
  }

  private static func compare<T: Comparable>(_ lhs: T, _ rhs: T, ascending: Bool) -> Bool? {
    if lhs == rhs {
      return nil
    }

    return ascending ? lhs < rhs : lhs > rhs
  }
}
