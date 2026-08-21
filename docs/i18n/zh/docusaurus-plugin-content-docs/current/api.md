---
sidebar_position: 3
title: API 参考
description: 查询曲目、专辑、艺术家、封面、歌词、音频元数据、排序、过滤和游标分页的 API 参考。
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
  directory: '/Music/Favorites',
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
  sortBy: ['trackCount', false], // 按曲目数降序排序
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
  sortBy: ['trackCount', false], // 按曲目数降序排序
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
  sortBy: ['album', true],
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
  after?: string; // 上一页返回的实体 ID 游标
  first?: number; // 返回 1–1000 项（默认：20）
  sortBy?: SortByValue<TrackSortByKey> | SortByValue<TrackSortByKey>[];
  directory?: string; // 旧路径或受支持的 Android SAF 树 URI
}
```

### `AlbumOptions`

```typescript
interface AlbumOptions {
  after?: string; // 上一页返回的实体 ID 游标
  first?: number; // 返回 1–1000 项（默认：20）
  sortBy?: SortByValue<AlbumSortByKey> | SortByValue<AlbumSortByKey>[];
}
```

### `ArtistOptions`

```typescript
interface ArtistOptions {
  after?: string; // 上一页返回的实体 ID 游标
  first?: number; // 返回 1–1000 项（默认：20）
  sortBy?: SortByValue<ArtistSortByKey> | SortByValue<ArtistSortByKey>[];
}
```

游标是上一页最后一个实体的 ID，必须与生成它时的实体类型、筛选条件和
规范化排序一起复用。格式错误的游标会以 `INVALID_CURSOR` 拒绝；格式正确但
不在当前查询结果中的 ID 会以 `CURSOR_NOT_FOUND` 拒绝。游标指向最后一个实体
时，返回不含 `endCursor` 的正常空白终止页。

### `Track`

```typescript
interface Track {
  id: string;
  title: string; // 曲目标题
  artist: string | null; // 艺术家名称，缺失时为 null
  artwork: string | null; // 封面引用，缺失时为 null
  album: string | null; // 专辑名称，缺失时为 null
  duration: number; // 时长（秒）
  url: string; // 可播放的资源 URI
  contentUri?: string | null; // Android MediaStore 规范 URI
  createdAt: number | null; // 添加日期（Unix 秒），缺失时为 null
  modifiedAt: number | null; // 资源修改时间；iOS 上为 null
  fileSize: number; // 文件大小（字节）
}
```

#### Android 曲目资源兼容策略

Android 播放或资源访问应优先使用 `contentUri`。为保持兼容，MediaStore 能提供
旧文件路径时，`url` 仍是 `file://` URI；不能提供时，`url` 回退为同一个
`contentUri`。内嵌曲目元数据通过 `ContentResolver` 读取，并用临时文件适配
只接受文件的标签解析器。

绝对 `directory` 路径保留原有的 `DATA` 筛选。Android 10 及以上支持来自
`com.android.externalstorage.documents` 的 SAF 树 URI，并按 MediaStore 卷和
相对路径筛选，包括已挂载的可移动存储。其他 provider，或 Android 10 以前的
SAF 树筛选，会以 `UNSUPPORTED_DIRECTORY_URI` 拒绝。

### `Album`

```typescript
interface Album {
  id: string;
  title: string; // 专辑名称
  artist: string; // 主要艺术家
  artwork: string | null; // 专辑封面引用，缺失时为 null
  trackCount: number; // 曲目数量
  year: number | null; // 发行年份，缺失时为 null
}
```

### `Artist`

```typescript
interface Artist {
  id: string;
  title: string; // 艺术家名称
  albumCount: number; // 专辑数量
  trackCount: number; // 总曲目数
}
```

### `TrackMetadata`

```typescript
interface TrackMetadata {
  id: string; // 曲目 ID

  // 音频头信息
  duration: number | null; // 时长（秒），缺失时为 null
  bitrate: number | null; // 比特率（kbps），缺失时为 null
  sampleRate: number | null; // 采样率（Hz），缺失时为 null
  channels: string | null; // 声道数，缺失时为 null
  format: string | null; // 音频格式，缺失时为 null

  // 标签信息
  title: string | null; // 曲目标题，缺失时为 null
  artist: string | null; // 艺术家名称，缺失时为 null
  album: string | null; // 专辑名称，缺失时为 null
  year: number | null; // 发行年份，缺失时为 null
  genre: string | null; // 音乐流派，缺失时为 null
  track: number | null; // 曲目编号，缺失时为 null
  disc: number | null; // 碟片编号，缺失时为 null
  composer: string | null; // 作曲家，缺失时为 null
  lyricist: string | null; // 作词家，缺失时为 null
  lyrics: string | null; // 歌词内容，缺失时为 null
  albumArtist: string | null; // 专辑艺术家，缺失时为 null
  comment: string | null; // 注释，缺失时为 null
}
```

## 返回值与错误契约

实体和曲目元数据中的可空字段始终存在；无可用值时返回 `null`。结构性的可选
字段则会省略：`contentUri` 仅 Android 返回，分页终止页不含 `endCursor`。
内嵌元数据不存在或无法读取时，`getTrackMetadataAsync` 仍会返回已有的音乐库
元数据，其余字段为 `null`。

原生失败会拒绝 Promise，并返回带稳定 `code` 的 `MusicLibraryError`：

| Code                        | 含义                                         |
| --------------------------- | -------------------------------------------- |
| `PERMISSION_DENIED`         | 未获得本地音乐库访问权限                     |
| `TRACK_NOT_FOUND`           | 请求的曲目已不存在                           |
| `QUERY_ERROR`               | 原生查询或资源读取失败                       |
| `INVALID_CURSOR`            | `after` 不是合法的实体 ID 游标               |
| `CURSOR_NOT_FOUND`          | 游标格式合法，但不在当前查询结果中           |
| `INVALID_PAGE_SIZE`         | `first` 不在 `1`–`1000` 范围内               |
| `UNSUPPORTED_DIRECTORY_URI` | Android 无法将目录 URI 安全映射到 MediaStore |

## 排序选项

默认按标题升序。单独传入排序键时表示降序。多个排序条件按声明顺序进行
词典序比较，最后以实体 ID 升序打破平局。两个平台都提供对应字段时，缺失的
字符串或数值在升序中排在已有值之前。

### 曲目排序键

- `'default'` - 默认排序（标题）
- `'title'` - 按曲目标题排序
- `'artist'` - 按艺术家名称排序
- `'album'` - 按专辑名称排序
- `'duration'` - 按时长排序
- `'createdAt'` - 按创建日期排序
- `'modifiedAt'` - 按资源修改日期排序（Android；iOS 缺失值相等并回退到 ID）
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
sortBy: 'artist';

// 单个排序键带方向
sortBy: ['artist', true]; // 升序
sortBy: ['artist', false]; // 降序

// 多个排序条件
sortBy: [['artist', true], ['album', true], 'duration'];
```
