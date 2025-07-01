---
sidebar_position: 2
---

# 开始使用

学习如何在您的项目中设置和使用 React Native Music Library。

## 安装

```bash
npm install @nodefinity/react-native-music-library
# 或
yarn add @nodefinity/react-native-music-library
```

## 平台设置

### Android

1. **添加权限**到 `android/app/src/main/AndroidManifest.xml`：

```xml
<!-- Android 13+ 细粒度权限 -->
<uses-permission android:name="android.permission.READ_MEDIA_AUDIO" />
<!-- Android 12 及以下传统存储权限 -->
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

2. **请求运行时权限**使用权限库：

```js
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const requestMusicPermission = async () => {
  const result = await request(PERMISSIONS.ANDROID.READ_MEDIA_AUDIO);
  
  if (result === RESULTS.GRANTED) {
    console.log('音乐权限已授予');
  } else {
    console.log('音乐权限被拒绝');
  }
};
```

### iOS（即将推出）

iOS 实现尚未可用。为了未来兼容性，在 `Info.plist` 中添加：

```xml
<key>NSAppleMusicUsageDescription</key>
<string>此应用需要访问您的音乐库来播放歌曲</string>
```

## 基本用法

### 导入库

```js
import { 
  getTracksAsync, 
  getAlbumsAsync, 
  getArtistsAsync,
  getTrackMetadataAsync 
} from '@nodefinity/react-native-music-library';
```

### 获取所有曲目

```js
const loadTracks = async () => {
  try {
    const result = await getTracksAsync();
    
    result.items.forEach(track => {
      console.log(`${track.title} - ${track.artist}`);
      console.log(`时长: ${Math.floor(track.duration / 60)}:${track.duration % 60}`);
      console.log(`文件: ${track.url}`);
    });
  } catch (error) {
    console.error('加载曲目失败:', error);
  }
};
```

### 获取专辑

```js
const loadAlbums = async () => {
  try {
    const result = await getAlbumsAsync({
      sortBy: ['title', true], // 按标题升序排序
      first: 50
    });
    
    result.items.forEach(album => {
      console.log(`${album.title} - ${album.artist}`);
      console.log(`曲目数: ${album.trackCount}`);
    });
  } catch (error) {
    console.error('加载专辑失败:', error);
  }
};
```

### 获取艺术家

```js
const loadArtists = async () => {
  try {
    const result = await getArtistsAsync({
      sortBy: 'title' // 按名称排序
    });
    
    result.items.forEach(artist => {
      console.log(`${artist.title}`);
      console.log(`专辑数: ${artist.albumCount}, 曲目数: ${artist.trackCount}`);
    });
  } catch (error) {
    console.error('加载艺术家失败:', error);
  }
};
```

## 下一步

- [API 参考](./api) - 了解所有可用的方法和选项
- [示例](./examples) - 查看实际使用示例
- [类型定义](./api/types) - 理解数据结构
