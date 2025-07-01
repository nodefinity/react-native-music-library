# react-native-music-library

[中文版](./README_ZH.md) | [📖 Documentation](./docs/)

A powerful React Native library for accessing local music files and getting full metadata. Built with React Native's New Architecture (TurboModules) for optimal performance.

[![npm version](https://badge.fury.io/js/@nodefinity%2Freact-native-music-library.svg)](https://badge.fury.io/js/@nodefinity%2Freact-native-music-library)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🎵 **Rich Metadata** - Access local music with full metadata including lyrics
- 🚀 **TurboModules** - Built with React Native's New Architecture for maximum performance
- 📄 **Pagination** - Efficient handling of large music collections
- 🔍 **Flexible Sorting** - Multiple sorting options for tracks, albums, and artists
- 📁 **Directory Filtering** - Filter music by specific directories
- 🔄 **TypeScript** - Full type definitions and type safety
- 🎨 **Album Artwork** - Support for album artwork and cover images
- 🤖 **Android Support** - Full native Android implementation
- 📱 **iOS Support** - Coming soon

## 🚀 Quick Start

### Installation

```bash
npm install @nodefinity/react-native-music-library
# or
yarn add @nodefinity/react-native-music-library
```

### Basic Usage

```js
import { getTracksAsync, getAlbumsAsync, getArtistsAsync } from '@nodefinity/react-native-music-library';

// Get all tracks
const tracks = await getTracksAsync();

// Get albums with sorting
const albums = await getAlbumsAsync({
  sortBy: ['title', true], // Sort by title ascending
  first: 50
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

## 📖 Documentation

- [📚 Full API Documentation](./docs/)
- [🎯 Getting Started](./docs/getting-started)
- [🔧 API Reference](./docs/api)
- [💡 Examples](./docs/examples)

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.
