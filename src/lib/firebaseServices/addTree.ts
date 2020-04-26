import { firestore } from 'firebase'

import { TreeTypes } from '../treeData'

interface TreePhoto {
  width: number
  height: number
  url: string
}

export interface TreeData {
  userId: string
  username: string
  photo: TreePhoto
  coords: firestore.GeoPoint
  speciesNameScientific: string
  speciesNameCommon: string
  dbh?: string
  treeType: TreeTypes
  landUseCategory: string
  locationType: string
  notes: string | null
  isValidated: boolean
}

const TREES_COLLECTION = 'trees'

export function addTree(treeData: TreeData) {
  firestore()
    .collection(TREES_COLLECTION)
    .add({
      ...treeData,
      created_at: firestore.FieldValue.serverTimestamp(),
    })
}
