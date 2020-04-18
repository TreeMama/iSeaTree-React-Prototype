# iSeaTree-React-Prototype

Prototype for the iSeaTree (a mobile app which creates compatible data collection for the iTree project).

## Development

Project was initialized using [Expo](https://expo.io). Here is a guide how to [get-started with expo](https://docs.expo.io/versions/latest/get-started/installation).

### Prerequisites

- node v12.16.1
- [yarn v1.19.1](https://yarnpkg.com)
- [expo-cli v3.16](https://www.npmjs.com/package/expo-cli)

### Instalation

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

## Firebase

This project is using Firebase Firestore database.

Database needs certain rules to works correctly. Visit https://firebase.google.com/docs/firestore/security/get-started to learn more about security rules.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
    	allow read, update, delete: if request.auth.uid == userId;
      allow create: if request.auth.uid != null;
    }

    match /users/{userId} {
    	allow read, update, delete: if request.auth.uid == resource.data.userId;
      allow create: if request.auth.uid != null;
    }
  }
}
```

## Releasing app to the Play Store (Android)

- google map config - https://docs.expo.io/versions/latest/sdk/map-view/#deploying-to-a-standalone-app-on-android
