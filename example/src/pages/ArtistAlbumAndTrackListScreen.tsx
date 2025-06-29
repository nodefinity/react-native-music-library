import { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { getAlbumsByArtistAsync } from '@nodefinity/react-native-music-library';
import type { Album } from '@nodefinity/react-native-music-library';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'ArtistAlbumAndTrackList'
>;

export default function ArtistAlbumAndTrackListScreen({
  route,
  navigation,
}: Props) {
  const { artist } = route.params;
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load artist albums when component mounts
    setLoading(true);
    getAlbumsByArtistAsync(artist.id)
      .then((artistAlbums) => {
        setAlbums(artistAlbums);
      })
      .catch((error) => {
        console.error('Failed to load artist albums:', error);
        Alert.alert('Error', 'Failed to load artist albums');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [artist.id]);

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
        <Text style={styles.albumDetails}>
          {item.trackCount} tracks
          {item.year && ` • ${item.year}`}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading albums...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.artistName}>{artist.title}</Text>
        <Text style={styles.albumCount}>
          {albums.length} album{albums.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <Text style={styles.title}>Albums</Text>

      {albums.length > 0 ? (
        <FlatList
          data={albums}
          renderItem={renderAlbum}
          keyExtractor={(item) => item.id}
          style={styles.list}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No albums found</Text>
        </View>
      )}

      <Text style={styles.title}>Tracks</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  artistName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  albumCount: {
    fontSize: 16,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
  },
  albumItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  albumArtwork: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  albumInfo: {
    flex: 1,
  },
  albumTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  albumDetails: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});
