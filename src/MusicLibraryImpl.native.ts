import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import type {
  MusicLibraryModule,
  InternalAssetsOptions,
  TrackResult,
  AlbumResult,
  ArtistResult,
  GenreResult,
} from './types';

interface Spec extends TurboModule, MusicLibraryModule {
  getTracksAsync(options: InternalAssetsOptions): Promise<TrackResult>;
  getAlbumsAsync(options: InternalAssetsOptions): Promise<AlbumResult>;
  getArtistsAsync(options: InternalAssetsOptions): Promise<ArtistResult>;
  getGenresAsync(options: InternalAssetsOptions): Promise<GenreResult>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('MusicLibrary');
