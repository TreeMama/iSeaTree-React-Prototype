# iSeaTree-React-Prototype

This is the repository for iSeaTree, a mobile app which observers can use to collect data for the iSeaTree project.

- [iSeaTree-React-Prototype](#iseatree-react-prototype)
  - [What’s the project about?](#whats-the-project-about)
  - [Git repository branching guidelines for contributors](#git-repository-branching-guidelines-for-contributors)
    - [To add a feature or fix a bug:](#to-add-a-feature-or-fix-a-bug)
    - [To update the version or build number:](#to-update-the-version-or-build-number)
  - [Development toolkit](#development-toolkit)
    - [Tookit prerequisites](#tookit-prerequisites)
    - [Installation](#installation)
    - [Source Code Secrets](#source-code-secrets)
    - [Running in a simulator](#running-in-a-simulator)
    - [Running on a real mobile device](#running-on-a-real-mobile-device)
  - [Interacting with the Android Simulator](#interacting-with-the-android-simulator)
  - [Linting](#linting)
  - [Production builds](#production-builds)


## What’s the project about?

The iSeaTree project is an open source project for building the react-native iSeaTree app (available in iOS and Android.  Links to our current releases can be found on our [TreeMama.org webpage](https://treemama.org/the-tech-treehouse/iseatree). This project utilizes [the USDA's US Forest Service iTree API](https://www.itreetools.org/) to calculate the individual CO2/Stormwater tree benefits of trees. iSeaTree is an educational tool, and was founded by Treemama.org with the belief that "kids can do more for then environment then just study it - they can participate in conserving it!

[Current Release Page](https://treemama.org/the-tech-treehouse/iseatree/)
[iSeaTree users / Treemama.org Community Forums](https://treemama.org/forum/)
[iSeaTree Dashboard](https://treemama.org/tree-census/dashboard/)

## Git repository branching guidelines for contributors

We follow a relaxed version of the [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/) workflow.

The `develop` branch is the default branch. The `develop` branch is always ready to be released. It contains only 
completed features and completed bugfixes. Do not commit directly to `develop`; use pull requests and merges from
feature branches instead.

All feature and bugfix work is done in feature branches, branching from `develop`, and named with the pattern `feature/<short descriptive name>`. 
Code reviews are not required, but pull requests _are_ required. You can approve your own PR, or you can tag another team
member to review it if you like.

Use descriptive names for feature branches. You can use the `#234` syntax in the comments to link to a particular issue or pull request. But please name your branches 
descriptively, so that another human can look at the branch name and understand what it's about.

 The `release` branch is where all releases are built from. __You will not touch the `release` branch at all unless you are deploying a release
to an app store.__ Update the version number and build number directly
in the `release` branch, just before release. Do not commit directly to `release`, except for edits of of the files that control the version number and build number.
Merge all other changes to `release` from `develop`.

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

### To update the version or build number:
Please keep these in sync for Android and iOS.

Android version and build number are controlled by `android/app/release/output-metadata.json`.

iOS version and build number are controlled by `ios/iSeaTree/Info.plist`. `Info.plist` is an XML file. You can edit it with a text editor, no need for Xcode.

## Development toolkit

This project uses [react-native-cli]. Here is a guide how to [get
started with
react-native-cli](https://reactnative.dev/docs/environment-setup). react-native-cli
is contains the actual React Native framework code and is installed locally into your project,
react-native-cli project is said to be a pure React Native app, since none of the native code is hidden away from the developer.
a development tool that runs interpreted JavaScript on your mobile device,
in debug mode. react-native-cli project has native code for Android and iOS,
so, you can perform any release related operation for Android and iOS, by using Android Studio and Xcode respectively.

You need [Xcode](https://apps.apple.com/us/app/xcode/id497799835?mt=12) or [Android Studio](https://developer.android.com/studio) to work on this 
project. It doesn't matter which one you use. You'll be working on the JavaScript code in whatever text editor you like (many of us 
use [VSCode](https://code.visualstudio.com)). The IDE is used only to wrap the JavaScript and package it for Android or iOS devices.

### Tookit prerequisites

- Nodejs v12.16.1 or later. You can download a prebuilt Nodejs installer from [https://nodejs.org/](https://nodejs.org/en/).
- [yarn v1.19.1](https://yarnpkg.com). Install Yarn with `npm install --global yarn`, or perhaps `sudo npm install --global yarn`.
- [react-native-cli](https://www.npmjs.com/package/react-native-cli). Install react-native-cli with `npm install –g react-native-cli`, or perhaps `sudo npm install –g react-native-cli`.

This is a one-time setup for each computer you'll do Yarn/react-native-cli development on.

Although we no longer use the Expo platform, there are still some Expo-prefixed node modules in use. This is not an oversight.

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
or something else. 

For project administrators: when you update `envVariables.ts`
* If it's the production version, execute the command `shasum -a 512 envVariables.ts > checksum-prod.txt` and commit `checksum-prod.txt` to the repository.
* If it's the development version, execute the command `shasum -a 512 envVariables.ts > checksum-dev.txt` and commit `checksum-dev.txt` to the repository.

For Google map functionality we have to add "google api key" in the below file
* AndroidManifest.xml
    - Path: `app/src/main/AndroidManifest.xml`
    - Desc: Please add Google API key in `com.google.android.geo.API_KEY` meta tag.

### Running in a simulator

In your terminal window, change directories to the project root. Then

- iOS:
```
    open /Applications/Xcode.app/Contents/Developer/Applications/Simulator.app
    npx react-native run-ios
```
- Android:
```
    npx react-native run-android
```

This command launches a `metroServer` on your computer and loads the JavaScript source code for the project.

Possible failure modess:
- The iOS Simulator must already be running and have finished booting. If not, you'll see
```
error Failed to launch the app on simulator, An error was encountered processing the command (domain=com.apple.CoreSimulator.SimError, code=405):
```
To fix it, launch the iOS Simulator, choose `File -> New Simulator` from the menu bar, wait for it to finish booting, and then run the `npx` command again.
- If your simulator shows a red box at the top with lots of console spew, the most likely cause is that communication with the `metroServer` has failed. Kill the `metroServer`
and run the `npx` command again.


### Running on a real mobile device

You'll want to use a real mobile device if you're doing anything with the camera.
- [Android](documentation/Android_Local_Dev.md)
- [iOS](documentation/Apple_Local_Dev.md) You'll be using Xcode. You can also use Xcode to run the project on the Simulator, if you prefer that instead of the command line.

To create a standalone native build that we can submit to the iOS App Store, we need to create a cryptographically signed `.xcarchive` file using Xcode. That procedure
is described in the [iOS](documentation/Apple_Local_Dev.md) document too.

## Interacting with the Android Simulator

when you run `npx react-native run-android` it run the application on all devices which enabled debug mode.

To obtain a standalone native build, we have `android` folder that contain native code for our application,
by open it on Android Studio, we can make signed APK. 

## Linting

This project has configured [Eslint](https://eslint.org/) with recommended typescript and react rules.

## Production builds 

Do not change version or build number yourself. Follow the procedures documented in the [App store release instructions](documentation/Release_Instructions.md).
Version and build numbers *_must_* be changed simultaneously for the Android and iOS versions. The version update must be a single commit,
performed in the `release` branch, and is the _only_ operation in that commit. 

