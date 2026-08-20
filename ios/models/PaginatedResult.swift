//
//  PaginatedResult.swift
//  MusicLibrary
//
//

import Foundation

// MARK: - Result Models

internal struct CursorPage<T> {
  let items: [T]
  let hasNextPage: Bool
  let endCursor: String?
}

internal func paginateById<T>(
  _ items: [T],
  first: Int,
  after: String?,
  id: (T) -> String
) throws -> CursorPage<T> {
  guard (1...1000).contains(first) else {
    throw MusicLibraryError.invalidPageSize(first)
  }

  var startIndex = 0
  if let after {
    let validRange = after.range(
      of: "^[1-9][0-9]*$",
      options: .regularExpression
    )
    guard validRange != nil, UInt64(after) != nil else {
      throw MusicLibraryError.invalidCursor(after)
    }
    guard let foundIndex = items.firstIndex(where: { id($0) == after }) else {
      throw MusicLibraryError.cursorNotFound(after)
    }
    startIndex = foundIndex + 1
  }

  let endIndex = min(startIndex + first, items.count)
  let page = startIndex < items.count ? Array(items[startIndex..<endIndex]) : []

  return CursorPage(
    items: page,
    hasNextPage: endIndex < items.count,
    endCursor: page.last.map(id)
  )
}

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
    
    var dictionary: [String: Any] = [
      "items": itemDictionaries,
      "hasNextPage": hasNextPage
    ]

    if let endCursor {
      dictionary["endCursor"] = endCursor
    }
    if let totalCount {
      dictionary["totalCount"] = totalCount
    }

    return dictionary
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
