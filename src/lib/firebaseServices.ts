/* This is a module written in TypeScript that provides functions for interacting with Firebase
authentication, Firestore database, and storage. It exports functions for user authentication,
getting and setting user data, uploading images, and deleting user accounts. It also defines
interfaces for user data and a constant for Firebase storage path. */
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

export interface UserData {
  email: string
  username: string
  badges: Array<string>
  treesCount: number
  avatarSeed: string
};

export const firebaseImagePath = {
  trees: (fileName: string) => `trees/${fileName}`,
};

export function signOutUser(): void {
  auth().signOut();
};

const USERS_COLLECTION = 'users';
const TREES_COLLECTION = 'trees';

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
        console.log('userDataListener error', error)
      }
    });
};

export function getUser(uid: string): Promise<UserData | undefined> {
  return firestore()
    .collection(USERS_COLLECTION)
    .doc(uid)
    .get()
    .then((user) => {
      if (user.exists) {
        return user.data() as UserData;
      }

      return undefined;
    })
    .catch(() => {
      return undefined;
    });
};

export function setUser(user: { username: string; uid: string; email: string }): void {
  firestore().collection(USERS_COLLECTION).doc(user.uid).set({
    username: user.username,
    email: user.email,
    created_at: firestore.FieldValue.serverTimestamp(),
  });
};

export function setUserAvatarSeed(uid: string, seed: string): void {
  firestore().collection(USERS_COLLECTION).doc(uid).update({ avatarSeed: seed });
}

export function updateBadges(
  uid: string,
  badges: Array<string>,
  treesCount: number,
): Promise<void> {
  return firestore().collection(USERS_COLLECTION).doc(uid).update({
    badges: badges,
    treesCount: treesCount,
  });
};

export type ImageDownloadUrl = string;

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
          resolve(url);
        });
    }).catch((e) => reject());
  });
};

export function getCurrentAuthUser() {
  return auth().currentUser
};

export async function updateTreeAndDeleteAccount(uid: any) {
  if (uid) {
    const treesRef = await firestore().collection(TREES_COLLECTION).where("userId", "==", uid);
    const snapshot = await treesRef.get();

    console.log('query snapshot size of trees colllection +++', snapshot.size);

    if (snapshot.size) {
      await snapshot.forEach(async (doc) => {
        console.log("tree find case id +++", doc.id);
        const treeDocumentRef = firestore().doc(`${TREES_COLLECTION}/${doc.id}`);
        try {
          await treeDocumentRef.update({
            userId: -1,
          });
        } catch (error) {
          console.error("error update tree document +++", error);
        }
      });
    } else {
      console.log('no tree there for user case +++');
    };

    firestore()
      .collection(USERS_COLLECTION)
      .doc(uid)
      .onSnapshot(async (doc) => {
        try {
          const userDocumentRef = firestore().doc(`${USERS_COLLECTION}/${doc.id}`);
          try {
            await userDocumentRef.delete().then(() => {
              console.log('user document deleted +++');
              const user = auth().currentUser;
              user && user.delete().then(() => {
                console.log('user account deleted +++');
              }).catch((error) => {
                console.error("error delete user account +++", error);
              });
            }).catch(e => console.log('user document delete exception +++', e));
          } catch (error) {
            console.error("error delete user document +++", error);
          };
        } catch (error) {
          console.log('get user document error', error)
        }
      });
  } else {
    console.log('there is no uid +++');
    return;
  }
};