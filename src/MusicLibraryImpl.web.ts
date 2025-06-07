import type {
  MusicLibraryModule,
  TrackResult,
  AlbumResult,
  ArtistResult,
  GenreResult,
} from './types';

const showWebWarning = () => {
  if (__DEV__) {
    console.warn(
      'MusicLibrary: This library is not supported on web platform. ' +
        'Music library access is only available on iOS and Android.'
    );
  }
};

// Web fallback implementation
const MusicLibrary: MusicLibraryModule = {
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
};

export default MusicLibrary;
