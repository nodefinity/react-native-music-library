---
sidebar_position: 3
title: API Reference
description: API reference for querying tracks, albums, artists, artwork, lyrics, audio metadata, sorting, filtering, and cursor pagination.
---

# API Reference

Complete API documentation for React Native Music Library.

## Core Functions

### `getTracksAsync(options?)`

Retrieves music tracks from the device's music library.

#### Parameters

- `options` (optional): `TrackOptions` - Configuration options for the query

#### Returns

`Promise<TrackResult>` containing:

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
  directory: '/Music/Favorites',
});
```

### `getAlbumsAsync(options?)`

Retrieves albums from the device's music library.

#### Parameters

- `options` (optional): `AlbumOptions` - Configuration options for the query

#### Returns

`Promise<AlbumResult>` containing:

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
  sortBy: ['trackCount', false], // Sort by track count descending
});
```

### `getArtistsAsync(options?)`

Retrieves artists from the device's music library.

#### Parameters

- `options` (optional): `ArtistOptions` - Configuration options for the query

#### Returns

`Promise<ArtistResult>` containing:

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
  sortBy: ['trackCount', false], // Sort by track count descending
});
```

### `getTrackMetadataAsync(trackId)`

Retrieves detailed metadata for a specific track.

#### Parameters

- `trackId`: string - The ID of the track to get metadata for

#### Returns

`Promise<TrackMetadata>` containing detailed audio and tag information.

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

`Promise<Track[]>` containing an array of `Track` objects.

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

`Promise<TrackResult>` containing tracks by the artist.

#### Example

```js
import { getTracksByArtistAsync } from '@nodefinity/react-native-music-library';

const tracks = await getTracksByArtistAsync('artist-id-123', {
  first: 100,
  sortBy: ['album', true],
});
```

### `getAlbumsByArtistAsync(artistId)`

Retrieves all albums from a specific artist.

#### Parameters

- `artistId`: string - The ID of the artist

#### Returns

`Promise<Album[]>` containing an array of `Album` objects.

#### Example

```js
import { getAlbumsByArtistAsync } from '@nodefinity/react-native-music-library';

const albums = await getAlbumsByArtistAsync('artist-id-123');
```

## Type Definitions

### `TrackOptions`

```typescript
interface TrackOptions {
  after?: string; // Previous page's entity-ID cursor
  first?: number; // 1–1000 items (default: 20)
  sortBy?: SortByValue<TrackSortByKey> | SortByValue<TrackSortByKey>[];
  directory?: string; // Directory path to search
}
```

### `AlbumOptions`

```typescript
interface AlbumOptions {
  after?: string; // Previous page's entity-ID cursor
  first?: number; // 1–1000 items (default: 20)
  sortBy?: SortByValue<AlbumSortByKey> | SortByValue<AlbumSortByKey>[];
}
```

### `ArtistOptions`

```typescript
interface ArtistOptions {
  after?: string; // Previous page's entity-ID cursor
  first?: number; // 1–1000 items (default: 20)
  sortBy?: SortByValue<ArtistSortByKey> | SortByValue<ArtistSortByKey>[];
}
```

The cursor is the ID of the last entity returned by the previous page and must
be reused with the same entity, filters, and normalized sort. A malformed
cursor rejects with `INVALID_CURSOR`. A valid ID absent from the current query
rejects with `CURSOR_NOT_FOUND`. A cursor at the final entity returns an empty
terminal page with no `endCursor`.

### `Track`

```typescript
interface Track {
  id: string;
  title: string; // Track title
  artist: string; // Artist name
  artwork?: string; // Artwork file URI (may be undefined)
  album: string; // Album name
  duration: number; // Duration in seconds
  url: string; // File URL or path
  createdAt?: number | null; // Date added (Unix seconds)
  modifiedAt?: number | null; // Resource modification time; null on iOS
  fileSize: number; // File size in bytes
}
```

### `Album`

```typescript
interface Album {
  id: string;
  title: string; // Album name
  artist: string; // Primary artist
  artwork?: string; // Album artwork URI
  trackCount: number; // Number of tracks
  year?: number; // Release year
}
```

### `Artist`

```typescript
interface Artist {
  id: string;
  title: string; // Artist name
  albumCount: number; // Number of albums
  trackCount: number; // Total number of tracks
}
```

### `TrackMetadata`

```typescript
interface TrackMetadata {
  id: string; // Track ID

  // Audio header
  duration: number; // Duration in seconds
  bitrate: number; // Bitrate in kbps
  sampleRate: number; // Sample rate in Hz
  channels: string; // Number of channels (e.g. "2")
  format: string; // Audio format

  // Tag info
  title: string; // Track title
  artist: string; // Artist name
  album: string; // Album name
  year: number; // Release year
  genre: string; // Music genre
  track: number; // Track number
  disc: number; // Disc number
  composer: string; // Composer
  lyricist: string; // Lyricist
  lyrics: string; // Lyrics content
  albumArtist: string; // Album artist
  comment: string; // Comment
}
```

## Sorting Options

The default sort is title ascending. A bare key is descending. Multiple sort
descriptors are evaluated in declaration order, then the entity ID is used as
an ascending tie-breaker. Missing string or numeric values sort before populated
values in ascending order where both platforms expose the field.

### Track Sorting Keys

- `'default'` - Default sorting (title)
- `'title'` - Sort by track title
- `'artist'` - Sort by artist name
- `'album'` - Sort by album name
- `'duration'` - Sort by duration
- `'createdAt'` - Sort by creation date
- `'modifiedAt'` - Sort by resource modification date (Android; unavailable values on iOS tie and fall back to ID)
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
sortBy: 'artist';

// Single sort key with direction
sortBy: ['artist', true]; // ascending
sortBy: ['artist', false]; // descending

// Multiple sort criteria
sortBy: [['artist', true], ['album', true], 'duration'];
```
