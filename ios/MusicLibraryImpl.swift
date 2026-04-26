//
//  MusicLibraryImpl.swift
//  MusicLibrary
//
//

import Foundation
import React

@objc(MusicLibraryImpl)
public class MusicLibraryImpl: NSObject {

  @objc
  public func getTracksAsync(options: TrackOptions, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    NSLog("🎵 [MusicLibrary] getTracksAsync called with options: %@", options)

    do {
      let getTracks = GetTracks(options: options)
      let result = getTracks.execute()
      let resultDict = result.toDictionary()

      NSLog("🎵 [MusicLibrary] getTracksAsync returning: %@", resultDict)
      resolve(resultDict)
    } catch {
      NSLog("🎵 [MusicLibrary] getTracksAsync error: %@", error.localizedDescription)
      reject("QUERY_ERROR", "Failed to query tracks: \(error.localizedDescription)", error)
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
    let options = TrackOptions(after: after, first: first, sortBy: sortBy, directory: directory)
    let result = GetTracksByArtistQuery.getTracksByArtist(artistId: artistId, options: options)
    return result.toDictionary()
  }

  @objc public func getAlbumsAsync(first: Int, after: String?, sortBy: [String]) -> [String: Any] {
    let options = AlbumOptions(after: after, first: first, sortBy: sortBy)
    let result = GetAlbumsQuery.getAlbums(options: options)
    return result.toDictionary()
  }

  @objc public func getAlbumsByArtistAsync(_ artistId: String) -> [[String: Any]] {
    let albums = GetAlbumsByArtistQuery.getAlbumsByArtist(artistId: artistId)
    return albums.map { $0.toDictionary() }
  }

  @objc public func getArtistsAsync(first: Int, after: String?, sortBy: [String]) -> [String: Any] {
    let options = ArtistOptions(after: after, first: first, sortBy: sortBy)
    let result = GetArtistsQuery.getArtists(options: options)
    return result.toDictionary()
  }
}
