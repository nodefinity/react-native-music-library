import type {
  Spec,
  TrackResult,
  AlbumResult,
  ArtistResult,
  GenreResult,
  TrackMetadata,
} from './NativeMusicLibrary';

const showWebWarning = () => {
  if (__DEV__) {
    console.warn(
      'MusicLibrary: This library is not supported on web platform. ' +
        'Music library access is only available on iOS and Android.'
    );
  }
};

// Web fallback implementation
const MusicLibrary: Spec = {
  async getTracksAsync(): Promise<TrackResult> {
    showWebWarning();
    return {
      items: [],
      hasNextPage: false,
      endCursor: undefined,
      totalCount: 0,
    };
  },

  async getAlbumsAsync(): Promise<AlbumResult> {
    showWebWarning();
    return {
      items: [],
      hasNextPage: false,
      endCursor: undefined,
      totalCount: 0,
    };
  },

  async getArtistsAsync(): Promise<ArtistResult> {
    showWebWarning();
    return {
      items: [],
      hasNextPage: false,
      endCursor: undefined,
      totalCount: 0,
    };
  },

  async getGenresAsync(): Promise<GenreResult> {
    showWebWarning();
    return {
      items: [],
      hasNextPage: false,
      endCursor: undefined,
      totalCount: 0,
    };
  },

  async getTrackMetadataAsync(trackId: string): Promise<TrackMetadata> {
    showWebWarning();
    return {
      id: trackId,
      duration: 0,
      bitrate: 0,
      sampleRate: 0,
      channels: 0,
      format: '',
      title: '',
      artist: '',
      album: '',
      year: 0,
      genre: '',
      track: 0,
      disc: 0,
      composer: '',
      lyricist: '',
      lyrics: '',
      albumArtist: '',
      comment: '',
    };
  },
};

export default MusicLibrary;
