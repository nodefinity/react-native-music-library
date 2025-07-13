//
//  Assets.swift
//  MusicLibrary
//
//

import Foundation

// MARK: - Data Models

public class Track: NSObject {
  public let id: String
  public let title: String
  public let artist: String?
  public let artwork: String?
  public let album: String?
  public let duration: Double
  public let url: String
  public let createdAt: Double?
  public let modifiedAt: Double?
  public let fileSize: Int64
  
  public init(id: String, title: String, artist: String?, artwork: String?, album: String?, duration: Double, url: String, createdAt: Double?, modifiedAt: Double?, fileSize: Int64) {
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
  
  public func toDictionary() -> [String: Any] {
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

public class TrackMetadata: NSObject {
  public let id: String
  
  // AudioHeader
  public let duration: Double?
  public let bitrate: Int64?
  public let sampleRate: Int?
  public let channels: String?
  public let format: String?
  
  // Tag
  public let title: String?
  public let artist: String?
  public let album: String?
  public let year: Int?
  public let genre: String?
  public let track: Int?
  public let disc: Int?
  public let composer: String?
  public let lyricist: String?
  public let lyrics: String?
  public let albumArtist: String?
  public let comment: String?
  
  public init(id: String, duration: Double?, bitrate: Int64?, sampleRate: Int?, channels: String?, format: String?, title: String?, artist: String?, album: String?, year: Int?, genre: String?, track: Int?, disc: Int?, composer: String?, lyricist: String?, lyrics: String?, albumArtist: String?, comment: String?) {
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
  
  public func toDictionary() -> [String: Any] {
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

public class Album: NSObject {
  public let id: String
  public let title: String
  public let artist: String
  public let artwork: String?
  public let trackCount: Int
  public let year: Int?
  
  public init(id: String, title: String, artist: String, artwork: String?, trackCount: Int, year: Int?) {
    self.id = id
    self.title = title
    self.artist = artist
    self.artwork = artwork
    self.trackCount = trackCount
    self.year = year
    super.init()
  }
  
  public func toDictionary() -> [String: Any] {
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

public class Artist: NSObject {
  public let id: String
  public let title: String
  public let albumCount: Int
  public let trackCount: Int
  
  public init(id: String, title: String, albumCount: Int, trackCount: Int) {
    self.id = id
    self.title = title
    self.albumCount = albumCount
    self.trackCount = trackCount
    super.init()
  }
  
  public func toDictionary() -> [String: Any] {
    return [
      "id": id,
      "title": title,
      "albumCount": albumCount,
      "trackCount": trackCount
    ]
  }
}

public class Genre: NSObject {
  public let id: String
  public let title: String
  public let trackCount: Int
  
  public init(id: String, title: String, trackCount: Int) {
    self.id = id
    self.title = title
    self.trackCount = trackCount
    super.init()
  }
  
  public func toDictionary() -> [String: Any] {
    return [
      "id": id,
      "title": title,
      "trackCount": trackCount
    ]
  }
}
