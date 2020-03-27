import * as firebase from 'firebase'
import { envVariables } from '../../envVariables'

export function initializeFirebase() {
  firebase.initializeApp({
    apiKey: envVariables.FIREBASE.API_KEY,
    authDomain: envVariables.FIREBASE.AUTH_DOMAIN,
    databaseURL: envVariables.FIREBASE.DATABASE_URL,
    storageBucket: envVariables.FIREBASE.STORAGE_BUCKET,
  })
}
