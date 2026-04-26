import Foundation
import MediaPlayer

internal class GetTracksByArtistQuery {

  static func getTracksByArtist(artistId: String, options: TrackOptions) -> PaginatedResult<Track> {
    guard MPMediaLibrary.authorizationStatus() == .authorized else {
      return PaginatedResult<Track>(items: [], hasNextPage: false, totalCount: 0)
    }

    let query = MPMediaQuery.songs()
    let artistPredicate = MPMediaPropertyPredicate(
      value: NSNumber(value: UInt64(artistId) ?? 0),
      forProperty: MPMediaItemPropertyArtistPersistentID
    )
    query.filterPredicates = Set([artistPredicate])

    guard var items = query.items else {
      return PaginatedResult<Track>(items: [], hasNextPage: false, totalCount: 0)
    }

    applySortBy(options.sortBy, to: &items)

    let totalCount = items.count
    var startIndex = 0
    if let after = options.after, let afterId = UInt64(after) {
      if let idx = items.firstIndex(where: { $0.persistentID == afterId }) {
        startIndex = idx + 1
      }
    }

    let endIndex = min(startIndex + options.first, items.count)
    let page = startIndex < items.count ? Array(items[startIndex..<endIndex]) : []

    let tracks = page.map { buildTrack($0) }
    let hasNextPage = endIndex < items.count
    let endCursor = page.last.map { "\($0.persistentID)" }

    return PaginatedResult<Track>(
      items: tracks,
      hasNextPage: hasNextPage,
      endCursor: endCursor,
      totalCount: totalCount
    )
  }

  // MARK: - Helpers

  private static func applySortBy(_ sortBy: [String], to items: inout [MPMediaItem]) {
    for sortString in sortBy {
      let parts = sortString.components(separatedBy: " ")
      guard parts.count == 2 else { continue }
      let ascending = parts[1].uppercased() == "ASC"
      switch parts[0].lowercased() {
      case "default", "title":
        items.sort { ($0.title ?? "") < ($1.title ?? "") ? ascending : !ascending }
      case "artist":
        items.sort { ($0.artist ?? "") < ($1.artist ?? "") ? ascending : !ascending }
      case "album":
        items.sort { ($0.albumTitle ?? "") < ($1.albumTitle ?? "") ? ascending : !ascending }
      case "duration":
        items.sort { ascending ? $0.playbackDuration < $1.playbackDuration : $0.playbackDuration > $1.playbackDuration }
      case "createdat":
        items.sort { ascending ? $0.dateAdded < $1.dateAdded : $0.dateAdded > $1.dateAdded }
      case "modifiedat":
        items.sort { ascending ? $0.dateAdded < $1.dateAdded : $0.dateAdded > $1.dateAdded }
      case "filesize":
        items.sort {
          let s0 = fileSize(for: $0)
          let s1 = fileSize(for: $1)
          return ascending ? s0 < s1 : s0 > s1
        }
      default: break
      }
    }
  }

  private static func buildTrack(_ item: MPMediaItem) -> Track {
    var urlString = ""
    if let assetURL = item.assetURL {
      urlString = assetURL.absoluteString
    } else {
      urlString = "ipod-library://item/item.m4a?id=\(item.persistentID)"
    }

    return Track(
      id: "\(item.persistentID)",
      title: item.title ?? "Unknown Title",
      artist: item.artist,
      artwork: item.artwork != nil ? "artwork://\(item.persistentID)" : nil,
      album: item.albumTitle,
      duration: item.playbackDuration,
      url: urlString,
      createdAt: item.dateAdded.timeIntervalSince1970,
      modifiedAt: item.dateAdded.timeIntervalSince1970,
      fileSize: fileSize(for: item)
    )
  }

  private static func fileSize(for item: MPMediaItem) -> Int64 {
    guard let url = item.assetURL else { return 0 }
    return (try? FileManager.default.attributesOfItem(atPath: url.path)[.size] as? Int64) ?? 0
  }
}
