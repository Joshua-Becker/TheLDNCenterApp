Tutorial to create this app found at:
https://amanhimself.dev/blog/chat-app-with-react-native-part-1/

icons:
https://feathericons.com/


FIXES:

Android emulator not printing console.log?
use console.debug

react-native-gifted-chat:
https://github.com/FaridSafi/react-native-gifted-chat/issues/2090

react-native-virgil-crypto error:
https://github.com/VirgilSecurity/react-native-virgil-crypto/issues/44


ENCRYPTION REPORTING:
https://www.bis.doc.gov/index.php/policy-guidance/encryption/4-reports-and-reviews/a-annual-self-classification

Removed flipper in podfile


Setting up for testing in Google Play Store:
- https://reactnative.dev/docs/signed-apk-android
- Play Console - https://play.google.com/console
- cd android 
- ./gradlew bundleRelease

Setting up for Build and Archive to App Store:
- links:
    https://appstoreconnect.apple.com/apps
    https://developer.apple.com/account/
1) changes to info.plist
- set NSAllowsArbitraryLoads to false
- comment out localhost key pair in NSExceptionDomains
2) Set scheme to release (not debug)
3) add ios simulator arm64 to excluded architectures in both pods and app
4) change version (or build) number in general
5) Make sure ios version is accurate
6) Change build target to any ios device
7) Build
8) Archive
9) Upload

Build and Archive and Deploy to Testflight Notes
- Must have app icons - Icons must not have transparency or alpha channels - (turn off alpha channels and use .jpg)
- Must have notification entitlements - under signing and capabilities

