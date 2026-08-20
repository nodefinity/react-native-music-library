//
//  MusicLibraryImpl.swift
//  MusicLibrary
//
//

import Foundation
import React
import MediaPlayer

enum MusicLibraryError: LocalizedError {
  case permissionDenied
  case trackNotFound(String)
  case invalidCursor(String)
  case cursorNotFound(String)
  case invalidPageSize(Int)

  var code: String {
    switch self {
    case .permissionDenied:
      return "PERMISSION_DENIED"
    case .trackNotFound:
      return "TRACK_NOT_FOUND"
    case .invalidCursor:
      return "INVALID_CURSOR"
    case .cursorNotFound:
      return "CURSOR_NOT_FOUND"
    case .invalidPageSize:
      return "INVALID_PAGE_SIZE"
    }
  }

  var errorDescription: String? {
    switch self {
    case .permissionDenied:
      return "Audio permission is required. Please grant media library permission first."
    case .trackNotFound(let trackId):
      return "Track with id \(trackId) not found"
    case .invalidCursor(let cursor):
      return "Cursor must be a positive decimal ID: \(cursor)"
    case .cursorNotFound(let cursor):
      return "Cursor is not present in the current query result: \(cursor)"
    case .invalidPageSize(let first):
      return "Page size must be between 1 and 1000: \(first)"
    }
  }
}

@objc(MusicLibraryImpl)
public class MusicLibraryImpl: NSObject {

  @objc
  public func getTracksAsync(options: TrackOptions, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    NSLog("🎵 [MusicLibrary] getTracksAsync called with options: %@", options)

    do {
      try ensureAuthorized()
      let getTracks = GetTracks(options: options)
      let result = try getTracks.execute()
      let resultDict = result.toDictionary()

      NSLog("🎵 [MusicLibrary] getTracksAsync returning: %@", resultDict)
      resolve(resultDict)
    } catch {
      NSLog("🎵 [MusicLibrary] getTracksAsync error: %@", error.localizedDescription)
      rejectError(error, fallbackCode: "QUERY_ERROR", fallbackMessage: "Failed to query tracks", reject: reject)
    }
  }

  @objc public func getTrackMetadataAsync(_ trackId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    NSLog("🎵 [MusicLibrary] getTrackMetadataAsync called with trackId: %@", trackId)

    Task { @MainActor in
      do {
        try ensureAuthorized()
        guard let metadata = await GetTrackMetadataQuery.getTrackMetadata(trackId: trackId) else {
          throw MusicLibraryError.trackNotFound(trackId)
        }
        let resultDict = metadata.toDictionary()
        NSLog("🎵 [MusicLibrary] getTrackMetadataAsync returning: %@", resultDict)
        resolve(resultDict)
      } catch {
        NSLog("🎵 [MusicLibrary] getTrackMetadataAsync error: %@", error.localizedDescription)
        rejectError(error, fallbackCode: "QUERY_ERROR", fallbackMessage: "Failed to get track metadata", reject: reject)
      }
    }
  }

  @objc public func getTracksByAlbumAsync(_ albumId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    NSLog("🎵 [MusicLibrary] getTracksByAlbumAsync called with albumId: %@", albumId)

    do {
      try ensureAuthorized()
      let tracks = GetTracksByAlbumQuery.getTracksByAlbum(albumId: albumId)
      let result = tracks.map { $0.toDictionary() }

      NSLog("🎵 [MusicLibrary] getTracksByAlbumAsync returning: %@", result)
      resolve(result)
    } catch {
      NSLog("🎵 [MusicLibrary] getTracksByAlbumAsync error: %@", error.localizedDescription)
      rejectError(error, fallbackCode: "QUERY_ERROR", fallbackMessage: "Failed to query tracks by album", reject: reject)
    }
  }

  @objc public func getTracksByArtistAsync(_ artistId: String, first: Int, after: String?, sortBy: NSArray, directory: String?, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    do {
      try ensureAuthorized()
      let options = TrackOptions(after: after, first: first, sortBy: sortBy, directory: directory)
      let result = try GetTracksByArtistQuery.getTracksByArtist(artistId: artistId, options: options)
      resolve(result.toDictionary())
    } catch {
      rejectError(error, fallbackCode: "QUERY_ERROR", fallbackMessage: "Failed to query tracks by artist", reject: reject)
    }
  }

  @objc public func getAlbumsAsync(first: Int, after: String?, sortBy: NSArray, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    do {
      try ensureAuthorized()
      let options = AlbumOptions(after: after, first: first, sortBy: sortBy)
      let result = try GetAlbumsQuery.getAlbums(options: options)
      resolve(result.toDictionary())
    } catch {
      rejectError(error, fallbackCode: "QUERY_ERROR", fallbackMessage: "Failed to query albums", reject: reject)
    }
  }

  @objc public func getAlbumsByArtistAsync(_ artistId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    do {
      try ensureAuthorized()
      let albums = GetAlbumsByArtistQuery.getAlbumsByArtist(artistId: artistId)
      resolve(albums.map { $0.toDictionary() })
    } catch {
      rejectError(error, fallbackCode: "QUERY_ERROR", fallbackMessage: "Failed to query albums by artist", reject: reject)
    }
  }

  @objc public func getArtistsAsync(first: Int, after: String?, sortBy: NSArray, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    do {
      try ensureAuthorized()
      let options = ArtistOptions(after: after, first: first, sortBy: sortBy)
      let result = try GetArtistsQuery.getArtists(options: options)
      resolve(result.toDictionary())
    } catch {
      rejectError(error, fallbackCode: "QUERY_ERROR", fallbackMessage: "Failed to query artists", reject: reject)
    }
  }

  private func ensureAuthorized() throws {
    guard MPMediaLibrary.authorizationStatus() == .authorized else {
      throw MusicLibraryError.permissionDenied
    }
  }

  private func rejectError(_ error: Error, fallbackCode: String, fallbackMessage: String, reject: RCTPromiseRejectBlock) {
    if let musicLibraryError = error as? MusicLibraryError {
      reject(musicLibraryError.code, musicLibraryError.localizedDescription, musicLibraryError)
      return
    }

    reject(fallbackCode, "\(fallbackMessage): \(error.localizedDescription)", error)
  }
}
