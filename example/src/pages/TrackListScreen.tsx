import { Alert, Button, View, FlatList, Text, StyleSheet } from 'react-native';
import { getTracksAsync } from '@nodefinity/react-native-music-library';
import { useState } from 'react';
import type {
  TrackOptions,
  Track,
} from '@nodefinity/react-native-music-library';
import { usePermission } from '../hooks/usePermission';
import { pickDirectory } from '@react-native-documents/picker';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePlayer } from '../contexts/PlayerContext';
import { AudioPro, type AudioProTrack } from 'react-native-audio-pro';
import TrackItem from '../components/TrackItem';

type Props = NativeStackScreenProps<RootStackParamList, 'TrackList'>;

export default function TrackListScreen({ navigation }: Props) {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const { permissionStatus, requestPermissions } = usePermission();
  const { setPlaylist } = usePlayer();

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

  const loadAllTracks = async (options: TrackOptions = {}) => {
    let allTracks: Track[] = [];
    let hasMore = true;
    let cursor;

    while (hasMore) {
      const result = await getTracksAsync({
        first: 100,
        ...options,
        after: cursor,
        sortBy: ['title', true],
      });

      allTracks = [...allTracks, ...result.items];
      hasMore = result.hasNextPage;
      cursor = result.endCursor;
    }

    return allTracks;
  };

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

  const handleTrackPress = (track: Track) => {
    setPlaylist(tracks);
    AudioPro.play(track as unknown as AudioProTrack);
    console.log('Playing track:', track.title);
    navigation.navigate('Player');
  };

  const renderItem = ({ item }: { item: Track }) => (
    <TrackItem track={item} onPress={handleTrackPress} />
  );

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
});
