import {
  Alert,
  Button,
  View,
  FlatList,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import { getTracksAsync } from '@nodefinity/react-native-music-library';
import { useState } from 'react';
import type { AssetsOptions, Track } from '../../src/NativeMusicLibrary';
import { usePermission } from './usePermission';
import { pickDirectory } from '@react-native-documents/picker';

export default function TrackList() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const { permissionStatus, requestPermissions } = usePermission();

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
    <View style={styles.trackItem}>
      <Image source={{ uri: item.artwork }} style={styles.cover} />
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.trackArtist} numberOfLines={1}>
          {item.artist} - {item.album}
        </Text>
      </View>
      <Text style={styles.duration}>{formatDuration(item.duration)}</Text>
    </View>
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
      Alert.alert('Error', err as string);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
    </>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
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
