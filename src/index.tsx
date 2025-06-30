import MusicLibrary from './NativeMusicLibrary';
import type {
  TrackOptions,
  AlbumOptions,
  ArtistOptions,
  TrackResult,
  AlbumResult,
  ArtistResult,
  TrackMetadata,
  Track,
  Album,
} from './NativeMusicLibrary';
import { getTrackOptions, getAlbumOptions, getArtistOptions } from './utils';

export * from './NativeMusicLibrary';

/**
 * Get all tracks from the music library.
 * @param trackOptions - The options for the query.
 * @returns A promise that resolves to an array of track info.
 */
export async function getTracksAsync(
  trackOptions: TrackOptions = {}
): Promise<TrackResult> {
  return MusicLibrary.getTracksAsync(getTrackOptions(trackOptions));
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

/**
 * Get all tracks from a specific artist with pagination.
 * @param artistId - The ID of the artist.
 * @param trackOptions - The options for the query (pagination, etc.).
 * @returns A promise that resolves to a paginated result of tracks by the artist.
 */
export function getTracksByArtistAsync(
  artistId: string,
  trackOptions: TrackOptions = {}
): Promise<TrackResult> {
  return MusicLibrary.getTracksByArtistAsync(
    artistId,
    getTrackOptions(trackOptions)
  );
}

/**
 * Get all albums from the music library.
 * @param albumOptions - The options for the query.
 * @returns A promise that resolves to an array of album info.
 */
export function getAlbumsAsync(
  albumOptions: AlbumOptions = {}
): Promise<AlbumResult> {
  return MusicLibrary.getAlbumsAsync(getAlbumOptions(albumOptions));
}

/**
 * Get all albums from a specific artist.
 * @param artistId - The ID of the artist.
 * @returns A promise that resolves to an array of albums by the artist.
 */
export function getAlbumsByArtistAsync(artistId: string): Promise<Album[]> {
  return MusicLibrary.getAlbumsByArtistAsync(artistId);
}

/**
 * Get all artists from the music library.
 * @param artistOptions - The options for the query.
 * @returns A promise that resolves to an array of artist info.
 */
export function getArtistsAsync(
  artistOptions: ArtistOptions = {}
): Promise<ArtistResult> {
  return MusicLibrary.getArtistsAsync(getArtistOptions(artistOptions));
}

export default MusicLibrary;
