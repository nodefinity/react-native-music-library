//
//  GetTrackMetadataQuery.swift
//  MusicLibrary
//
//

import Foundation
import MediaPlayer
import AVFoundation

internal class GetTrackMetadataQuery {
  
  static func getTrackMetadata(trackId: String) -> TrackMetadata? {
    let query = MPMediaQuery.songs()
    
    // 创建ID筛选条件
    let idPredicate = MPMediaPropertyPredicate(
      value: NSNumber(value: UInt64(trackId) ?? 0),
      forProperty: MPMediaItemPropertyPersistentID
    )
    
    query.filterPredicates = Set([idPredicate])
    
    guard let items = query.items, let item = items.first else {
      return nil
    }
    
    // 获取基本信息
    let duration = item.playbackDuration
    let title = item.title
    let artist = item.artist
    let album = item.albumTitle
    let year = item.releaseDate.map { Calendar.current.component(.year, from: $0) }
    let genre = item.genre
    let trackNumber = item.albumTrackNumber > 0 ? item.albumTrackNumber : nil
    let discNumber = item.discNumber > 0 ? item.discNumber : nil
    let composer = item.composer
    let albumArtist = item.albumArtist
    
    // 尝试获取更详细的音频信息
    var bitrate: Int64? = nil
    var sampleRate: Int? = nil
    var channels: String? = nil
    var format: String? = nil
    var lyrics: String? = nil
    
    if let assetURL = item.assetURL {
      let asset = AVAsset(url: assetURL)
      
      // 获取音频轨道信息
      if let audioTrack = asset.tracks(withMediaType: .audio).first {
        // 获取格式信息
        if let formatDescriptions = audioTrack.formatDescriptions as? [CMFormatDescription],
           let formatDescription = formatDescriptions.first {
          
          let audioStreamBasicDescription = CMAudioFormatDescriptionGetStreamBasicDescription(formatDescription)
          if let basicDescription = audioStreamBasicDescription {
            sampleRate = Int(basicDescription.pointee.mSampleRate)
            channels = "\(basicDescription.pointee.mChannelsPerFrame)"
            
            // 获取格式信息
            let formatID = basicDescription.pointee.mFormatID
            format = formatIDToString(formatID)
          }
        }
        
        // 估算比特率
        bitrate = estimateBitrate(for: asset, duration: duration)
      }
      
      // 获取歌词（如果有）
      lyrics = getLyrics(from: item)
    }
    
    return TrackMetadata(
      id: trackId,
      duration: duration,
      bitrate: bitrate,
      sampleRate: sampleRate,
      channels: channels,
      format: format,
      title: title,
      artist: artist,
      album: album,
      year: year,
      genre: genre,
      track: trackNumber,
      disc: discNumber,
      composer: composer,
      lyricist: nil, // MediaPlayer框架不直接提供lyricist信息
      lyrics: lyrics,
      albumArtist: albumArtist,
      comment: nil // MediaPlayer框架不直接提供comment信息
    )
  }
  
  // MARK: - Private Helper Methods
  
  private static func estimateBitrate(for asset: AVAsset, duration: Double) -> Int64? {
    guard duration > 0 else { return nil }
    
    // 尝试从文件大小估算比特率
    if let url = (asset as? AVURLAsset)?.url {
      do {
        let attributes = try FileManager.default.attributesOfItem(atPath: url.path)
        if let fileSize = attributes[.size] as? Int64 {
          // 比特率 = (文件大小 * 8) / 持续时间 / 1000 (kbps)
          let bitrate = (fileSize * 8) / Int64(duration * 1000)
          return bitrate
        }
      } catch {
        // 忽略错误
      }
    }
    
    return nil
  }
  
  private static func formatIDToString(_ formatID: AudioFormatID) -> String {
    switch formatID {
    case kAudioFormatLinearPCM:
      return "PCM"
    case kAudioFormatMPEG4AAC:
      return "AAC"
    case kAudioFormatMPEGLayer3:
      return "MP3"
    case kAudioFormatAppleLossless:
      return "ALAC"
    default:
      // 将formatID转换为四字符字符串
      let formatBytes = withUnsafeBytes(of: formatID.bigEndian) { bytes in
        Array(bytes)
      }
      return String(bytes: formatBytes, encoding: .ascii) ?? "Unknown"
    }
  }
  
  private static func getLyrics(from item: MPMediaItem) -> String? {
    // MediaPlayer框架不直接提供歌词
    // 在实际应用中，您可能需要从其他源获取歌词或解析文件中的歌词标签
    return item.lyrics
  }
} 
