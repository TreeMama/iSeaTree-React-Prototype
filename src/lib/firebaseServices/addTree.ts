/* This is a TypeScript module that defines interfaces and functions related to tree data and AI
results. It imports `TreeTypes` and `TreeValidationTypes` from another module, as well as the
`firestore` object from the `@react-native-firebase/firestore` library. */
/* eslint-disable @typescript-eslint/camelcase */
import { TreeTypes, TreeValidationTypes } from './../treeData'
import firestore from '@react-native-firebase/firestore';

/* The `interface TreePhoto` is defining the structure of an object that represents a photo of a tree.
It has three properties: `width` and `height` which are numbers representing the dimensions of the
photo, and `url` which is a string representing the URL where the photo can be accessed. This
interface is used in the `TreeData` interface to define the structure of the `photo` property. */

interface TreePhoto {
  width: number
  height: number
  url: string
}

/* The `export interface TreeData` is defining the structure of an object that represents data related
to a tree. It has various properties such as `userId`, `username`, `photo`, `coords`,
`speciesNameScientific`, `treeType`, `isValidated`, etc. These properties represent different
aspects of a tree such as its location, species, physical characteristics, environmental impact, and
AI results. This interface is used in the `addTree` function to define the structure of the data
that will be added to the Firestore database. */

export interface TreeData {
  userId: string
  username: string
  photo: TreePhoto
  coords: firestore.GeoPoint
  speciesNameScientific: string
  speciesNameCommon: string
  dbh?: string
  estmated_dbh: boolean
  CameraMeasured: boolean
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
  NationFullName: string | null
  StateAbbr: string | null
  CountyName: string | null
  CityName: string | null
  CalculatedHeightMeter: string | null
  CalculatedCrownHeightMeter: string | null
  CalculatedCrownWidthMeter: string | null
  RunoffAvoided: string | null
  RunoffAvoidedValue: string | null
  Interception: string | null
  PotentialEvaporation: string | null
  PotentialEvapotranspiration: string | null
  Evaporation: string | null
  Transpiration: string | null
  CORemoved: string | null
  CORemovedValue: string | null
  NO2Removed: string | null
  NO2RemovedValue: string | null
  SO2Removed: string | null
  SO2RemovedValue: string | null
  O3Removed: string | null
  O3RemovedValue: string | null
  PM25Removed: string | null
  PM25RemovedValue: string | null
  CO2Sequestered: string | null
  CO2SequesteredValue: string | null
  CarbonStorage: string | null
  CarbonDioxideStorage: string | null
  CarbonDioxideStorageValue: string | null
  DryWeight: string | null
  AIResult: number
}

/* The `export interface AIResult` is defining the structure of an object that represents the result of
an AI analysis on a tree. It has two properties: `tree_name` which is a string representing the name
of the tree species predicted by the AI, and `probability` which is a number representing the
confidence level of the prediction. This interface is used in the `addTreeAIResult` function to
define the structure of the data that will be added to the Firestore database. */

export interface AIResult {
  tree_name: string
  probability: number
}

const TREES_COLLECTION = 'trees'
const TREES_AI_RESULT = 'AI_results'

/**
 * This function adds a new tree to a Firestore collection and updates its validation status if it has
 * AI results.
 * @param {TreeData} treeData - `treeData` is an object that contains information about a tree, such as
 * its location, species, and image. It is passed as an argument to the `addTree` function.
 */
export function addTree(treeData: TreeData) {
  console.log("Addtree cakked")
  firestore()
    .collection(TREES_COLLECTION)
    .add({
      ...treeData,
      created_at: firestore.FieldValue.serverTimestamp(),
    }).then((docRef) => {
      console.log('add tree doc id ===', docRef.id)
      if (treeData.AIResult) {
        firestore().collection(TREES_COLLECTION).doc(docRef.id).update({
          isValidated: TreeValidationTypes.NEEDS_VALIDATION,
        }).then(() => {
          console.log('AI Result updated successfully ===')
        })
      }
    })
}

/**
 * This function adds tree AI data to a Firestore collection with a timestamp.
 * @param {AIResult} aiResult - The `aiResult` parameter is an object of type `AIResult` that contains
 * data related to the result of an AI analysis on a tree. This function adds this data to a Firestore
 * collection named `TREES_AI_RESULT`. The `created_at` field is automatically set to the server
 * timestamp
 */
export function addTreeAIResult(aiResult: AIResult) {
  console.log("Add tree ai data")
  firestore()
    .collection(TREES_AI_RESULT)
    .add({
      ...aiResult,
      created_at: firestore.FieldValue.serverTimestamp(),
    })
}
