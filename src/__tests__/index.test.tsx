import type { TrackSortByKey } from '../NativeMusicLibrary';
import MusicLibrary from '../NativeMusicLibrary';
import WebMusicLibrary from '../NativeMusicLibrary.web';
import {
  getAlbumsAsync,
  getAllAlbumsAsync,
  getAllArtistsAsync,
  getAllTracksAsync,
} from '../index';
import {
  getAlbumOptions,
  getArtistOptions,
  getTrackOptions,
  normalizeSortBy,
} from '../utils';

// Mock the native module
jest.mock('../NativeMusicLibrary', () => ({
  __esModule: true,
  default: {
    getTracksAsync: jest.fn(),
    getTrackMetadataAsync: jest.fn(),
    getTracksByAlbumAsync: jest.fn(),
    getTracksByArtistAsync: jest.fn(),
    getAlbumsAsync: jest.fn(),
    getAlbumsByArtistAsync: jest.fn(),
    getArtistsAsync: jest.fn(),
  },
  TrackSortByObject: {
    default: 'default',
    title: 'title',
    artist: 'artist',
    album: 'album',
    duration: 'duration',
    createdAt: 'createdAt',
    modifiedAt: 'modifiedAt',
    fileSize: 'fileSize',
  },
  AlbumSortByObject: {
    default: 'default',
    title: 'title',
    artist: 'artist',
    trackCount: 'trackCount',
    year: 'year',
  },
  ArtistSortByObject: {
    default: 'default',
    title: 'title',
    trackCount: 'trackCount',
    albumCount: 'albumCount',
  },
}));

const mockMusicLibrary = MusicLibrary as jest.Mocked<typeof MusicLibrary>;

describe('normalizeSortBy', () => {
  it('should return empty array when input is undefined', () => {
    expect(normalizeSortBy(undefined)).toEqual([['default', true]]);
  });

  it('should handle single SortByKey', () => {
    expect(normalizeSortBy('default')).toEqual(['default']);
    expect(normalizeSortBy('artist')).toEqual(['artist']);
  });

  it('should handle [SortByKey, boolean] tuple', () => {
    expect(normalizeSortBy(['default', true])).toEqual([['default', true]]);
    expect(normalizeSortBy(['artist', false])).toEqual([['artist', false]]);
  });

  it('should handle array of SortByValue', () => {
    expect(normalizeSortBy(['default', 'artist'])).toEqual([
      'default',
      'artist',
    ]);
    expect(
      normalizeSortBy<TrackSortByKey>([
        ['default', true],
        ['artist', false],
      ])
    ).toEqual([
      ['default', true],
      ['artist', false],
    ]);
  });

  it('should handle mixed array of SortByValue', () => {
    expect(normalizeSortBy(['default', ['artist', true]])).toEqual([
      'default',
      ['artist', true],
    ]);
  });
});

describe('getTrackOptions', () => {
  it('converts public sort values to structured native sort descriptors', () => {
    expect(
      getTrackOptions({
        sortBy: ['artist', false],
      }).sortBy
    ).toEqual([{ key: 'artist', ascending: false }]);
  });

  it('uses one structured default sort descriptor', () => {
    expect(getTrackOptions({}).sortBy).toEqual([
      { key: 'default', ascending: true },
    ]);
  });

  it('supports multiple structured native sort descriptors', () => {
    expect(
      getTrackOptions({
        sortBy: ['title', ['duration', false]],
      }).sortBy
    ).toEqual([
      { key: 'title', ascending: false },
      { key: 'duration', ascending: false },
    ]);
  });

  it.each(['', '0', '-1', '1.5', 'abc', '1abc', '18446744073709551616'])(
    'rejects malformed cursor %p',
    (after) => {
      expect(() => getTrackOptions({ after })).toThrow(
        expect.objectContaining({ code: 'INVALID_CURSOR' })
      );
    }
  );

  it('accepts a positive decimal entity ID cursor', () => {
    expect(getTrackOptions({ after: '18446744073709551615' }).after).toBe(
      '18446744073709551615'
    );
  });

  it.each([0, -1, 1.5, 1001, Number.POSITIVE_INFINITY])(
    'rejects invalid page size %p',
    (first) => {
      expect(() => getTrackOptions({ first })).toThrow(
        expect.objectContaining({ code: 'INVALID_PAGE_SIZE' })
      );
    }
  );

  it.each([1, 1000])('accepts page-size boundary %p', (first) => {
    expect(getTrackOptions({ first }).first).toBe(first);
  });

  it('applies the same cursor and page-size validation to every entity', () => {
    expect(() => getAlbumOptions({ after: 'bad' })).toThrow(
      expect.objectContaining({ code: 'INVALID_CURSOR' })
    );
    expect(() => getArtistOptions({ first: 1001 })).toThrow(
      expect.objectContaining({ code: 'INVALID_PAGE_SIZE' })
    );
  });
});

