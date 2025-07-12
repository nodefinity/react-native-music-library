//
//  MusicLibraryImpl.swift
//  MusicLibrary
//
//

import Foundation

@objc public class MusicLibraryImpl: NSObject {
    
  @objc public func getTracksAsync(_ options: [String: Any]) -> [String: Any] {
    return [
        "items": [],
        "hasNextPage": false,
        "endCursor": NSNull(),
        "totalCount": 0,
    ]
  }
  
  @objc public func getTrackMetadataAsync(_ trackId: String) -> [String: Any] {
    return [:]
  }

  @objc public func getTracksByAlbumAsync(_ albumId: String) -> [[String: Any]] {
    return []
  }
  
  @objc public func getTracksByArtistAsync(_ artistId: String, options: [String: Any]) -> [String: Any] {
    return [:]
  }
  
  @objc public func getAlbumsAsync(_ options: [String: Any]) -> [String: Any] {
    return [:]
  }
  
  @objc public func getAlbumsByArtistAsync(_ artistId: String) -> [[String: Any]] {
    return []
  }
  
  @objc public func getArtistsAsync(_ options: [String: Any]) -> [String: Any] {
    return [:]
  }
}
