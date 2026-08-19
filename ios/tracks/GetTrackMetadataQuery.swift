import Foundation

internal class GetTrackMetadataQuery {
  static func getTrackMetadata(trackId: String) -> TrackMetadata? {
    guard let item = TrackLibraryItemLookup.findTrack(trackId: trackId) else {
      return nil
    }

    return TrackMetadataExtractor.extract(trackId: trackId, from: item)
  }
}
