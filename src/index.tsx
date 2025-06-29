import MusicLibrary from './NativeMusicLibrary';
import type {
  AssetsOptions,
  TrackResult,
  AlbumResult,
  ArtistResult,
  TrackMetadata,
  Track,
} from './NativeMusicLibrary';
import { getOptions } from './utils';

export * from './NativeMusicLibrary';

/**
 * Get all tracks from the music library.
 * @param assetsOptions - The options for the query.
 * @returns A promise that resolves to an array of track info.
 */
export async function getTracksAsync(
  assetsOptions: AssetsOptions = {}
): Promise<TrackResult> {
  return MusicLibrary.getTracksAsync(getOptions(assetsOptions));
}

/**
 * Get all albums from the music library.
 * @param options - The options for the query.
 * @returns A promise that resolves to an array of album info.
 */
export function getAlbumsAsync(
  assetsOptions: AssetsOptions = {}
): Promise<AlbumResult> {
  return MusicLibrary.getAlbumsAsync(getOptions(assetsOptions));
}

/**
 * Get all artists from the music library.
 * @param options - The options for the query.
 * @returns A promise that resolves to an array of artist info.
 */
export function getArtistsAsync(
  assetsOptions: AssetsOptions = {}
): Promise<ArtistResult> {
  return MusicLibrary.getArtistsAsync(getOptions(assetsOptions));
}

/**
 * Get the metadata of a track.
 * @param trackId - The ID of the track.
 * @returns A promise that resolves to the metadata of the track.
 */
export function getTrackMetadataAsync(trackId: string): Promise<TrackMetadata> {
  return MusicLibrary.getTrackMetadataAsync(trackId);
}

/**
 * Get all tracks from a specific album.
 * @param albumId - The ID of the album.
 * @returns A promise that resolves to an array of tracks in the album.
 */
export function getTracksByAlbumAsync(albumId: string): Promise<Track[]> {
  return MusicLibrary.getTracksByAlbumAsync(albumId);
}

export default MusicLibrary;
