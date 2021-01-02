# Releasing to the app stores

## To release a version:
* `git checkout develop`
* `git pull` (to make sure you're starting with the newest code in the `develop` branch)
* `git checkout master`
* `git pull` (to make sure you're starting with the newest code in the `master` branch)
* `git merge develop`
* Edit `app.json`. Increment `version`, `versionCode`, and `bundleNumber`. Keep `versionCode` (the Android store build number) and `bundleNumber` (the Apple store build number) set to the same incremented value.
* Commit your changes to `app.json` (`git add app.json`, `git commit 'updating build number and version number'`, `git push`.
* Build your archive and post it to the relevant store.
    - For iOS, start the build using `expo build:ios`. Choose "archive". When the `.ipa` file is ready on Fastlane, submit it to the App Store using Apple's "Transporter" app.
    - For Android, .... (instructions needed here)
* Notify the team (on Slack) ("I've updated to version 1.1, build number 92, and built/submitted the Android version. iOS version still needs to be done"). If you built the iOS version, the Android build master needs only to pull `master` and build what's there, and vice versa if it's Android that's getting built first. Keep version number and build number in sync for the two platforms. Now merge your changes back to `develop`:
    * `git checkout develop`
    * `git merge master`
    * `git push`

## Releasing app to the Play Store (Android)

First you have to obtain google map key:
- google map config - https://docs.expo.io/versions/latest/sdk/map-view/#deploying-to-a-standalone-app-on-android

Then you can follow these instructions: https://docs.expo.io/distribution/app-stores/

## Releasing app to the App Store (iOS)

Expo documentation continually refers to building for Testflight. That's incorrect. You build for the App Store 
(specifically appstoreconnect.apple.com). Maybe you release a build on Testflight, maybe you don't. Maybe you release
it straight to the App Store. Maybe you don't release it anywhere because Apple review finds problems, or because you
want to include a new feature. But every time, you're building for upload to App Store Connect.

There are three parts to putting an app into the App Store: generating a signing profile, generating an App Store
entry, and putting a particular build into the store. Expo will automate all of these phases. Their toolset and
documentation handles the first two as one step. Expo will also attempt to pull down defining information
from App Store Connect (specifically, the distribution certificate and the signing profile) on each build,
to make sure that Expo is using current information.

Builds happen on the Expo server, using Fastlane. Your `Info.plist` is created by Expo, based on the values in 
`app.json`.

### Builds
Start the build using `expo build:ios`. Choose "archive" (for App
Store builds) or "simulator" (for Simulator testing).

After you start a build, you'll see a URL starting with `https://expo.io/dashboard/` that 
you can use to monitor the build.

At the end of the build, you'll see a URL starting with `https://expo.io/artifacts`
which is the location of your build product. For "archive" builds it's
an  IPA (the archive containing your iPhone application). For
"simulator" builds it's a .tar file.

If you built for App Store submission, download the IPA and upload it to the
Apple App Store using either the [Transporter](https://apps.apple.com/us/app/transporter/id1450874784?mt=12) GUI tool,
or using `xcrun altool` from the command line:

```
$ xcrun altool --upload-app --type ios --file <IPA_FILE_THAT_YOU_HAVE_UPLOAD_FROM_EXPO_BUILD> --username "YOUR_APPLE_ID_USER" --password "YOUR_ITMC_PASSWORD"
```

`xcrun altool` provides no feedback while running.

According to [Expo documentation on App Store uploads](https://docs.expo.io/distribution/uploading-apps/#22-if-you-choose-to-upload-your), 
Expo can handle the upload automatically. This would be a nice option for minor updates from a machine that can't 
run Xcode.

### Posting a build to App Store Connect

You must increment `buildNumber` in the `"ios"`dictionary for each new upload to the App Store. If `"version"` 
is "1.0.0"` and `"buildNumber"` is `"3"`, App Store Connect will display "1.0.0 (3)" for version information.
If you've already uploaded "1.0.0 (3)", you can't upload it again. Increment the build number, and upload "1.0.0 (4)".

A build must pass App Store review before being released to the App Store or to public Testflight. Team members
(who are listed in the organization's developer page, 
see [https://developer.apple.com/support/roles/](https://developer.apple.com/support/roles/)) have immediate
Testflight access to all builds. Public Testflight reviewers are added
manually by email invitation, or automatically (and anonymously) if a
public link is enabled.

To submit an uploaded build for Testflight review, use the Testflight menu,
and choose a build instance. New testflight builds are not
automatically released to public testers; you'll have to do this
manually after approval. Provide a support email address (someone who
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

