import { firestore } from 'firebase'

import { TreeTypes } from '../treeData'

interface TreePhoto {
  width: number
  height: number
  url: string
}

export interface TreeData {
  userId: string
  photo: TreePhoto
  coords: firestore.GeoPoint
  speciesNameScientific: string
  speciesNameCommon: string
  dbh: number
  treeType: TreeTypes
  landUseCategory: string
  notes: string | null
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
