---
sidebar_position: 3
---

# API Reference

Complete API documentation for React Native Music Library.

## Core Functions

### `getTracksAsync(options?)`

Retrieves music tracks from the device's music library.

#### Parameters

- `options` (optional): `TrackOptions` - Configuration options for the query

#### Returns

Promise that resolves to `TrackResult` containing:

- `items`: Array of `Track` objects
- `hasNextPage`: Boolean indicating if more tracks are available
- `endCursor`: String cursor for pagination
- `totalCount`: Total number of tracks (optional)

#### Example

```js
import { getTracksAsync } from '@nodefinity/react-native-music-library';

// Get all tracks
const result = await getTracksAsync();

// Get tracks with options
const tracks = await getTracksAsync({
  first: 50,
  sortBy: ['artist', true],
  directory: '/Music/Favorites'
});
```

### `getAlbumsAsync(options?)`

Retrieves albums from the device's music library.

#### Parameters

- `options` (optional): `AlbumOptions` - Configuration options for the query

#### Returns

Promise that resolves to `AlbumResult` containing:

- `items`: Array of `Album` objects
- `hasNextPage`: Boolean indicating if more albums are available
- `endCursor`: String cursor for pagination
- `totalCount`: Total number of albums (optional)

#### Example

```js
import { getAlbumsAsync } from '@nodefinity/react-native-music-library';

// Get all albums
const result = await getAlbumsAsync();

// Get albums with sorting
const albums = await getAlbumsAsync({
  first: 30,
  sortBy: ['trackCount', false] // Sort by track count descending
});
```

### `getArtistsAsync(options?)`

Retrieves artists from the device's music library.

#### Parameters

- `options` (optional): `ArtistOptions` - Configuration options for the query

#### Returns

Promise that resolves to `ArtistResult` containing:

- `items`: Array of `Artist` objects
- `hasNextPage`: Boolean indicating if more artists are available
- `endCursor`: String cursor for pagination
- `totalCount`: Total number of artists (optional)

#### Example

```js
import { getArtistsAsync } from '@nodefinity/react-native-music-library';

// Get all artists
const result = await getArtistsAsync();

// Get artists with sorting
const artists = await getArtistsAsync({
  first: 20,
  sortBy: ['trackCount', false] // Sort by track count descending
});
```

### `getTrackMetadataAsync(trackId)`

Retrieves detailed metadata for a specific track.

#### Parameters

- `trackId`: string - The ID of the track to get metadata for

#### Returns

Promise that resolves to `TrackMetadata` containing detailed audio and tag information.

#### Example

```js
import { getTrackMetadataAsync } from '@nodefinity/react-native-music-library';

const metadata = await getTrackMetadataAsync('track-id-123');
console.log('Lyrics:', metadata.lyrics);
console.log('Bitrate:', metadata.bitrate);
```

### `getTracksByAlbumAsync(albumId)`

Retrieves all tracks from a specific album.

#### Parameters

- `albumId`: string - The ID of the album

#### Returns

Promise that resolves to an array of `Track` objects.

#### Example

```js
import { getTracksByAlbumAsync } from '@nodefinity/react-native-music-library';

const tracks = await getTracksByAlbumAsync('album-id-123');
```

### `getTracksByArtistAsync(artistId, options?)`

Retrieves all tracks from a specific artist.

#### Parameters

- `artistId`: string - The ID of the artist
- `options` (optional): `TrackOptions` - Configuration options for the query

#### Returns

Promise that resolves to `TrackResult` containing tracks by the artist.

#### Example

```js
import { getTracksByArtistAsync } from '@nodefinity/react-native-music-library';

const tracks = await getTracksByArtistAsync('artist-id-123', {
  first: 100,
  sortBy: ['album', true]
});
```

### `getAlbumsByArtistAsync(artistId)`

Retrieves all albums from a specific artist.

#### Parameters

- `artistId`: string - The ID of the artist

