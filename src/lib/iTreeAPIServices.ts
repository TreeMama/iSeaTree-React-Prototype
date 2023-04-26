/**
 * This is a TypeScript module that contains functions for identifying a tree from a picture and
 * retrieving data about a tree's benefits based on its characteristics.
 * @param {string} key - The API key for accessing the i-Tree database.
 * @param {string} stringValue - A string value that needs to be formatted and returned in a specific
 * way.
 * @param {string} unit - The unit of measurement for a numeric value, such as '$' for dollars or 'lb'
 * for pounds.
 * @returns The code contains several functions and interfaces, but it is not clear what is being
 * returned without additional context. Each function appears to perform a specific task, such as
 * identifying a tree from a picture or retrieving data about a tree's benefits based on its location
 * and characteristics. The return values of each function will depend on the specific implementation
 * and input parameters.
 */

// ####################################



/* The code is defining a regular expression pattern for validating email addresses and importing
several modules and interfaces that will be used in the code. */
const EMAIL_REGEX =
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
import { CONFIG } from '../../envVariables'
import { xml2js, xml2json } from 'xml-js'
import { OutputInformation, RootObject } from '../screens/AddTreeScreen/TreeBenefitResponse'
import axios from 'axios'
import fs from 'react-native-fs'

/* The `interface Coords` is defining a type for an object that has two properties: `latitude` and
`longitude`, both of which are of type `number`. This interface is likely used to ensure that
functions that require latitude and longitude values as input parameters receive them in the correct
format. */
interface Coords {
  latitude: number
  longitude: number
}

/**
 * This is an async function that takes in a key, a string value, and a unit, and returns a promise
 * that resolves to a formatted display string.
 * @param {string} key - The key is a string that represents the identifier for the item being set. It
 * is used to retrieve the item later on.
 * @param {string} stringValue - The value to be stored as a string in the key-value store.
 * @param {string} unit - The `unit` parameter is a string that represents the unit of measurement or
 * currency symbol to be used when displaying the value. It can be empty if no unit is needed.
 * @returns A Promise object is being returned.
 */
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

/**
 * This function takes a picture and coordinates as input, sends a request to the Plant.id API to
 * identify the tree in the picture, and returns information about the identified tree.
 * @param picture - The picture parameter is the file path or URL of the image of the tree that needs
 * to be identified.
 * @param {Coords} coords - The `coords` parameter is an object that contains the latitude and
 * longitude coordinates of the location where the picture was taken. These coordinates are used by the
 * API to provide more accurate identification results based on the location's flora and fauna.
 * @returns an array with the following elements:
 * - A boolean indicating whether the given picture contains a tree
 * - The tree's common name (if available)
 * - The tree's scientific name
 * - The tree's structured name (contains the genus and species of a tree, may only contain genus)
 * - The probability that the given picture contains a tree
 */
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
      result['suggestions'][0]['plant_details']['common_names'] ? result['suggestions'][0]['plant_details']['common_names'][0] : '',
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
/**
 * This function retrieves data from an API and formats the response into a specific data structure.
 * @param params - The function `getItreeData` takes in an object `params` as its parameter. The
 * `params` object has the following properties:
 * @returns an object containing various data related to the benefits provided by a tree, based on the
 * input parameters. The data includes information on hydro benefits, air quality benefits, CO2
 * sequestration, carbon storage, and dry weight. If there is an error in the response, the function
 * returns null.
 */

export async function getItreeData(params) {
  /* The code is creating a URL string with various parameters to make an API request to the i-Tree
  database for calculating the benefits of a tree. The parameters include the tree's location
  (country, state, county, and city), species, diameter at breast height (dbh), condition category,
  crown light exposure category, and some default values for tree height, crown width, and crown
  height. */
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

  /* The code is making an HTTP GET request to a specified URL using the Axios library in
  TypeScript. If the response data is not empty, it is converted from XML format to JSON format using
  the xml2json library. The response data is also parsed into a JavaScript object using the xml2js
  library. If the parsed object contains an error, the function returns null. */
  const response = await axios.get(url)
  if (response.data) {
    const formattedResponse: string = xml2json(response.data, { compact: true, spaces: 2 })
    const root: RootObject = xml2js(response.data, { compact: true }) as RootObject
    if (root) {
      const err = root.Result.Error

      if (Object.keys(err).length > 0) {
        return null

        /* Otherwise, the code is extracting data from an object named `root` and assigning it to various
     variables using the `setItem` function. The extracted data includes information about the
     location and tree measurements, as well as various environmental benefits such as runoff
     avoided, air quality benefits, and carbon sequestration. The extracted data is then stored in
     variables with corresponding names. */
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

        /* The code is accessing the `OutputInformation` property of an object named `Result` that
        is located in the `root` namespace. The value of this property is then assigned to a constant
        variable named `outputInformation`. The syntax ` */
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

        /* The code is defining an object called `resultData` with various properties such as
        `NationFullName`, `StateAbbr`, `CountyName`, `CalculatedHeightMeter`, `RunoffAvoided`,
        `CO2Sequestered`, etc. These properties likely represent data related to environmental
        impact calculations for a specific location. */

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
