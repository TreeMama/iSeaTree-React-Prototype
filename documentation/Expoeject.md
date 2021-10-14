# iSeaTree bare react native 

- iSeaTree bare react native is the expo ejected project

# Run Project

- npm install or yarn install
- ios: 
    npx react-native run-ios
- android:
    npx react-native run-android

# dependency Changes:

- replace `firebase` dependency with `@react-native-firebase`
- replace `expo-camera` dependency with `react-native-camera`

## why change `firebase` dependency with `@react-native-firebase`?

- well as per the new flow `firebase` is not recognised by the react-native
- and it's make project future proof

## why change `expo-camera` dependency with `react-native-camera`?

- to fix rotation image issue

# Generate Release

## Android:
    - change versionCode or versionName at iseaTree-reactnative/android/app/build.gradle
    - go to android studio and generate signed apk

## IOS:
    - change version and build number from Xcode 
    - generate archive and upload it to appStore
