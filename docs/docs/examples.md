---
sidebar_position: 4
title: Examples
description: Practical React Native examples for loading local tracks, cursor pagination, albums, artists, lyrics, and audio metadata.
---

# Examples

These examples cover common ways to work with a Local Music Library. Before
running them, complete the Android or iOS permission setup in the
[Getting Started guide](./getting-started.md).

## Load the first page of tracks

Use a page size to keep the initial query fast, then pass `endCursor` into the
next request.

```ts
import { getTracksAsync } from '@nodefinity/react-native-music-library';

const firstPage = await getTracksAsync({
  first: 50,
  sortBy: ['title', true],
});

const nextPage = firstPage.hasNextPage
  ? await getTracksAsync({
      first: 50,
      after: firstPage.endCursor,
      sortBy: ['title', true],
    })
  : undefined;
```

## Load a complete result

Use the high-level helpers when the workflow needs the complete current list.
The paginated methods remain available for incremental screens.

```ts
import {
  getAllTracksAsync,
  getAllAlbumsAsync,
  getAllArtistsAsync,
} from '@nodefinity/react-native-music-library';

const tracks = await getAllTracksAsync({ first: 100 });
const albums = await getAllAlbumsAsync({ first: 100 });
const artists = await getAllArtistsAsync({ first: 100 });
```

## Read audio metadata and lyrics

Load detailed Track Metadata when a user opens a track. The returned values
depend on the metadata available from the platform and the track itself.

```ts
import { getTrackMetadataAsync } from '@nodefinity/react-native-music-library';

const metadata = await getTrackMetadataAsync(track.id);

console.log(metadata.bitrate);
console.log(metadata.sampleRate);
console.log(metadata.genre);
console.log(metadata.lyrics);
```

## Browse albums and artists

```ts
import {
  getAlbumsAsync,
  getArtistsAsync,
  getTracksByAlbumAsync,
} from '@nodefinity/react-native-music-library';

const albums = await getAlbumsAsync({
  first: 30,
  sortBy: ['title', true],
});

const artists = await getArtistsAsync({
  first: 30,
  sortBy: ['title', true],
});

const albumTracks = await getTracksByAlbumAsync(albums.items[0].id);
```

## Run the example app

The [example application](https://github.com/nodefinity/react-native-music-library/tree/main/example)
contains track, album, artist, player, and lyrics screens for manual testing on
Android and iOS.
