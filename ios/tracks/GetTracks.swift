import Foundation

internal class GetTracks {
  private let options: TrackOptions

  init(options: TrackOptions) {
    self.options = options
  }

  func execute() throws -> PaginatedResult<Track> {
    if let directory = options.directory, !directory.isEmpty {
      NSLog("🎵 [MusicLibrary] Directory filtering ('%@') is not supported on iOS, ignoring parameter", directory)
    }

    return try TrackQuery.getPaginatedTracks(options: options)
  }
}
