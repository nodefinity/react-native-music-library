import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

/**
 * Sorting keys for different entity types
 */
export type TrackSortByKey =
  | 'default'
  | 'title'
  | 'artist'
  | 'album'
  | 'duration'
  | 'createdAt'
  | 'modifiedAt'
  | 'fileSize';

export type AlbumSortByKey =
  | 'default'
  | 'title'
  | 'artist'
  | 'trackCount'
  | 'year';

export type ArtistSortByKey = 'default' | 'title' | 'trackCount' | 'albumCount';

export type SortByValue<T extends string> = [T, boolean] | T;

export type InternalSortByValue = `${string} ${'ASC' | 'DESC'}`;

export const TrackSortByObject = {
  default: 'default',
  title: 'title',
  artist: 'artist',
  album: 'album',
  duration: 'duration',
  createdAt: 'createdAt',
  modifiedAt: 'modifiedAt',
  fileSize: 'fileSize',
} as const;

export const AlbumSortByObject = {
  default: 'default',
  title: 'title',
  artist: 'artist',
  trackCount: 'trackCount',
  year: 'year',
} as const;

export const ArtistSortByObject = {
  default: 'default',
  title: 'title',
  trackCount: 'trackCount',
  albumCount: 'albumCount',
} as const;

/**
 * Base options interface
 */
export interface BaseOptions {
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
}

/**
 * Track-specific options
 */
export interface TrackOptions extends BaseOptions {
  /**
   * Sorting configuration for tracks
   * @example
   * 'title' // Sort by title descending (default)
   * ['title', true] // Sort by title ascending
   */
  sortBy?: SortByValue<TrackSortByKey> | SortByValue<TrackSortByKey>[];

  /**
   * Directory path to search for tracks
   * @default undefined
   */
  directory?: string;
}

/**
 * Album-specific options
 */
export interface AlbumOptions extends BaseOptions {
  /**
   * Sorting configuration for albums
   * @example
   * 'title' // Sort by title descending (default)
   * ['trackCount', true] // Sort by track count ascending
   */
  sortBy?: SortByValue<AlbumSortByKey> | SortByValue<AlbumSortByKey>[];
}

/**
 * Artist-specific options
 */
export interface ArtistOptions extends BaseOptions {
  /**
   * Sorting configuration for artists
   * @example
   * 'title' // Sort by name descending (default)
   * ['trackCount', true] // Sort by track count ascending
   */
  sortBy?: SortByValue<ArtistSortByKey> | SortByValue<ArtistSortByKey>[];
}

/**
 * Internal options used by native module
 */
export interface InternalTrackOptions {
  after?: string;
  first: number;
  sortBy: InternalSortByValue[];
  directory?: string;
}

export interface InternalAlbumOptions {
  after?: string;
  first: number;
  sortBy: InternalSortByValue[];
}

export interface InternalArtistOptions {
  after?: string;
  first: number;
  sortBy: InternalSortByValue[];
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

export type TrackResult = PaginatedResult<Track>;
export type AlbumResult = PaginatedResult<Album>;
export type ArtistResult = PaginatedResult<Artist>;

export interface ArtistWithAlbumsAndTracks {
  albums: Album[];
  tracks: Track[];
}

export interface Spec extends TurboModule {
  getTracksAsync(options: InternalTrackOptions): Promise<TrackResult>;
  getTrackMetadataAsync(trackId: string): Promise<TrackMetadata>;
  getTracksByAlbumAsync(albumId: string): Promise<Track[]>;
  getTracksByArtistAsync(
    artistId: string,
    options: InternalTrackOptions
  ): Promise<TrackResult>;
  getAlbumsAsync(options: InternalAlbumOptions): Promise<AlbumResult>;
  getAlbumsByArtistAsync(artistId: string): Promise<Album[]>;
  getArtistsAsync(options: InternalArtistOptions): Promise<ArtistResult>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('MusicLibrary');
