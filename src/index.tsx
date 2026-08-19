import MusicLibrary from './NativeMusicLibrary';
import type {
  TrackOptions,
  AlbumOptions,
  ArtistOptions,
  TrackResult,
  AlbumResult,
  ArtistResult,
  TrackMetadata,
  PaginatedResult,
  Track,
  Album,
  Artist,
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
 * Get every track from the music library by following all paginated results.
 * @param trackOptions - The options for the query. `first` is used as the page size.
 * @returns A promise that resolves to all matching tracks.
 */
export async function getAllTracksAsync(
  trackOptions: TrackOptions = {}
): Promise<Track[]> {
  return collectPaginatedItems(getTracksAsync, trackOptions);
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
 * Get every track from a specific artist by following all paginated results.
 * @param artistId - The ID of the artist.
 * @param trackOptions - The options for the query. `first` is used as the page size.
 * @returns A promise that resolves to all matching tracks by the artist.
 */
export async function getAllTracksByArtistAsync(
  artistId: string,
  trackOptions: TrackOptions = {}
): Promise<Track[]> {
  return collectPaginatedItems(
    (options) => getTracksByArtistAsync(artistId, options),
    trackOptions
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
 * Get every album from the music library by following all paginated results.
 * @param albumOptions - The options for the query. `first` is used as the page size.
 * @returns A promise that resolves to all matching albums.
 */
export async function getAllAlbumsAsync(
  albumOptions: AlbumOptions = {}
): Promise<Album[]> {
  return collectPaginatedItems(getAlbumsAsync, albumOptions);
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

/**
 * Get every artist from the music library by following all paginated results.
 * @param artistOptions - The options for the query. `first` is used as the page size.
 * @returns A promise that resolves to all matching artists.
 */
export async function getAllArtistsAsync(
  artistOptions: ArtistOptions = {}
): Promise<Artist[]> {
  return collectPaginatedItems(getArtistsAsync, artistOptions);
}

async function collectPaginatedItems<T, TOptions extends { after?: string }>(
  loadPage: (options: TOptions) => Promise<PaginatedResult<T>>,
  options: TOptions
): Promise<T[]> {
  const items: T[] = [];
  const seenCursors = new Set<string>();
  let after = options.after;

  while (true) {
    const page = await loadPage({
      ...options,
      after,
    });

    items.push(...page.items);

    if (!page.hasNextPage) {
      return items;
    }

    if (!page.endCursor) {
      throw new Error('Pagination did not provide an end cursor.');
    }

    if (page.endCursor === after || seenCursors.has(page.endCursor)) {
      throw new Error('Pagination cursor did not advance.');
    }

    seenCursors.add(page.endCursor);
    after = page.endCursor;
  }
}

export default MusicLibrary;
