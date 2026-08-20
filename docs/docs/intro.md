---
sidebar_position: 1
title: Local Music Library for Android & iOS
description: Access on-device tracks, albums, artists, artwork, lyrics, and audio metadata on Android and iOS with React Native.
---

# Introduction

React Native Music Library is a powerful library for accessing local music files with full metadata support. Built with React Native's New Architecture (TurboModules) for optimal performance.

## ✨ Features

- 🎵 **Rich Metadata** - Access local music with full metadata including lyrics
- 🚀 **TurboModules** - Built with React Native's New Architecture for maximum performance
- 📄 **Pagination** - Efficient handling of large music collections
- 🔍 **Flexible Sorting** - Multiple sorting options for tracks, albums, and artists
- 📁 **Directory Filtering** - Filter music by specific directories
- 🔄 **TypeScript** - Full type definitions and type safety
- 🎨 **Album Artwork** - Support for album artwork and cover images
- 🤖 **Android** - Full native Android implementation
- 🍎 **iOS** - Full native iOS implementation via MediaPlayer framework

## 🚀 Quick Start

### Installation

```bash
npm install @nodefinity/react-native-music-library
# or
yarn add @nodefinity/react-native-music-library
```

### Basic Usage

```js
import {
  getTracksAsync,
  getAlbumsAsync,
  getArtistsAsync,
} from '@nodefinity/react-native-music-library';

// Get all tracks
const tracks = await getTracksAsync();

// Get albums with sorting
const albums = await getAlbumsAsync({
  sortBy: ['title', true], // Sort by title ascending
  first: 50,
});

// Get artists
const artists = await getArtistsAsync();
```

### Android Permissions

Add to `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.READ_MEDIA_AUDIO" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

### iOS Permissions

Add to `Info.plist`:

```xml
<key>NSAppleMusicUsageDescription</key>
<string>This app needs access to your music library.</string>
```

## 📖 What's Next?

- [Getting Started](./getting-started.md) - Learn how to set up and use the library
- [API Reference](./api.md) - Complete API documentation
- [Examples](./examples.md) - Practical usage examples
