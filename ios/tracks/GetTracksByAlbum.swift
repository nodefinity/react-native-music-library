//
//  GetTracksByAlbum.swift
//  MusicLibrary
//
//

import Foundation

internal class GetTracksByAlbum {
  private let albumId: String
  private let completion: (Result<[Track], Error>) -> Void
  
  init(albumId: String, completion: @escaping (Result<[Track], Error>) -> Void) {
    self.albumId = albumId
    self.completion = completion
  }
  
  func execute() {
    let tracks = GetTracksByAlbumQuery.getTracksByAlbum(albumId: albumId)
    completion(.success(tracks))
  }
} 
