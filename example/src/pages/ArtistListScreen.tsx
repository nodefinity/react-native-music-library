import { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Button,
} from 'react-native';
import { getArtistsAsync } from '@nodefinity/react-native-music-library';
import type {
  Artist,
  ArtistOptions,
} from '@nodefinity/react-native-music-library';
import { usePermission } from '../hooks/usePermission';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'ArtistList'>;

export default function ArtistListScreen({ navigation }: Props) {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(false);
  const { permissionStatus, requestPermissions } = usePermission();

  const getAllArtists = async () => {
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
      const results = await loadAllArtists();
      const endTime = Date.now();

      setArtists(results);
      Alert.alert(
        'Success',
        `Found ${results.length} artists in ${endTime - startTime}ms`
      );
    } catch (e) {
      console.error(e, 'error');
      Alert.alert('Error', 'Failed to fetch artists');
    } finally {
      setLoading(false);
    }
  };

  const loadAllArtists = async (options: ArtistOptions = {}) => {
    let allArtists: Artist[] = [];
    let hasMore = true;
    let cursor;

    while (hasMore) {
      const result = await getArtistsAsync({
        first: 100,
        ...options,
        after: cursor,
        sortBy: ['title', true],
      });

      allArtists = [...allArtists, ...result.items];
      hasMore = result.hasNextPage;
      cursor = result.endCursor;
    }

    return allArtists;
  };

  const handleArtistPress = async (artist: Artist) => {
    try {
      console.log('Artist selected:', artist.title);

      // Navigate to artist album and track list
      navigation.navigate('ArtistAlbumAndTrackList', {
        artist: artist,
      });
    } catch (error) {
      console.error('Failed to handle artist selection:', error);
      Alert.alert('Error', 'Failed to handle artist selection');
    }
  };

  const renderArtist = ({ item }: { item: Artist }) => (
    <TouchableOpacity
      style={styles.artistItem}
      onPress={() => handleArtistPress(item)}
    >
      <View style={styles.artistAvatar}>
        <Text style={styles.artistInitial}>
          {item.title.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.artistInfo}>
        <Text style={styles.artistName} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.artistDetails}>
          {item.albumCount} albums • {item.trackCount} tracks
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>React Native Music Library</Text>
      <View style={styles.buttonContainer}>
        <Button
          title={`${loading ? 'loading...' : ''} get all artists`}
          onPress={getAllArtists}
          disabled={loading}
        />
      </View>

      {artists.length > 0 && (
        <FlatList
          data={artists}
          renderItem={renderArtist}
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
  artistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    marginVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  artistAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  artistInitial: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  artistInfo: {
    flex: 1,
  },
  artistName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  artistDetails: {
    fontSize: 14,
    color: '#666',
  },
});
