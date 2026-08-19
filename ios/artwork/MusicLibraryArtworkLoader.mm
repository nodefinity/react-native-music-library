#import <React/RCTBridgeModule.h>
#import <React/RCTImageURLLoader.h>

#import "MusicLibrary-Swift.h"

@interface MusicLibraryArtworkURLProtocol : NSURLProtocol

@property(nonatomic, strong, nullable) MusicLibraryArtworkLoadTask *loadTask;
@property(nonatomic, assign) BOOL stopped;

@end


@implementation MusicLibraryArtworkURLProtocol

+ (BOOL)canInitWithRequest:(NSURLRequest *)request
{
  return [request.URL.scheme.lowercaseString isEqualToString:@"artwork"];
}

+ (NSURLRequest *)canonicalRequestForRequest:(NSURLRequest *)request
{
  return request;
}

- (void)startLoading
{
  __weak MusicLibraryArtworkURLProtocol *weakSelf = self;
  self.loadTask =
      [MusicLibraryArtworkProvider loadImageForReference:self.request.URL.absoluteString
                                              completion:^(UIImage *image, NSError *error) {
    __strong MusicLibraryArtworkURLProtocol *strongSelf = weakSelf;
    if (!strongSelf || strongSelf.stopped) {
      return;
    }

    if (error || !image) {
      NSError *loadError = error ?: [NSError errorWithDomain:@"MusicLibraryArtwork"
                                                         code:1
                                                     userInfo:@{
                                                       NSLocalizedDescriptionKey: @"Artwork could not be loaded."
                                                     }];
      [strongSelf.client URLProtocol:strongSelf didFailWithError:loadError];
      return;
    }

    NSData *imageData = UIImagePNGRepresentation(image);
    if (!imageData) {
      NSError *encodingError = [NSError errorWithDomain:@"MusicLibraryArtwork"
                                                    code:2
                                                userInfo:@{
                                                  NSLocalizedDescriptionKey: @"Artwork could not be encoded."
                                                }];
      [strongSelf.client URLProtocol:strongSelf didFailWithError:encodingError];
      return;
    }

    NSURLResponse *response = [[NSURLResponse alloc] initWithURL:strongSelf.request.URL
                                                       MIMEType:@"image/png"
                                          expectedContentLength:imageData.length
                                               textEncodingName:nil];
    [strongSelf.client URLProtocol:strongSelf
                didReceiveResponse:response
                cacheStoragePolicy:NSURLCacheStorageNotAllowed];
    [strongSelf.client URLProtocol:strongSelf didLoadData:imageData];
    [strongSelf.client URLProtocolDidFinishLoading:strongSelf];
  }];
}

- (void)stopLoading
{
  self.stopped = YES;
  [self.loadTask cancel];
  self.loadTask = nil;
}

@end


__attribute__((constructor))
static void MusicLibraryRegisterArtworkURLProtocol(void)
{
  [NSURLProtocol registerClass:MusicLibraryArtworkURLProtocol.class];
}


@interface MusicLibraryArtworkLoader : NSObject <RCTImageURLLoader>
@end

@implementation MusicLibraryArtworkLoader

RCT_EXPORT_MODULE()

- (BOOL)canLoadImageURL:(NSURL *)requestURL
{
  return [requestURL.scheme.lowercaseString isEqualToString:@"artwork"];
}

- (BOOL)requiresScheduling
{
  return NO;
}

- (BOOL)shouldCacheLoadedImages
{
  return YES;
}

- (float)loaderPriority
{
  return 2;
}

- (nullable RCTImageLoaderCancellationBlock)loadImageForURL:(NSURL *)imageURL
                                                       size:(CGSize)size
                                                      scale:(CGFloat)scale
                                                 resizeMode:(RCTResizeMode)resizeMode
                                            progressHandler:(RCTImageLoaderProgressBlock)progressHandler
                                         partialLoadHandler:(RCTImageLoaderPartialLoadBlock)partialLoadHandler
                                          completionHandler:(RCTImageLoaderCompletionBlock)completionHandler
{
  MusicLibraryArtworkLoadTask *loadTask =
      [MusicLibraryArtworkProvider loadImageForReference:imageURL.absoluteString
                                              completion:^(UIImage *image, NSError *error) {
    if (image && progressHandler) {
      progressHandler(1, 1);
    }
    completionHandler(error, image);
  }];

  return ^{
    [loadTask cancel];
  };
}

@end
