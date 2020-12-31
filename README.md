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

 The `master` branch is where all releases are built from. __You will not do any work in `master` unless you are deploying a release
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

## Development

This project uses [Expo](https://expo.io). Here is a guide how to [get
started with
expo](https://docs.expo.io/versions/latest/get-started/installation). Expo
is a development tool that runs interpreted JavaScript on your mobile device,
in debug mode. It can also submit builds to a Fastlane remote compiler
instance, to create native builds suitable for standalone installation
or for submission to the Android or Apple app store.

You do not need Xcode or Android Studio to work on this project.

### Prerequisites

- Nodejs v12.16.1 or later. You can download a prebuilt Nodejs installer from [https://nodejs.org/](https://nodejs.org/en/).
- [yarn v1.19.1](https://yarnpkg.com). Install Yarn with `npm install --global yarn`, or perhaps `sudo npm install --global yarn`.
- [expo-cli v3.16](https://www.npmjs.com/package/expo-cli). Install Expo with `npm install --global expo-cli`, or perhaps `sudo npm install --global expo-cli`.

This is a one-time setup for each computer you'll do Yarn/Expo development on.

### Installation

From the project's root directory run:

```bash
yarn install
```

This sets up Yarn for the iSeaTree project directory.

Note: you'll probably have to run `yarn install` after a git pull, if the updated code has added React libraries or changed library versions.

### Secrets

`envVariables.ts` file holds all secret keys (api keys etc). It should
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

### Running

```bash
yarn start
```

This command launches a webserver on your computer and loads the source code for the project. Then you'll scan the displayed 
QR code with your iOS or Android device, which will load an interpreted version of the project from the local 
webserver into the Expo app on your device. 

If you have Android Studio or Xcode installed on your computer, You can also use the `a` or `i` commands within Yarn
to load iSeaTree into an emulator.

## Linting

This project has configured [Eslint](https://eslint.org/) with recommended typescript and react rules.

## Interacting with the iOS Simulator

When Expo commands touch the Simulator, the commands will work with the most
recently launched instance, even if that's not the instance you last
used yourself.

`expo-cli client:install:ios` installs the Expo client to the
Simulator. If another app is running, that app won't be disturbed, but
you'll see the Expo icon on your home screen if you look for it. Log
in to your Expo account and you'll see any Expo projects you've built,
hopefully including iSeaTree. iPad
simulators show the app in full-screen mode. This is misleading,
because the native build comes up in 1x letterboxed mode.

To obtain a native build for the Simulator, use `expo build:ios` (you'll first need to establish a free Expo account). At the
prompt, select "simulator". This will launch a build in the Expo
build queue, and eventually return the URL of a downloadtable .tar
file. Expand the .tar file and you'll see the iSeaTree app, marked as
unlaunchable. Drag that app onto your simulator's screen (it will
appear on the second page of the Home screen, which you'll have to
page to see). Building the
native app takes a while, but launching iSeaTree in multiple
simulators (which is necessary for making screenshots) is faster this
way.

