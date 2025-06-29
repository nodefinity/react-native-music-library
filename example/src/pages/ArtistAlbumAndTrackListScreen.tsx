import { useState, useEffect, useCallback } from 'react';
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
import {
  getAlbumsByArtistAsync,
  getTracksByArtistAsync,
} from '@nodefinity/react-native-music-library';
import type { Album, Track } from '@nodefinity/react-native-music-library';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';
import TrackItem from '../components/TrackItem';
import { usePlayer } from '../contexts/PlayerContext';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'ArtistAlbumAndTrackList'
>;

type SectionData = {
  type: 'albums' | 'tracks';
  title: string;
  data: (Album | Track)[];
};

export default function ArtistAlbumAndTrackListScreen({
  route,
  navigation,
}: Props) {
  const { artist } = route.params;
  const [sections, setSections] = useState<SectionData[]>([]);
  const [loading, setLoading] = useState(false);
  const { setPlaylist } = usePlayer();

  const loadArtistData = useCallback(async () => {
    try {
      setLoading(true);

      // Load albums and tracks in parallel
      const [albums, tracksResult] = await Promise.all([
        getAlbumsByArtistAsync(artist.id),
        getTracksByArtistAsync(artist.id, { first: 50 }), // Load first 50 tracks
      ]);

      const newSections: SectionData[] = [];

      // Add albums section if there are albums
      if (albums.length > 0) {
        newSections.push({
          type: 'albums',
          title: `Albums (${albums.length})`,
          data: albums,
        });
      }

      // Add tracks section if there are tracks
      if (tracksResult.items.length > 0) {
        newSections.push({
          type: 'tracks',
          title: `Tracks (${tracksResult.totalCount || tracksResult.items.length})`,
          data: tracksResult.items,
        });
      }

      setSections(newSections);
    } catch (error) {
      console.error('Failed to load artist data:', error);
      Alert.alert('Error', 'Failed to load artist data');
    } finally {
      setLoading(false);
    }
  }, [artist.id]);

  useEffect(() => {
    loadArtistData();
  }, [loadArtistData]);

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

  const handleTrackPress = (track: Track) => {
    try {
      console.log('Playing track:', track.title);
      setPlaylist([track]);
    } catch (error) {
      console.error('Failed to play track:', error);
      Alert.alert('Error', 'Failed to play track');
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

  const renderTrack = ({ item }: { item: Track }) => (
    <TrackItem track={item} onPress={() => handleTrackPress(item)} />
  );

  const renderSectionHeader = ({ section }: { section: SectionData }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
    </View>
  );

  const renderItem = ({
    item,
    section,
  }: {
    item: Album | Track;
    section: SectionData;
  }) => {
    if (section.type === 'albums') {
      return renderAlbum({ item: item as Album });
    } else {
      return renderTrack({ item: item as Track });
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading artist data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.artistName}>{artist.title}</Text>
        <Text style={styles.artistStats}>
          {artist.albumCount} albums • {artist.trackCount} tracks
        </Text>
      </View>

      {sections.length > 0 ? (
        <FlatList
          data={sections}
          renderItem={({ item: section }) => (
            <View>
              {renderSectionHeader({ section })}
              <FlatList
                data={section.data}
                renderItem={({ item }) => renderItem({ item, section })}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
              />
            </View>
          )}
          keyExtractor={(item) => item.type}
          style={styles.list}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No data found</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  artistName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  artistStats: {
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
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#f5f5f5',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  albumItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    marginHorizontal: 20,
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
