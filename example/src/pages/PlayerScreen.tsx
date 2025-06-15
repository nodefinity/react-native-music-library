import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { AudioPro, useAudioPro, AudioProState } from 'react-native-audio-pro';
import { usePlayer } from '../contexts/PlayerContext';
import { useEffect, useState } from 'react';
import Slider from '@react-native-community/slider';
import LyricsView from '../components/LyricsView';

export default function PlayerScreen() {
  const {
    state: audioProState,
    playingTrack: audioProPlayingTrack,
    position,
    duration,
  } = useAudioPro();
  const { playNext, playPrevious } = usePlayer();
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (position !== undefined) {
      setCurrentTime(position);
    }
  }, [position]);

  const handlePlay = () => {
    if (!audioProPlayingTrack) return;
    AudioPro.play(audioProPlayingTrack, { autoPlay: true });
  };

  const handlePause = () => {
    AudioPro.pause();
  };

  const handlePrevious = () => {
    playPrevious();
  };

  const handleNext = () => {
    playNext();
  };

  const handleSeek = (value: number) => {
    AudioPro.seekTo(value);
    setCurrentTime(value);
  };

  const handleLyricPress = (time: number) => {
    AudioPro.seekTo(time);
    setCurrentTime(time);
  };

  const formatTime = (milliseconds: number) => {
    if (!milliseconds) return '0:00';
    const seconds = Math.floor(milliseconds / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!audioProPlayingTrack) return null;

  return (
    <View style={styles.container}>
      <Image
        source={
          audioProPlayingTrack.artwork
            ? { uri: audioProPlayingTrack.artwork.toString() }
            : require('../assets/default_artwork.png')
        }
        style={styles.artwork}
        defaultSource={require('../assets/default_artwork.png')}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{audioProPlayingTrack.title}</Text>
        <Text style={styles.artist}>{audioProPlayingTrack.artist}</Text>
        <Text style={styles.album}>{audioProPlayingTrack.album}</Text>
      </View>

      <LyricsView
        lyrics={audioProPlayingTrack.lyrics as string}
        currentTime={currentTime}
        onLyricPress={handleLyricPress}
      />

      <View style={styles.progressContainer}>
        <Slider
          style={styles.progressBar}
          minimumValue={0}
          maximumValue={duration || 0}
          value={currentTime}
          onSlidingComplete={handleSeek}
          minimumTrackTintColor="#007AFF"
          maximumTrackTintColor="#E0E0E0"
          thumbTintColor="#007AFF"
        />
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={handlePrevious}>
          <Text style={styles.controlButtonText}>Prev</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.controlButton,
            audioProState === AudioProState.PLAYING
              ? styles.pauseButton
              : styles.playButton,
          ]}
          onPress={
            audioProState === AudioProState.PLAYING ? handlePause : handlePlay
          }
        >
          <Text
            style={[
              styles.controlButtonText,
              audioProState === AudioProState.PLAYING
                ? styles.pauseButtonText
                : styles.playButtonText,
            ]}
          >
            {audioProState === AudioProState.PLAYING ? 'Pause' : 'Play'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={handleNext}>
          <Text style={styles.controlButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  artwork: {
    width: 260,
    height: 260,
    borderRadius: 10,
    marginBottom: 30,
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  artist: {
    fontSize: 18,
    color: '#666',
    marginBottom: 4,
  },
  album: {
    fontSize: 16,
    color: '#999',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  controlButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    marginHorizontal: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  playButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
  },
  pauseButton: {
    backgroundColor: '#4A4A4A',
    paddingHorizontal: 30,
  },
  controlButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  playButtonText: {
    color: '#FFFFFF',
  },
  pauseButtonText: {
    color: '#FFFFFF',
  },
  progressContainer: {
    width: '100%',
    marginBottom: 20,
  },
  progressBar: {
    width: '100%',
    height: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  timeText: {
    fontSize: 12,
    color: '#666',
  },
});
