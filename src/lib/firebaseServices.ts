import * as firebase from 'firebase'

const collections = {
  users: 'users',
}

export function signOutUser(): void {
  firebase.auth().signOut()
}

export function addUser(user: { uid: string; email: string }): void {
  firebase.firestore().collection(collections.users).add({
    email: user.email,
    created_at: firebase.firestore.FieldValue.serverTimestamp(),
  })
}
