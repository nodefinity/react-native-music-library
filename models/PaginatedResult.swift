//
//  PaginatedResult.swift
//  MusicLibrary
//
//

import Foundation

// MARK: - Result Models

@objc public class PaginatedResult<T: DictionaryConvertible & NSObject>: NSObject {
  @objc public let items: [T]
  @objc public let hasNextPage: Bool
  @objc public let endCursor: String?
  @objc public let totalCount: Int?
  
  @objc public init(items: [T], hasNextPage: Bool, endCursor: String? = nil, totalCount: Int? = nil) {
    self.items = items
    self.hasNextPage = hasNextPage
    self.endCursor = endCursor
    self.totalCount = totalCount
    super.init()
  }
  
  @objc public func toDictionary() -> [String: Any] {
    return [
      "items": items.map { $0.toDictionary() },
      "hasNextPage": hasNextPage,
      "endCursor": endCursor ?? NSNull(),
      "totalCount": totalCount ?? NSNull()
    ]
  }
}

// MARK: - Specific Result Classes for Objective-C Bridge

@objc public class PaginatedResultTrack: NSObject {
  @objc public let inner: PaginatedResult<Track>
  
  @objc public init(inner: PaginatedResult<Track>) {
    self.inner = inner
    super.init()
  }
  
  @objc public func toDictionary() -> [String: Any] {
    return inner.toDictionary()
  }
}

@objc public class PaginatedResultAlbum: NSObject {
  @objc public let inner: PaginatedResult<Album>
  
  @objc public init(inner: PaginatedResult<Album>) {
    self.inner = inner
    super.init()
  }
  
  @objc public func toDictionary() -> [String: Any] {
    return inner.toDictionary()
  }
}

@objc public class PaginatedResultArtist: NSObject {
  @objc public let inner: PaginatedResult<Artist>
  
  @objc public init(inner: PaginatedResult<Artist>) {
    self.inner = inner
    super.init()
  }
  
  @objc public func toDictionary() -> [String: Any] {
    return inner.toDictionary()
  }
}

