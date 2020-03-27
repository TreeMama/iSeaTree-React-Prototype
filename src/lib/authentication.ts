import * as firebase from 'firebase'

/**
 * Creates and authenticates an user.
 */
export function createUserWithEmailAndPassword({
  email,
  password,
}: {
  email: string
  password: string
}): Promise<any> {
  return firebase.auth().createUserWithEmailAndPassword(email, password)
}
