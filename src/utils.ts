import { Platform } from 'react-native';
import {
  SortByObject,
  type AssetsOptions,
  type InternalAssetsOptions,
  type InternalSortByValue,
  type SortByValue,
} from './NativeMusicLibrary';

export function arrayize<T>(item: T | T[]): T[] {
  if (Array.isArray(item)) {
    return item;
  }
  return item ? [item] : [];
}

export function checkSortBy(sortBy: unknown): asserts sortBy is SortByValue {
  if (Array.isArray(sortBy)) {
    checkSortByKey(sortBy[0]);

    if (typeof sortBy[1] !== 'boolean') {
      throw new Error(
        'Invalid sortBy array argument. Second item must be a boolean!'
      );
    }
  } else {
    checkSortByKey(sortBy);
  }
}

export function checkSortByKey(sortBy: any): void {
  if (Object.values(SortByObject).indexOf(sortBy) === -1) {
    throw new Error(`Invalid sortBy key: ${sortBy}`);
  }
}

export function sortByOptionToString(
  sortBy: SortByValue | undefined
): InternalSortByValue {
  checkSortBy(sortBy);
  if (Array.isArray(sortBy)) {
    return `${sortBy[0]} ${sortBy[1] ? 'ASC' : 'DESC'}`;
  }
  return `${sortBy} DESC`;
}

export function getId(
  ref: string | undefined | { id?: string }
): string | undefined {
  if (typeof ref === 'string') {
    return ref;
  }
  return ref ? ref.id : undefined;
}

export function getOptions(
  assetsOptions: AssetsOptions
): InternalAssetsOptions {
  const { after, first, sortBy, directory } = assetsOptions;

  const options = {
    after: getId(after),
    first: first == null ? 20 : first,
    directory,
    sortBy: arrayize(sortBy),
  };

  if (after != null && typeof options.after !== 'string') {
    throw new Error('Option "after" must be a string!');
  }
  if (first != null && typeof options.first !== 'number') {
    throw new Error('Option "first" must be a number!');
  }
  if (directory != null && typeof options.directory !== 'string') {
    throw new Error('Option "album" must be a string!');
  }
  if (
    after != null &&
    Platform.OS === 'android' &&
    isNaN(parseInt(getId(after) as string, 10))
  ) {
    throw new Error('Option "after" must be a valid ID!');
  }
  if (first != null && first < 0) {
    throw new Error('Option "first" must be a positive integer!');
  }

  return {
    ...assetsOptions,
    sortBy: arrayize(assetsOptions.sortBy).map(sortByOptionToString),
  };
}
