---
sidebar_position: 3
---

# API 参考

React Native Music Library 的完整 API 文档。

## 核心函数

### `getTracksAsync(options?)`

从设备的音乐库中检索音乐曲目。

#### 参数

- `options`（可选）：`TrackOptions` - 查询的配置选项

#### 返回值

`Promise<TrackResult>`，包含：

- `items`：`Track` 对象数组
- `hasNextPage`：布尔值，指示是否有更多曲目可用
- `endCursor`：用于分页的字符串游标
- `totalCount`：曲目总数

#### 示例

```js
import { getTracksAsync } from '@nodefinity/react-native-music-library';

// 获取所有曲目
const result = await getTracksAsync();

// 使用选项获取曲目
const tracks = await getTracksAsync({
  first: 50,
  sortBy: ['artist', true],
  directory: '/Music/Favorites'
});
```

### `getAlbumsAsync(options?)`

从设备的音乐库中检索专辑。

#### 参数

- `options`（可选）：`AlbumOptions` - 查询的配置选项

#### 返回值

`Promise<AlbumResult>`，包含：

- `items`：`Album` 对象数组
- `hasNextPage`：布尔值，指示是否有更多专辑可用
- `endCursor`：用于分页的字符串游标
- `totalCount`：专辑总数（可选）

#### 示例

```js
import { getAlbumsAsync } from '@nodefinity/react-native-music-library';

// 获取所有专辑
const result = await getAlbumsAsync();

// 获取专辑并排序
const albums = await getAlbumsAsync({
  first: 30,
  sortBy: ['trackCount', false] // 按曲目数降序排序
});
```

### `getArtistsAsync(options?)`

从设备的音乐库中检索艺术家。

#### 参数

- `options`（可选）：`ArtistOptions` - 查询的配置选项

#### 返回值

`Promise<ArtistResult>`，包含：

- `items`：`Artist` 对象数组
- `hasNextPage`：布尔值，指示是否有更多艺术家可用
- `endCursor`：用于分页的字符串游标
- `totalCount`：艺术家总数（可选）

#### 示例

```js
import { getArtistsAsync } from '@nodefinity/react-native-music-library';

// 获取所有艺术家
const result = await getArtistsAsync();

// 获取艺术家并排序
const artists = await getArtistsAsync({
  first: 20,
  sortBy: ['trackCount', false] // 按曲目数降序排序
});
```

### `getTrackMetadataAsync(trackId)`

检索特定曲目的详细元数据。

#### 参数

- `trackId`：string - 要获取元数据的曲目 ID

#### 返回值

`Promise<TrackMetadata>`，包含详细的音频和标签信息。

#### 示例

```js
import { getTrackMetadataAsync } from '@nodefinity/react-native-music-library';

const metadata = await getTrackMetadataAsync('track-id-123');
console.log('歌词:', metadata.lyrics);
console.log('比特率:', metadata.bitrate);
```

### `getTracksByAlbumAsync(albumId)`

检索特定专辑的所有曲目。

#### 参数

- `albumId`：string - 专辑 ID

#### 返回值

`Promise<Track[]>`，包含曲目对象数组。

#### 示例

```js
import { getTracksByAlbumAsync } from '@nodefinity/react-native-music-library';

const tracks = await getTracksByAlbumAsync('album-id-123');
```

### `getTracksByArtistAsync(artistId, options?)`

检索特定艺术家的所有曲目。

#### 参数

- `artistId`：string - 艺术家 ID
- `options`（可选）：`TrackOptions` - 查询的配置选项

#### 返回值

`Promise<TrackResult>`，包含艺术家曲目的 `TrackResult`。

#### 示例

```js
import { getTracksByArtistAsync } from '@nodefinity/react-native-music-library';

const tracks = await getTracksByArtistAsync('artist-id-123', {
  first: 100,
  sortBy: ['album', true]
});
```

### `getAlbumsByArtistAsync(artistId)`

检索特定艺术家的所有专辑。

#### 参数

- `artistId`：string - 艺术家 ID

#### 返回值

`Promise<Album[]>`，包含专辑对象数组。

