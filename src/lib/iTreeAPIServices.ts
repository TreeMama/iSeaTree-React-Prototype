/**
 * This is a TypeScript function that identifies a tree from a picture and retrieves data about it
 * using the iTrees API.
 * @param {string} key - The API key for the i-Tree Eco API.
 * @param {string} stringValue - A string value that needs to be formatted and returned.
 * @param {string} unit - The unit of measurement for a numerical value, such as '$' for dollars or
 * 'lb' for pounds.
 * @returns The code does not have a return statement for the entire file. It contains multiple
 * functions that may or may not have return statements.
 */
const EMAIL_REGEX =
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
import { CONFIG } from '../../envVariables'
import { xml2js, xml2json } from 'xml-js'
import { OutputInformation, RootObject } from '../screens/AddTreeScreen/TreeBenefitResponse'
import axios from 'axios'
import fs from 'react-native-fs'

interface Coords {
  latitude: number
  longitude: number
}

async function setItem(key: string, stringValue: string, unit: string) {
  try {
    return new Promise(async (resolve, reject) => {
      const decimal = parseFloat(stringValue)
      const isUnitPrefix = unit === '$'
      let display = await `${decimal.toFixed(2)} ${unit}`
      if (Number.isNaN(decimal)) {
        display = stringValue
      } else if (isUnitPrefix) {
        display = `${unit}${decimal.toFixed(2)}`
      } else if (unit === '') {
        display = `${decimal.toFixed(2)}`
      }
      // console.log(key, display)
      resolve(String(display).trim())
    })
  } catch (error) {
    return null
  }
}

export async function identifyTreePicture(picture, coords: Coords) {
  let file = picture
  let base64files = await fs.readFile(file, 'base64')

  try {
    const response = await fetch('https://api.plant.id/v2/identify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': CONFIG.PLANTID_KEY,
      },
      body: JSON.stringify({
        images: [base64files],
        latitude: coords.latitude,
        longitude: coords.longitude,
        modifiers: ['similar_images'],
        plant_details: ['common_names', 'url'],
      }),
    })
    const result = await response.json()
    console.log('identifyTreePicture ===', result)
    // return result['suggestions'][0]['plant_name'];
    // let ret: [boolean, string, string]
    let ret: any
    /*
    AI return result
    (1) is_plant: Whether the given picture contains a tree
    (2) common_names: the tree's common name
    (3) scientific_name: the tree's common name scientific name
    (4) structured_name: contains the genus and species of a tree. May only contains genus
    */
  
    ret = [
      result['is_plant'],
      result['suggestions'][0]['plant_details']['common_names'] ? result['suggestions'][0]['plant_details']['common_names'][0]: '',
      result['suggestions'][0]['plant_details']['scientific_name'],
      result['suggestions'][0]['plant_details']['structured_name'],
      result['is_plant_probability'],
      // result['suggestions'], maybe suggestions needs to be sorted?
      [...result['suggestions'].slice(1).map((r:any)=> ({other:r.plant_name, prob: r.probability}))]
    ]
    return ret
  } catch (error) {
    console.error(error)
    return -1
  }
}

