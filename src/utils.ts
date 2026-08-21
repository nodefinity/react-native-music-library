import {
  TrackSortByObject,
  AlbumSortByObject,
  ArtistSortByObject,
  type TrackOptions,
  type AlbumOptions,
  type ArtistOptions,
  type InternalTrackOptions,
  type InternalAlbumOptions,
  type InternalArtistOptions,
  type InternalSortByValue,
  type SortByValue,
} from './NativeMusicLibrary';

type SortByType = 'track' | 'album' | 'artist';
const MAX_CURSOR_ID = '18446744073709551615';

export function arrayize<T>(item: T | T[]): T[] {
  if (Array.isArray(item)) {
    return item;
  }
  return item ? [item] : [];
}

export function checkSortBy(
  sortBy: unknown,
  type: SortByType
): asserts sortBy is SortByValue<any> {
  if (Array.isArray(sortBy)) {
    checkSortByKey(sortBy[0], type);

    if (typeof sortBy[1] !== 'boolean') {
      throw new Error(
        'Invalid sortBy array argument. Second item must be a boolean!'
      );
    }
  } else {
    checkSortByKey(sortBy, type);
  }
}

export function checkSortByKey(sortBy: any, type: SortByType): void {
  const validKeys = Object.values(
    type === 'track'
      ? TrackSortByObject
      : type === 'album'
        ? AlbumSortByObject
        : ArtistSortByObject
  );
  if (validKeys.indexOf(sortBy) === -1) {
    throw new Error(`Invalid sortBy key: ${sortBy}`);
  }
}

export function sortByOptionToDescriptor(
  sortBy: SortByValue<any> | undefined,
  type: SortByType
): InternalSortByValue {
  checkSortBy(sortBy, type);
  if (Array.isArray(sortBy)) {
    return { key: sortBy[0], ascending: sortBy[1] };
  }
  return { key: sortBy, ascending: false };
}

export function getId(
  ref: string | undefined | { id?: string }
): string | undefined {
  if (typeof ref === 'string') {
    return ref;
  }
  return ref ? ref.id : undefined;
}

/**
 * Parse sortBy to SortByValue[]
 * @param sortBy - SortByValue or SortByValue[]
 * @returns SortByValue[]
 */
export function normalizeSortBy<T extends string>(
  input: SortByValue<T> | SortByValue<T>[] | undefined
): SortByValue<T>[] {
  if (!input) return [['default', true] as SortByValue<T>];

  // If input is an array, check if it's a SortByValue[] or [SortByKey, boolean]
  if (Array.isArray(input)) {
    const isTuple =
      input.length === 2 &&
      typeof input[0] === 'string' &&
      typeof input[1] === 'boolean';
    if (isTuple) {
      return [input as SortByValue<T>];
    } else {
      return input as SortByValue<T>[];
    }
  }

  return [input];
}

export function getTrackOptions(
  trackOptions: TrackOptions
): InternalTrackOptions {
  const { after, first, sortBy, directory } = trackOptions;

  const options = {
    after: getId(after),
    first: first == null ? 20 : first,
    directory,
    sortBy: normalizeSortBy(sortBy),
  };

  validateOptions(options);

  return {
    ...options,
    sortBy: options.sortBy.map((t) => sortByOptionToDescriptor(t, 'track')),
  };
}

export function getAlbumOptions(
  albumOptions: AlbumOptions
): InternalAlbumOptions {
  const { after, first, sortBy } = albumOptions;

  const options = {
    after: getId(after),
    first: first == null ? 20 : first,
    sortBy: normalizeSortBy(sortBy),
  };

  validateOptions(options);

  return {
    ...options,
    sortBy: options.sortBy.map((t) => sortByOptionToDescriptor(t, 'album')),
  };
}

export function getArtistOptions(
  artistOptions: ArtistOptions
): InternalArtistOptions {
  const { after, first, sortBy } = artistOptions;

  const options = {
    after: getId(after),
    first: first == null ? 20 : first,
    sortBy: normalizeSortBy(sortBy),
  };

  validateOptions(options);

  return {
    ...options,
    sortBy: options.sortBy.map((t) => sortByOptionToDescriptor(t, 'artist')),
  };
}

function validateOptions(options: any): void {
  if (options.after != null && typeof options.after !== 'string') {
    throw new Error('Option "after" must be a string!');
  }
  if (options.first != null && typeof options.first !== 'number') {
    throw new Error('Option "first" must be a number!');
  }
  if (options.directory != null && typeof options.directory !== 'string') {
    throw new Error('Option "directory" must be a string!');
  }
  if (options.after != null && !isValidCursor(options.after)) {
    throw createOptionError(
      'INVALID_CURSOR',
      'Option "after" must be a positive decimal ID!'
    );
  }
  if (
    options.first != null &&
    (!Number.isInteger(options.first) ||
      options.first < 1 ||
      options.first > 1000)
  ) {
    throw createOptionError(
      'INVALID_PAGE_SIZE',
      'Option "first" must be an integer between 1 and 1000!'
    );
  }
}

function isValidCursor(cursor: string): boolean {
  return (
    /^[1-9]\d*$/.test(cursor) &&
    (cursor.length < MAX_CURSOR_ID.length ||
      (cursor.length === MAX_CURSOR_ID.length && cursor <= MAX_CURSOR_ID))
  );
}

function createOptionError(code: string, message: string): Error {
  return Object.assign(new Error(message), { code });
}
