//
//  AssetsOptions.swift
//  MusicLibrary
//
//

import Foundation

// MARK: - Options Models

@objc public class TrackOptions: NSObject {
  @objc public let after: String?
  @objc public let first: Int
  @objc public let sortBy: [String]
  @objc public let directory: String?
  
  @objc public init(after: String? = nil, first: Int = 20, sortBy: [String] = [], directory: String? = nil) {
    self.after = after
    self.first = first
    self.sortBy = sortBy
    self.directory = directory
    super.init()
  }
  
  @objc public func toDictionary() -> [String: Any] {
    return [
      "after": after ?? NSNull(),
      "first": first,
      "sortBy": sortBy,
      "directory": directory ?? NSNull()
    ]
  }
}

@objc public class AlbumOptions: NSObject {
  @objc public let after: String?
  @objc public let first: Int
  @objc public let sortBy: [String]
  
  @objc public init(after: String? = nil, first: Int = 20, sortBy: [String] = []) {
    self.after = after
    self.first = first
    self.sortBy = sortBy
    super.init()
  }
  
  @objc public func toDictionary() -> [String: Any] {
    return [
      "after": after ?? NSNull(),
      "first": first,
      "sortBy": sortBy
    ]
  }
}

@objc public class ArtistOptions: NSObject {
  @objc public let after: String?
  @objc public let first: Int
  @objc public let sortBy: [String]
  
  @objc public init(after: String? = nil, first: Int = 20, sortBy: [String] = []) {
    self.after = after
    self.first = first
    self.sortBy = sortBy
    super.init()
  }
  
  @objc public func toDictionary() -> [String: Any] {
    return [
      "after": after ?? NSNull(),
      "first": first,
      "sortBy": sortBy
    ]
  }
}
