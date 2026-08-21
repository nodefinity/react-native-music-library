import Foundation
import MediaPlayer

internal class GetAlbumsQuery {

  static func getAlbums(options: AlbumOptions) throws -> PaginatedResult<Album> {
    guard MPMediaLibrary.authorizationStatus() == .authorized else {
      return PaginatedResult<Album>(items: [], hasNextPage: false, totalCount: 0)
    }

    let query = MPMediaQuery.albums()
    var albums = (query.collections ?? []).compactMap { buildAlbum($0) }

    applySortBy(options.sortBy, to: &albums)

    let page = try paginateById(
      albums,
      first: options.first,
      after: options.after,
      id: { $0.id }
    )

    return PaginatedResult<Album>(
      items: page.items,
      hasNextPage: page.hasNextPage,
      endCursor: page.endCursor,
      totalCount: albums.count
    )
  }

  // MARK: - Helpers

  static func buildAlbum(_ collection: MPMediaItemCollection) -> Album? {
    guard let representative = collection.representativeItem else { return nil }
    let albumId = representative.albumPersistentID
    let title = representative.albumTitle ?? ""
    guard !title.isEmpty else { return nil }

    let artist = representative.albumArtist ?? representative.artist ?? ""
    let trackCount = collection.count
    let year = representative.releaseDate.map { Calendar.current.component(.year, from: $0) }
    let artwork: String? = representative.artwork != nil || representative.assetURL != nil
      ? "artwork://album/\(albumId)"
      : nil

    return Album(
      id: "\(albumId)",
      title: title,
      artist: artist,
      artwork: artwork,
      trackCount: trackCount,
      year: year
    )
  }

  private static func applySortBy(_ sortBy: [SortOption], to albums: inout [Album]) {
    let options = sortBy.isEmpty ? [SortOption(key: "default", ascending: true)] : sortBy
    albums.sort { lhs, rhs in
      for option in options {
        if let result = compare(lhs, rhs, by: option) {
          return result
        }
      }

      return (UInt64(lhs.id) ?? 0) < (UInt64(rhs.id) ?? 0)
    }
  }

  private static func compare(_ lhs: Album, _ rhs: Album, by option: SortOption) -> Bool? {
    switch option.key.lowercased() {
    case "default", "title":
      return compare(lhs.title, rhs.title, ascending: option.ascending)
    case "artist":
      return compare(lhs.artist, rhs.artist, ascending: option.ascending)
    case "trackcount":
      return compare(lhs.trackCount, rhs.trackCount, ascending: option.ascending)
    case "year":
      return compare(lhs.year ?? 0, rhs.year ?? 0, ascending: option.ascending)
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
