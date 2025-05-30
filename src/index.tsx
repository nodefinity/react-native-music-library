import MusicLibrary from './NativeMusicLibrary';
import type {
  AssetsOptions,
  TrackResult,
  AlbumResult,
  ArtistResult,
  GenreResult,
} from './NativeMusicLibrary';

export type {
  AssetsOptions,
  TrackResult,
  AlbumResult,
  ArtistResult,
  GenreResult,
};

/**
 * Get all tracks from the music library.
 * @param options - The options for the query.
 * @returns A promise that resolves to an array of track info.
 */
export function getTracksAsync(options?: AssetsOptions): Promise<TrackResult> {
  return MusicLibrary.getTracksAsync(options);
}

/**
 * Get all albums from the music library.
 * @param options - The options for the query.
 * @returns A promise that resolves to an array of album info.
 */
export function getAlbumsAsync(options?: AssetsOptions): Promise<AlbumResult> {
  return MusicLibrary.getAlbumsAsync(options);
}

/**
 * Get all artists from the music library.
 * @param options - The options for the query.
 * @returns A promise that resolves to an array of artist info.
 */
export function getArtistsAsync(
  options?: AssetsOptions
): Promise<ArtistResult> {
  return MusicLibrary.getArtistsAsync(options);
}

/**
 * Get all genres from the music library.
 * @param options - The options for the query.
 * @returns A promise that resolves to an array of genre info.
 */
export function getGenresAsync(options?: AssetsOptions): Promise<GenreResult> {
  return MusicLibrary.getGenresAsync(options);
}

export default MusicLibrary;
