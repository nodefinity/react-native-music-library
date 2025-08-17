//
//  MusicLibraryImpl.swift
//  MusicLibrary
//
//

import Foundation

@objc public class MusicLibraryImpl: NSObject {
  
  @objc public func getTracksAsync(first: Int, after: String?, sortBy: [String], directory: String?) -> [String: Any] {
    NSLog("🎵 [MusicLibrary] getTracksAsync called with first: %d, after: %@, sortBy: %@, directory: %@", first, after ?? "nil", sortBy, directory ?? "nil")
    
    do {
      let trackOptions = TrackOptions(after: after, first: first, sortBy: sortBy, directory: directory)
      NSLog("🎵 [MusicLibrary] getTracksAsync trackOptions: %@", trackOptions)
      let result = GetTracksQuery.getTracks(options: trackOptions)
      let resultDict = result.toDictionary()
      
      NSLog("🎵 [MusicLibrary] getTracksAsync returning: %@", resultDict)
      return resultDict
    } catch {
      NSLog("🎵 [MusicLibrary] getTracksAsync error: %@", error.localizedDescription)
      return DataConverter.createErrorDictionary(
        code: "QUERY_ERROR", 
        message: "Failed to query tracks: \(error.localizedDescription)"
      )
    }
  }
  
  @objc public func getTrackMetadataAsync(_ trackId: String) -> [String: Any] {
    NSLog("🎵 [MusicLibrary] getTrackMetadataAsync called with trackId: %@", trackId)
    
    if let metadata = GetTrackMetadataQuery.getTrackMetadata(trackId: trackId) {
      let resultDict = metadata.toDictionary()
      NSLog("🎵 [MusicLibrary] getTrackMetadataAsync returning: %@", resultDict)
      return resultDict
    } else {
      NSLog("🎵 [MusicLibrary] getTrackMetadataAsync: track not found")
      return DataConverter.createErrorDictionary(
        code: "TRACK_NOT_FOUND", 
        message: "Track with id \(trackId) not found"
      )
    }
  }

  @objc public func getTracksByAlbumAsync(_ albumId: String) -> [[String: Any]] {
    NSLog("🎵 [MusicLibrary] getTracksByAlbumAsync called with albumId: %@", albumId)
    
    let tracks = GetTracksByAlbumQuery.getTracksByAlbum(albumId: albumId)
    let result = tracks.map { $0.toDictionary() }
    
    NSLog("🎵 [MusicLibrary] getTracksByAlbumAsync returning: %@", result)
    return result
  }
  
  @objc public func getTracksByArtistAsync(_ artistId: String, first: Int, after: String?, sortBy: [String], directory: String?) -> [String: Any] {
    NSLog("🎵 [MusicLibrary] getTracksByArtistAsync called with artistId: %@, first: %d, after: %@, sortBy: %@, directory: %@", artistId, first, after ?? "nil", sortBy, directory ?? "nil")
    
    let result = PaginatedResult<Track>(items: [], hasNextPage: false)
    let resultDict = result.toDictionary()
    
    NSLog("🎵 [MusicLibrary] getTracksByArtistAsync returning: %@", resultDict)
    return resultDict
  }
  
  @objc public func getAlbumsAsync(first: Int, after: String?, sortBy: [String]) -> [String: Any] {
    NSLog("🎵 [MusicLibrary] getAlbumsAsync called with first: %d, after: %@, sortBy: %@", first, after ?? "nil", sortBy)
    
    let result = PaginatedResult<Album>(items: [], hasNextPage: false)
    let resultDict = result.toDictionary()
    
    NSLog("🎵 [MusicLibrary] getAlbumsAsync returning: %@", resultDict)
    return resultDict
  }
  
  @objc public func getAlbumsByArtistAsync(_ artistId: String) -> [[String: Any]] {
    NSLog("🎵 [MusicLibrary] getAlbumsByArtistAsync called with artistId: %@", artistId)
    
    let result: [[String: Any]] = []
    
    NSLog("🎵 [MusicLibrary] getAlbumsByArtistAsync returning: %@", result)
    return result
  }
  
  @objc public func getArtistsAsync(first: Int, after: String?, sortBy: [String]) -> [String: Any] {
    NSLog("🎵 [MusicLibrary] getArtistsAsync called with first: %d, after: %@, sortBy: %@", first, after ?? "nil", sortBy)
    
    let result = PaginatedResult<Artist>(items: [], hasNextPage: false)
    let resultDict = result.toDictionary()
    
    NSLog("🎵 [MusicLibrary] getArtistsAsync returning: %@", resultDict)
    return resultDict
  }
}
