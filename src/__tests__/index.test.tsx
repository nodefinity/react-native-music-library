import type { TrackSortByKey } from '../NativeMusicLibrary';
import { normalizeSortBy } from '../utils';

// Mock the native module
jest.mock('../NativeMusicLibrary', () => ({}));

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
