import * as firebase from 'firebase'

import { uploadTreeImage } from './uploadTreeImage'
import { FormValues } from '../addTreeForm'
import { addTree, TreeData } from '../../../lib/firebaseServices/addTree'
import { getCurrentAuthUser, getUser } from '../../../lib/firebaseServices'

export async function submitTreeData(formValues: FormValues): Promise<FormValues> {
  const authUser = getCurrentAuthUser()

  if (!authUser) {
    throw Error('User is not authenticated')
  }

  const userData = await getUser(authUser.uid)

  if (
    !formValues.photo ||
    !formValues.speciesData ||
    !formValues.landUseCategory ||
    !formValues.locationType ||
    !formValues.coords ||
    !userData
  ) {
    throw Error('Invalid form values')
  }

  const imageDownloadUrl = await uploadTreeImage(formValues.photo.uri)
  const treeCoords = new firebase.firestore.GeoPoint(
    formValues.coords.latitude,
    formValues.coords.longitude,
  )

  const treeData: TreeData = {
    userId: authUser.uid,
    username: userData.username,
    speciesNameCommon: formValues.speciesData.COMMON,
    speciesNameScientific: formValues.speciesData.SCIENTIFIC,
    dbh: formValues.dbh,
    treeType: formValues.treeType,
    landUseCategory: formValues.landUseCategory,
    locationType: formValues.locationType,
    notes: formValues.notes || null,
    photo: {
      url: imageDownloadUrl,
      width: formValues.photo.width,
      height: formValues.photo.height,
    },
    coords: treeCoords,
    isValidated: false,
  }

  addTree(treeData)

  return formValues
}
