#import "MusicLibrary.h"
#import "MusicLibrary-Swift.h"

static NSArray *NSArrayFromSortByVector(facebook::react::LazyVector<JS::NativeMusicLibrary::InternalSortByValue> sortByVector) {
  NSMutableArray *sortBy = [NSMutableArray array];

  for (auto sortOption : sortByVector) {
    NSString *key = sortOption.key() ?: @"default";
    [sortBy addObject:@{
      @"key": key,
      @"ascending": @(sortOption.ascending())
    }];
  }

  return sortBy;
}

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
  // Extract values and create TrackOptions object
  int first = (int)options.first();
  NSString *after = options.after();
  NSString *directory = options.directory();
  NSArray *sortBy = NSArrayFromSortByVector(options.sortBy());

  TrackOptions *trackOptions = [[TrackOptions alloc] initAfter:after first:first sortBy:sortBy directory:directory];

  // Call Swift function with options object
  [musicLibrary getTracksAsyncWithOptions:trackOptions resolve:resolve reject:reject];
}

- (void)getTrackMetadataAsync:(nonnull NSString *)trackId resolve:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject {
  NSLog(@"🎵 [MusicLibrary.mm] getTrackMetadataAsync called with trackId: %@", trackId);

  [musicLibrary getTrackMetadataAsync:trackId resolve:resolve reject:reject];
}

- (void)getTracksByAlbumAsync:(nonnull NSString *)albumId resolve:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject {
  NSLog(@"🎵 [MusicLibrary.mm] getTracksByAlbumAsync called with albumId: %@", albumId);

  [musicLibrary getTracksByAlbumAsync:albumId resolve:resolve reject:reject];
}

- (void)getTracksByArtistAsync:(nonnull NSString *)artistId options:(JS::NativeMusicLibrary::InternalTrackOptions &)options resolve:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject {
  NSLog(@"🎵 [MusicLibrary.mm] getTracksByArtistAsync called with artistId: %@", artistId);

  // Extract values from Objective-C types with proper casting
  int first = (int)options.first();
  NSString *after = options.after();
  NSString *directory = options.directory();
  NSArray *sortBy = NSArrayFromSortByVector(options.sortBy());

  [musicLibrary getTracksByArtistAsync:artistId first:first after:after sortBy:sortBy directory:directory resolve:resolve reject:reject];
}

- (void)getAlbumsAsync:(JS::NativeMusicLibrary::InternalAlbumOptions &)options resolve:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject {
  NSLog(@"🎵 [MusicLibrary.mm] getAlbumsAsync called from Objective-C");

  // Extract values from Objective-C types with proper casting
  int first = (int)options.first();
  NSString *after = options.after();
  NSArray *sortBy = NSArrayFromSortByVector(options.sortBy());

  [musicLibrary getAlbumsAsyncWithFirst:first after:after sortBy:sortBy resolve:resolve reject:reject];
}

- (void)getAlbumsByArtistAsync:(nonnull NSString *)artistId resolve:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject {
  NSLog(@"🎵 [MusicLibrary.mm] getAlbumsByArtistAsync called with artistId: %@", artistId);

  [musicLibrary getAlbumsByArtistAsync:artistId resolve:resolve reject:reject];
}

- (void)getArtistsAsync:(JS::NativeMusicLibrary::InternalArtistOptions &)options resolve:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject {
  NSLog(@"🎵 [MusicLibrary.mm] getArtistsAsync called from Objective-C");

  // Extract values from Objective-C types with proper casting
  int first = (int)options.first();
  NSString *after = options.after();
  NSArray *sortBy = NSArrayFromSortByVector(options.sortBy());

  [musicLibrary getArtistsAsyncWithFirst:first after:after sortBy:sortBy resolve:resolve reject:reject];
}

+ (NSString *)moduleName {
  return @"MusicLibraryImpl";
}

@end
