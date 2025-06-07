// This is the default implementation that exports the native module
// React Native Metro bundler will pick platform-specific versions when available:
// - MusicLibraryImpl.native.ts for iOS/Android
// - MusicLibraryImpl.web.ts for web
export { default } from './MusicLibraryImpl.native';
