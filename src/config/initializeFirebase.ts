import * as firebase from 'firebase'
import 'firebase/firestore'

import { envVariables } from '../../envVariables'

export function initializeFirebase() {
  firebase.initializeApp({
    appId: envVariables.FIREBASE.APP_ID,
    apiKey: envVariables.FIREBASE.API_KEY,
    authDomain: envVariables.FIREBASE.AUTH_DOMAIN,
    databaseURL: envVariables.FIREBASE.DATABASE_URL,
    storageBucket: envVariables.FIREBASE.STORAGE_BUCKET,
    projectId: envVariables.FIREBASE.PROJECT_ID,
  })
}
