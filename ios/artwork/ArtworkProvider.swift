import AVFoundation
import Foundation
import MediaPlayer
import UIKit

@objc(MusicLibraryArtworkLoadTask)
public final class MusicLibraryArtworkLoadTask: NSObject {
  fileprivate var task: Task<Void, Never>?

  @objc public func cancel() {
    task?.cancel()
  }
}

@objc(MusicLibraryArtworkProvider)
public final class MusicLibraryArtworkProvider: NSObject {
  @MainActor private static let imageCache = NSCache<NSString, UIImage>()

  @objc(loadImageForReference:completion:)
  public static func loadImage(
    forReference reference: String,
    completion: @escaping (UIImage?, NSError?) -> Void
  ) -> MusicLibraryArtworkLoadTask {
    let loadTask = MusicLibraryArtworkLoadTask()

    loadTask.task = Task { @MainActor in
      do {
        if let cachedImage = imageCache.object(forKey: reference as NSString) {
          completion(cachedImage, nil)
          return
        }

        guard let item = mediaItem(for: reference) else {
          throw ArtworkError.itemNotFound
        }

        let image = try await loadImage(from: item)
        try Task.checkCancellation()

        guard let image else {
          throw ArtworkError.artworkNotFound
        }

        imageCache.setObject(image, forKey: reference as NSString)
        completion(image, nil)
      } catch is CancellationError {
        return
      } catch {
        completion(nil, error as NSError)
      }
    }

    return loadTask
  }

  @MainActor
  private static func mediaItem(for reference: String) -> MPMediaItem? {
    guard let url = URL(string: reference), url.scheme == "artwork" else {
      return nil
    }

    let pathId = url.pathComponents.last.flatMap { $0 == "/" ? nil : $0 }

    if url.host == "album", let albumId = pathId {
      let query = MPMediaQuery.albums()
      query.filterPredicates = Set([
        MPMediaPropertyPredicate(
          value: NSNumber(value: UInt64(albumId) ?? 0),
          forProperty: MPMediaItemPropertyAlbumPersistentID
        )
      ])
      return query.collections?.first?.representativeItem
    }

    let trackId: String?
    if url.host == "track" {
      trackId = pathId
    } else {
      trackId = url.host
    }

    guard let trackId else {
      return nil
    }

    return TrackLibraryItemLookup.findTrack(trackId: trackId)
  }

  @MainActor
  private static func loadImage(from item: MPMediaItem) async throws -> UIImage? {
    if let image = item.artwork?.image(at: CGSize(width: 1200, height: 1200)) {
      return image
    }

    guard let assetURL = item.assetURL else {
      return nil
    }

    let asset = AVURLAsset(url: assetURL)
    let metadataItems = try await asset.load(.metadata)
    let identifiers: [AVMetadataIdentifier] = [
      .commonIdentifierArtwork,
      .id3MetadataAttachedPicture,
      .iTunesMetadataCoverArt
    ]

    for identifier in identifiers {
      let artworkItems = AVMetadataItem.metadataItems(
        from: metadataItems,
        filteredByIdentifier: identifier
      )

      for artworkItem in artworkItems {
        try Task.checkCancellation()
        if let imageData = try await artworkItem.load(.dataValue),
           let image = UIImage(data: imageData) {
          return image
        }
      }
    }

    return nil
  }

  private enum ArtworkError: LocalizedError {
    case itemNotFound
    case artworkNotFound

    var errorDescription: String? {
      switch self {
      case .itemNotFound:
        return "The music library item for this artwork reference was not found."
      case .artworkNotFound:
        return "The music library item does not contain artwork."
      }
    }
  }
}
