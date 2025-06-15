import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Track } from '../../../src/NativeMusicLibrary';
import type { AudioProTrack } from 'react-native-audio-pro';
import { AudioPro } from 'react-native-audio-pro';

interface PlayerContextType {
  playlist: Track[];
  setPlaylist: (tracks: Track[]) => void;
  playingTrack: Track | null;
  setPlayingTrack: (track: Track) => void;
  playNext: () => void;
  playPrevious: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [playingTrack, setPlayingTrack] = useState<Track | null>(null);

  const playNext = useCallback(() => {
    if (!playingTrack || playlist.length === 0) return;
    const currentIndex = playlist.findIndex(
      (track) => track.id === playingTrack.id
    );
    const nextIndex = (currentIndex + 1) % playlist.length;
    const nextTrack = playlist[nextIndex];
    if (nextTrack) {
      AudioPro.play(nextTrack as unknown as AudioProTrack);
      setPlayingTrack(nextTrack);
    }
  }, [playingTrack, playlist]);

  const playPrevious = useCallback(() => {
    if (!playingTrack || playlist.length === 0) return;
    const currentIndex = playlist.findIndex(
      (track) => track.id === playingTrack.id
    );
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    const prevTrack = playlist[prevIndex];
    if (prevTrack) {
      AudioPro.play(prevTrack as unknown as AudioProTrack);
      setPlayingTrack(prevTrack);
    }
  }, [playingTrack, playlist]);

  return (
    <PlayerContext.Provider
      value={{
        playlist,
        setPlaylist,
        playNext,
        playPrevious,
        playingTrack,
        setPlayingTrack,
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
