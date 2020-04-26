import * as firebase from 'firebase'

import { uploadTreeImage } from './uploadTreeImage'
import { FormValues } from '../addTreeForm'
import { addTree, TreeData } from '../../../lib/firebaseServices/addTree'
import { getCurrentAuthUser } from '../../../lib/firebaseServices'
import { SpeciesData } from '../SpeciesSelect'

export async function submitTreeData(formValues: FormValues): Promise<FormValues> {
  const user = getCurrentAuthUser()

  if (!user) {
    throw Error('User is not authenticated')
  }

  if (
    !formValues.photo ||
    !formValues.speciesData ||
    !formValues.landUseCategory ||
    !formValues.locationType ||
    !formValues.coords
  ) {
    throw Error('Invalid form values')
  }

  const imageDownloadUrl = await uploadTreeImage(formValues.photo.uri)
  const treeCoords = new firebase.firestore.GeoPoint(
    formValues.coords.latitude,
    formValues.coords.longitude,
  )

  const treeData: TreeData = {
    userId: user.uid,
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
