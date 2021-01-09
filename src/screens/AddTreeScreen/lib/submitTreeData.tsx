/* eslint-disable @typescript-eslint/camelcase */
import * as firebase from 'firebase'
import * as Device from 'expo-device'
import * as Application from 'expo-application'
import { uploadTreeImage } from './uploadTreeImage'
import { FormValues } from '../addTreeForm'
import { addTree, TreeData } from '../../../lib/firebaseServices/addTree'
import { getCurrentAuthUser, getUser } from '../../../lib/firebaseServices'
import { TreeValidationTypes } from '../../../lib/treeData'
import { AsyncStorage } from 'react-native'

async function getItem(item: string) {
  try {
    const value = await AsyncStorage.getItem(item);
    if (value !== null) {
      console.log(item, value);
      return value;
    } else {
      return 'NULL';
    }
  } catch (error) {
    // Error retrieving data
    return 'NULL';
  }
}

export async function submitTreeData(formValues: FormValues): Promise<FormValues> {
  const authUser = getCurrentAuthUser()

  if (!authUser) {
    throw Error('User is not authenticated')
  }

  const userData = await getUser(authUser.uid)

  const AirPollutionRemoved = await getItem('AirPollutionRemoved')
  const AirPollutionRemovedValue = await getItem('AirPollutionRemovedValue')
  const CO2Sequestered = await getItem('CO2Sequestered')
  const CO2SequesteredValue = await getItem('CO2SequesteredValue')
  const RunoffAvoided = await getItem('RunoffAvoided')
  const RunoffAvoidedValue = await getItem('RunoffAvoidedValue')
  const CO2Storage = await getItem('CO2Storage')
  const CO2StorageValue = await getItem('CO2StorageValue')

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
    BuildVersion: Application.nativeBuildVersion,
    AirPollutionRemoved,
    AirPollutionRemovedValue,
    CO2Sequestered,
    CO2SequesteredValue,
    RunoffAvoided,
    RunoffAvoidedValue,
    CO2Storage,
    CO2StorageValue
  }
  addTree(treeData)

  return formValues
}
