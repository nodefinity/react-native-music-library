//
//  GetTracksQuery.swift
//  MusicLibrary
//
//

import Foundation
import MediaPlayer

internal class GetTracksQuery {
  
  static func getTracks(options: TrackOptions) -> PaginatedResult<Track> {
    let query = MPMediaQuery.songs()
    
    NSLog("🎵 [MusicLibrary] getTracks query: %@", query)

    // 添加筛选条件
    var predicates: [MPMediaPredicate] = []
    
    // 只查询音乐文件（排除其他音频）
    let musicPredicate = MPMediaPropertyPredicate(value: MPMediaType.music.rawValue,
                                                forProperty: MPMediaItemPropertyMediaType)
    predicates.append(musicPredicate)
    
    // 如果有目录筛选，添加路径筛选
    if let directory = options.directory, !directory.isEmpty {
      // iOS中MediaPlayer框架不直接支持路径筛选，这里留作扩展
      // 可以通过assetURL进行后筛选
    }
    
    // 应用所有筛选条件
    query.filterPredicates = Set(predicates)
    
    // 设置排序
    query.groupingType = .title
    
    // 获取所有项目
    guard let items = query.items else {
      return PaginatedResult<Track>(items: [], hasNextPage: false, totalCount: 0)
    }
    
    let totalCount = items.count
    var tracks: [Track] = []
    var startIndex = 0
    
    // 处理分页：查找after位置
    if let after = options.after {
      for (index, item) in items.enumerated() {
        if "\(item.persistentID)" == after {
          startIndex = index + 1
          break
        }
      }
    }
    
    // 获取指定数量的记录
    let maxItems = min(options.first, 1000) // 限制最大查询数量
    let endIndex = min(startIndex + maxItems, totalCount)
    
    for i in startIndex..<endIndex {
      let item = items[i]
      
      // 跳过无效的音频文件
      guard let url = item.assetURL, item.playbackDuration > 0 else {
        continue
      }
      
      // 创建Track对象
      let track = Track(
        id: "\(item.persistentID)",
        title: item.title ?? "Unknown Title",
        artist: item.artist,
        artwork: getArtworkURL(for: item),
        album: item.albumTitle,
        duration: item.playbackDuration,
        url: url.absoluteString,
        createdAt: item.dateAdded.timeIntervalSince1970,
        modifiedAt: item.dateAdded.timeIntervalSince1970,
        fileSize: getFileSize(for: item)
      )
      
      tracks.append(track)
    }
    
    // 判断是否有下一页
    let hasNextPage = endIndex < totalCount
    let endCursor = tracks.last?.id
    
    return PaginatedResult<Track>(
      items: tracks,
      hasNextPage: hasNextPage,
      endCursor: endCursor,
      totalCount: totalCount
    )
  }
  
  // MARK: - Private Helper Methods
  
  private static func getArtworkURL(for item: MPMediaItem) -> String? {
    if let artwork = item.artwork {
      // 在实际应用中，您可能需要将artwork保存到临时目录并返回文件URL
      // 这里返回一个占位符URL，实际项目中可以实现artwork缓存
      return "artwork://\(item.persistentID)"
    }
    return nil
  }
  
  private static func getFileSize(for item: MPMediaItem) -> Int64 {
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
  
  private static func buildSortDescriptors(from sortBy: [String]) -> [NSSortDescriptor] {
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
