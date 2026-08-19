import AVFoundation
import Foundation
import MediaPlayer

@MainActor
internal enum TrackMetadataExtractor {
  static func extract(trackId: String, from item: MPMediaItem) async throws -> TrackMetadata {
    let duration = item.playbackDuration
    var title = nonEmpty(item.title)
    var artist = nonEmpty(item.artist)
    var album = nonEmpty(item.albumTitle)
    var year = item.releaseDate.map { Calendar.current.component(.year, from: $0) }
    var genre = nonEmpty(item.genre)
    var trackNumber = item.albumTrackNumber > 0 ? item.albumTrackNumber : nil
    var discNumber = item.discNumber > 0 ? item.discNumber : nil
    var composer = nonEmpty(item.composer)
    var albumArtist = nonEmpty(item.albumArtist)

    var bitrate: Int64?
    var sampleRate: Int?
    var channels: String?
    var format: String?
    var lyricist: String?
    var lyrics = nonEmpty(item.lyrics)
    var comment = nonEmpty(item.comments)

    if let assetURL = item.assetURL {
      let asset = AVURLAsset(url: assetURL)
      let audioInfo = try await extractAudioInfo(from: asset, duration: duration)

      bitrate = audioInfo.bitrate
      sampleRate = audioInfo.sampleRate
      channels = audioInfo.channels
      format = audioInfo.format

      let metadataItems = try await asset.load(.metadata)

      if title == nil {
        title = try await firstMetadataString(in: metadataItems, identifiers: [
          .commonIdentifierTitle,
          .iTunesMetadataSongName,
          .id3MetadataTitleDescription
        ])
      }
      if artist == nil {
        artist = try await firstMetadataString(in: metadataItems, identifiers: [
          .commonIdentifierArtist,
          .iTunesMetadataArtist,
          .id3MetadataLeadPerformer
        ])
      }
      if album == nil {
        album = try await firstMetadataString(in: metadataItems, identifiers: [
          .commonIdentifierAlbumName,
          .iTunesMetadataAlbum,
          .id3MetadataAlbumTitle
        ])
      }
      if year == nil {
        year = try await firstMetadataInt(in: metadataItems, identifiers: [
          .commonIdentifierCreationDate,
          .iTunesMetadataReleaseDate,
          .id3MetadataYear,
          .id3MetadataRecordingTime,
          .id3MetadataReleaseTime
        ])
      }
      if genre == nil {
        genre = try await firstMetadataString(in: metadataItems, identifiers: [
          .iTunesMetadataUserGenre,
          .iTunesMetadataPredefinedGenre,
          .id3MetadataContentType
        ])
      }
      if trackNumber == nil {
        trackNumber = try await firstMetadataInt(in: metadataItems, identifiers: [
          .iTunesMetadataTrackNumber,
          .id3MetadataTrackNumber
        ])
      }
      if discNumber == nil {
        discNumber = try await firstMetadataInt(in: metadataItems, identifiers: [
          .iTunesMetadataDiscNumber,
          .id3MetadataPartOfASet
        ])
      }
      if composer == nil {
        composer = try await firstMetadataString(in: metadataItems, identifiers: [
          .iTunesMetadataComposer,
          .id3MetadataComposer,
          .quickTimeUserDataComposer,
          .quickTimeMetadataComposer
        ])
      }
      lyricist = try await firstMetadataString(in: metadataItems, identifiers: [
        .id3MetadataLyricist,
        .id3MetadataOriginalLyricist,
        .quickTimeUserDataWriter
      ])
      if lyrics == nil {
        lyrics = try await firstMetadataString(in: metadataItems, identifiers: [
          .iTunesMetadataLyrics,
          .id3MetadataUnsynchronizedLyric,
          .id3MetadataSynchronizedLyric
        ])
      }
      if albumArtist == nil {
        albumArtist = try await firstMetadataString(in: metadataItems, identifiers: [
          .iTunesMetadataAlbumArtist,
          .id3MetadataBand
        ])
      }
      if comment == nil {
        comment = try await firstMetadataString(in: metadataItems, identifiers: [
          .iTunesMetadataUserComment,
          .id3MetadataComments,
          .quickTimeUserDataComment,
          .quickTimeMetadataComment,
          .commonIdentifierDescription,
          .iTunesMetadataDescription
        ])
      }
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

  private static func extractAudioInfo(from asset: AVAsset, duration: Double) async throws -> AudioInfo {
    var bitrate: Int64?
    var sampleRate: Int?
    var channels: String?
    var format: String?

    if let audioTrack = try await asset.loadTracks(withMediaType: .audio).first {
      let estimatedDataRate = try await audioTrack.load(.estimatedDataRate)
      if estimatedDataRate > 0 {
        bitrate = Int64(estimatedDataRate / 1000)
      }

      if let formatDescription = try await audioTrack.load(.formatDescriptions).first,
         let basicDescription = CMAudioFormatDescriptionGetStreamBasicDescription(formatDescription) {
        sampleRate = Int(basicDescription.pointee.mSampleRate)
        channels = "\(basicDescription.pointee.mChannelsPerFrame)"
        format = formatIDToString(basicDescription.pointee.mFormatID)
      }
    }

    return AudioInfo(
      bitrate: bitrate ?? estimateBitrate(for: asset, duration: duration),
      sampleRate: sampleRate,
      channels: channels,
      format: format
    )
  }

  private static func estimateBitrate(for asset: AVAsset, duration: Double) -> Int64? {
    guard duration > 0, let url = (asset as? AVURLAsset)?.url else {
      return nil
    }

    do {
      let attributes = try FileManager.default.attributesOfItem(atPath: url.path)
      if let fileSize = attributes[.size] as? Int64 {
        return (fileSize * 8) / Int64(duration * 1000)
      }
    } catch {
      return nil
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
      let formatBytes = withUnsafeBytes(of: formatID.bigEndian) { bytes in
        Array(bytes)
      }
      return String(bytes: formatBytes, encoding: .ascii) ?? "Unknown"
    }
  }

  private static func firstMetadataString(in metadataItems: [AVMetadataItem], identifiers: [AVMetadataIdentifier]) async throws -> String? {
    for identifier in identifiers {
      let items = AVMetadataItem.metadataItems(from: metadataItems, filteredByIdentifier: identifier)
      for item in items {
        if let value = try await metadataStringValue(item) {
          let trimmedValue = value.trimmingCharacters(in: .whitespacesAndNewlines)
          if !trimmedValue.isEmpty {
            return trimmedValue
          }
        }
      }
    }

    return nil
  }

  private static func nonEmpty(_ value: String?) -> String? {
    guard let value else {
      return nil
    }

    return value.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty ? nil : value
  }

  private static func firstMetadataInt(in metadataItems: [AVMetadataItem], identifiers: [AVMetadataIdentifier]) async throws -> Int? {
    guard let value = try await firstMetadataString(in: metadataItems, identifiers: identifiers) else {
      return nil
    }

    return parseLeadingInt(value)
  }

  private static func metadataStringValue(_ item: AVMetadataItem) async throws -> String? {
    if let stringValue = try await item.load(.stringValue) {
      return stringValue
    }

    if let numberValue = try await item.load(.numberValue) {
      return numberValue.stringValue
    }

    if let dataValue = try await item.load(.dataValue), let decodedValue = decodeMetadataData(dataValue) {
      return decodedValue
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

  private struct AudioInfo {
    let bitrate: Int64?
    let sampleRate: Int?
    let channels: String?
    let format: String?
  }
}
