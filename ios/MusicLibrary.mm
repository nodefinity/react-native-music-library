#import "MusicLibrary.h"
#import "MusicLibrary-Swift.h"

@implementation MusicLibrary {
  MusicLibraryImpl *musicLibrary;
}

- (instancetype) init {
  if (self = [super init]) {
    musicLibrary = [MusicLibraryImpl new];
  }
  return self;
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeMusicLibrarySpecJSI>(params);
}

- (void)getTracksAsync:(JS::NativeMusicLibrary::InternalTrackOptions &)options resolve:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject {
  NSLog(@"🎵 [MusicLibrary.mm] getTracksAsync called from Objective-C");
  
  NSDictionary *optionsDict = @{}; // Convert JS options to NSDictionary
  NSDictionary *result = [musicLibrary getTracksAsync:optionsDict];
  
  NSLog(@"🎵 [MusicLibrary.mm] getTracksAsync resolved with result: %@", result);
  resolve(result);
}

- (void)getTrackMetadataAsync:(nonnull NSString *)trackId resolve:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject { 
  NSLog(@"🎵 [MusicLibrary.mm] getTrackMetadataAsync called with trackId: %@", trackId);
  
  NSDictionary *result = [musicLibrary getTrackMetadataAsync:trackId];
  
  NSLog(@"🎵 [MusicLibrary.mm] getTrackMetadataAsync resolved with result: %@", result);
  resolve(result);
}

- (void)getTracksByAlbumAsync:(nonnull NSString *)albumId resolve:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject { 
  NSLog(@"🎵 [MusicLibrary.mm] getTracksByAlbumAsync called with albumId: %@", albumId);
  
  NSArray *result = [musicLibrary getTracksByAlbumAsync:albumId];
  
  NSLog(@"🎵 [MusicLibrary.mm] getTracksByAlbumAsync resolved with result: %@", result);
  resolve(result);
}

- (void)getTracksByArtistAsync:(nonnull NSString *)artistId options:(JS::NativeMusicLibrary::InternalTrackOptions &)options resolve:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject { 
  NSLog(@"🎵 [MusicLibrary.mm] getTracksByArtistAsync called with artistId: %@", artistId);
  
  NSDictionary *optionsDict = @{}; // Convert JS options to NSDictionary
  NSDictionary *result = [musicLibrary getTracksByArtistAsync:artistId options:optionsDict];
  
  NSLog(@"🎵 [MusicLibrary.mm] getTracksByArtistAsync resolved with result: %@", result);
  resolve(result);
}

- (void)getAlbumsAsync:(JS::NativeMusicLibrary::InternalAlbumOptions &)options resolve:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject { 
  NSLog(@"🎵 [MusicLibrary.mm] getAlbumsAsync called from Objective-C");
  
  NSDictionary *optionsDict = @{}; // Convert JS options to NSDictionary
  NSDictionary *result = [musicLibrary getAlbumsAsync:optionsDict];
  
  NSLog(@"🎵 [MusicLibrary.mm] getAlbumsAsync resolved with result: %@", result);
  resolve(result);
}

- (void)getAlbumsByArtistAsync:(nonnull NSString *)artistId resolve:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject { 
  NSLog(@"🎵 [MusicLibrary.mm] getAlbumsByArtistAsync called with artistId: %@", artistId);
  
  NSArray *result = [musicLibrary getAlbumsByArtistAsync:artistId];
  
  NSLog(@"🎵 [MusicLibrary.mm] getAlbumsByArtistAsync resolved with result: %@", result);
  resolve(result);
}

- (void)getArtistsAsync:(JS::NativeMusicLibrary::InternalArtistOptions &)options resolve:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject { 
  NSLog(@"🎵 [MusicLibrary.mm] getArtistsAsync called from Objective-C");
  
  NSDictionary *optionsDict = @{}; // Convert JS options to NSDictionary
  NSDictionary *result = [musicLibrary getArtistsAsync:optionsDict];
  
  NSLog(@"🎵 [MusicLibrary.mm] getArtistsAsync resolved with result: %@", result);
  resolve(result);
}

+ (NSString *)moduleName { 
  return @"MusicLibraryImpl";
}

@end
