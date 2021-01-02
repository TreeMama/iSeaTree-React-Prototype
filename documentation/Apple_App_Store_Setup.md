# One-time setup on your Apple developer account

Create an app-specific password in developer account, if you want. Hal tried but the Expo build tools weren't 
able to authenticate using the app-specific password.

If you have not generated the deployable iOS version of your app with Expo before, then the first time your 
run `expo build:ios` you'll see a series of questions of 
questions about App Store Connect credentials. Expo can handle creation of provisioning profile. This worked smoothly 
and was easier than populating fields by hand.

In App Store Connect, you will see a newly-created entry for iSeaTree. Upload the icon (`icon.png` in 
the `assets` folder). Populate the remaining fields.

