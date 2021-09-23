import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

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
    auth().signOut()
}

const USERS_COLLECTION = 'users'

export function userDataListener(
  uid: string,
  onUserDataChange: (user: UserData | undefined) => void,
): () => void {
  return firestore()
    .collection(USERS_COLLECTION)
    .doc(uid)
    .onSnapshot((doc) => {
      try {
        onUserDataChange(doc.data() as UserData | undefined)
      } catch (error) {

      }
    })
}

export function getUser(uid: string): Promise<UserData | undefined> {
  return firestore()
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
  firestore().collection(USERS_COLLECTION).doc(user.uid).set({
    username: user.username,
    email: user.email,
    created_at: firestore.FieldValue.serverTimestamp(),
  })
}

export function updateBadges(
  uid: string,
  badges: Array<string>,
  treesCount: number,
): Promise<void> {
  return firestore().collection(USERS_COLLECTION).doc(uid).update({
    badges: badges,
    treesCount: treesCount,
  })
}

export type ImageDownloadUrl = string

export function uploadImage(
  firebaseStoragePath: string,
  imageUri: string,
): Promise<ImageDownloadUrl> {
  const imageRef = storage().ref(firebaseStoragePath);
  const uploadTask = imageRef.putFile(imageUri);

  return new Promise((resolve, reject) => {
    uploadTask.then(() => {
      imageRef
        .getDownloadURL()
        .then(async (url) => {
          resolve(url)
        });
    }).catch((e) => reject());
  })
}

export function getCurrentAuthUser() {
  return auth().currentUser
}
