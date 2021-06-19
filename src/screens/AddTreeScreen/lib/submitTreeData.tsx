/* eslint-disable @typescript-eslint/camelcase */
import * as firebase from 'firebase'
import * as Device from 'expo-device'
import * as Application from 'expo-application'
import { uploadTreeImage } from './uploadTreeImage'
import { FormValues } from '../addTreeForm'
import { addTree, TreeData } from '../../../lib/firebaseServices/addTree'
import { getCurrentAuthUser, getUser } from '../../../lib/firebaseServices'
import { TreeValidationTypes } from '../../../lib/treeData'
import AsyncStorage from '@react-native-async-storage/async-storage';
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

  let NationFullName = "NULL"
  let StateAbbr = "NULL"
  let CountyName = "NULL"
  let CityName = "NULL"
  let CalculatedHeightMeter = "NULL"
  let CalculatedCrownHeightMeter = "NULL"
  let CalculatedCrownWidthMeter = "NULL"
  let RunoffAvoided = "NULL"
  let RunoffAvoidedValue = "NULL"
  let Interception = "NULL"
  let PotentialEvaporation = "NULL"
  let PotentialEvapotranspiration = "NULL"
  let Evaporation = "NULL"
  let Transpiration = "NULL"
  let CORemoved = "NULL"
  let CORemovedValue = "NULL"
  let NO2Removed = "NULL"
  let NO2RemovedValue = "NULL"
  let SO2Removed = "NULL"
  let SO2RemovedValue = "NULL"
  let O3Removed = "NULL"
  let O3RemovedValue = "NULL"
  let PM25Removed = "NULL"
  let PM25RemovedValue = "NULL"
  let CO2Sequestered = "NULL"
  let CO2SequesteredValue = "NULL"
  let CarbonStorage = "NULL"
  let CarbonDioxideStorage = "NULL"
  let CarbonDioxideStorageValue = "NULL"
  let DryWeight = "NULL"

  if (formValues.speciesData.COMMON !== "Unknown") {
    NationFullName = await getItem('NationFullName')
    StateAbbr = await getItem('StateAbbr')
    CountyName = await getItem('CountyName')
    CityName = await getItem('CityName')
    CalculatedHeightMeter = await getItem('CalculatedHeightMeter')
    CalculatedCrownHeightMeter = await getItem('CalculatedCrownHeightMeter')
    CalculatedCrownWidthMeter = await getItem('CalculatedCrownWidthMeter')
    RunoffAvoided = await getItem('RunoffAvoided')
    RunoffAvoidedValue = await getItem('RunoffAvoidedValue')
    Interception = await getItem('Interception')
    PotentialEvaporation = await getItem('PotentialEvaporation')
    PotentialEvapotranspiration = await getItem('PotentialEvapotranspiration')
    Evaporation = await getItem('Evaporation')
    Transpiration = await getItem('Transpiration')
    CORemoved = await getItem('CORemoved')
    CORemovedValue = await getItem('CORemovedValue')
    NO2Removed = await getItem('NO2Removed')
    NO2RemovedValue = await getItem('NO2RemovedValue')
    SO2Removed = await getItem('SO2Removed')
    SO2RemovedValue = await getItem('SO2RemovedValue')
    O3Removed = await getItem('O3Removed')
    O3RemovedValue = await getItem('O3RemovedValue')
    PM25Removed = await getItem('PM25Removed')
    PM25RemovedValue = await getItem('PM25RemovedValue')
    CO2Sequestered = await getItem('CO2Sequestered')
    CO2SequesteredValue = await getItem('CO2SequesteredValue')
    CarbonStorage = await getItem('CarbonStorage')
    CarbonDioxideStorage = await getItem('CarbonDioxideStorage')
    CarbonDioxideStorageValue = await getItem('CarbonDioxideStorageValue')
    DryWeight = await getItem('DryWeight')
  }


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
  // const roundedLatitude = Math.round(formValues.coords.latitude * decimals) / decimals
  // const roundedLongitude = Math.round(formValues.coords.longitude * decimals) / decimals
  const roundedLatitude = Math.round(21.967757595410784 * decimals) / decimals
  const roundedLongitude = Math.round(71.5776363254773 * decimals) / decimals
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
    NationFullName,
    StateAbbr,
    CountyName,
    CityName,
    CalculatedHeightMeter,
    CalculatedCrownHeightMeter,
    CalculatedCrownWidthMeter,
    RunoffAvoided,
    RunoffAvoidedValue,
    Interception,
    PotentialEvaporation,
    PotentialEvapotranspiration,
    Evaporation,
    Transpiration,
    CORemoved,
    CORemovedValue,
    NO2Removed,
    NO2RemovedValue,
    SO2Removed,
    SO2RemovedValue,
    O3Removed,
    O3RemovedValue,
    PM25Removed,
    PM25RemovedValue,
    CO2Sequestered,
    CO2SequesteredValue,
    CarbonStorage,
    CarbonDioxideStorage,
    CarbonDioxideStorageValue,
    DryWeight
  }
  console.log("calling addTree")
  addTree(treeData)
  console.log("trees are added")
  console.log("calling remove ")
  removeBenefitVal()
  return formValues
}

// todo clear benefits form asyncstorage
export const removeBenefitVal = async () => {
  console.log("remove storage val")
  const keys = [
    'NationFullName',
    'StateAbbr',
    'CountyName',
    'CityName',
    'CalculatedHeightMeter',
    'CalculatedCrownHeightMeter',
    'CalculatedCrownWidthMeter',
    'RunoffAvoided',
    'RunoffAvoidedValue',
    'Interception',
    'PotentialEvaporation',
    'PotentialEvapotranspiration',
    'Evaporation',
    'Transpiration',
    'CORemoved',
    'CORemovedValue',
    'NO2Removed',
    'NO2RemovedValue',
    'SO2Removed',
    'SO2RemovedValue',
    'O3Removed',
    'O3RemovedValue',
    'PM25Removed',
    'PM25RemovedValue',
    'CO2Sequestered',
    'CO2SequesteredValue',
    'CarbonStorage',
    'CarbonDioxideStorage',
    'CarbonDioxideStorageValue',
    'DryWeight'
  ]
  try {
    await AsyncStorage.multiRemove(keys).then(() => {
      console.log("making sure that values are deleted")
    })
  } catch (e) {
    // remove error
    console.log(e)
  }
  console.log('Done remove values Async storage')
}