describe('getAllTracksAsync', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('collects tracks across every paginated result', async () => {
    const firstTrack = createTrack('1');
    const secondTrack = createTrack('2');

    mockMusicLibrary.getTracksAsync
      .mockResolvedValueOnce({
        items: [firstTrack],
        hasNextPage: true,
        endCursor: '1',
        totalCount: 2,
      })
      .mockResolvedValueOnce({
        items: [secondTrack],
        hasNextPage: false,
        endCursor: '2',
        totalCount: 2,
      });

    await expect(getAllTracksAsync({ first: 1 })).resolves.toEqual([
      firstTrack,
      secondTrack,
    ]);
    expect(mockMusicLibrary.getTracksAsync).toHaveBeenNthCalledWith(1, {
      after: undefined,
      first: 1,
      sortBy: [{ key: 'default', ascending: true }],
      directory: undefined,
    });
    expect(mockMusicLibrary.getTracksAsync).toHaveBeenNthCalledWith(2, {
      after: '1',
      first: 1,
      sortBy: [{ key: 'default', ascending: true }],
      directory: undefined,
    });
  });

  it('fails when a native page claims there is a next page without a cursor', async () => {
    mockMusicLibrary.getTracksAsync.mockResolvedValueOnce({
      items: [createTrack('1')],
      hasNextPage: true,
      totalCount: 2,
    });

    await expect(getAllTracksAsync()).rejects.toThrow(
      'Pagination did not provide an end cursor.'
    );
  });

  it('returns an empty list for an empty library', async () => {
    mockMusicLibrary.getTracksAsync.mockResolvedValueOnce({
      items: [],
      hasNextPage: false,
      totalCount: 0,
    });

    await expect(getAllTracksAsync()).resolves.toEqual([]);
  });

  it('fails when a native cursor repeats instead of advancing', async () => {
    mockMusicLibrary.getTracksAsync
      .mockResolvedValueOnce({
        items: [createTrack('1')],
        hasNextPage: true,
        endCursor: '1',
      })
      .mockResolvedValueOnce({
        items: [createTrack('1')],
        hasNextPage: true,
        endCursor: '1',
      });

    await expect(getAllTracksAsync()).rejects.toThrow(
      'Pagination cursor did not advance.'
    );
    expect(mockMusicLibrary.getTracksAsync).toHaveBeenCalledTimes(2);
  });
});

describe('complete entity helpers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('collects every album through the shared pagination loop', async () => {
    const album = createAlbum('1');
    mockMusicLibrary.getAlbumsAsync.mockResolvedValueOnce({
      items: [album],
      hasNextPage: false,
      totalCount: 1,
    });

    await expect(getAllAlbumsAsync({ first: 50 })).resolves.toEqual([album]);
    expect(mockMusicLibrary.getAlbumsAsync).toHaveBeenCalledWith({
      after: undefined,
      first: 50,
      sortBy: [{ key: 'default', ascending: true }],
    });
  });

  it('collects every artist through the shared pagination loop', async () => {
    const artist = createArtist('1');
    mockMusicLibrary.getArtistsAsync.mockResolvedValueOnce({
      items: [artist],
      hasNextPage: false,
      totalCount: 1,
    });

    await expect(getAllArtistsAsync()).resolves.toEqual([artist]);
    expect(mockMusicLibrary.getArtistsAsync).toHaveBeenCalledWith({
      after: undefined,
      first: 20,
      sortBy: [{ key: 'default', ascending: true }],
    });
  });
});

describe('public pagination validation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('rejects malformed cursors with a stable error code before native query', async () => {
    await expect(getAlbumsAsync({ after: 'bad' })).rejects.toMatchObject({
      code: 'INVALID_CURSOR',
    });
    expect(mockMusicLibrary.getAlbumsAsync).not.toHaveBeenCalled();
  });
});

describe('web result contract', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('omits an end cursor from an empty terminal page', async () => {
    const result = await WebMusicLibrary.getTracksAsync({
      first: 20,
      sortBy: [],
    });

    expect(result).toEqual({
      items: [],
      hasNextPage: false,
      totalCount: 0,
    });
    expect(result).not.toHaveProperty('endCursor');
  });

  it('returns every unavailable metadata field as null', async () => {
    await expect(WebMusicLibrary.getTrackMetadataAsync('42')).resolves.toEqual({
      id: '42',
      duration: null,
      bitrate: null,
      sampleRate: null,
      channels: null,
      format: null,
      title: null,
      artist: null,
      album: null,
      year: null,
      genre: null,
      track: null,
      disc: null,
      composer: null,
      lyricist: null,
      lyrics: null,
      albumArtist: null,
      comment: null,
    });
  });
});

function createTrack(id: string) {
  return {
    id,
    title: `Track ${id}`,
    artist: null,
    artwork: null,
    album: null,
    duration: 1,
    url: `file://${id}`,
    createdAt: null,
    modifiedAt: null,
    fileSize: 1,
  };
}

function createAlbum(id: string) {
  return {
    id,
    title: `Album ${id}`,
    artist: 'Artist',
    artwork: null,
    trackCount: 1,
    year: null,
  };
}

function createArtist(id: string) {
  return {
    id,
    title: `Artist ${id}`,
    albumCount: 1,
    trackCount: 1,
  };
}
