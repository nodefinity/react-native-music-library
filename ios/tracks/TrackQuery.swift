import Foundation
import MediaPlayer

internal enum TrackQueryFilter {
  case all
  case album(String)
  case artist(String)
}

internal enum TrackResourcePolicy {
  case allowLibraryFallback
  case requireAssetURL
}

internal enum TrackSortPolicy {
  case options([SortOption])
  case albumTrackNumber
}

internal class TrackQuery {
  static func getPaginatedTracks(filter: TrackQueryFilter = .all, options: TrackOptions) -> PaginatedResult<Track> {
    guard var items = queryItems(filter: filter) else {
      return PaginatedResult<Track>(items: [], hasNextPage: false, totalCount: 0)
    }

    applySort(.options(options.sortBy), to: &items)

    let page = paginate(items, first: options.first, after: options.after)
    let tracks = page.items.compactMap {
      buildTrack(from: $0, resourcePolicy: .allowLibraryFallback)
    }

    return PaginatedResult<Track>(
      items: tracks,
      hasNextPage: page.hasNextPage,
      endCursor: page.endCursor,
      totalCount: items.count
    )
  }

  static func getTracks(filter: TrackQueryFilter, sortPolicy: TrackSortPolicy = .albumTrackNumber) -> [Track] {
    guard var items = queryItems(filter: filter) else {
      return []
    }

    applySort(sortPolicy, to: &items)

    return items.compactMap {
      buildTrack(from: $0, resourcePolicy: .requireAssetURL)
    }
  }

  private static func queryItems(filter: TrackQueryFilter) -> [MPMediaItem]? {
    let query = MPMediaQuery.songs()
    let predicates = filterPredicates(for: filter)

    if !predicates.isEmpty {
      query.filterPredicates = Set(predicates)
    }

    return query.items
  }

  private static func filterPredicates(for filter: TrackQueryFilter) -> [MPMediaPropertyPredicate] {
    switch filter {
    case .all:
      return []
    case .album(let albumId):
      return [
        MPMediaPropertyPredicate(
          value: NSNumber(value: UInt64(albumId) ?? 0),
          forProperty: MPMediaItemPropertyAlbumPersistentID
        ),
        MPMediaPropertyPredicate(
          value: MPMediaType.music.rawValue,
          forProperty: MPMediaItemPropertyMediaType
        )
      ]
    case .artist(let artistId):
      return [
        MPMediaPropertyPredicate(
          value: NSNumber(value: UInt64(artistId) ?? 0),
          forProperty: MPMediaItemPropertyArtistPersistentID
        )
      ]
    }
  }

  private static func applySort(_ sortPolicy: TrackSortPolicy, to items: inout [MPMediaItem]) {
    switch sortPolicy {
    case .albumTrackNumber:
      items.sort { lhs, rhs in
        if lhs.albumTrackNumber != rhs.albumTrackNumber {
          return lhs.albumTrackNumber < rhs.albumTrackNumber
        }

        return (lhs.title ?? "") < (rhs.title ?? "")
      }
    case .options(let sortBy):
      let options = sortBy.isEmpty ? [SortOption(key: "default", ascending: true)] : sortBy
      items.sort { lhs, rhs in
        compare(lhs, rhs, using: options)
      }
    }
  }

  private static func compare(_ lhs: MPMediaItem, _ rhs: MPMediaItem, using sortBy: [SortOption]) -> Bool {
    for sortOption in sortBy {
      if let result = compare(lhs, rhs, by: sortOption) {
        return result
      }
    }

    return lhs.persistentID < rhs.persistentID
  }

  private static func compare(_ lhs: MPMediaItem, _ rhs: MPMediaItem, by sortOption: SortOption) -> Bool? {
    let ascending = sortOption.ascending

    switch sortOption.key.lowercased() {
    case "default", "title":
      return compare(lhs.title ?? "", rhs.title ?? "", ascending: ascending)
    case "artist":
      return compare(lhs.artist ?? "", rhs.artist ?? "", ascending: ascending)
    case "album":
      return compare(lhs.albumTitle ?? "", rhs.albumTitle ?? "", ascending: ascending)
    case "duration":
      return compare(lhs.playbackDuration, rhs.playbackDuration, ascending: ascending)
    case "createdat", "creationtime", "modifiedat", "modificationtime":
      return compare(lhs.dateAdded, rhs.dateAdded, ascending: ascending)
    case "filesize":
      return compare(fileSize(for: lhs), fileSize(for: rhs), ascending: ascending)
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

  private static func paginate(_ items: [MPMediaItem], first: Int, after: String?) -> (items: [MPMediaItem], hasNextPage: Bool, endCursor: String?) {
    var startIndex = 0

    if let after = after, let afterId = UInt64(after),
       let foundIndex = items.firstIndex(where: { $0.persistentID == afterId }) {
      startIndex = foundIndex + 1
    }

    let endIndex = min(startIndex + first, items.count)
    let page = startIndex < items.count ? Array(items[startIndex..<endIndex]) : []
    let endCursor = page.last.map { "\($0.persistentID)" } ?? after

    return (
      items: page,
      hasNextPage: endIndex < items.count,
      endCursor: endCursor
    )
  }

  private static func buildTrack(from item: MPMediaItem, resourcePolicy: TrackResourcePolicy) -> Track? {
    guard let urlString = trackURL(for: item, policy: resourcePolicy) else {
      return nil
    }

    return Track(
      id: "\(item.persistentID)",
      title: item.title ?? "Unknown Title",
      artist: item.artist,
      artwork: artworkURL(for: item),
      album: item.albumTitle,
      duration: item.playbackDuration,
      url: urlString,
      createdAt: item.dateAdded.timeIntervalSince1970,
      modifiedAt: item.dateAdded.timeIntervalSince1970,
      fileSize: fileSize(for: item)
    )
  }

  private static func trackURL(for item: MPMediaItem, policy: TrackResourcePolicy) -> String? {
    if let assetURL = item.assetURL {
      return assetURL.absoluteString
    }

    switch policy {
    case .allowLibraryFallback:
      return "ipod-library://item/item.m4a?id=\(item.persistentID)"
    case .requireAssetURL:
      return nil
    }
  }

  private static func artworkURL(for item: MPMediaItem) -> String? {
    guard item.artwork != nil || item.assetURL != nil else {
      return nil
    }

    return "artwork://track/\(item.persistentID)"
  }

  private static func fileSize(for item: MPMediaItem) -> Int64 {
    guard let url = item.assetURL else {
      return 0
    }

    return (try? FileManager.default.attributesOfItem(atPath: url.path)[.size] as? Int64) ?? 0
  }
}
