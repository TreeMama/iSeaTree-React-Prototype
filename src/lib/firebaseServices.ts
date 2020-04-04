import * as firebase from 'firebase'

const collections = {
  users: 'users',
}

export const firebaseImagePath = {
  trees: (fileName: string) => `trees/${fileName}`,
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
