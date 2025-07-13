//
//  Assets.swift
//  MusicLibrary
//
//

import Foundation

// MARK: - Protocols

@objc public protocol DictionaryConvertible {
  func toDictionary() -> [String: Any]
}

// MARK: - Data Models

@objc public class Track: NSObject, DictionaryConvertible {
  @objc public let id: String
  @objc public let title: String
  @objc public let artist: String?
  @objc public let artwork: String?
  @objc public let album: String?
  @objc public let duration: Double
  @objc public let url: String
  @objc public let createdAt: Double?
  @objc public let modifiedAt: Double?
  @objc public let fileSize: Int64
  
  @objc public init(id: String, title: String, artist: String?, artwork: String?, album: String?, duration: Double, url: String, createdAt: Double?, modifiedAt: Double?, fileSize: Int64) {
    self.id = id
    self.title = title
    self.artist = artist
    self.artwork = artwork
    self.album = album
    self.duration = duration
    self.url = url
    self.createdAt = createdAt
    self.modifiedAt = modifiedAt
    self.fileSize = fileSize
    super.init()
  }
  
  @objc public func toDictionary() -> [String: Any] {
    return [
      "id": id,
      "title": title,
      "artist": artist ?? NSNull(),
      "artwork": artwork ?? NSNull(),
      "album": album ?? NSNull(),
      "duration": duration,
      "url": url,
      "createdAt": createdAt ?? NSNull(),
      "modifiedAt": modifiedAt ?? NSNull(),
      "fileSize": fileSize
    ]
  }
}

@objc public class TrackMetadata: NSObject, DictionaryConvertible {
  @objc public let id: String
  
  // AudioHeader
  @objc public let duration: Double?
  @objc public let bitrate: Int64?
  @objc public let sampleRate: Int?
  @objc public let channels: String?
  @objc public let format: String?
  
  // Tag
  @objc public let title: String?
  @objc public let artist: String?
  @objc public let album: String?
  @objc public let year: Int?
  @objc public let genre: String?
  @objc public let track: Int?
  @objc public let disc: Int?
  @objc public let composer: String?
  @objc public let lyricist: String?
  @objc public let lyrics: String?
  @objc public let albumArtist: String?
  @objc public let comment: String?
  
  @objc public init(id: String, duration: Double?, bitrate: Int64?, sampleRate: Int?, channels: String?, format: String?, title: String?, artist: String?, album: String?, year: Int?, genre: String?, track: Int?, disc: Int?, composer: String?, lyricist: String?, lyrics: String?, albumArtist: String?, comment: String?) {
    self.id = id
    self.duration = duration
    self.bitrate = bitrate
    self.sampleRate = sampleRate
    self.channels = channels
    self.format = format
    self.title = title
    self.artist = artist
    self.album = album
    self.year = year
    self.genre = genre
    self.track = track
    self.disc = disc
    self.composer = composer
    self.lyricist = lyricist
    self.lyrics = lyrics
    self.albumArtist = albumArtist
    self.comment = comment
    super.init()
  }
  
  @objc public func toDictionary() -> [String: Any] {
    return [
      "id": id,
      "duration": duration ?? NSNull(),
      "bitrate": bitrate ?? NSNull(),
      "sampleRate": sampleRate ?? NSNull(),
      "channels": channels ?? NSNull(),
      "format": format ?? NSNull(),
      "title": title ?? NSNull(),
      "artist": artist ?? NSNull(),
      "album": album ?? NSNull(),
      "year": year ?? NSNull(),
      "genre": genre ?? NSNull(),
      "track": track ?? NSNull(),
      "disc": disc ?? NSNull(),
      "composer": composer ?? NSNull(),
      "lyricist": lyricist ?? NSNull(),
      "lyrics": lyrics ?? NSNull(),
      "albumArtist": albumArtist ?? NSNull(),
      "comment": comment ?? NSNull()
    ]
  }
}

@objc public class Album: NSObject, DictionaryConvertible {
  @objc public let id: String
  @objc public let title: String
  @objc public let artist: String
  @objc public let artwork: String?
  @objc public let trackCount: Int
  @objc public let year: Int?
  
  @objc public init(id: String, title: String, artist: String, artwork: String?, trackCount: Int, year: Int?) {
    self.id = id
    self.title = title
    self.artist = artist
    self.artwork = artwork
    self.trackCount = trackCount
    self.year = year
    super.init()
  }
  
  @objc public func toDictionary() -> [String: Any] {
    return [
      "id": id,
      "title": title,
      "artist": artist,
      "artwork": artwork ?? NSNull(),
      "trackCount": trackCount,
      "year": year ?? NSNull()
    ]
  }
}

@objc public class Artist: NSObject, DictionaryConvertible {
  @objc public let id: String
  @objc public let title: String
  @objc public let albumCount: Int
  @objc public let trackCount: Int
  
  @objc public init(id: String, title: String, albumCount: Int, trackCount: Int) {
    self.id = id
    self.title = title
    self.albumCount = albumCount
    self.trackCount = trackCount
    super.init()
  }
  
  @objc public func toDictionary() -> [String: Any] {
    return [
      "id": id,
      "title": title,
      "albumCount": albumCount,
      "trackCount": trackCount
    ]
  }
}

@objc public class Genre: NSObject, DictionaryConvertible {
  @objc public let id: String
  @objc public let title: String
  @objc public let trackCount: Int
  
  @objc public init(id: String, title: String, trackCount: Int) {
    self.id = id
    self.title = title
    self.trackCount = trackCount
    super.init()
  }
  
  @objc public func toDictionary() -> [String: Any] {
    return [
      "id": id,
      "title": title,
      "trackCount": trackCount
    ]
  }
}
