//
//  GetTracksByAlbumQuery.swift
//  MusicLibrary
//
//

import Foundation
import MediaPlayer

internal class GetTracksByAlbumQuery {
  
  static func getTracksByAlbum(albumId: String) -> [Track] {
    let query = MPMediaQuery.songs()
    
    // 创建专辑筛选条件
    let albumPredicate = MPMediaPropertyPredicate(
      value: NSNumber(value: UInt64(albumId) ?? 0),
      forProperty: MPMediaItemPropertyAlbumPersistentID
    )
    
    // 只查询音乐文件
    let musicPredicate = MPMediaPropertyPredicate(
      value: MPMediaType.music.rawValue,
      forProperty: MPMediaItemPropertyMediaType
    )
    
    query.filterPredicates = Set([albumPredicate, musicPredicate])
    
    // 按照音轨号和标题排序
    query.groupingType = .title
    
    guard let items = query.items else {
      return []
    }
    
    var tracks: [Track] = []
    
    for item in items {
      // 跳过无效的音频文件
      guard let url = item.assetURL, item.playbackDuration > 0 else {
        continue
      }
      
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
    
    // 按照音轨号排序，如果没有音轨号则按标题排序
    return tracks.sorted { track1, track2 in
      // 获取原始MPMediaItem来访问trackNumber属性
      if let item1 = items.first(where: { "\($0.persistentID)" == track1.id }),
         let item2 = items.first(where: { "\($0.persistentID)" == track2.id }) {
        
        let trackNum1 = item1.albumTrackNumber
        let trackNum2 = item2.albumTrackNumber
        
        if trackNum1 != trackNum2 {
          return trackNum1 < trackNum2
        }
      }
      
      // 如果音轨号相同或者没有音轨号，按标题排序
      return track1.title < track2.title
    }
  }
  
  // MARK: - Private Helper Methods
  
  private static func getArtworkURL(for item: MPMediaItem) -> String? {
    if let artwork = item.artwork {
      return "artwork://\(item.persistentID)"
    }
    return nil
  }
  
  private static func getFileSize(for item: MPMediaItem) -> Int64 {
    guard let url = item.assetURL else { return 0 }
    
    do {
      let attributes = try FileManager.default.attributesOfItem(atPath: url.path)
      return attributes[.size] as? Int64 ?? 0
    } catch {
      return 0
    }
  }
} 
