/* This is a TypeScript file that defines interfaces and functions related to tree data. The `/*
eslint-disable @typescript-eslint/camelcase. comment disables a linting rule that requires
camelCase naming convention for variables and properties. The `TreePhoto` interface defines the
shape of an object that represents a photo of a tree. The `TreeData` interface defines the shape of
an object that represents tree data, including its location, species, condition, and metadata. The
`getTree` function retrieves tree data from a Firestore collection and returns an array of tree
objects. */
/* eslint-disable @typescript-eslint/camelcase */

import { TreeTypes, TreeValidationTypes } from './../treeData'
import firestore from '@react-native-firebase/firestore';

/* The `interface TreePhoto` is defining the shape of an object that represents a photo of a tree. It
specifies that a `TreePhoto` object should have three properties: `width` and `height`, both of
which are numbers, and `url`, which is a string. */
interface TreePhoto {
  width: number
  height: number
  url: string
}

/* The `export interface TreeData` is defining the shape of an object that represents tree data. It
specifies the properties that a `TreeData` object should have, including `userId`, `username`,
`photo`, `coords`, `speciesNameScientific`, `speciesNameCommon`, `dbh`, `estimated_dbh`, `treeType`,
`landUseCategory`, `treeConditionCategory`, `crownLightExposureCategory`, `locationType`, `notes`,
`isValidated`, `level`, `modelName`, `os_name`, `os_version`, `applicationVersion`, `BuildVersion`,
and `brand`. These properties represent various attributes of a tree, such as its location, species,
condition, and metadata. */

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

/**
 * This function retrieves tree data from a Firestore collection.
 * @param {any} userId - The `userId` parameter is a variable that is expected to contain the ID of a
 * user. However, it is currently not being used in the function as the `where` clause has been
 * commented out.
 */
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
