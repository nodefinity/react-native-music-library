import type { AudioProEvent, AudioProTrack } from 'react-native-audio-pro';
import { useEffect } from 'react';
import {
  AudioPro,
  AudioProContentType,
  AudioProEventType,
} from 'react-native-audio-pro';
import { usePlayer } from '../contexts/PlayerContext';

let playList: AudioProTrack[] = [];

// setup audio pro outside react native lifecycle
export function setupAudioPro(): void {
  // Configure audio settings
  AudioPro.configure({
    contentType: AudioProContentType.MUSIC,
    debug: true,
    debugIncludesProgress: false,
    progressIntervalMs: 1000,
  });

  // Set up event listeners that persist for the app's lifetime
  AudioPro.addEventListener((event: AudioProEvent) => {
    switch (event.type) {
      case AudioProEventType.TRACK_ENDED:
        // Auto-play next track when current track ends
        const currentTrack = AudioPro.getPlayingTrack();
        if (currentTrack) {
          const currentIndex = playList.findIndex(
            (track) => track.id === currentTrack.id
          );
          const nextIndex = (currentIndex + 1) % playList.length;
          const nextTrack = playList[nextIndex];
          if (nextTrack) {
            AudioPro.play(nextTrack);
          }
        }
        break;

      case AudioProEventType.REMOTE_NEXT:
        // Handle next button press from lock screen/notification
        const nextTrack = AudioPro.getPlayingTrack();
        if (nextTrack) {
          AudioPro.play(nextTrack);
        }
        break;

      case AudioProEventType.REMOTE_PREV:
        // Handle previous button press from lock screen/notification
        const prevTrack = AudioPro.getPlayingTrack();
        if (prevTrack) {
          AudioPro.play(prevTrack);
        }
        break;

      case AudioProEventType.PLAYBACK_ERROR:
        console.warn('Playback error:', event.payload?.error);
        break;
    }
  });
}

// setup audio pro inside react native lifecycle
export function useSetupAudioPro(): void {
  const { playlist } = usePlayer();

  // Update playlist when it changes
  useEffect(() => {
    if (playlist.length > 0) {
      playList = playlist as unknown as AudioProTrack[];
    }
  }, [playlist]);
}

export function getProgressInterval(): number {
  return AudioPro.getProgressInterval()!;
}

export function setProgressInterval(ms: number): void {
  AudioPro.setProgressInterval(ms);
}
