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
    var title = item.title
    var artist = item.artist
    var album = item.albumTitle
    var year = item.releaseDate.map { Calendar.current.component(.year, from: $0) }
    var genre = item.genre
    var trackNumber = item.albumTrackNumber > 0 ? item.albumTrackNumber : nil
    var discNumber = item.discNumber > 0 ? item.discNumber : nil
    var composer = item.composer
    var albumArtist = item.albumArtist
    
    // 尝试获取更详细的音频信息
    var bitrate: Int64? = nil
    var sampleRate: Int? = nil
    var channels: String? = nil
    var format: String? = nil
    var lyricist: String? = nil
    var lyrics: String? = item.lyrics
    var comment: String? = item.comments
    
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
      
      let metadataItems = collectMetadata(from: asset)
      
      title = title ?? firstMetadataString(in: metadataItems, identifiers: [
        .commonIdentifierTitle,
        .iTunesMetadataSongName,
        .id3MetadataTitleDescription
      ])
      artist = artist ?? firstMetadataString(in: metadataItems, identifiers: [
        .commonIdentifierArtist,
        .iTunesMetadataArtist,
        .id3MetadataLeadPerformer
      ])
      album = album ?? firstMetadataString(in: metadataItems, identifiers: [
        .commonIdentifierAlbumName,
        .iTunesMetadataAlbum,
        .id3MetadataAlbumTitle
      ])
      year = year ?? firstMetadataInt(in: metadataItems, identifiers: [
        .commonIdentifierCreationDate,
        .iTunesMetadataReleaseDate,
        .id3MetadataYear,
        .id3MetadataRecordingTime,
        .id3MetadataReleaseTime
      ])
      genre = genre ?? firstMetadataString(in: metadataItems, identifiers: [
        .iTunesMetadataUserGenre,
        .iTunesMetadataPredefinedGenre,
        .id3MetadataContentType
      ])
      trackNumber = trackNumber ?? firstMetadataInt(in: metadataItems, identifiers: [
        .iTunesMetadataTrackNumber,
        .id3MetadataTrackNumber
      ])
      discNumber = discNumber ?? firstMetadataInt(in: metadataItems, identifiers: [
        .iTunesMetadataDiscNumber,
        .id3MetadataPartOfASet
      ])
      composer = composer ?? firstMetadataString(in: metadataItems, identifiers: [
        .iTunesMetadataComposer,
        .id3MetadataComposer,
        .quickTimeUserDataComposer,
        .quickTimeMetadataComposer
      ])
      lyricist = firstMetadataString(in: metadataItems, identifiers: [
        .id3MetadataLyricist,
        .id3MetadataOriginalLyricist,
        .quickTimeUserDataWriter
      ])
      lyrics = lyrics ?? firstMetadataString(in: metadataItems, identifiers: [
        .iTunesMetadataLyrics,
        .id3MetadataUnsynchronizedLyric,
        .id3MetadataSynchronizedLyric
      ])
      albumArtist = albumArtist ?? firstMetadataString(in: metadataItems, identifiers: [
        .iTunesMetadataAlbumArtist,
        .id3MetadataBand
      ])
      comment = comment ?? firstMetadataString(in: metadataItems, identifiers: [
        .iTunesMetadataUserComment,
        .id3MetadataComments,
        .quickTimeUserDataComment,
        .quickTimeMetadataComment,
        .commonIdentifierDescription,
        .iTunesMetadataDescription
      ])
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
      lyricist: lyricist,
      lyrics: lyrics,
      albumArtist: albumArtist,
      comment: comment
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
  
  private static func collectMetadata(from asset: AVAsset) -> [AVMetadataItem] {
    var metadataItems = asset.commonMetadata + asset.metadata
    
    for format in asset.availableMetadataFormats {
      metadataItems.append(contentsOf: asset.metadata(forFormat: format))
    }
    
    return metadataItems
  }
  
  private static func firstMetadataString(in metadataItems: [AVMetadataItem], identifiers: [AVMetadataIdentifier]) -> String? {
    for identifier in identifiers {
      let items = AVMetadataItem.metadataItems(from: metadataItems, filteredByIdentifier: identifier)
      for item in items {
        if let value = metadataStringValue(item) {
          let trimmedValue = value.trimmingCharacters(in: .whitespacesAndNewlines)
          if !trimmedValue.isEmpty {
            return trimmedValue
          }
        }
      }
    }
    
    return nil
  }
  
  private static func firstMetadataInt(in metadataItems: [AVMetadataItem], identifiers: [AVMetadataIdentifier]) -> Int? {
    guard let value = firstMetadataString(in: metadataItems, identifiers: identifiers) else {
      return nil
    }
    
    return parseLeadingInt(value)
  }
  
  private static func metadataStringValue(_ item: AVMetadataItem) -> String? {
    if let stringValue = item.stringValue {
      return stringValue
    }
    
    if let numberValue = item.numberValue {
      return numberValue.stringValue
    }
    
    if let dataValue = item.dataValue, let decodedValue = decodeMetadataData(dataValue) {
      return decodedValue
    }
    
    if let stringValue = item.value as? String {
      return stringValue
    }
    
    if let numberValue = item.value as? NSNumber {
      return numberValue.stringValue
    }
    
    if let dataValue = item.value as? Data {
      return decodeMetadataData(dataValue)
    }
    
    return nil
  }
  
  private static func decodeMetadataData(_ data: Data) -> String? {
    let encodings: [String.Encoding] = [
      .utf8,
      .utf16,
      .utf16LittleEndian,
      .utf16BigEndian,
      .isoLatin1
    ]
    
    for encoding in encodings {
      if let value = String(data: data, encoding: encoding) {
        let trimmedValue = value.trimmingCharacters(in: .controlCharacters)
        if !trimmedValue.isEmpty {
          return trimmedValue
        }
      }
    }
    
    return nil
  }
  
  private static func parseLeadingInt(_ value: String) -> Int? {
    let leadingDigits = value
      .split(separator: "/")
      .first?
      .trimmingCharacters(in: .whitespacesAndNewlines)
      .prefix { $0.isNumber }
    
    guard let digits = leadingDigits, !digits.isEmpty else {
      return nil
    }
    
    return Int(String(digits))
  }
} 
