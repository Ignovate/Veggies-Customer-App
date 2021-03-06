/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"
#import <CodePush/CodePush.h>

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import "RNFIRMessaging.h"
@import Firebase;
#import "RNGoogleSignin.h"
#import "SplashScreen.h"  // here

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;

    #ifdef DEBUG
        jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
    #else
        jsCodeLocation = [CodePush bundleURL];
    #endif

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"Veggie"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  [[FBSDKApplicationDelegate sharedInstance] application:application
                           didFinishLaunchingWithOptions:launchOptions];
  
  [FIRApp configure];
  [[UNUserNotificationCenter currentNotificationCenter] setDelegate:self];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  [SplashScreen show];
  return YES;
}
  
//  - (BOOL)application:(UIApplication *)application openURL:(NSURL *)url
//    sourceApplication:(NSString *)sourceApplication annotation:(id)annotation {
//
//    return [[FBSDKApplicationDelegate sharedInstance] application:application
//                                                          openURL:url
//                                                sourceApplication:sourceApplication
//                                                       annotation:annotation
//            ]
//    || [RNGoogleSignin application:application
//                           openURL:url
//                 sourceApplication:sourceApplication
//                        annotation:annotation
//        ];
//  }

- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
            options:(NSDictionary<NSString *,id> *)options {
  BOOL handled =
  [[FBSDKApplicationDelegate sharedInstance] application:application
                                                 openURL:url
                                       sourceApplication:options[UIApplicationOpenURLOptionsSourceApplicationKey]
                                              annotation:options[UIApplicationOpenURLOptionsAnnotationKey]] || [RNGoogleSignin application:application
                                                                                                                                   openURL:url sourceApplication:options[UIApplicationOpenURLOptionsSourceApplicationKey] annotation:options[UIApplicationOpenURLOptionsAnnotationKey]];
  return handled;
}


//- (BOOL)application:(UIApplication *)application
//              openURL:(NSURL *)url
//    sourceApplication:(NSString *)sourceApplication
//           annotation:(id)annotation {
//    return [[FBSDKApplicationDelegate sharedInstance] application:application
//                                                          openURL:url
//                                                sourceApplication:sourceApplication
//                                                       annotation:annotation];
//  }
  
  - (void)applicationDidBecomeActive:(UIApplication *)application {
    [FBSDKAppEvents activateApp];
  }
  
  - (void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler
  {
       [RNFIRMessaging willPresentNotification:notification withCompletionHandler:completionHandler];
  }
  
  #if defined(__IPHONE_11_0)
  - (void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)(void))completionHandler
  {
    [RNFIRMessaging didReceiveNotificationResponse:response withCompletionHandler:completionHandler];
  }
  #else
  - (void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void(^)())completionHandler
  {
    [RNFIRMessaging didReceiveNotificationResponse:response withCompletionHandler:completionHandler];
  }
  #endif
  
  //You can skip this method if you don't want to use local notification
  -(void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification {
    [RNFIRMessaging didReceiveLocalNotification:notification];
  }
  
  - (void)application:(UIApplication *)application didReceiveRemoteNotification:(nonnull NSDictionary *)userInfo fetchCompletionHandler:(nonnull void (^)(UIBackgroundFetchResult))completionHandler{
    [RNFIRMessaging didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
    }


@end
