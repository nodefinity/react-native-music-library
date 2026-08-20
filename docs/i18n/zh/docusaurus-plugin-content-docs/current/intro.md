---
sidebar_position: 1
title: Android 与 iOS 本地音乐库
description: 使用 React Native 在 Android 和 iOS 上访问设备中的曲目、专辑、艺术家、封面、歌词和音频元数据。
---

# 介绍

React Native Music Library 是一个功能强大的库，用于访问本地音乐文件并支持完整的元数据。基于 React Native 新架构（TurboModules）构建，以获得最佳性能。

## ✨ 特性

- 🎵 **丰富的元数据** - 访问本地音乐，包含歌词在内的完整元数据
- 🚀 **TurboModules** - 基于 React Native 新架构构建，性能最大化
- 📄 **分页** - 高效处理大型音乐集合
- 🔍 **灵活排序** - 多种排序选项，支持曲目、专辑和艺术家
- 📁 **目录过滤** - 按特定目录过滤音乐
- 🔄 **TypeScript** - 完整的类型定义和类型安全
- 🎨 **专辑封面** - 支持专辑封面和封面图片
- 🤖 **Android** - 完整的原生 Android 实现
- 🍎 **iOS** - 基于 MediaPlayer 框架的完整原生 iOS 实现

## 🚀 快速开始

### 安装

```bash
npm install @nodefinity/react-native-music-library
# 或
yarn add @nodefinity/react-native-music-library
```

### 基本用法

```js
import { getTracksAsync, getAlbumsAsync, getArtistsAsync, getTrackMetadataAsync, getTracksByAlbumAsync, getTracksByArtistAsync, getAlbumsByArtistAsync } from '@nodefinity/react-native-music-library';

// 获取曲目
const tracks = await getTracksAsync();

// 获取元数据
const trackWithMetadata = await getTrackMetadataAsync(track.id);

// 获取专辑曲目
const tracksFromAlbum = await getTracksByAlbumAsync(album.id);

// 获取艺术家曲目
const tracksFromArtist = await getTracksByArtistAsync(artist.id);

// 获取专辑并排序
const albums = await getAlbumsAsync({
  sortBy: ['title', true], // 按标题升序排序
  first: 50
});

// 获取艺术家专辑
const albumsFromArtist = await getAlbumsByArtistAsync(artist.id);

// 获取艺术家
const artists = await getArtistsAsync();
```

### Android 权限

在 `android/app/src/main/AndroidManifest.xml` 中添加：

```xml
<uses-permission android:name="android.permission.READ_MEDIA_AUDIO" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

### iOS 权限

在 `Info.plist` 中添加：

```xml
<key>NSAppleMusicUsageDescription</key>
<string>此应用需要访问您的音乐库。</string>
```

## 📖 下一步

- [开始使用](./getting-started.md) - 学习如何设置和使用该库
- [API 参考](./api.md) - 完整的 API 文档
- [示例](./examples.md) - 实际使用示例
