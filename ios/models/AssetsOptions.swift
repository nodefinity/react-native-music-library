//
//  AssetsOptions.swift
//  MusicLibrary
//
//

import Foundation

// MARK: - Options Models

public struct SortOption {
  public let key: String
  public let ascending: Bool

  public init(key: String, ascending: Bool) {
    self.key = key
    self.ascending = ascending
  }

  public var dictionary: [String: Any] {
    return [
      "key": key,
      "ascending": ascending
    ]
  }

  public static func fromBridgeArray(_ array: NSArray) -> [SortOption] {
    guard array.count > 0 else {
      return [SortOption(key: "default", ascending: true)]
    }

    let parsed: [SortOption] = array.compactMap { item in
      guard let dict = item as? [String: Any] else {
        return nil
      }

      return SortOption(
        key: dict["key"] as? String ?? "default",
        ascending: dict["ascending"] as? Bool ?? true
      )
    }

    return parsed.isEmpty ? [SortOption(key: "default", ascending: true)] : parsed
  }
}

@objc(TrackOptions)
public class TrackOptions: NSObject {
  public let after: String?
  public let first: Int
  public let sortBy: [SortOption]
  public let directory: String?

  @objc
  public init(after: String? = nil, first: Int = 20, sortBy: NSArray = [], directory: String? = nil) {
    self.after = after
    self.first = first
    self.sortBy = SortOption.fromBridgeArray(sortBy)
    self.directory = directory
    super.init()
  }

  public override var description: String {
    return "TrackOptions(after: \(after ?? "nil"), first: \(first), sortBy: \(sortBy), directory: \(directory ?? "nil"))"
  }

  public func toDictionary() -> [String: Any] {
    return [
      "after": after ?? NSNull(),
      "first": first,
      "sortBy": sortBy.map { $0.dictionary },
      "directory": directory ?? NSNull()
    ]
  }
}

public class AlbumOptions: NSObject {
  public let after: String?
  public let first: Int
  public let sortBy: [SortOption]

  public init(after: String? = nil, first: Int = 20, sortBy: NSArray = []) {
    self.after = after
    self.first = first
    self.sortBy = SortOption.fromBridgeArray(sortBy)
    super.init()
  }

  public override var description: String {
    return "AlbumOptions(after: \(after ?? "nil"), first: \(first), sortBy: \(sortBy))"
  }

  public func toDictionary() -> [String: Any] {
    return [
      "after": after ?? NSNull(),
      "first": first,
      "sortBy": sortBy.map { $0.dictionary }
    ]
  }
}

public class ArtistOptions: NSObject {
  public let after: String?
  public let first: Int
  public let sortBy: [SortOption]

  public init(after: String? = nil, first: Int = 20, sortBy: NSArray = []) {
    self.after = after
    self.first = first
    self.sortBy = SortOption.fromBridgeArray(sortBy)
    super.init()
  }

  public override var description: String {
    return "ArtistOptions(after: \(after ?? "nil"), first: \(first), sortBy: \(sortBy))"
  }

  public func toDictionary() -> [String: Any] {
    return [
      "after": after ?? NSNull(),
      "first": first,
      "sortBy": sortBy.map { $0.dictionary }
    ]
  }
}