export async function getItreeData(params) {
  const { crownLightExposureCategory, dbh, speciesData, treeConditionCategory, address, state } =
    params
  const url =
    `${CONFIG.API_TREE_BENEFIT}?` +
    `key=${CONFIG.ITREE_KEY}&` +
    `NationFullName=${address.country}&` +
    `StateAbbr=${state}&` +
    `CountyName=${address.subregion}&` +
    `CityName=${address.city}&` +
    `Species=${speciesData.ITREECODE}&` +
    `DBHInch=${dbh}&` +
    `condition=${treeConditionCategory}&` +
    `CLE=${crownLightExposureCategory}&` +
    `TreeHeightMeter=-1&` +
    `TreeCrownWidthMeter=-1&` +
    `TreeCrownHeightMeter=-1&`

  const response = await axios.get(url)
  if (response.data) {
    const formattedResponse: string = xml2json(response.data, { compact: true, spaces: 2 })
    const root: RootObject = xml2js(response.data, { compact: true }) as RootObject
    if (root) {
      const err = root.Result.Error

      if (Object.keys(err).length > 0) {
        return null
      } else {
        const inputInformation = root.Result.InputInformation

        let NationFullName = await setItem(
          'NationFullName',
          inputInformation.Location.NationFullName._text,
          '',
        )
        let StateAbbr = await setItem('StateAbbr', inputInformation.Location.StateAbbr._text, '')
        let CountyName = await setItem('CountyName', inputInformation.Location.CountyName._text, '')
        let CityName = await setItem('CityName', inputInformation.Location.CityName._text, '')

        let CalculatedHeightMeter = await setItem(
          'CalculatedHeightMeter',
          inputInformation.Tree.CalculatedHeightMeter._text,
          '',
        )
        let CalculatedCrownHeightMeter = await setItem(
          'CalculatedCrownHeightMeter',
          inputInformation.Tree.CalculatedCrownHeightMeter._text,
          '',
        )
        let CalculatedCrownWidthMeter = await setItem(
          'CalculatedCrownWidthMeter',
          inputInformation.Tree.CalculatedCrownWidthMeter._text,
          '',
        )

        const outputInformation = root.Result.OutputInformation

        let RunoffAvoided = await setItem(
          'RunoffAvoided',
          outputInformation.Benefit.HydroBenefit.RunoffAvoided._text,
          '',
        )
        let RunoffAvoidedValue = await setItem(
          'RunoffAvoidedValue',
          outputInformation.Benefit.HydroBenefit.RunoffAvoidedValue._text,
          '$',
        )
        let Interception = await setItem(
          'Interception',
          outputInformation.Benefit.HydroBenefit.Interception._text,
          '',
        )
        let PotentialEvaporation = await setItem(
          'PotentialEvaporation',
          outputInformation.Benefit.HydroBenefit.PotentialEvaporation._text,
          '',
        )
        let PotentialEvapotranspiration = await setItem(
          'PotentialEvapotranspiration',
          outputInformation.Benefit.HydroBenefit.PotentialEvapotranspiration._text,
          '',
        )
        let Evaporation = await setItem(
          'Evaporation',
          outputInformation.Benefit.HydroBenefit.Evaporation._text,
          '',
        )
        let Transpiration = await setItem(
          'Transpiration',
          outputInformation.Benefit.HydroBenefit.Transpiration._text,
          '',
        )

        let CORemoved = await setItem(
          'CORemoved',
          outputInformation.Benefit.AirQualityBenefit.CORemoved._text,
          'lb',
        )
        let CORemovedValue = await setItem(
          'CORemovedValue',
          outputInformation.Benefit.AirQualityBenefit.CORemovedValue._text,
          '$',
        )
        let NO2Removed = await setItem(
          'NO2Removed',
          outputInformation.Benefit.AirQualityBenefit.NO2Removed._text,
          'lb',
        )
        let NO2RemovedValue = await setItem(
          'NO2RemovedValue',
          outputInformation.Benefit.AirQualityBenefit.NO2RemovedValue._text,
          '$',
        )
        let SO2Removed = await setItem(
          'SO2Removed',
          outputInformation.Benefit.AirQualityBenefit.SO2Removed._text,
          'lb',
        )
        let SO2RemovedValue = await setItem(
          'SO2RemovedValue',
          outputInformation.Benefit.AirQualityBenefit.SO2RemovedValue._text,
          '$',
        )
        let O3Removed = await setItem(
          'O3Removed',
          outputInformation.Benefit.AirQualityBenefit.O3Removed._text,
          'lb',
        )
        let O3RemovedValue = await setItem(
          'O3RemovedValue',
          outputInformation.Benefit.AirQualityBenefit.O3RemovedValue._text,
          '$',
        )
        let PM25Removed = await setItem(
          'PM25Removed',
          outputInformation.Benefit.AirQualityBenefit.PM25Removed._text,
          'lb',
        )
        let PM25RemovedValue = await setItem(
          'PM25RemovedValue',
          outputInformation.Benefit.AirQualityBenefit.PM25RemovedValue._text,
          '$',
        )

        let CO2Sequestered = await setItem(
          'CO2Sequestered',
          outputInformation.Benefit.CO2Benefits.CO2Sequestered._text,
          'lb',
        )
        let CO2SequesteredValue = await setItem(
          'CO2SequesteredValue',
          outputInformation.Benefit.CO2Benefits.CO2SequesteredValue._text,
          '$',
        )

        let CarbonStorage = await setItem(
          'CarbonStorage',
          outputInformation.Carbon.CarbonStorage._text,
          'lb',
        )
        let CarbonDioxideStorage = await setItem(
          'CarbonDioxideStorage',
          outputInformation.Carbon.CarbonDioxideStorage._text,
          'lb',
        )
        let CarbonDioxideStorageValue = await setItem(
          'CarbonDioxideStorageValue',
          outputInformation.Carbon.CarbonDioxideStorageValue._text,
          '$',
        )
        let DryWeight = await setItem('DryWeight', outputInformation.Carbon.DryWeight._text, 'lb')

        const resultData = {
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
          DryWeight,
        }

        return resultData
      }
    }
  }
}
