import * as firebase from 'firebase'

const refs = {
  users: 'users',
}

export function signOutUser(): void {
  firebase.auth().signOut()
}

export function setUser(user: { uid: string; email: string }): void {
  firebase
    .database()
    .ref(`${refs.users}/${user.uid}`)
    .set({
      email: user.email,
      created_at: Date.now(),
    })
}
