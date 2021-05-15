import * as firebase from 'firebase'

export interface UserData {
  email: string
  username: string
  badges: Array<string>
  treesCount: number
}

export const firebaseImagePath = {
  trees: (fileName: string) => `trees/${fileName}`,
}

export function signOutUser(): void {
  firebase.auth().signOut()
}

const USERS_COLLECTION = 'users'

export function userDataListener(
  uid: string,
  onUserDataChange: (user: UserData | undefined) => void,
): () => void {
  return firebase
    .firestore()
    .collection(USERS_COLLECTION)
    .doc(uid)
    .onSnapshot((doc) => {
      onUserDataChange(doc.data() as UserData | undefined)
    })
}

export function getUser(uid: string): Promise<UserData | undefined> {
  return firebase
    .firestore()
    .collection(USERS_COLLECTION)
    .doc(uid)
    .get()
    .then((user) => {
      if (user.exists) {
        return user.data() as UserData
      }

      return undefined
    })
    .catch(() => {
      return undefined
    })
}

export function setUser(user: { username: string; uid: string; email: string }): void {
  firebase.firestore().collection(USERS_COLLECTION).doc(user.uid).set({
    username: user.username,
    email: user.email,
    created_at: firebase.firestore.FieldValue.serverTimestamp(),
  })
}

export function updateBadges(
  uid: string,
  badges: Array<string>,
  treesCount: number,
): Promise<void> {
  return firebase.firestore().collection(USERS_COLLECTION).doc(uid).update({
    badges: badges,
    treesCount: treesCount,
  })
}

export type ImageDownloadUrl = string

export function uploadImage(
  firebaseStoragePath: string,
  imageBlob: Blob,
): Promise<ImageDownloadUrl> {
  const storageRef = firebase.storage().ref()
  const imageRef = storageRef.child(firebaseStoragePath)

  const uploadTask = imageRef.put(imageBlob)

  return new Promise((resolve, reject) => {
    uploadTask
      .then((snapshot) => snapshot.ref.getDownloadURL())
      .then((url: string) => resolve(url))
      .catch(() => {
        reject()
      })
  })
}

export function getCurrentAuthUser() {
  return firebase.auth().currentUser
}
