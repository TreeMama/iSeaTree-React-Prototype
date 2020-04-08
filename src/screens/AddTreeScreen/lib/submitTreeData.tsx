import * as firebase from 'firebase'

import { uploadTreeImage } from './uploadTreeImage'
import { FormValues } from '../addTreeForm'
import { addTree, TreeData } from '../../../lib/firebaseServices/addTree'
import { getSpeciesNames } from '../SpeciesSelect'
import { getCurrentUser } from '../../../lib/firebaseServices'

export async function submitTreeData(formValues: FormValues): Promise<void> {
  const user = getCurrentUser()

  if (!user) {
    throw Error('User is not authenticated')
  }

  if (
    !formValues.photo ||
    !formValues.speciesData ||
    !formValues.landUseCategory ||
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
    dbh: Number(formValues.dbh),
    treeType: formValues.treeType,
    landUseCategory: formValues.landUseCategory,
    notes: formValues.notes || null,
    photo: {
      url: imageDownloadUrl,
      width: formValues.photo.width,
      height: formValues.photo.height,
    },
    coords: treeCoords,
  }

  return addTree(treeData)
}
