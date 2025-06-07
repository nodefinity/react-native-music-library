# react-native-music-library

[中文版](./README_ZH.md)

A powerful React Native library for accessing local music files with full metadata support. Built with React Native's New Architecture (TurboModules) for optimal performance.

> **Note**: Currently only Android is implemented. iOS support is coming soon.

[![npm version](https://badge.fury.io/js/@nodefinity%2Freact-native-music-library.svg)](https://badge.fury.io/js/@nodefinity%2Freact-native-music-library)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features & Roadmap

- [x] 🎵 Access local music library with rich metadata
- [x] 🚀 Built with TurboModules for maximum performance
- [x] 📄 Pagination support for large music collections  
- [x] 🔍 Flexible sorting and filtering options
- [x] 📁 Directory-based filtering
- [x] 🔄 TypeScript support with full type definitions
- [x] 🎨 Base64 album artwork support
- [x] 🤖 Android support
- [ ] 📱 iOS support
- [ ] 📀 Album queries (`getAlbumsAsync`)
- [ ] 👨‍🎤 Artist queries (`getArtistsAsync`) 
- [ ] 🎼 Genre queries (`getGenresAsync`)
- [ ] 🎵 Playlist support
- [ ] 🔍 Search functionality
- [ ] 📡 Real-time library change notifications

## Installation

```sh
npm install @nodefinity/react-native-music-library
```

or

```sh
yarn add @nodefinity/react-native-music-library
```

### Android Setup

For Android, add the following permission to your `android/app/src/main/AndroidManifest.xml`:

```xml
<!-- Android 13+ granular permission -->
<uses-permission android:name="android.permission.READ_MEDIA_AUDIO" />
<!-- Android 12 and below traditional storage permission -->
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

### iOS Setup (Coming Soon)

iOS implementation is not yet available. For now, you can add the permission to your `Info.plist` for future compatibility:

```xml
<key>NSAppleMusicUsageDescription</key>
<string>This app needs access to your music library to play songs</string>
```

## Permissions

You need to request permission to access the music library before using this library. We recommend using one of these libraries:

- [react-native-permissions](https://github.com/zoontek/react-native-permissions)
- [expo-media-library](https://docs.expo.dev/versions/latest/sdk/media-library/) (for Expo projects)

## API Reference

### getTracksAsync(options?)

Retrieves music tracks from the device's music library.

#### Parameters

- `options` (optional): `AssetsOptions` - Configuration options for the query

#### Returns

Promise that resolves to `TrackResult` containing:

- `items`: Array of `Track` objects
- `hasNextPage`: Boolean indicating if more tracks are available
- `endCursor`: String cursor for pagination
- `totalCount`: Total number of tracks (optional)

#### Example

```js
import { getTracksAsync } from '@nodefinity/react-native-music-library';

// Get first 20 tracks (default)
const result = await getTracksAsync();

// Get tracks with custom options
const customResult = await getTracksAsync({
  first: 50,
  sortBy: ['title', true], // Sort by title ascending
  directory: '/Music/Favorites'
});

console.log('Tracks:', customResult.items);
console.log('Has more:', customResult.hasNextPage);
```

## Type Definitions

### Track

```typescript
interface Track {
  id: string;
  title: string;           // Track title
  artwork: string;         // Artwork file URI
  artist: string;          // Artist name
  album: string;           // Album name
  genre: string;           // Music genre
  duration: number;        // Duration in seconds
  uri: string;             // File URI or path
  createdAt?: number;      // Date added (Unix timestamp)
  modifiedAt?: number;     // Date modified (Unix timestamp)
  fileSize?: number;       // File size in bytes
}
```

### AssetsOptions

```typescript
interface AssetsOptions {
  after?: string;          // Cursor for pagination
  first?: number;          // Max items to return (default: 20)
  sortBy?: SortByValue | SortByValue[];  // Sorting configuration
  directory?: string;      // Directory path to search
}
```

### SortByValue

```typescript
type SortByValue = SortByKey | [SortByKey, boolean];

type SortByKey = 
  | 'default'
  | 'artist' 
  | 'album'
  | 'duration'
  | 'createdAt'
  | 'modifiedAt'
  | 'genre'
  | 'trackCount';
```

### TrackResult

```typescript
interface TrackResult {
  items: Track[];          // Array of tracks
  hasNextPage: boolean;    // More items available?
  endCursor?: string;      // Cursor for next page
  totalCount?: number;     // Total count (optional)
}
```

## Usage Examples

### Basic Usage

```js
import { getTracksAsync } from '@nodefinity/react-native-music-library';

const loadMusicLibrary = async () => {
  try {
    const result = await getTracksAsync();
    
    result.items.forEach(track => {
      console.log(`${track.title} by ${track.artist}`);
      console.log(`Duration: ${Math.floor(track.duration / 60)}:${track.duration % 60}`);
      console.log(`File: ${track.uri}`);
    });
  } catch (error) {
    console.error('Failed to load music library:', error);
  }
};
```

### Pagination

```js
import { getTracksAsync } from '@nodefinity/react-native-music-library';

const loadAllTracks = async () => {
  let allTracks = [];
  let hasMore = true;
  let cursor;
  
  while (hasMore) {
    const result = await getTracksAsync({
      first: 100,
      after: cursor
    });
    
    allTracks = [...allTracks, ...result.items];
    hasMore = result.hasNextPage;
    cursor = result.endCursor;
  }
  
  console.log(`Loaded ${allTracks.length} tracks total`);
  return allTracks;
};
```

### Sorting

```js
import { getTracksAsync } from '@nodefinity/react-native-music-library';

// Sort by artist name (descending - default)
const tracksByArtist = await getTracksAsync({
  sortBy: 'artist'
});

// Sort by artist name ascending
const tracksByArtistAsc = await getTracksAsync({
  sortBy: ['artist', true]
});

// Multiple sort criteria
const tracksMultiSort = await getTracksAsync({
  sortBy: [
    ['artist', true],
    ['album', true],
    'duration'
  ]
});
```

### Directory Filtering

```js
import { getTracksAsync } from '@nodefinity/react-native-music-library';

// Get tracks from specific directory
const playlistTracks = await getTracksAsync({
  directory: '/Music/Playlists/Favorites'
});
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
