/**
 * Sorting keys for music library items
 */
export type SortKey =
  | 'default'
  | 'title'
  | 'artist'
  | 'album'
  | 'duration'
  | 'createdAt'
  | 'genre'
  | 'trackCount'
  | 'name';

/**
 * Sorting configuration
 * Can be a single key or a tuple of [key, ascending]
 * @example
 * 'title' // Sort by title descending (default)
 * ['title', true] // Sort by title ascending
 */
export type SortBy = SortKey | [SortKey, boolean];

/**
 * Basic pagination and filtering parameters
 */
export interface IPaginatedQuery {
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
   * Search query string
   * @default undefined
   */
  searchQuery?: string;

  /**
   * Sorting configuration
   * @default undefined
   */
  sortBy?: SortBy;

  /**
   * Directory path to search for tracks
   * @default undefined
   */
  directory?: string;
}

export interface IPaginatedResult<T> {
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

export interface ITrack {
  id: string;

  /**
   * Track title
   * @default ''
   */
  title: string;

  /** Album artwork (base64 encoded image or URL) */
  artwork: string;

  /**
   * Artist name
   * @default ''
   */
  artist: string;

  /**
   * Album name
   * @default ''
   */
  album: string;

  /** Music genre */
  genre: string;

  /**
   * Duration in seconds
   * @default 0
   */
  duration: number;

  /**
   * File URI or path
   * @default ''
   */
  uri: string;

  /**
   * Date added to library (Unix timestamp, optional)
   * @default undefined
   */
  createdAt?: number;

  /**
   * File size in bytes (optional)
   * @default undefined
   */
  fileSize?: number;
}

export interface IAlbum {
  id: string;

  /**
   * Album name
   * @default ''
   */
  name: string;

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
   * Total duration in seconds
   * @default 0
   */
  duration: number;

  /**
   * Release year (optional)
   * @default undefined
   */
  year?: number;
}

export interface IArtist {
  id: string;

  /**
   * Artist name
   * @default ''
   */
  name: string;

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

export interface IGenre {
  id: string;

  /**
   * Genre name
   * @default ''
   */
  name: string;

  /**
   * Number of tracks in this genre
   * @default 0
   */
  trackCount: number;
}

export type ITrackResult = IPaginatedResult<ITrack>;
export type IAlbumResult = IPaginatedResult<IAlbum>;
export type IArtistResult = IPaginatedResult<IArtist>;
export type IGenreResult = IPaginatedResult<IGenre>;
