import Foundation
import MediaPlayer

internal class GetAlbumsQuery {

  static func getAlbums(options: AlbumOptions) -> PaginatedResult<Album> {
    guard MPMediaLibrary.authorizationStatus() == .authorized else {
      return PaginatedResult<Album>(items: [], hasNextPage: false, totalCount: 0)
    }

    let query = MPMediaQuery.albums()
    guard let collections = query.collections else {
      return PaginatedResult<Album>(items: [], hasNextPage: false, totalCount: 0)
    }

    var albums = collections.compactMap { buildAlbum($0) }

    applySortBy(options.sortBy, to: &albums)

    let totalCount = albums.count
    var startIndex = 0
    if let after = options.after {
      if let idx = albums.firstIndex(where: { $0.id == after }) {
        startIndex = idx + 1
      }
    }

    let endIndex = min(startIndex + options.first, albums.count)
    let page = startIndex < albums.count ? Array(albums[startIndex..<endIndex]) : []

    let hasNextPage = endIndex < albums.count
    let endCursor = page.last?.id

    return PaginatedResult<Album>(
      items: page,
      hasNextPage: hasNextPage,
      endCursor: endCursor,
      totalCount: totalCount
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
    let artwork: String? = representative.artwork != nil ? "artwork://album/\(albumId)" : nil

    return Album(
      id: "\(albumId)",
      title: title,
      artist: artist,
      artwork: artwork,
      trackCount: trackCount,
      year: year
    )
  }

  private static func applySortBy(_ sortBy: [String], to albums: inout [Album]) {
    for sortString in sortBy {
      let parts = sortString.components(separatedBy: " ")
      guard parts.count == 2 else { continue }
      let ascending = parts[1].uppercased() == "ASC"
      switch parts[0].lowercased() {
      case "default", "title":
        albums.sort { ascending ? $0.title < $1.title : $0.title > $1.title }
      case "artist":
        albums.sort { ascending ? $0.artist < $1.artist : $0.artist > $1.artist }
      case "trackcount":
        albums.sort { ascending ? $0.trackCount < $1.trackCount : $0.trackCount > $1.trackCount }
      case "year":
        albums.sort {
          let y0 = $0.year ?? 0
          let y1 = $1.year ?? 0
          return ascending ? y0 < y1 : y0 > y1
        }
      default: break
      }
    }
  }
}
