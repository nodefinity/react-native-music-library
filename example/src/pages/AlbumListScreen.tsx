import { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Button,
} from 'react-native';
import { getAlbumsAsync } from '@nodefinity/react-native-music-library';
import type {
  Album,
  AlbumOptions,
} from '@nodefinity/react-native-music-library';
import { usePermission } from '../hooks/usePermission';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'AlbumList'>;

export default function AlbumListScreen({ navigation }: Props) {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(false);
  const { permissionStatus, requestPermissions } = usePermission();

  const getAllAlbums = async () => {
    try {
      if (!permissionStatus?.granted) {
        const result = await requestPermissions();
        if (!result.granted) {
          Alert.alert(
            'Error',
            'Can not request permission again, please grant audio permission manually'
          );
          return;
        }
      }

      setLoading(true);
      const startTime = Date.now();
      const results = await loadAllAlbums();
      const endTime = Date.now();

      setAlbums(results);
      Alert.alert(
        'Success',
        `Found ${results.length} albums in ${endTime - startTime}ms`
      );
    } catch (e) {
      console.error(e, 'error');
      Alert.alert('Error', 'Failed to fetch albums');
    } finally {
      setLoading(false);
    }
  };

  const loadAllAlbums = async (options: AlbumOptions = {}) => {
    let allAlbums: Album[] = [];
    let hasMore = true;
    let cursor;

    while (hasMore) {
      const result = await getAlbumsAsync({
        first: 100,
        ...options,
        after: cursor,
        sortBy: ['title', true],
      });

      allAlbums = [...allAlbums, ...result.items];
      hasMore = result.hasNextPage;
      cursor = result.endCursor;
    }

    return allAlbums;
  };

  const handleAlbumPress = async (album: Album) => {
    try {
      console.log('Loading album tracks for:', album.title);

      // Navigate to album track list with only album info
      navigation.navigate('AlbumTrackList', {
        album: album,
      });
    } catch (error) {
      console.error('Failed to load album tracks:', error);
      Alert.alert('Error', 'Failed to load album tracks');
    }
  };

  const renderAlbum = ({ item }: { item: Album }) => (
    <TouchableOpacity
      style={styles.albumItem}
      onPress={() => handleAlbumPress(item)}
    >
      <Image
        source={
          item.artwork
            ? { uri: item.artwork }
            : require('../assets/default_artwork.png')
        }
        style={styles.albumArtwork}
        defaultSource={require('../assets/default_artwork.png')}
      />
      <View style={styles.albumInfo}>
        <Text style={styles.albumTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.albumArtist} numberOfLines={1}>
          {item.artist}
        </Text>
        <Text style={styles.albumDetails}>
          {item.trackCount} tracks
          {item.year && ` • ${item.year}`}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>React Native Music Library</Text>
      <View style={styles.buttonContainer}>
        <Button
          title={`${loading ? 'loading...' : ''} get all albums`}
          onPress={getAllAlbums}
          disabled={loading}
        />
      </View>

      {albums.length > 0 && (
        <FlatList
          data={albums}
          renderItem={renderAlbum}
          keyExtractor={(item) => item.id}
          style={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 10,
  },
  list: {
    flex: 1,
    width: '100%',
    marginTop: 20,
  },
  albumItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    marginVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  albumArtwork: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  albumInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  albumTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  albumArtist: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  albumDetails: {
    fontSize: 12,
    color: '#8E8E93',
  },
});
