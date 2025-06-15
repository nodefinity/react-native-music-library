import {
  Alert,
  Button,
  View,
  FlatList,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { getTracksAsync } from '@nodefinity/react-native-music-library';
import { useState } from 'react';
import type {
  AssetsOptions,
  Track,
} from '@nodefinity/react-native-music-library';
import { usePermission } from '../hooks/usePermission';
import { pickDirectory } from '@react-native-documents/picker';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePlayer } from '../contexts/PlayerContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Index'>;

export default function IndexScreen({ navigation }: Props) {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const { permissionStatus, requestPermissions } = usePermission();
  const { setPlaylist, setPlayingTrack } = usePlayer();

  const getAllTracks = async () => {
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
      const results = await loadAllTracks();
      const endTime = Date.now();

      setTracks(results);
      Alert.alert(
        'Success',
        `Found ${results.length} tracks in ${endTime - startTime}ms`
      );
    } catch (e) {
      console.error(e, 'error');
      Alert.alert('Error', 'Failed to fetch tracks');
    } finally {
      setLoading(false);
    }
  };

  const loadAllTracks = async (options: AssetsOptions = {}) => {
    let allTracks: Track[] = [];
    let hasMore = true;
    let cursor;

    while (hasMore) {
      const result = await getTracksAsync({
        first: 100,
        ...options,
        after: cursor,
        sortBy: ['artist', true],
      });

      allTracks = [...allTracks, ...result.items];
      hasMore = result.hasNextPage;
      cursor = result.endCursor;
    }

    return allTracks;
  };

  const formatDuration = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${minutes}:${seconds.toString()}`;
  };

  const renderItem = ({ item }: { item: Track }) => (
    <TouchableOpacity
      style={styles.trackItem}
      onPress={() => {
        setPlaylist(tracks);
        setPlayingTrack(item);
        console.log('item', item);
        navigation.navigate('Player');
      }}
    >
      <Image
        source={
          item.artwork
            ? {
                uri: item.artwork,
              }
            : require('../assets/default_artwork.png')
        }
        style={styles.cover}
        defaultSource={require('../assets/default_artwork.png')}
      />
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.trackArtist} numberOfLines={1}>
          {item.artist} - {item.album}
        </Text>
      </View>
      <Text style={styles.duration}>{formatDuration(item.duration)}</Text>
    </TouchableOpacity>
  );

  const getTracksFromPickedDirectory = async () => {
    try {
      const { uri } = await pickDirectory({
        requestLongTermAccess: false,
      });

      if (!uri) return;

      const results = await loadAllTracks({ directory: uri });

      setTracks(results);

      Alert.alert('Success', `Picked ${results.length} tracks from:\n${uri}`);
    } catch (err) {
      console.log(err, 'error');
      Alert.alert('Error', 'Failed to get tracks from directory');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>React Native Music Library</Text>
      <View style={styles.buttonContainer}>
        <Button
          title={`${loading ? 'loading...' : ''} get all tracks`}
          onPress={getAllTracks}
          disabled={loading}
        />

        <Button
          title={`${loading ? 'loading...' : ''} get tracks from directory`}
          onPress={getTracksFromPickedDirectory}
          disabled={loading}
        />
      </View>

      {tracks.length > 0 && (
        <FlatList
          data={tracks}
          renderItem={renderItem}
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
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cover: {
    width: 50,
    height: 50,
    borderRadius: 4,
    marginRight: 12,
  },
  trackInfo: {
    flex: 1,
    marginRight: 8,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  trackArtist: {
    fontSize: 14,
    color: '#666',
  },
  duration: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
});
