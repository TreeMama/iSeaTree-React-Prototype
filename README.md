# iSeaTree-React-Prototype

This is the repository for iSeaTree, a mobile app which observers can use to collect data for the iSeaTree project.

* [Git repository branching guidelines for contributors](#Git-repository-branching-guidelines-for-contributors)
* [Setting up your development environment](#Development) 
* [Interacting with the iOS Simulator](#Interacting-with-the-iOS-Simulator)
* [App store release instructions](documentation/Release_Instructions.md)
* [iSeaTree community forum](https://treemama.org/forum/)
* [iSeaTree data dashboard](https://treemama.org/365-days-of-trees/dashboard/)
* One-time setup items:
    - [Firebase](documentation/Firebase_Setup.md)
    - [Apple App Store](documentation/Apple_App_Store_Setup.md)

## Git repository branching guidelines for contributors

We follow a relaxed version of the [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/) workflow.

The `develop` branch is the default branch. The `develop` branch is always ready to be released. It contains only 
completed features and completed bugfixes. Do not commit directly to `develop`; use pull requests and merges from
feature branches instead.

All feature and bugfix work is done in feature branches, branching from `develop`, and named with the pattern `feature/<short descriptive name>`. 
Code reviews are not required, but pull requests _are_ required. You can approve your own PR, or you can tag another team
member to review it if you like.

 The `master` branch is where all releases are built from. __You will not touch the `master` branch at all unless you are deploying a release
to an app store.__ Update the version number and build number directly
in the `master` branch, just before release. Do not commit directly to `master`, except for edits of `app.json`
that update `version`, `versionCode`, and `bundleNumber`. Merge all other changes to `master` from `develop`.

### To add a feature or fix a bug:
* `git checkout develop`
* `git pull` (to make sure you're starting with the newest code).
* `git checkout -b feature/frobishizer-bug` (just an example, we don't have a frobishizer in this project...yet).
* Fix the bug, or add the feature. `git push` periodically, to keep the Github repository updated with your work. The first time you push, you'll have to use `git push --set-upstream origin feature/frobishizer-bug`, but the Github command line will remind you of this.
* When your bugfix or new feature is finished, merge your work into the main (`develop`) branch:
    - `git push`
    - `git checkout develop` (this retrieves work committed to `develop` from other branches while you were building the frobishizer).
    - `git pull`
    - `git checkout feature/mybranch`
    - `git merge develop` (this catches your feature branch up with the new work in `develop`).
    - `git push`
    - Open your pull request, from `feature/mybranch` to `develop`, on the [Github repository web page](https://github.com/TreeMama/iSeaTree-React-Prototype).
    - Merge your pull request, or tag someone for a code review.
    - After your pull request has been merged, you can delete your
    feature branch, both on the Github server and in your local repository.

## Development toolkit

This project uses [react-native-cli]. Here is a guide how to [get
started with
react-native-cli](https://reactnative.dev/docs/environment-setup). react-native-cli
is contains the actual React Native framework code and is installed locally into your project,
react-native-cli project is said to be a pure React Native app, since none of the native code is hidden away from the developer.
a development tool that runs interpreted JavaScript on your mobile device,
in debug mode. react-native-cli project has native code for android and iOS,
so, you can perform any release related operation for android and iOS, by using androidSudio and Xcode relatively.

You need Xcode or Android Studio to work on this project.

### Tookit prerequisites

- Nodejs v12.16.1 or later. You can download a prebuilt Nodejs installer from [https://nodejs.org/](https://nodejs.org/en/).
- [yarn v1.19.1](https://yarnpkg.com). Install Yarn with `npm install --global yarn`, or perhaps `sudo npm install --global yarn`.
- [react-native-cli](https://www.npmjs.com/package/react-native-cli). Install react-native-cli with `npm install –g react-native-cli`, or perhaps `sudo npm install –g react-native-cli`.

This is a one-time setup for each computer you'll do Yarn/react-native-cli development on.

### Installation

From the project's root directory run:

```bash
yarn install
```

This sets up Yarn for the iSeaTree project directory.

Note: you'll probably have to run `yarn install` after a git pull, if the updated code has added React libraries or changed library versions.

### Source Code Secrets

`envVariables.ts` file holds all secret keys (api keys etc) associated with the iSeaTree project. It should
never be commited to a Git repository. Before launching iSeaTree
for the first time in your development environment, get a copy of the
Development `envVariables.ts` from an iSeaTree project administrator.

```bash
./verify-checksums.sh
```
will check to see whether you have `envVariables.ts` in the right
place, and whether it is the current production or development version
or something else. A `prestart` script also verifies this file before Expo
launches your development build.

For project administrators: when you update `envVariables.ts`
* If it's the production version, execute the command `shasum -a 512 envVariables.ts > checksum-prod.txt` and commit `checksum-prod.txt` to the repository.
* If it's the development version, execute the command `shasum -a 512 envVariables.ts > checksum-dev.txt` and commit `checksum-dev.txt` to the repository.

for google map functionality we have to add "google api key" in the below file
* AndroidManifest.xml
    - Path: app/src/main/AndroidManifest.xml
    - Desc: Please add google api key in "com.google.android.geo.API_KEY" meta tag.

### Running

```bash
- ios:
    - cd ios
    - pod install
    - cd ..
    - npx react-native run-ios
- android:
    - npx react-native run-android
```

This command launches a metroServer on your computer and loads the source code for the project.

## Linting

This project has configured [Eslint](https://eslint.org/) with recommended typescript and react rules.

## Interacting with the iOS Simulator

when you run `npx react-native run-ios` it launchs the default simulator of you PC.

To obtain a standalone native build, we have iOS folder that contain native code for our application,
by open it on Xcode, we can make archive of the application and directly upload it to appStore. 
we can also change version and build number from Xcode 

## Interacting with the Android Simulator

when you run `npx react-native run-android` it run the application on all devices which enabled debug mode.

To obtain a standalone native build, we have android folder that contain native code for our application,
by open it on Android Studio, we can make signed apk. 
we can also change versionCode or versionName at android/app/build.gradle

# Dependency Changes for Migrate Project:

- replace `firebase` dependency with `@react-native-firebase`
- replace `expo-camera` dependency with `react-native-camera`
- add `react-native-unimodules`

## Why change `firebase` dependency with `@react-native-firebase`?

- well as per the new flow `firebase` is not recognised by the react-native
- and it's make project future proof

## Why change `expo-camera` dependency with `react-native-camera`?

- to fix rotation image issue

## Why add `react-native-unimodules`?

- This dependency allows us to use most of the expo dependency if require.

## Troubleshooting for interacting with the iOS Simulator

- First check wether cocoapod is installed in your pc or not with below command:

```bash
pod --version
```

- If it dosn't show any verion, install it by below command:

```bash
brew install cocoapods
```

- If Cocoapod is already installed in your PC then try below steps to install pod:
1. Delete "Podfile.lock" file at "/ios/Podfile.lock"
2. Install pod

```bash
- cd ios
- pod install
- cd ..
- npx react-native run-ios
```

- `npx react-native run-ios` this command will launch iPhone 11 simulator by default, if this simulator is not available then, try below command to check available simulator:

```bash
- xcrun simctl list devices
```

- Select any available device and use with below commad:

```bash
- npx react-native run-ios --simulator="YOUR SIMULATOR NAME"
```