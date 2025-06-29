import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import type { Track } from '@nodefinity/react-native-music-library';

interface TrackItemProps {
  track: Track;
  onPress: (track: Track) => void;
}

export default function TrackItem({ track, onPress }: TrackItemProps) {
  const formatDuration = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <TouchableOpacity style={styles.trackItem} onPress={() => onPress(track)}>
      <Image
        source={
          track.artwork
            ? {
                uri: track.artwork,
              }
            : require('../assets/default_artwork.png')
        }
        style={styles.cover}
        defaultSource={require('../assets/default_artwork.png')}
      />
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle} numberOfLines={1}>
          {track.title}
        </Text>
        <Text style={styles.trackArtist} numberOfLines={1}>
          {track.artist} - {track.album}
        </Text>
      </View>
      <Text style={styles.duration}>{formatDuration(track.duration)}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
