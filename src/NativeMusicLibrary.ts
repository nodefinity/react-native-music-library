// Re-export all types from the shared types file
export * from './types';

// Platform-specific module import
// React Native Metro bundler will automatically pick the right file based on platform:
// - MusicLibraryImpl.native.ts for iOS/Android
// - MusicLibraryImpl.web.ts for web
import MusicLibrary from './MusicLibraryImpl';

export default MusicLibrary;
