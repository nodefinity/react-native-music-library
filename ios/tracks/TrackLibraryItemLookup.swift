import Foundation
import MediaPlayer

internal enum TrackLibraryItemLookup {
  static func findTrack(trackId: String) -> MPMediaItem? {
    let query = MPMediaQuery.songs()
    let idPredicate = MPMediaPropertyPredicate(
      value: NSNumber(value: UInt64(trackId) ?? 0),
      forProperty: MPMediaItemPropertyPersistentID
    )

    query.filterPredicates = Set([idPredicate])

    return query.items?.first
  }
}
