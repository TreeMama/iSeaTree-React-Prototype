import { v4 as uuidV4 } from 'uuid'

import { uploadImage, firebaseImagePath, ImageDownloadUrl } from '../../../lib/firebaseServices'

export async function uploadTreeImage(imageUri: string): Promise<ImageDownloadUrl> {
  const response = await fetch(imageUri)
  const blob = await response.blob()

  const fileName: string = uuidV4()
  const firebaseStoragePath = firebaseImagePath.trees(`${fileName}.jpg`)

  return uploadImage(firebaseStoragePath, blob)
}
