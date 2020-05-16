# iSeaTree-React-Prototype

Prototype for the iSeaTree (a mobile app which creates compatible data collection for the iTree project).

## Development

Project was initialized using [Expo](https://expo.io). Here is a guide how to [get-started with expo](https://docs.expo.io/versions/latest/get-started/installation).

### Prerequisites

- node v12.16.1
- [yarn v1.19.1](https://yarnpkg.com)
- [expo-cli v3.16](https://www.npmjs.com/package/expo-cli)

### Installation

From the project's root directory run:

```bash
yarn install
```

### Running

```bash
yarn start
```

### Secrets

`envVariables.ts` file holds all secret keys (api keys etc). It should never be commited to the repo. Before starting the app, get correct values from someone.

```bash
cp envVariables.example.ts envVariables.ts
```

Now you can follow displayed instructioned. For example, you can open Android emulator pressing `a` in the current tab.

## Linting

This project has configured [Eslint](https://eslint.org/) with recommended typescript and react rules.

## Firebase - Setup

1. Go to the https://console.firebase.google.com and create new project
2. Click `Database` in the left side panel and create `Firestore`(!) Database
3. Edit Firestore Database security rules
   1. Database needs certain rules to works correctly. Visit https://firebase.google.com/docs/firestore/security/get-started to learn more about security rules.
   2. Copy and paste below rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
    	allow read, update, delete: if request.auth.uid == userId;
      allow create: if request.auth.uid != null;
    }

    match /trees/{userId} {
    	allow read, update, delete: if request.auth.uid == resource.data.userId;
      allow create: if request.auth.uid != null;
    }
  }
}
```
4. Click `Storage` in the left side panel and create storage
5. Click `Authentication` in the left side panel and click `Set up sign-in method`
   1. Enable `Email/Password` method (first from top)
6. Go to the project settings (Cog icon)
   1. Find `Your apps` section and register new app. You have to select web platform (</> icon)
   2. Copy keys from `firebaseConfig` object and use them to populate envVariables.ts inside this project


## Releasing app to the Play Store (Android)

First you have to obtain google map key:
- google map config - https://docs.expo.io/versions/latest/sdk/map-view/#deploying-to-a-standalone-app-on-android

Then you can follow these instructions: https://docs.expo.io/distribution/app-stores/

## Releasing app to the App Store (iOS)

Builds happen on the Expo server, using Fastlane. Your Info.plist is created by Expo, based on the values in `app.json`.

### One-time setup on your Apple developer account



Create app-specific password in developer account, if you want. Hal tried but the Expo build tools weren't able to authenticate using the app-specific password.

If you have generated the deployable iOS version of your app with Expo before, then the first time your 
run `expo build:ios` you'll see a series of questions of 
questions about App Store Connect credentials. Expo can handle creation of provisioning profile. This worked smoothly 
and was easier than populating fields by hand.

In App Store Connect, reate an entry for iSeaTree. Upload the icon (`icon.png` in the `assets` folder).

### Builds
Start the build using `expo build:ios`. 

After you start a build , you'll see a URL starting with `https://expo.io/dashboard/` that 
you can use to monitor the build.

At end of the build, you'll see a URL starting with `https://expo.io/artifacts`
that is the location of your IPA (the archive containing your iPhone application).
Download the IPA and upload it to the
Apple App Store using either the [Transporter](https://apps.apple.com/us/app/transporter/id1450874784?mt=12) GUI tool,
or using `xcrun altool` from the command line:

```
$ xcrun altool --upload-app --type ios --file <IPA_FILE_THAT_YOU_HAVE_UPLOAD_FROM_EXPO_BUILD> --username "YOUR_APPLE_ID_USER" --password "YOUR_ITMC_PASSWORD"
```

`xcrun altool` provides no feedback while running.

You must increment `buildNumber` in the `"ios"` between uploads to the App Store.

### Rough notes

See standalone build instructions: https://docs.expo.io/distribution/building-standalone-apps/

Xcode command line builds:
https://docs.expo.io/distribution/app-stores/?redirected
https://stackoverflow.com/a/58449544/719690
