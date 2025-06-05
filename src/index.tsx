import MusicLibrary from './NativeMusicLibrary';
import type {
  AssetsOptions,
  TrackResult,
  AlbumResult,
  ArtistResult,
  GenreResult,
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
 * Get all genres from the music library.
 * @param options - The options for the query.
 * @returns A promise that resolves to an array of genre info.
 */
export function getGenresAsync(
  assetsOptions: AssetsOptions = {}
): Promise<GenreResult> {
  return MusicLibrary.getGenresAsync(getOptions(assetsOptions));
}

export default MusicLibrary;
