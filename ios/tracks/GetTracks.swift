//
//  GetTracks.swift
//  MusicLibrary
//
//

import Foundation
import MediaPlayer

internal class GetTracks {
  private let options: TrackOptions

  init(options: TrackOptions) {
    self.options = options
  }

  func execute() -> PaginatedResult<Track> {
    return getTracks(options: options)
  }

  // MARK: - Main Query Logic

  private func getTracks(options: TrackOptions) -> PaginatedResult<Track> {
    // 检查权限
    if MPMediaLibrary.authorizationStatus() != .authorized {
      NSLog("🎵 [MusicLibrary] Music Library permission not authorized")
      return PaginatedResult<Track>(items: [], hasNextPage: false, totalCount: 0)
    }

    // iOS 不支持按目录过滤，忽略 directory 参数
    if let directory = options.directory, !directory.isEmpty {
      NSLog("🎵 [MusicLibrary] Directory filtering ('%@') is not supported on iOS, ignoring parameter", directory)
    }

    let query = MPMediaQuery.songs()
    NSLog("🎵 [MusicLibrary] getTracks query: %@", query)

    // 获取所有项目
    guard var items = query.items else {
      NSLog("🎵 [MusicLibrary] No items found in query")
      return PaginatedResult<Track>(items: [], hasNextPage: false, totalCount: 0)
    }

    NSLog("🎵 [MusicLibrary] Found %d total items", items.count)

    // 处理排序 - 按照参考实现的方式
    if !options.sortBy.isEmpty {
      for sortString in options.sortBy {
        let components = sortString.components(separatedBy: " ")
        let key = components[0]
        let ascending = components.count > 1 && components[1] == "ASC"

        NSLog("🎵 [MusicLibrary] Sorting by: %@ %@", key, ascending ? "ASC" : "DESC")

        switch key.lowercased() {
        case "title", "default":
          items.sort { item1, item2 in
            let title1 = item1.title ?? ""
            let title2 = item2.title ?? ""
            return ascending ? title1 < title2 : title1 > title2
          }
        case "artist":
          items.sort { item1, item2 in
            let artist1 = item1.artist ?? ""
            let artist2 = item2.artist ?? ""
            return ascending ? artist1 < artist2 : artist1 > artist2
          }
        case "duration":
          items.sort { item1, item2 in
            return ascending ? item1.playbackDuration < item2.playbackDuration : item1.playbackDuration > item2.playbackDuration
          }
        case "createdat", "creationtime":
          items.sort { item1, item2 in
            return ascending ? item1.dateAdded < item2.dateAdded : item1.dateAdded > item2.dateAdded
          }
        case "modifiedat", "modificationtime":
          items.sort { item1, item2 in
            let date1 = item1.lastPlayedDate ?? Date(timeIntervalSince1970: 0)
            let date2 = item2.lastPlayedDate ?? Date(timeIntervalSince1970: 0)
            return ascending ? date1 < date2 : date1 > date2
          }
        case "album":
          items.sort { item1, item2 in
            let album1 = item1.albumTitle ?? ""
            let album2 = item2.albumTitle ?? ""
            return ascending ? album1 < album2 : album1 > album2
          }
        case "filesize":
          items.sort { item1, item2 in
            let size1 = getFileSize(for: item1)
            let size2 = getFileSize(for: item2)
            return ascending ? size1 < size2 : size1 > size2
          }
        default:
          NSLog("🎵 [MusicLibrary] Unknown sort key: %@", key)
        }
      }
    }

    // 处理分页 - 按照参考实现的方式
    let first = options.first
    let after = options.after

    var startIndex = 0
    if let after = after, let afterId = UInt64(after) {
      if let foundIndex = items.firstIndex(where: { $0.persistentID == afterId }) {
        startIndex = foundIndex + 1
      }
    }

    let endIndex = min(startIndex + first, items.count)
    let paginatedItems = startIndex < items.count ? Array(items[startIndex..<endIndex]) : []

    NSLog("🎵 [MusicLibrary] Pagination: startIndex=%d, endIndex=%d, paginatedItems=%d",
          startIndex, endIndex, paginatedItems.count)

    // 转换为Track对象
    let tracks = paginatedItems.map { item -> Track in
      // 详细调试 URL 信息
      NSLog("🎵 [MusicLibrary] Track: '%@'", item.title ?? "Unknown")
      NSLog("🎵 [MusicLibrary] - assetURL: %@", item.assetURL?.absoluteString ?? "nil")
      NSLog("🎵 [MusicLibrary] - isCloudItem: %d", item.isCloudItem)
      NSLog("🎵 [MusicLibrary] - hasProtectedAsset: %d", item.hasProtectedAsset)

      // 尝试不同的 URL 获取方式
      var urlString = ""

      if let assetURL = item.assetURL {
        urlString = assetURL.absoluteString
        NSLog("🎵 [MusicLibrary] - Using assetURL: %@", urlString)
      } else if item.isCloudItem {
        // 对于云端项目，我们可以使用 persistentID 作为标识符
        urlString = "ipod-library://item/item.m4a?id=\(item.persistentID)"
        NSLog("🎵 [MusicLibrary] - Cloud item, using custom scheme: %@", urlString)
      } else {
        // 尝试使用 persistentID 构造URL（某些播放器可能支持）
        urlString = "ipod-library://item/item.m4a?id=\(item.persistentID)"
        NSLog("🎵 [MusicLibrary] - No assetURL, using fallback scheme: %@", urlString)
      }

      let track = Track(
        id: "\(item.persistentID)",
        title: item.title ?? "Unknown Title",
        artist: item.artist,
        artwork: getArtworkURL(for: item),
        album: item.albumTitle,
        duration: item.playbackDuration,
        url: urlString,
        createdAt: item.dateAdded.timeIntervalSince1970,
        modifiedAt: item.dateAdded.timeIntervalSince1970,
        fileSize: getFileSize(for: item)
      )

      NSLog("🎵 [MusicLibrary] Created track: %@ with URL: %@", track.title, track.url)
      return track
    }

    // 返回结果
    let hasNextPage = endIndex < items.count
    let endCursor = paginatedItems.last.map { "\($0.persistentID)" } ?? after ?? ""

    return PaginatedResult<Track>(
      items: tracks,
      hasNextPage: hasNextPage,
      endCursor: endCursor,
      totalCount: items.count
    )
  }

