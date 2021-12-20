# Releasing to the app stores

## To release a version:
* Preparation:
    * `git checkout develop`
    * `git pull` (to make sure you're starting with the newest code in the `develop` branch)
    * `git checkout release`
    * `git pull` (to make sure you're starting with the newest code in the `release` branch)
    * `git merge develop`
* Edit `BuildNumber.txt` and `VersionString.txt`. For a new upload to an app store (Android or Apple), you must 
increment the integer in `BuildNumber.txt`. You may also update `VersionString.txt`. If we are iterating with 
public betas to produce a final release, we might have several different builds with the same VersionString but
incrmented build numbers, for example `2.3 (57)`, `2.3 (58)`, etc.
* Do not edit `build.gradle` or `Info.plist`. The correct version and build numbers are set by the build tools,
based on what is in `BuildNumber.txt` and `VersionString.txt`. This allows us to keep iOS and Android version
numbers in sync with each other. Android uses a `file()` call in `build.gradle`. iOS uses a custom Run Script
build phase in the .`xcodeproj` file.
* Commit your changes to `BuildNumber.txt` and `VersionString.txt`: 
    * `git add VersionString.txt BuildNumber.txt`
    * `git commit -m 'updating build number and version number'`
    * `git push`
* Now merge your changes back to `develop`:
    * `git checkout develop`
    * `git merge release`
    * `git push`
* Tag your release using the version and build number. For version 2.3.1, build number 57, the tag is 2.3.1.57. This step makes it easy for another developer to switch to the exact version
of the source code that was used to build that release (`git checkout 2.3.1.57`).
    * `git tag 2.3.1.57`
    * `git push --tags` 
* Build your archive (for Android, for iOS, or both) and post it to the relevant stores.
* Notify the team (on Slack) ("I've updated to version 1.1, build number 92, and built/submitted the Android 
version. iOS version still needs to be done"). If you built the iOS version, the Android build manager needs 
only to pull `release` and build what's there, and vice versa if it's Android that's getting built first. 


## Releasing app to the Play Store (Android)

First you have to obtain google map key:
- google map config - https://docs.expo.io/versions/latest/sdk/map-view/#deploying-to-a-standalone-app-on-android

Then you can follow these instructions: https://docs.expo.io/distribution/app-stores/

## Releasing app to the App Store (iOS)

When you build for the iOS App Store, you'll build an `xcarchive` file, just as you would for any other iOS app.

Upload your `xcarchive` to the Apple App Store using Xcode.

### Posting a build to App Store Connect

A build must pass App Store review before being released to the App Store or to public Testflight. Team members
(who are listed in the organization's developer page, 
see [https://developer.apple.com/support/roles/](https://developer.apple.com/support/roles/)) have immediate
Testflight access to all builds. Until we become a registered corporation, we must use an individual app store profile,
and there is only one team member, the owner of that account.

Public Testflight reviewers are added
manually by email invitation, or automatically (and anonymously) if a
public link is enabled.

To submit an uploaded build for Testflight review, use the Testflight menu,
and choose a build instance. New Testflight builds are not
automatically reviewed for release to public testers; you'll have to do this
manually after upload. Provide a support email address (someone who
will receive emails specifically sent from the Testflight testers), and a
privacy policy URL.

To submit an uploaded build for App Store review, verify the app
description, keywords, categories, support URL, marketing URL, and screenshots. 
Optionally, supply app preview videos (you can capture these
on device). You can't change
any of these after public release (but you _can_ update them during the TestFlight beta cycle). 
Updating them after public release requires a new
version. The "promotional text" field can be modified without a new
release. Click "Submit for review" and follow the prompts. When asked
if the app uses the IDFA advertising identifier, the answer is Yes,
because Expo uses the Segment Analytics, which uses it.

Screenshot devices required, as of May 2020, are iPhone
6.5" display (11 Pro Max, 11, Xs Max), iPhone 5.5" display (6s Plus, 7
Plus, 8 Plus), and iPad Pro 12.9" (3rd Gen). Don't use
the iPhone XR because the screenshots are half the pixel density of
the other 6.5" devices, and they won't pass Apple review.

