import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';
import {
  getTracksByAlbumAsync,
  type Track,
} from '@nodefinity/react-native-music-library';
import TrackItem from '../components/TrackItem';
import { usePlayer } from '../contexts/PlayerContext';
import { AudioPro, type AudioProTrack } from 'react-native-audio-pro';
import { useEffect, useState } from 'react';

type Props = NativeStackScreenProps<RootStackParamList, 'AlbumTrackList'>;

export default function AlbumTrackListScreen({ navigation, route }: Props) {
  const { album } = route.params;
  const { setPlaylist } = usePlayer();

  const [albumTracks, setAlbumTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load album tracks when component mounts
    setLoading(true);
    getTracksByAlbumAsync(album.id)
      .then((tracks) => {
        setAlbumTracks(tracks);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [album.id]);

  const handleTrackPress = (track: Track) => {
    setPlaylist(albumTracks);
    AudioPro.play(track as unknown as AudioProTrack);
    console.log('Playing track:', track.title);
    navigation.navigate('Player');
  };

  const renderItem = ({ item }: { item: Track }) => (
    <TrackItem track={item} onPress={handleTrackPress} />
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.albumTitle}>{album.title}</Text>
          <Text style={styles.albumArtist}>{album.artist}</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading tracks...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.albumTitle}>{album.title}</Text>
        <Text style={styles.albumArtist}>{album.artist}</Text>
        <Text style={styles.trackCount}>
          {albumTracks.length} {albumTracks.length === 1 ? 'track' : 'tracks'}
        </Text>
      </View>

      <FlatList
        data={albumTracks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  albumTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  albumArtist: {
    fontSize: 18,
    color: '#666',
    marginBottom: 4,
  },
  trackCount: {
    fontSize: 14,
    color: '#999',
  },
  list: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
});
