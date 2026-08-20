# react-native-music-library

[![npm version](https://badge.fury.io/js/@nodefinity%2Freact-native-music-library.svg)](https://badge.fury.io/js/@nodefinity%2Freact-native-music-library)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[English](./README.md)

[文档](https://nodefinity.github.io/react-native-music-library/zh/) ·
[开始使用](https://nodefinity.github.io/react-native-music-library/zh/docs/getting-started) ·
[API 参考](https://nodefinity.github.io/react-native-music-library/zh/docs/api)

一个支持 Android 和 iOS 的 React Native 本地音乐库。通过 Android MediaStore 和 iOS MediaPlayer 查询设备上的曲目、专辑、艺术家、封面、歌词和音频元数据，并基于 TurboModules 与 React Native 新架构构建。

<div style="display: flex; gap: 10px; flex-wrap: wrap; justify-content: center;">
  <img src="./assets/home.jpg" alt="Home Screen" style="width: 150px; height: auto;" />
  <img src="./assets/track-list.jpg" alt="Track List" style="width: 150px; height: auto;" />
  <img src="./assets/player.jpg" alt="Player" style="width: 150px; height: auto;" />
  <img src="./assets/album-list.jpg" alt="Album List" style="width: 150px; height: auto;" />
  <img src="./assets/artist-list.jpg" alt="Artist List" style="width: 150px; height: auto;" />
</div>

## ✨ 特性

- 🎵 **丰富元数据** - 读取完整音频元数据，包括歌词、比特率、采样率等
- 🚀 **TurboModules** - 基于 React Native 新架构构建，性能卓越
- 📄 **游标分页** - 高效处理大型音乐集合
- 🔍 **灵活排序** - 支持曲目、专辑和艺术家的多种排序选项
- 📁 **目录过滤** - 按目录路径过滤曲目（Android）
- 🔄 **TypeScript** - 完整类型定义
- 🎨 **专辑封面** - 支持专辑封面图片
- 🤖 **Android** - 完整原生 Android 实现
- 🍎 **iOS** - 基于 MediaPlayer 框架的完整原生 iOS 实现

## 🚀 快速开始

### 安装

```bash
npm install @nodefinity/react-native-music-library
# 或
yarn add @nodefinity/react-native-music-library
```

### 权限配置

**Android** — 在 `android/app/src/main/AndroidManifest.xml` 中添加：

```xml
<uses-permission android:name="android.permission.READ_MEDIA_AUDIO" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

**iOS** — 在 `Info.plist` 中添加：

```xml
<key>NSAppleMusicUsageDescription</key>
<string>此应用需要访问您的音乐库。</string>
```

### 基本用法

```js
import {
  getTracksAsync,
  getAlbumsAsync,
  getArtistsAsync,
} from '@nodefinity/react-native-music-library';

// 获取前 20 首曲目，按标题升序排序
const result = await getTracksAsync({ sortBy: ['title', true] });
console.log(result.items);       // Track[]
console.log(result.hasNextPage); // boolean
console.log(result.endCursor);   // string | undefined

// 获取下一页
const nextPage = await getTracksAsync({
  sortBy: ['title', true],
  first: 20,
  after: result.endCursor,
});
```

## 📖 API

### `getTracksAsync(options?)`

返回音乐库中的分页曲目列表。

```ts
getTracksAsync(options?: TrackOptions): Promise<PaginatedResult<Track>>
```

**TrackOptions**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `first` | `number` | `20` | 最多返回的条数 |
| `after` | `string` | — | 上一页的 `endCursor` |
| `sortBy` | `TrackSortByKey \| [TrackSortByKey, boolean] \| (...)[]` | `'default'` | 排序字段，或 `[字段, 是否升序]` 元组 |
| `directory` | `string` | — | 按目录路径过滤（仅 Android） |

**TrackSortByKey**：`'default' \| 'title' \| 'artist' \| 'album' \| 'duration' \| 'createdAt' \| 'modifiedAt' \| 'fileSize'`

---

### `getTrackMetadataAsync(trackId)`

返回单首曲目的详细音频元数据。

```ts
getTrackMetadataAsync(trackId: string): Promise<TrackMetadata>
```

---

### `getTracksByAlbumAsync(albumId)`

返回专辑内的所有曲目（不分页）。

```ts
getTracksByAlbumAsync(albumId: string): Promise<Track[]>
```

---

### `getTracksByArtistAsync(artistId, options?)`

返回某位艺术家的分页曲目列表。

```ts
getTracksByArtistAsync(artistId: string, options?: TrackOptions): Promise<PaginatedResult<Track>>
```

---

### `getAlbumsAsync(options?)`

返回分页专辑列表。

```ts
getAlbumsAsync(options?: AlbumOptions): Promise<PaginatedResult<Album>>
```

**AlbumOptions**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `first` | `number` | `20` | 最多返回的条数 |
| `after` | `string` | — | 上一页的 `endCursor` |
| `sortBy` | `AlbumSortByKey \| [AlbumSortByKey, boolean] \| (...)[]` | `'default'` | 排序字段，或 `[字段, 是否升序]` 元组 |

**AlbumSortByKey**：`'default' \| 'title' \| 'artist' \| 'trackCount' \| 'year'`

---

### `getAlbumsByArtistAsync(artistId)`

返回某位艺术家的所有专辑（不分页）。

```ts
getAlbumsByArtistAsync(artistId: string): Promise<Album[]>
```

---

### `getArtistsAsync(options?)`

返回分页艺术家列表。

```ts
getArtistsAsync(options?: ArtistOptions): Promise<PaginatedResult<Artist>>
```

**ArtistOptions**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `first` | `number` | `20` | 最多返回的条数 |
| `after` | `string` | — | 上一页的 `endCursor` |
| `sortBy` | `ArtistSortByKey \| [ArtistSortByKey, boolean] \| (...)[]` | `'default'` | 排序字段，或 `[字段, 是否升序]` 元组 |

**ArtistSortByKey**：`'default' \| 'title' \| 'trackCount' \| 'albumCount'`

---

## 📦 类型定义

### `Track`

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | `string` | 唯一标识符 |
| `title` | `string` | 曲目标题 |
| `artist` | `string` | 艺术家名称 |
| `artwork` | `string?` | 封面图片 URI（可能为空） |
| `album` | `string` | 专辑名称 |
| `duration` | `number` | 时长（秒） |
| `url` | `string` | 文件 URI |
| `createdAt` | `number` | 添加时间（Unix 时间戳，秒） |
| `modifiedAt` | `number` | 修改时间（Unix 时间戳，秒） |
| `fileSize` | `number` | 文件大小（字节） |

### `TrackMetadata`

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | `string` | 曲目 ID |
| `duration` | `number` | 时长（秒） |
| `bitrate` | `number` | 比特率（kbps） |
| `sampleRate` | `number` | 采样率（Hz） |
| `channels` | `string` | 声道数 |
| `format` | `string` | 音频格式（如 `"AAC"`、`"MP3"`） |
| `title` | `string` | 标题标签 |
| `artist` | `string` | 艺术家标签 |
| `album` | `string` | 专辑标签 |
| `year` | `number` | 发行年份 |
| `genre` | `string` | 流派标签 |
| `track` | `number` | 音轨号 |
| `disc` | `number` | 碟号 |
| `composer` | `string` | 作曲家标签 |
| `lyricist` | `string` | 作词人标签 |
| `lyrics` | `string` | 内嵌歌词 |
| `albumArtist` | `string` | 专辑艺术家标签 |
| `comment` | `string` | 备注标签 |

### `Album`

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | `string` | 唯一标识符 |
| `title` | `string` | 专辑名称 |
| `artist` | `string` | 主要艺术家 |
| `artwork` | `string?` | 封面图片 URI（可能为空） |
| `trackCount` | `number` | 曲目数量 |
| `year` | `number?` | 发行年份 |

### `Artist`

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | `string` | 唯一标识符 |
| `title` | `string` | 艺术家名称 |
| `albumCount` | `number` | 专辑数量 |
| `trackCount` | `number` | 曲目总数 |

### `PaginatedResult<T>`

| 字段 | 类型 | 说明 |
|------|------|------|
| `items` | `T[]` | 结果数组 |
| `hasNextPage` | `boolean` | 是否还有更多数据 |
| `endCursor` | `string?` | 传入 `after` 以获取下一页 |
| `totalCount` | `number?` | 总数量（计算可能较慢） |

---

## 🔄 分页示例

```ts
async function fetchAllTracks() {
  const allTracks = [];
  let cursor: string | undefined;

  do {
    const result = await getTracksAsync({ first: 50, after: cursor });
    allTracks.push(...result.items);
    cursor = result.hasNextPage ? result.endCursor : undefined;
  } while (cursor);

  return allTracks;
}
```

## 🤝 贡献

详情请参阅 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 📄 许可证

MIT 许可证 - 详情请参阅 [LICENSE](LICENSE)。
