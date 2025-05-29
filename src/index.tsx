import MusicLibrary from './NativeMusicLibrary';
import type {
  IPaginatedQuery,
  ITrackResult,
  IAlbumResult,
  IArtistResult,
  IGenreResult,
} from './types';

export type {
  IPaginatedQuery,
  ITrackResult,
  IAlbumResult,
  IArtistResult,
  IGenreResult,
};

/**
 * Get all tracks from the music library.
 * @param options - The options for the query.
 * @returns A promise that resolves to an array of track info.
 */
export function getTracksAsync(
  options?: IPaginatedQuery
): Promise<ITrackResult> {
  return MusicLibrary.getTracksAsync(options);
}

/**
 * Get all albums from the music library.
 * @param options - The options for the query.
 * @returns A promise that resolves to an array of album info.
 */
export function getAlbumsAsync(
  options?: IPaginatedQuery
): Promise<IAlbumResult> {
  return MusicLibrary.getAlbumsAsync(options);
}

/**
 * Get all artists from the music library.
 * @param options - The options for the query.
 * @returns A promise that resolves to an array of artist info.
 */
export function getArtistsAsync(
  options?: IPaginatedQuery
): Promise<IArtistResult> {
  return MusicLibrary.getArtistsAsync(options);
}

/**
 * Get all genres from the music library.
 * @param options - The options for the query.
 * @returns A promise that resolves to an array of genre info.
 */
export function getGenresAsync(
  options?: IPaginatedQuery
): Promise<IGenreResult> {
  return MusicLibrary.getGenresAsync(options);
}

export default MusicLibrary;
