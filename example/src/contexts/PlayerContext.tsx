import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Track } from '../../../src/NativeMusicLibrary';
import type { AudioProTrack } from 'react-native-audio-pro';
import { AudioPro } from 'react-native-audio-pro';

export function toAudioProTrack(track: Track): AudioProTrack {
  return {
    ...track,
    url: track.contentUri ?? track.url,
    artwork: track.artwork ?? require('../assets/default_artwork.png'),
    artist: track.artist ?? '',
    album: track.album ?? '',
  } as unknown as AudioProTrack;
}

interface PlayerContextType {
  playlist: Track[];
  setPlaylist: (tracks: Track[]) => void;
  playNext: () => void;
  playPrevious: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [playlist, setPlaylist] = useState<Track[]>([]);

  const playNext = useCallback(() => {
    if (playlist.length === 0) return;
    const currentTrack = AudioPro.getPlayingTrack();
    const currentIndex = playlist.findIndex(
      (track) => track.id === currentTrack?.id
    );
    const nextIndex = (currentIndex + 1) % playlist.length;
    const nextTrack = playlist[nextIndex];
    if (nextTrack) {
      AudioPro.play(toAudioProTrack(nextTrack));
    }
  }, [playlist]);

  const playPrevious = useCallback(() => {
    if (playlist.length === 0) return;
    const currentTrack = AudioPro.getPlayingTrack();
    const currentIndex = playlist.findIndex(
      (track) => track.id === currentTrack?.id
    );
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    const prevTrack = playlist[prevIndex];
    if (prevTrack) {
      AudioPro.play(toAudioProTrack(prevTrack));
    }
  }, [playlist]);

  return (
    <PlayerContext.Provider
      value={{
        playlist,
        setPlaylist,
        playNext,
        playPrevious,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}
