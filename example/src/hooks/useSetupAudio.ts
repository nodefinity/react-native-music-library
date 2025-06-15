import type { AudioProEvent, AudioProTrack } from 'react-native-audio-pro';
import { useEffect } from 'react';
import {
  AudioPro,
  AudioProContentType,
  AudioProEventType,
} from 'react-native-audio-pro';
import { usePlayer } from '../contexts/PlayerContext';

type TrackCallback = () => {
  currentTrackId: string | null;
  playList: AudioProTrack[];
};

let getTrackStateCallback: TrackCallback | null = null;

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
    if (!getTrackStateCallback) return;

    switch (event.type) {
      case AudioProEventType.TRACK_ENDED:
        // Auto-play next track when current track ends
        playNextTrack(getTrackStateCallback);
        break;

      case AudioProEventType.REMOTE_NEXT:
        // Handle next button press from lock screen/notification
        playNextTrack(getTrackStateCallback);
        break;

      case AudioProEventType.REMOTE_PREV:
        // Handle previous button press from lock screen/notification
        playPreviousTrack(getTrackStateCallback);
        break;

      case AudioProEventType.PLAYBACK_ERROR:
        console.warn('Playback error:', event.payload?.error);
        break;
    }
  });
}

function playNextTrack(
  getTrackState: TrackCallback,
  autoPlay: boolean = true
): void {
  const { currentTrackId, playList } = getTrackState();

  if (playList.length === 0) return;

  const currentIndex = playList.findIndex(
    (track) => track.id === currentTrackId
  );
  const nextIndex = (currentIndex + 1) % playList.length;
  const nextTrack = playList[nextIndex];

  AudioPro.play(nextTrack!, { autoPlay });
}

function playPreviousTrack(
  getTrackState: TrackCallback,
  autoPlay: boolean = true
): void {
  const { currentTrackId, playList } = getTrackState();

  if (playList.length === 0) return;

  const currentIndex = playList.findIndex(
    (track) => track.id === currentTrackId
  );
  const prevIndex = currentIndex > 0 ? currentIndex - 1 : playList.length - 1;
  const prevTrack = playList[prevIndex];

  AudioPro.play(prevTrack!, { autoPlay });
}

// setup audio pro inside react native lifecycle
export function useSetupAudioPro(): void {
  const { playlist, playingTrack } = usePlayer();

  // Update the callback function
  useEffect(() => {
    getTrackStateCallback = () => ({
      currentTrackId: playingTrack?.id ?? null,
      playList: playlist as unknown as AudioProTrack[],
    });
  }, [playlist, playingTrack]);
}

export function getProgressInterval(): number {
  return AudioPro.getProgressInterval()!;
}

export function setProgressInterval(ms: number): void {
  AudioPro.setProgressInterval(ms);
}
