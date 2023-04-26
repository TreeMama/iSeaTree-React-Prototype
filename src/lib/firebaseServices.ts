/* This is a module written in TypeScript that provides functions for interacting with Firebase
authentication, Firestore database, and storage. It exports functions for user authentication,
getting and setting user data, uploading images, and deleting user accounts. It also defines
interfaces for user data and a constant for Firebase storage path. The module includes functions for
listening to user data changes, getting user data, setting user data, updating user badges,
uploading images, and deleting user accounts. It also includes a function for getting the current
authenticated user and a function for updating trees and deleting user accounts. */
/* This is a module written in TypeScript that provides functions for interacting with Firebase
authentication, Firestore database, and storage. It exports functions for user authentication,
getting and setting user data, uploading images, and deleting user accounts. It also defines
interfaces for user data and a constant for Firebase storage path. */
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

/* Defining an interface named `UserData` that specifies the shape of an object that represents user
data. The interface includes properties for the user's email, username, an array of badges, the
number of trees the user has, and an avatar seed. This interface can be used to ensure that user
data is properly formatted and to provide type checking when working with user data in the code. */

export interface UserData {
  email: string
  username: string
  badges: Array<string>
  treesCount: number
  avatarSeed: string
};

/* `export const firebaseImagePath` is a constant that defines an object with a single property
`trees`. The value of `trees` is a function that takes a `fileName` argument and returns a string
that represents the path to a Firebase storage location for tree images. The path includes the
`trees` directory and the `fileName` argument. This constant can be imported and used in other parts
of the code to reference the Firebase storage path for tree images. */

export const firebaseImagePath = {
  trees: (fileName: string) => `trees/${fileName}`,
};

/**
 * This function signs out the current user.
 */
export function signOutUser(): void {
  auth().signOut();
};

const USERS_COLLECTION = 'users';
const TREES_COLLECTION = 'trees';

/**
 * This TypeScript function listens for changes to a user's data in a Firestore database and calls a
 * callback function with the updated user data.
 * @param {string} uid - A string representing the unique identifier of a user in the database.
 * @param onUserDataChange - onUserDataChange is a callback function that takes in a single parameter
 * of type UserData or undefined. This function will be called whenever there is a change in the user
 * data for the specified uid. The purpose of this function is to allow the caller to handle the
 * updated user data in their own way.
 * @returns The function `userDataListener` returns another function that can be used to unsubscribe
 * the listener. This returned function takes no arguments and when called, it unsubscribes the
 * listener from the Firestore document.
 */
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

/**
 * This function retrieves user data from a Firestore collection based on a given user ID.
 * @param {string} uid - The `uid` parameter is a string representing the unique identifier of a user
 * in a Firebase Firestore database. It is used to retrieve the user's data from the `USERS_COLLECTION`
 * collection.
 * @returns The function `getUser` returns a Promise that resolves to either a `UserData` object or
 * `undefined`. If the user with the given `uid` exists in the `USERS_COLLECTION` in Firestore, the
 * function returns the user data as a `UserData` object. If the user does not exist, the function
 * returns `undefined`. If there is an error while fetching the user data, the function
 */
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

/**
 * This TypeScript function sets user data in a Firestore collection.
 * @param user - The `user` parameter is an object that contains the following properties:
 */
export function setUser(user: { username: string; uid: string; email: string }): void {
  firestore().collection(USERS_COLLECTION).doc(user.uid).set({
    username: user.username,
    email: user.email,
    created_at: firestore.FieldValue.serverTimestamp(),
  });
};

/**
 * This function updates the avatarSeed field of a user document in a Firestore collection.
 * @param {string} uid - A string representing the unique identifier of a user in the Firebase
 * authentication system.
 * @param {string} seed - The `seed` parameter is a string that represents the unique identifier for
 * the user's avatar. It can be used to generate a consistent avatar image for the user across
 * different platforms or devices.
 */

export function setUserAvatarSeed(uid: string, seed: string): void {
  firestore().collection(USERS_COLLECTION).doc(uid).update({ avatarSeed: seed });
}

/**
 * This TypeScript function updates the badges and treesCount fields of a user document in a Firestore
 * collection.
 * @param {string} uid - A string representing the unique identifier of a user in the database.
 * @param badges - An array of strings representing the badges that the user has earned.
 * @param {number} treesCount - The `treesCount` parameter is a number that represents the total number
 * of trees a user has planted. It is used to update the `treesCount` field in the user's document in
 * the Firestore database.
 * @returns The function `updateBadges` is returning a Promise that resolves to `void`.
 */

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

/**
 * This TypeScript function uploads an image to Firebase storage and returns a promise containing the
 * download URL of the uploaded image.
 * @param {string} firebaseStoragePath - A string representing the path to the location in Firebase
 * Storage where the image will be uploaded.
 * @param {string} imageUri - The imageUri parameter is a string that represents the local file path or
 * URL of the image that needs to be uploaded to Firebase Storage.
 * @returns The function `uploadImage` returns a Promise that resolves to an `ImageDownloadUrl`.
 */

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

/**
 * This function returns the current authenticated user.
 * @returns The `getCurrentAuthUser` function is returning the current authenticated user object from
 * Firebase Authentication.
 */

export function getCurrentAuthUser() {
  return auth().currentUser
};

/**
 * This function updates all trees associated with a user and deletes the user's account.
 * @param {any} uid - The `uid` parameter is a unique identifier for a user account.
 * @returns The function does not have a return statement, so it will return undefined by default.
 */
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