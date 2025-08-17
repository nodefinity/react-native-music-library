//
//  GetTracks.swift
//  MusicLibrary
//
//

import Foundation

internal class GetTracks {
  private let options: TrackOptions
  private let completion: (Result<PaginatedResult<Track>, Error>) -> Void
  
  init(options: TrackOptions, completion: @escaping (Result<PaginatedResult<Track>, Error>) -> Void) {
    self.options = options
    self.completion = completion
  }
  
  func execute() {
    let result = GetTracksQuery.getTracks(options: options)
    completion(.success(result))
  }
}

