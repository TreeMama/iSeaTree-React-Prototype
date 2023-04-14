/* eslint-disable @typescript-eslint/camelcase */
import { CONFIG } from '../../envVariables'
import { xml2js } from 'xml-js'
import { RootObject } from '../screens/AddTreeScreen/TreeBenefitResponse'
import axios from 'axios'
import fs from 'react-native-fs'

interface Coords {
  latitude: number
  longitude: number
}

async function setItem(key: string, stringValue: string, unit: string) {
  try {
    return new Promise(async (resolve) => {
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

export async function identifyTreePicture(picture: string, coords: Coords) {
  const file = picture
  const base64files = await fs.readFile(file, 'base64')

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
    const ret = [
      result['is_plant'],
      result['suggestions'][0]['plant_details']['common_names']
        ? result['suggestions'][0]['plant_details']['common_names'][0]
        : '',
      result['suggestions'][0]['plant_details']['scientific_name'],
      result['suggestions'][0]['plant_details']['structured_name'],
      result['is_plant_probability'],
    ]
    return ret
  } catch (error) {
    console.error(error)
    return -1
  }
}

export async function getItreeData(params: any) {
  const { crownLightExposureCategory, dbh, speciesData, treeConditionCategory, location } = params
  const url =
    `${CONFIG.API_TREE_BENEFIT}?` +
    `key=${CONFIG.ITREE_KEY}&` +
    `Longitude=${location.longitude}&` +
    `Latitude=${location.latitude}&` +
    `Species=${speciesData.ITREECODE}&` +
    `DBHInch=${dbh}&` +
    `condition=${treeConditionCategory}&` +
    `CLE=${crownLightExposureCategory}&` +
    `TreeHeightMeter=-1&` +
    `TreeCrownWidthMeter=-1&` +
    `TreeCrownHeightMeter=-1&`

  const response = await axios.get(url)
  if (response.data) {
    console.log('map getItreeData ===')
    // const formattedResponse: string = xml2json(response.data, { compact: true, spaces: 2 })
    const root: RootObject = xml2js(response.data, { compact: true }) as RootObject
    if (root) {
      const err = root.Result.Error

      if (Object.keys(err).length > 0) {
        return null
      } else {
        const inputInformation = root.Result.InputInformation

        const NationFullName = await setItem(
          'NationFullName',
          inputInformation.Location.NationFullName._text,
          '',
        )
        const StateAbbr = await setItem('StateAbbr', inputInformation.Location.StateAbbr._text, '')
        const CountyName = await setItem(
          'CountyName',
          inputInformation.Location.CountyName._text,
          '',
        )
        const CityName = await setItem('CityName', inputInformation.Location.CityName._text, '')

        const CalculatedHeightMeter = await setItem(
          'CalculatedHeightMeter',
          inputInformation.Tree.CalculatedHeightMeter._text,
          '',
        )
        const CalculatedCrownHeightMeter = await setItem(
          'CalculatedCrownHeightMeter',
          inputInformation.Tree.CalculatedCrownHeightMeter._text,
          '',
        )
        const CalculatedCrownWidthMeter = await setItem(
          'CalculatedCrownWidthMeter',
          inputInformation.Tree.CalculatedCrownWidthMeter._text,
          '',
        )

        const outputInformation = root.Result.OutputInformation

        const RunoffAvoided = await setItem(
          'RunoffAvoided',
          outputInformation.Benefit.HydroBenefit.RunoffAvoided._text,
          '',
        )
        const RunoffAvoidedValue = await setItem(
          'RunoffAvoidedValue',
          outputInformation.Benefit.HydroBenefit.RunoffAvoidedValue._text,
          '$',
        )
        const Interception = await setItem(
          'Interception',
          outputInformation.Benefit.HydroBenefit.Interception._text,
          '',
        )
        const PotentialEvaporation = await setItem(
          'PotentialEvaporation',
          outputInformation.Benefit.HydroBenefit.PotentialEvaporation._text,
          '',
        )
        const PotentialEvapotranspiration = await setItem(
          'PotentialEvapotranspiration',
          outputInformation.Benefit.HydroBenefit.PotentialEvapotranspiration._text,
          '',
        )
        const Evaporation = await setItem(
          'Evaporation',
          outputInformation.Benefit.HydroBenefit.Evaporation._text,
          '',
        )
        const Transpiration = await setItem(
          'Transpiration',
          outputInformation.Benefit.HydroBenefit.Transpiration._text,
          '',
        )

        const CORemoved = await setItem(
          'CORemoved',
          outputInformation.Benefit.AirQualityBenefit.CORemoved._text,
          'lb',
        )
        const CORemovedValue = await setItem(
          'CORemovedValue',
          outputInformation.Benefit.AirQualityBenefit.CORemovedValue._text,
          '$',
        )
        const NO2Removed = await setItem(
          'NO2Removed',
          outputInformation.Benefit.AirQualityBenefit.NO2Removed._text,
          'lb',
        )
        const NO2RemovedValue = await setItem(
          'NO2RemovedValue',
          outputInformation.Benefit.AirQualityBenefit.NO2RemovedValue._text,
          '$',
        )
        const SO2Removed = await setItem(
          'SO2Removed',
          outputInformation.Benefit.AirQualityBenefit.SO2Removed._text,
          'lb',
        )
        const SO2RemovedValue = await setItem(
          'SO2RemovedValue',
          outputInformation.Benefit.AirQualityBenefit.SO2RemovedValue._text,
          '$',
        )
        const O3Removed = await setItem(
          'O3Removed',
          outputInformation.Benefit.AirQualityBenefit.O3Removed._text,
          'lb',
        )
        const O3RemovedValue = await setItem(
          'O3RemovedValue',
          outputInformation.Benefit.AirQualityBenefit.O3RemovedValue._text,
          '$',
        )
        const PM25Removed = await setItem(
          'PM25Removed',
          outputInformation.Benefit.AirQualityBenefit.PM25Removed._text,
          'lb',
        )
        const PM25RemovedValue = await setItem(
          'PM25RemovedValue',
          outputInformation.Benefit.AirQualityBenefit.PM25RemovedValue._text,
          '$',
        )

        const CO2Sequestered = await setItem(
          'CO2Sequestered',
          outputInformation.Benefit.CO2Benefits.CO2Sequestered._text,
          'lb',
        )
        const CO2SequesteredValue = await setItem(
          'CO2SequesteredValue',
          outputInformation.Benefit.CO2Benefits.CO2SequesteredValue._text,
          '$',
        )

        const CarbonStorage = await setItem(
          'CarbonStorage',
          outputInformation.Carbon.CarbonStorage._text,
          'lb',
        )
        const CarbonDioxideStorage = await setItem(
          'CarbonDioxideStorage',
          outputInformation.Carbon.CarbonDioxideStorage._text,
          'lb',
        )
        const CarbonDioxideStorageValue = await setItem(
          'CarbonDioxideStorageValue',
          outputInformation.Carbon.CarbonDioxideStorageValue._text,
          '$',
        )
        const DryWeight = await setItem('DryWeight', outputInformation.Carbon.DryWeight._text, 'lb')

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
