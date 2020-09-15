/* eslint-disable @typescript-eslint/camelcase */
import * as firebase from 'firebase'
import * as Device from 'expo-device'
import * as Application from 'expo-application'
import { uploadTreeImage } from './uploadTreeImage'
import { FormValues } from '../addTreeForm'
import { addTree, TreeData } from '../../../lib/firebaseServices/addTree'
import { getCurrentAuthUser, getUser } from '../../../lib/firebaseServices'
import { TreeValidationTypes } from '../../../lib/treeData'

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
    !formValues.treeConditionCategory ||
    !formValues.crownLightExposureCategory ||
    !formValues.locationType ||
    !formValues.coords ||
    !userData
  ) {
    throw Error('Invalid form values')
  }

  const imageDownloadUrl = await uploadTreeImage(formValues.photo.uri)
  const decimals = 1000000
  const roundedLatitude = Math.round(formValues.coords.latitude * decimals) / decimals
  const roundedLongitude = Math.round(formValues.coords.longitude * decimals) / decimals
  const treeCoords = new firebase.firestore.GeoPoint(
    roundedLatitude,
    roundedLongitude
  )

  const submittedNotes = formValues.notes || ""

  const treeData: TreeData = {
    userId: authUser.uid,
    username: userData.username,
    speciesNameCommon: formValues.speciesData.COMMON,
    speciesNameScientific: formValues.speciesData.SCIENTIFIC,
    dbh: formValues.dbh,
    estmated_dbh: formValues.estimate,
    treeType: formValues.treeType,
    landUseCategory: formValues.landUseCategory,
    treeConditionCategory: formValues.treeConditionCategory,
    crownLightExposureCategory: formValues.crownLightExposureCategory,
    locationType: formValues.locationType,
    notes: submittedNotes,
    photo: {
      url: imageDownloadUrl,
      width: formValues.photo.width,
      height: formValues.photo.height,
    },
    coords: treeCoords,
    isValidated: TreeValidationTypes.SPAM,
    level: (typeof formValues.speciesData?.LEVEL === 'undefined') ? 'none' : formValues.speciesData?.LEVEL,
    brand: Device.brand,
    modelName: Device.modelName,
    os_name: Device.osName,
    os_version: Device.osVersion,
    applicationVersion: Application.nativeApplicationVersion,
    BuildVersion: Application.nativeBuildVersion
  }
  addTree(treeData)

  return formValues
}
