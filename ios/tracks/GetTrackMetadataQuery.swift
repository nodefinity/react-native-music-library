import Foundation

@MainActor
internal class GetTrackMetadataQuery {
  static func getTrackMetadata(trackId: String) async -> TrackMetadata? {
    guard let item = TrackLibraryItemLookup.findTrack(trackId: trackId) else {
      return nil
    }

    return await TrackMetadataExtractor.extract(trackId: trackId, from: item)
  }
}
