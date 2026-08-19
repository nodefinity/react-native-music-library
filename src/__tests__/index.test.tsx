import type { TrackSortByKey } from '../NativeMusicLibrary';
import MusicLibrary from '../NativeMusicLibrary';
import { getAllTracksAsync } from '../index';
import { getTrackOptions, normalizeSortBy } from '../utils';

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
