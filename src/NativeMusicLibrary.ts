import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import type {
  IPaginatedQuery,
  ITrackResult,
  IAlbumResult,
  IArtistResult,
  IGenreResult,
} from './types';

export interface Spec extends TurboModule {
  getTracksAsync(options?: IPaginatedQuery): Promise<ITrackResult>;
  getAlbumsAsync(options?: IPaginatedQuery): Promise<IAlbumResult>;
  getArtistsAsync(options?: IPaginatedQuery): Promise<IArtistResult>;
  getGenresAsync(options?: IPaginatedQuery): Promise<IGenreResult>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('MusicLibrary');