  // MARK: - Private Helper Methods

  private func getArtworkURL(for item: MPMediaItem) -> String? {
    if let artwork = item.artwork {
      // 在实际应用中，您可能需要将artwork保存到临时目录并返回文件URL
      // 这里返回一个占位符URL，实际项目中可以实现artwork缓存
      return "artwork://\(item.persistentID)"
    }
    return nil
  }

  private func getFileSize(for item: MPMediaItem) -> Int64 {
    // MediaPlayer框架不直接提供文件大小信息
    // 可以通过assetURL读取文件属性获取
    guard let url = item.assetURL else { return 0 }

    do {
      let attributes = try FileManager.default.attributesOfItem(atPath: url.path)
      return attributes[.size] as? Int64 ?? 0
    } catch {
      return 0
    }
  }

  private func buildSortDescriptors(from sortBy: [String]) -> [NSSortDescriptor] {
    if sortBy.isEmpty {
      return [NSSortDescriptor(key: MPMediaItemPropertyTitle, ascending: true)]
    }

    return sortBy.compactMap { sortOption in
      let parts = sortOption.components(separatedBy: " ")
      guard parts.count == 2 else { return nil }

      let key: String
      switch parts[0].lowercased() {
      case "default", "title":
        key = MPMediaItemPropertyTitle
      case "artist":
        key = MPMediaItemPropertyArtist
      case "album":
        key = MPMediaItemPropertyAlbumTitle
      case "duration":
        key = MPMediaItemPropertyPlaybackDuration
      case "createdat":
        key = MPMediaItemPropertyDateAdded
      case "modifiedat":
        key = MPMediaItemPropertyDateAdded
      default:
        return nil
      }

      let ascending = parts[1].uppercased() == "ASC"
      return NSSortDescriptor(key: key, ascending: ascending)
    }
  }
}
