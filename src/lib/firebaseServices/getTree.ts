/* eslint-disable @typescript-eslint/camelcase */
import { TreeTypes, TreeValidationTypes } from './../treeData'
import { firestore } from 'firebase'

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
  estmated_dbh: boolean
  treeType: TreeTypes
  landUseCategory: string
  treeConditionCategory: string
  crownLightExposureCategory: string
  locationType: string
  notes: string | null
  isValidated: TreeValidationTypes
  level: string
  modelName: string | null
  os_name: string | null
  os_version: string | null
  applicationVersion: string | null
  BuildVersion: string | null
  brand: string | null
}

const TREES_COLLECTION = 'trees'

export function getTree(userId: any) {
  firestore()
    .collection(TREES_COLLECTION)
    // .where('userId', '==', userId)
    .get()
    .then(data => {
      let trees: any = [];
      data.forEach((doc) => {
        trees.push(doc.data());
      });
      return trees;
    })

}
