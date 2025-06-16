# react-native-music-library

[English Version](./README.md)

一个功能强大的 React Native 库，用于访问本地音乐文件并获取完整的元数据信息。基于 React Native 新架构（TurboModules）构建，性能卓越。

> **注意**：目前仅实现了 Android 平台，iOS 支持即将推出。

[![npm version](https://badge.fury.io/js/@nodefinity%2Freact-native-music-library.svg)](https://badge.fury.io/js/@nodefinity%2Freact-native-music-library)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 特性与路线图

- [x] 🎵 访问本地音乐库并获取丰富的元数据（包括歌词）
- [x] 🚀 基于 TurboModules 构建，性能卓越
- [x] 📄 支持大型音乐集合的分页功能
- [x] 🔍 灵活的排序和过滤选项
- [x] 📁 基于目录的过滤功能
- [x] 🔄 完整的 TypeScript 类型定义支持
- [x] 🎨 支持 Base64 专辑封面
- [x] 🤖 Android 平台支持
- [ ] 📱 iOS 平台支持
- [ ] 📀 专辑查询 (`getAlbumsAsync`)
- [ ] 👨‍🎤 艺术家查询 (`getArtistsAsync`)
- [ ] 🎼 音乐类型查询 (`getGenresAsync`)
- [ ] 🎵 播放列表支持
- [ ] 🔍 搜索功能
- [ ] 📡 实时音乐库变更通知

## 安装

```sh
npm install @nodefinity/react-native-music-library
```

或者

```sh
yarn add @nodefinity/react-native-music-library
```

## 平台支持

此库支持多个平台，具有自动平台检测功能：

- **Android**：完整的原生音乐库访问
- **iOS**：完整的原生音乐库访问（即将推出）
- **Web**：回退实现并提供警告（适用于 React Native Web 项目）

该库会根据您的平台自动提供相应的实现。在 web 平台上，所有方法都会返回空结果并显示开发警告，以帮助开发和测试。

### Android 设置

对于 Android，在 `android/app/src/main/AndroidManifest.xml` 中添加以下权限：

```xml
<!-- Android 13+ -->
<uses-permission android:name="android.permission.READ_MEDIA_AUDIO" />
<!-- Android 12 以下 -->
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

### iOS 设置（即将推出）

iOS 实现尚未完成。现在可以先添加权限到 `Info.plist` 以便将来兼容：

```xml
<key>NSAppleMusicUsageDescription</key>
<string>此应用需要访问您的音乐库来播放歌曲</string>
```

## 权限

在使用此库之前，你需要请求访问音乐库的权限。我们推荐使用以下库之一：

- [react-native-permissions](https://github.com/zoontek/react-native-permissions)
- [expo-media-library](https://docs.expo.dev/versions/latest/sdk/media-library/)

## API 参考

### getTracksAsync(options?)

从设备的音乐库中检索音乐曲目。

#### 参数

- `options`（可选）：`AssetsOptions` - 查询的配置选项

#### 返回值

返回一个 Promise，解析为包含以下内容的 `TrackResult`：

- `items`：`Track` 对象数组
- `hasNextPage`：布尔值，指示是否有更多曲目可用
- `endCursor`：用于分页的字符串游标
- `totalCount`：曲目总数（可选）

### getTrackMetadataAsync(trackId)

获取特定曲目的详细元数据，包括歌词和来自 JAudioTagger 的额外元数据。

#### 参数

- `trackId`：string - 要获取元数据的曲目 ID

#### 返回值

返回一个 Promise，解析为包含以下内容的 `TrackMetadata`：

```typescript
interface TrackMetadata {
  id: string;              // 曲目 ID

  // audio header
  duration?: number;       // 持续时间（秒）
  bitrate?: number;        // 比特率（kbps）
  sampleRate?: number;     // 采样率（Hz）
  channels?: number;       // 通道数
  format?: string;         // 音频格式

  // tag info
  title?: string;          // 曲目标题
  artist?: string;         // 艺术家名称
  album?: string;          // 专辑名称
  year?: number;           // 发行年份
  genre?: string;          // 音乐流派
  track?: number;          // 曲目编号
  disc?: number;           // 碟片编号
  composer?: string;       // 作曲家
  lyricist?: string;       // 作词家
  lyrics?: string;         // 歌词内容
  albumArtist?: string;    // 专辑艺术家
  comment?: string;        // 注释
}
```

#### 示例

```js
import { getTrackMetadataAsync } from '@nodefinity/react-native-music-library';

// 获取特定曲目的元数据
const metadata = await getTrackMetadataAsync('track-id-123');
console.log('歌词:', metadata.lyrics);
console.log('额外元数据:', metadata.additionalMetadata);
```

## 类型定义

### Track

```typescript
interface Track {
  id: string;
  title: string;           // 曲目标题
  artist?: string;         // 艺术家名称
  artwork?: string;        // 专辑封面 URI
  album?: string;          // 专辑名称
  duration: number;        // 持续时间（秒）
  url: string;             // 文件 URL 或路径
  createdAt?: number;      // 添加日期（Unix 时间戳）
  modifiedAt?: number;     // 修改日期（Unix 时间戳）
  fileSize?: number;       // 文件大小（字节）
}
```

### AssetsOptions

```typescript
interface AssetsOptions {
  after?: string;          // 分页游标
  first?: number;          // 返回的最大项目数（默认：20）
  sortBy?: SortByValue | SortByValue[];  // 排序配置
  directory?: string;      // 搜索的目录路径
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
  | 'trackCount';
```

### TrackResult

```typescript
interface TrackResult {
  items: Track[];          // 曲目数组
  hasNextPage: boolean;    // 是否有更多项目？
  endCursor?: string;      // 下一页的游标
  totalCount?: number;     // 总数（可选）
}
```

## 使用示例

### 基本用法

```js
import { getTracksAsync } from '@nodefinity/react-native-music-library';

const loadMusicLibrary = async () => {
  try {
    const result = await getTracksAsync();
    
    result.items.forEach(track => {
      console.log(`${track.title} - ${track.artist}`);
      console.log(`时长: ${Math.floor(track.duration / 60)}:${track.duration % 60}`);
      console.log(`文件: ${track.url}`);
    });
  } catch (error) {
    console.error('加载音乐库失败:', error);
  }
};
```

### 分页

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
  
  console.log(`总共加载了 ${allTracks.length} 首曲目`);
  return allTracks;
};
```

### 排序

```js
import { getTracksAsync } from '@nodefinity/react-native-music-library';

// 按艺术家名称排序（降序 - 默认）
const tracksByArtist = await getTracksAsync({
  sortBy: 'artist'
});

// 按艺术家名称升序排序
const tracksByArtistAsc = await getTracksAsync({
  sortBy: ['artist', true]
});

// 多个排序条件
const tracksMultiSort = await getTracksAsync({
  sortBy: [
    ['artist', true],
    ['album', true],
    'duration'
  ]
});
```

### 目录过滤

```js
import { getTracksAsync } from '@nodefinity/react-native-music-library';

// 从特定目录获取曲目
const playlistTracks = await getTracksAsync({
  directory: '/Music/Playlists/Favorites'
});
```

## 贡献

请参阅 [贡献指南](CONTRIBUTING.md) 了解如何为仓库做贡献以及开发工作流程。

## 许可证

MIT

---

使用 [create-react-native-library](https://github.com/callstack/react-native-builder-bob) 构建
