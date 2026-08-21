---
sidebar_position: 4
title: 示例
description: 加载本地曲目、游标分页、专辑、艺术家、歌词和音频元数据的实用 React Native 示例。
---

# 示例

以下示例介绍使用本地音乐库的常见方式。运行代码前，请先按照
[开始使用指南](./getting-started.md)完成 Android 或 iOS 权限配置。

## 加载第一页曲目

设置分页大小可以保持首次查询快速。继续加载时，将 `endCursor` 传入下一次请求。

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

## 加载完整结果

当业务需要当前完整列表时，使用高层 helper；增量加载页面仍可继续使用分页方法。

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

## 读取音频元数据和歌词

当用户打开某个曲目时再加载详细的曲目元数据。返回值取决于平台和曲目本身能够提供的元数据。

```ts
import { getTrackMetadataAsync } from '@nodefinity/react-native-music-library';

const metadata = await getTrackMetadataAsync(track.id);

console.log(metadata.bitrate);
console.log(metadata.sampleRate);
console.log(metadata.genre);
console.log(metadata.lyrics);
```

## 浏览专辑和艺术家

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

## 运行示例应用

[示例应用](https://github.com/nodefinity/react-native-music-library/tree/main/example)
包含曲目、专辑、艺术家、播放器和歌词页面，可用于在 Android 和 iOS 上进行手动测试。
