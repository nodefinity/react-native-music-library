//
//  PaginatedResult.swift
//  MusicLibrary
//
//

import Foundation

// MARK: - Result Models

public class PaginatedResult<T: NSObject>: NSObject {
  public let items: [T]
  public let hasNextPage: Bool
  public let endCursor: String?
  public let totalCount: Int?
  
  public init(items: [T], hasNextPage: Bool, endCursor: String? = nil, totalCount: Int? = nil) {
    self.items = items
    self.hasNextPage = hasNextPage
    self.endCursor = endCursor
    self.totalCount = totalCount
    super.init()
  }
  
  public func toDictionary() -> [String: Any] {
    let itemDictionaries = items.compactMap { item in
      if let track = item as? Track {
        return track.toDictionary()
      } else if let album = item as? Album {
        return album.toDictionary()
      } else if let artist = item as? Artist {
        return artist.toDictionary()
      }
      return nil
    }
    
    return [
      "items": itemDictionaries,
      "hasNextPage": hasNextPage,
      "endCursor": endCursor ?? NSNull(),
      "totalCount": totalCount ?? NSNull()
    ]
  }
}

// MARK: - Specific Result Classes for Objective-C Bridge

public class PaginatedResultTrack: NSObject {
  public let inner: PaginatedResult<Track>
  
  public init(inner: PaginatedResult<Track>) {
    self.inner = inner
    super.init()
  }
  
  public func toDictionary() -> [String: Any] {
    return inner.toDictionary()
  }
}

public class PaginatedResultAlbum: NSObject {
  public let inner: PaginatedResult<Album>
  
  public init(inner: PaginatedResult<Album>) {
    self.inner = inner
    super.init()
  }
  
  public func toDictionary() -> [String: Any] {
    return inner.toDictionary()
  }
}

public class PaginatedResultArtist: NSObject {
  public let inner: PaginatedResult<Artist>
  
  public init(inner: PaginatedResult<Artist>) {
    self.inner = inner
    super.init()
  }
  
  public func toDictionary() -> [String: Any] {
    return inner.toDictionary()
  }
}

