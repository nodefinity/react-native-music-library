//
//  DataConverter.swift
//  MusicLibrary
//
//

import Foundation

internal class DataConverter {
  
  // MARK: - Options Conversion
  
  static func dictionaryToTrackOptions(_ dict: [String: Any]) -> TrackOptions {
    let after = dict["after"] as? String
    let first = dict["first"] as? Int ?? 20
    let sortBy = dict["sortBy"] as? [String] ?? []
    let directory = dict["directory"] as? String
    
    return TrackOptions(after: after, first: first, sortBy: sortBy, directory: directory)
  }
  
  static func dictionaryToAlbumOptions(_ dict: [String: Any]) -> AlbumOptions {
    let after = dict["after"] as? String
    let first = dict["first"] as? Int ?? 20
    let sortBy = dict["sortBy"] as? [String] ?? []
    
    return AlbumOptions(after: after, first: first, sortBy: sortBy)
  }
  
  static func dictionaryToArtistOptions(_ dict: [String: Any]) -> ArtistOptions {
    let after = dict["after"] as? String
    let first = dict["first"] as? Int ?? 20
    let sortBy = dict["sortBy"] as? [String] ?? []
    
    return ArtistOptions(after: after, first: first, sortBy: sortBy)
  }
  
  // MARK: - Result Conversion
  
  static func paginatedResultToDictionary<T: NSObject>(_ result: PaginatedResult<T>) -> [String: Any] {
    return result.toDictionary()
  }
  
  // MARK: - Error Handling
  
  static func createErrorDictionary(code: String, message: String) -> [String: Any] {
    return [
      "error": [
        "code": code,
        "message": message
      ]
    ]
  }
}
