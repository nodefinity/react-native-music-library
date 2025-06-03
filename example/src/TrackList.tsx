import {
  Alert,
  Button,
  View,
  FlatList,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import { globalStyles } from './styles';
import { getTracksAsync } from 'react-native-music-library';
import { useState } from 'react';
import type { Track } from '../../src/NativeMusicLibrary';

export default function TrackList() {
  const [tracks, setTracks] = useState<Track[]>([]);

  const getAllTracks = async () => {
    try {
      const results = await getTracksAsync();
      setTracks(results.items);
    } catch (e) {
      console.error(e, 'error');
      Alert.alert('Error', 'Failed to fetch tracks');
    }
  };

  const formatDuration = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${minutes}:${seconds.toString()}`;
  };

  const renderItem = ({ item }: { item: Track }) => (
    <View style={styles.trackItem}>
      <Image source={{ uri: item.cover }} style={styles.cover} />
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

  return (
    <>
      <View style={globalStyles.buttonContainer}>
        <View style={globalStyles.buttonSpacer} />
        <Button title="get the first 20 tracks" onPress={getAllTracks} />
      </View>

      {tracks.length && (
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
