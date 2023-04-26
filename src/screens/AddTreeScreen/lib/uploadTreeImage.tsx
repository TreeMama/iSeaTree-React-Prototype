/**
 * This function uploads a tree image to Firebase storage and returns the download URL.
 * @param {string} imageUri - The `imageUri` parameter is a string that represents the URI (Uniform
 * Resource Identifier) of an image file. It is used as the source of the image that will be uploaded
 * to Firebase storage.
 * @returns The function `uploadTreeImage` is returning a Promise that resolves to an
 * `ImageDownloadUrl`. This `ImageDownloadUrl` is the URL of the uploaded image in Firebase storage.
 */
import { v4 as uuidV4 } from 'uuid'

import { uploadImage, firebaseImagePath, ImageDownloadUrl } from '../../../lib/firebaseServices'

export async function uploadTreeImage(imageUri: string): Promise<ImageDownloadUrl> {
  const response = await fetch(imageUri)
  const blob = await response.blob()

  const fileName: string = uuidV4()
  const firebaseStoragePath = firebaseImagePath.trees(`${fileName}.jpg`)

  return uploadImage(firebaseStoragePath, imageUri)
}
