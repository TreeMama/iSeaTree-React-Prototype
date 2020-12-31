# Firebase - Setup

This work has already been done for the project. You do not need to set up Firebase again. Instructions are included for 
reference.

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


