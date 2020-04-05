import * as firebase from 'firebase'

import { uploadTreeImage } from './uploadTreeImage'
import { FormValues } from '../addTreeForm'
import { addTree, TreeData } from '../../../lib/firebaseServices/addTree'
import { getSpeciesNames } from '../SpeciesSelect'

export async function submitTreeData(formValues: FormValues): Promise<void> {
  const user = firebase.auth().currentUser

  if (!user) {
    throw Error('User is not authenticated')
  }

  if (
    !formValues.photo ||
    !formValues.speciesNameId ||
    !formValues.landUseCategory ||
    !formValues.coords
  ) {
    throw Error('Invalid form values')
  }

  const speciesNames = getSpeciesNames(formValues.speciesNameId)

  if (!speciesNames) {
    throw Error('Could not find species name')
  }

  const imageDownloadUrl = await uploadTreeImage(formValues.photo.uri)
  const treeCoords = new firebase.firestore.GeoPoint(
    formValues.coords.latitude,
    formValues.coords.longitude,
  )

  const treeData: TreeData = {
    userId: user.uid,
    speciesNameCommon: speciesNames.COMMON,
    speciesNameScientific: speciesNames.SCIENTIFIC,
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