#### Returns

Promise that resolves to an array of `Album` objects.

#### Example

```js
import { getAlbumsByArtistAsync } from '@nodefinity/react-native-music-library';

const albums = await getAlbumsByArtistAsync('artist-id-123');
```

## Type Definitions

### `TrackOptions`

```typescript
interface TrackOptions {
  after?: string;          // Cursor for pagination
  first?: number;          // Max items to return (default: 20)
  sortBy?: SortByValue<TrackSortByKey> | SortByValue<TrackSortByKey>[];
  directory?: string;      // Directory path to search
}
```

### `AlbumOptions`

```typescript
interface AlbumOptions {
  after?: string;          // Cursor for pagination
  first?: number;          // Max items to return (default: 20)
  sortBy?: SortByValue<AlbumSortByKey> | SortByValue<AlbumSortByKey>[];
}
```

### `ArtistOptions`

```typescript
interface ArtistOptions {
  after?: string;          // Cursor for pagination
  first?: number;          // Max items to return (default: 20)
  sortBy?: SortByValue<ArtistSortByKey> | SortByValue<ArtistSortByKey>[];
}
```

### `Track`

```typescript
interface Track {
  id: string;
  title: string;          // Track title
  artist: string;         // Artist name
  artwork: string;        // Artwork file URI
  album: string;          // Album name
  duration: number;       // Duration in seconds
  url: string;            // File URL or path
  createdAt: number;      // Date added (Unix timestamp)
  modifiedAt: number;     // Date modified (Unix timestamp)
  fileSize: number;       // File size in bytes
}
```

### `Album`

```typescript
interface Album {
  id: string;
  title: string;          // Album name
  artist: string;         // Primary artist
  artwork?: string;       // Album artwork URI
  trackCount: number;     // Number of tracks
  year?: number;          // Release year
}
```

### `Artist`

```typescript
interface Artist {
  id: string;
  title: string;          // Artist name
  albumCount: number;     // Number of albums
  trackCount: number;     // Total number of tracks
}
```

### `TrackMetadata`

```typescript
interface TrackMetadata {
  id: string;              // Track ID

  // Audio header
  duration: number;       // Duration in seconds
  bitrate: number;        // Bitrate in kbps
  sampleRate: number;     // Sample rate in Hz
  channels: number;       // Number of channels
  format: string;         // Audio format

  // Tag info
  title: string;          // Track title
  artist: string;         // Artist name
  album: string;          // Album name
  year: number;           // Release year
  genre: string;          // Music genre
  track: number;          // Track number
  disc: number;           // Disc number
  composer: string;       // Composer
  lyricist: string;       // Lyricist
  lyrics: string;         // Lyrics content
  albumArtist: string;    // Album artist
  comment: string;        // Comment
}
```

## Sorting Options

### Track Sorting Keys

- `'default'` - Default sorting (title)
- `'title'` - Sort by track title
- `'artist'` - Sort by artist name
- `'album'` - Sort by album name
- `'duration'` - Sort by duration
- `'createdAt'` - Sort by creation date
- `'modifiedAt'` - Sort by modification date
- `'fileSize'` - Sort by file size

### Album Sorting Keys

- `'default'` - Default sorting (title)
- `'title'` - Sort by album title
- `'artist'` - Sort by artist name
- `'trackCount'` - Sort by number of tracks
- `'year'` - Sort by release year

### Artist Sorting Keys

- `'default'` - Default sorting (title)
- `'title'` - Sort by artist name
- `'trackCount'` - Sort by number of tracks
- `'albumCount'` - Sort by number of albums

### Sorting Examples

```js
// Single sort key (descending by default)
sortBy: 'artist'

// Single sort key with direction
sortBy: ['artist', true]  // ascending
sortBy: ['artist', false] // descending

// Multiple sort criteria
sortBy: [
  ['artist', true],
  ['album', true],
  'duration'
]
```
