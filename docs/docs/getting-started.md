---
sidebar_position: 2
title: Installation and Permissions
description: Install React Native Music Library, configure Android and iOS permissions, and query tracks, albums, and artists.
---

# Getting Started

Learn how to set up and use React Native Music Library in your project.

## Installation

```bash
npm install @nodefinity/react-native-music-library
# or
yarn add @nodefinity/react-native-music-library
```

## Platform Setup

### Android

1. **Add permissions** to `android/app/src/main/AndroidManifest.xml`:

```xml
<!-- Android 13+ granular permission -->
<uses-permission android:name="android.permission.READ_MEDIA_AUDIO" />
<!-- Android 12 and below traditional storage permission -->
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

1. **Request runtime permissions** using a permissions library:

```js
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const requestMusicPermission = async () => {
  const result = await request(PERMISSIONS.ANDROID.READ_MEDIA_AUDIO);

  if (result === RESULTS.GRANTED) {
    console.log('Music permission granted');
  } else {
    console.log('Music permission denied');
  }
};
```

### iOS

1. **Add permission** to `Info.plist`:

```xml
<key>NSAppleMusicUsageDescription</key>
<string>This app needs access to your music library to play songs</string>
```

1. **Request runtime permission** using a permissions library:

```js
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const requestMusicPermission = async () => {
  const result = await request(PERMISSIONS.IOS.MEDIA_LIBRARY);

  if (result === RESULTS.GRANTED) {
    console.log('Music permission granted');
  } else {
    console.log('Music permission denied');
  }
};
```

## Basic Usage

### Import the library

```js
import {
  getTracksAsync,
  getAlbumsAsync,
  getArtistsAsync,
  getTrackMetadataAsync,
} from '@nodefinity/react-native-music-library';
```

### Get all tracks

```js
const loadTracks = async () => {
  try {
    const result = await getTracksAsync();

    result.items.forEach((track) => {
      console.log(`${track.title} by ${track.artist}`);
      console.log(
        `Duration: ${Math.floor(track.duration / 60)}:${track.duration % 60}`
      );
      console.log(`Resource: ${track.contentUri ?? track.url}`);
    });
  } catch (error) {
    console.error('Failed to load tracks:', error);
  }
};
```

### Get albums

```js
const loadAlbums = async () => {
  try {
    const result = await getAlbumsAsync({
      sortBy: ['title', true], // Sort by title ascending
      first: 50,
    });

    result.items.forEach((album) => {
      console.log(`${album.title} by ${album.artist}`);
      console.log(`Tracks: ${album.trackCount}`);
    });
  } catch (error) {
    console.error('Failed to load albums:', error);
  }
};
```

### Get artists

```js
const loadArtists = async () => {
  try {
    const result = await getArtistsAsync({
      sortBy: 'title', // Sort by name
    });

    result.items.forEach((artist) => {
      console.log(`${artist.title}`);
      console.log(`Albums: ${artist.albumCount}, Tracks: ${artist.trackCount}`);
    });
  } catch (error) {
    console.error('Failed to load artists:', error);
  }
};
```

## Next Steps

- [API Reference](./api.md) - Learn about all available methods and options
- [Examples](./examples.md) - See practical usage examples
- [Type Definitions](./api.md#type-definitions) - Understand the data structures
