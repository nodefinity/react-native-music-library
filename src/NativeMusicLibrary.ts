import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

/**
 * Sorting keys for music library items
 */
export type SortByKey =
  | 'default'
  | 'artist'
  | 'album'
  | 'duration'
  | 'createdAt'
  | 'modifiedAt'
  | 'trackCount'
  | 'year';
export type SortByValue = [SortByKey, boolean] | SortByKey;

export type InternalSortByValue = `${SortByKey} ${'ASC' | 'DESC'}`;

export const SortByObject = {
  default: 'default',
  artist: 'artist',
  album: 'album',
  duration: 'duration',
  createdAt: 'createdAt',
  modifiedAt: 'modifiedAt',
  trackCount: 'trackCount',
  year: 'year',
};

/**
 * Basic assets options
 */
export interface AssetsOptions {
  /**
   * Cursor for pagination - ID of the last item from previous page
   * @default undefined
   */
  after?: string;

  /**
   * Maximum number of items to return
   * @default 20
   */
  first?: number;

  /**
   * Sorting configuration
   * Can be a single key or a tuple of [key, ascending]
   * @example
   * 'title' // Sort by title descending (default)
   * ['title', true] // Sort by title ascending
   */
  sortBy?: SortByValue | SortByValue[];

  /**
   * Directory path to search for tracks
   * @default undefined
   */
  directory?: string;
}

/**
 * Internal assets options used by native module
 */
export interface InternalAssetsOptions {
  after?: string;
  first: number;
  sortBy: InternalSortByValue[];
  directory?: string;
}

export interface PaginatedResult<T> {
  /**
   * Array of items returned
   * @default []
   */
  items: T[];

  /**
   * Whether there are more items available
   * @default false
   */
  hasNextPage: boolean;

  /**
   * Cursor for next page (ID of last item)
   * @default undefined
   */
  endCursor?: string;

  /**
   * Total count of items (optional, may be expensive to compute)
   * @default undefined
   */
  totalCount?: number;
}

export interface Track {
  id: string;

  /** Track title */
  title: string;

  /** Artist name */
  artist: string;

  /** Track artwork (file URI) */
  artwork: string;

  /** Album name */
  album: string;

  /** Duration in seconds */
  duration: number;

  /** File URI or path */
  url: string;

  /** Date added to library (Unix timestamp, optional) */
  createdAt: number;

  /** Date modified (Unix timestamp, optional) */
  modifiedAt: number;

  /** File size in bytes */
  fileSize: number;
}

export interface TrackMetadata {
  /** Track ID */
  id: string;

  /** Audio header */
  duration: number; // in seconds
  bitrate: number; // in kbps
  sampleRate: number; // in Hz
  channels: number;
  format: string;

  /** Tag info */
  title: string;
  artist: string;
  album: string;
  year: number;
  genre: string;
  track: number;
  disc: number;
  composer: string;
  lyricist: string;
  lyrics: string;
  albumArtist: string;
  comment: string;
}

export interface Album {
  id: string;

  /** Album name */
  title: string;

  /**
   * Primary artist
   * @default ''
   */
  artist: string;

  /**
   * Album artwork (base64 encoded image or URL, optional)
   * @default undefined
   */
  artwork?: string;

  /**
   * Number of tracks in album
   * @default 0
   */
  trackCount: number;

  /**
   * Release year (optional)
   * @default undefined
   */
  year?: number;
}

export interface Artist {
  id: string;

  /**
   * Artist name
   * @default ''
   */
  title: string;

  /**
   * Number of albums
   * @default 0
   */
  albumCount: number;

  /**
   * Total number of tracks
   * @default 0
   */
  trackCount: number;
}

export interface Genre {
  id: string;

  /**
   * Genre name
   * @default ''
   */
  title: string;

  /**
   * Number of tracks in this genre
   * @default 0
   */
  trackCount: number;
}

export type TrackResult = PaginatedResult<Track>;
export type AlbumResult = PaginatedResult<Album>;
export type ArtistResult = PaginatedResult<Artist>;
export type GenreResult = PaginatedResult<Genre>;

export interface Spec extends TurboModule {
  getTracksAsync(options: InternalAssetsOptions): Promise<TrackResult>;
  getAlbumsAsync(options: InternalAssetsOptions): Promise<AlbumResult>;
  getArtistsAsync(options: InternalAssetsOptions): Promise<ArtistResult>;
  getGenresAsync(options: InternalAssetsOptions): Promise<GenreResult>;
  getTrackMetadataAsync(trackId: string): Promise<TrackMetadata>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('MusicLibrary');
