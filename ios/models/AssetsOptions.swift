//
//  AssetsOptions.swift
//  MusicLibrary
//
//

import Foundation

// MARK: - Options Models

public class TrackOptions: NSObject {
  public let after: String?
  public let first: Int
  public let sortBy: [String]
  public let directory: String?
  
  public init(after: String? = nil, first: Int = 20, sortBy: [String] = [], directory: String? = nil) {
    self.after = after
    self.first = first
    self.sortBy = sortBy
    self.directory = directory
    super.init()
  }
  
  public func toDictionary() -> [String: Any] {
    return [
      "after": after ?? NSNull(),
      "first": first,
      "sortBy": sortBy,
      "directory": directory ?? NSNull()
    ]
  }
}

public class AlbumOptions: NSObject {
  public let after: String?
  public let first: Int
  public let sortBy: [String]
  
  public init(after: String? = nil, first: Int = 20, sortBy: [String] = []) {
    self.after = after
    self.first = first
    self.sortBy = sortBy
    super.init()
  }
  
  public func toDictionary() -> [String: Any] {
    return [
      "after": after ?? NSNull(),
      "first": first,
      "sortBy": sortBy
    ]
  }
}

public class ArtistOptions: NSObject {
  public let after: String?
  public let first: Int
  public let sortBy: [String]
  
  public init(after: String? = nil, first: Int = 20, sortBy: [String] = []) {
    self.after = after
    self.first = first
    self.sortBy = sortBy
    super.init()
  }
  
  public func toDictionary() -> [String: Any] {
    return [
      "after": after ?? NSNull(),
      "first": first,
      "sortBy": sortBy
    ]
  }
}