#### 示例

```js
import { getAlbumsByArtistAsync } from '@nodefinity/react-native-music-library';

const albums = await getAlbumsByArtistAsync('artist-id-123');
```

## 类型定义

### `TrackOptions`

```typescript
interface TrackOptions {
  after?: string;          // 分页游标
  first?: number;          // 最大返回项目数（默认：20）
  sortBy?: SortByValue<TrackSortByKey> | SortByValue<TrackSortByKey>[];
  directory?: string;      // 搜索目录路径
}
```

### `AlbumOptions`

```typescript
interface AlbumOptions {
  after?: string;          // 分页游标
  first?: number;          // 最大返回项目数（默认：20）
  sortBy?: SortByValue<AlbumSortByKey> | SortByValue<AlbumSortByKey>[];
}
```

### `ArtistOptions`

```typescript
interface ArtistOptions {
  after?: string;          // 分页游标
  first?: number;          // 最大返回项目数（默认：20）
  sortBy?: SortByValue<ArtistSortByKey> | SortByValue<ArtistSortByKey>[];
}
```

### `Track`

```typescript
interface Track {
  id: string;
  title: string;          // 曲目标题
  artist: string;         // 艺术家名称
  artwork: string;        // 封面文件 URI
  album: string;          // 专辑名称
  duration: number;       // 时长（秒）
  url: string;            // 文件 URL 或路径
  createdAt: number;      // 添加日期（Unix 时间戳）
  modifiedAt: number;     // 修改日期（Unix 时间戳）
  fileSize: number;       // 文件大小（字节）
}
```

### `Album`

```typescript
interface Album {
  id: string;
  title: string;          // 专辑名称
  artist: string;         // 主要艺术家
  artwork?: string;       // 专辑封面 URI
  trackCount: number;     // 曲目数量
  year?: number;          // 发行年份
}
```

### `Artist`

```typescript
interface Artist {
  id: string;
  title: string;          // 艺术家名称
  albumCount: number;     // 专辑数量
  trackCount: number;     // 总曲目数
}
```

### `TrackMetadata`

```typescript
interface TrackMetadata {
  id: string;              // 曲目 ID

  // 音频头信息
  duration: number;       // 时长（秒）
  bitrate: number;        // 比特率（kbps）
  sampleRate: number;     // 采样率（Hz）
  channels: number;       // 声道数
  format: string;         // 音频格式

  // 标签信息
  title: string;          // 曲目标题
  artist: string;         // 艺术家名称
  album: string;          // 专辑名称
  year: number;           // 发行年份
  genre: string;          // 音乐流派
  track: number;          // 曲目编号
  disc: number;           // 碟片编号
  composer: string;       // 作曲家
  lyricist: string;       // 作词家
  lyrics: string;         // 歌词内容
  albumArtist: string;    // 专辑艺术家
  comment: string;        // 注释
}
```

## 排序选项

### 曲目排序键

- `'default'` - 默认排序（标题）
- `'title'` - 按曲目标题排序
- `'artist'` - 按艺术家名称排序
- `'album'` - 按专辑名称排序
- `'duration'` - 按时长排序
- `'createdAt'` - 按创建日期排序
- `'modifiedAt'` - 按修改日期排序
- `'fileSize'` - 按文件大小排序

### 专辑排序键

- `'default'` - 默认排序（标题）
- `'title'` - 按专辑标题排序
- `'artist'` - 按艺术家名称排序
- `'trackCount'` - 按曲目数量排序
- `'year'` - 按发行年份排序

### 艺术家排序键

- `'default'` - 默认排序（标题）
- `'title'` - 按艺术家名称排序
- `'trackCount'` - 按曲目数量排序
- `'albumCount'` - 按专辑数量排序

### 排序示例

```js
// 单个排序键（默认降序）
sortBy: 'artist'

// 单个排序键带方向
sortBy: ['artist', true]  // 升序
sortBy: ['artist', false] // 降序

// 多个排序条件
sortBy: [
  ['artist', true],
  ['album', true],
  'duration'
]
```
