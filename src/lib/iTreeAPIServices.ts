const EMAIL_REGEX = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
import { CONFIG } from '../../envVariables';
import { xml2js, xml2json } from 'xml-js'
import { OutputInformation, RootObject } from '../screens/AddTreeScreen/TreeBenefitResponse';
import axios from 'axios';
import fs from 'react-native-fs';

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
      resolve(String(display).trim());
    })
  } catch (error) {
    return null
  }
}

export async function identifyTreePicture(url) {
  const file = '/Users/gaigai/Desktop/INI/Practicum/iSeaTree-React-Prototype/src/lib/img/maple_tree.jpeg';
  // const file = url;
  let base64files = await fs.readFile(file, 'base64');
  //   const data = {
  //     api_key: "QmthcG07fdXf27yYmAtcAt2h92STmQEki0YkpoRDhPJcnJA7dV",
  //     images: base64files,
  //     /* modifiers docs: https://github.com/flowerchecker/Plant-id-API/wiki/Modifiers */
  //     modifiers: ["crops_fast", "similar_images"],
  //     plant_language: "en",
  //     /* plant details docs: https://github.com/flowerchecker/Plant-id-API/wiki/Plant-details */
  //     plant_details: ["common_names",
  //       "url",
  //       "name_authority",
  //       "wiki_description",
  //       "taxonomy",
  //       "synonyms"],
  //   };

  //   console.log("test")
  //   axios.post('https://api.plant.id/v2/identify', data).then(res => {
  //     console.log('Success:', res.data);
  //     return res.data;
  //   }).catch(error => {
  //     console.error('Error: ', error)
  //   })
  //   // axios.get("https://google.com").then(res => {
  //   //   console.log("success");
  //   // })
  //   return -1;
  try {
    const response = await fetch(
      'https://api.plant.id/v2/identify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Api-Key": "QmthcG07fdXf27yYmAtcAt2h92STmQEki0YkpoRDhPJcnJA7dV"
      },
      body: JSON.stringify({
        "images": [base64files],
        "modifiers": ["similar_images"],
        "plant_details": ["common_names", "url"],
      })
    }
    );
    const result = await response.json();
    console.log(result)
    return result['suggestions'][0]['plant_name'];
  } catch (error) {
    console.error(error);
    return -1;
  }
}

export async function getItreeData(params) {
  const { crownLightExposureCategory,
    dbh,
    speciesData,
    treeConditionCategory,
    address,
    state } = params;
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
        return null;
      } else {
        const inputInformation = root.Result.InputInformation

        let NationFullName = await setItem('NationFullName', inputInformation.Location.NationFullName._text, '')
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
        let Interception = await setItem('Interception', outputInformation.Benefit.HydroBenefit.Interception._text, '')
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
        let Evaporation = await setItem('Evaporation', outputInformation.Benefit.HydroBenefit.Evaporation._text, '')
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

        let CarbonStorage = await setItem('CarbonStorage', outputInformation.Carbon.CarbonStorage._text, 'lb')
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
          DryWeight
        }

        return resultData;
      }
    }
  }
}
