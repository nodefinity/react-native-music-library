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
  NSDictionary *optionsDict = @{}; // Convert JS options to NSDictionary
  NSDictionary *result = [musicLibrary getTracksAsync:optionsDict];
  resolve(result);
}

- (void)getTrackMetadataAsync:(nonnull NSString *)trackId resolve:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject { 
  NSDictionary *result = [musicLibrary getTrackMetadataAsync:trackId];
  resolve(result);
}

- (void)getTracksByAlbumAsync:(nonnull NSString *)albumId resolve:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject { 
  NSArray *result = [musicLibrary getTracksByAlbumAsync:albumId];
  resolve(result);
}

- (void)getTracksByArtistAsync:(nonnull NSString *)artistId options:(JS::NativeMusicLibrary::InternalTrackOptions &)options resolve:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject { 
  NSDictionary *optionsDict = @{}; // Convert JS options to NSDictionary
  NSDictionary *result = [musicLibrary getTracksByArtistAsync:artistId options:optionsDict];
  resolve(result);
}

- (void)getAlbumsAsync:(JS::NativeMusicLibrary::InternalAlbumOptions &)options resolve:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject { 
  NSDictionary *optionsDict = @{}; // Convert JS options to NSDictionary
  NSDictionary *result = [musicLibrary getAlbumsAsync:optionsDict];
  resolve(result);
}

- (void)getAlbumsByArtistAsync:(nonnull NSString *)artistId resolve:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject { 
  NSArray *result = [musicLibrary getAlbumsByArtistAsync:artistId];
  resolve(result);
}

- (void)getArtistsAsync:(JS::NativeMusicLibrary::InternalArtistOptions &)options resolve:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject { 
  NSDictionary *optionsDict = @{}; // Convert JS options to NSDictionary
  NSDictionary *result = [musicLibrary getArtistsAsync:optionsDict];
  resolve(result);
}

+ (NSString *)moduleName { 
  return @"MusicLibraryImpl";
}

@end
