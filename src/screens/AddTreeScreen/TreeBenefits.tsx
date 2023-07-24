import React, { useEffect, useContext } from 'react'
import axios from 'axios'
import { xml2js, xml2json } from 'xml-js'
import { Modal, View, ScrollView, StyleSheet, ActivityIndicator, Alert } from 'react-native'
import { LocationContext } from '../../LocationContext'
import { useTheme, Text, Headline, Button, Divider } from 'react-native-paper'
import { StatusBar } from '../../components/StatusBar'
import { CONFIG } from '../../../envVariables'
import { FormValues } from './addTreeForm'
import { OutputInformation, RootObject } from './TreeBenefitResponse'
import { convertRegion } from './geoHelper'
import AsyncStorage from '@react-native-async-storage/async-storage'

// 1 Cubic meter (m3) is equal to 264.172052 US gallons
// https://www.asknumbers.com/cubic-meters-to-gallons.aspx
const CUBIC_GALLONS_FACTOR = 264.172052

interface TreeBenefitsProps {
  values: FormValues
  loadBenefitsCall: boolean
  setCalculatedFormValues: Function
  onModalClose: Function
  setModalClosed: Function
}

const styles = StyleSheet.create({
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 15,
    paddingLeft: 25,
  },
  tableRowHeader: {
    paddingLeft: 15,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  tableCell: {
    flex: 1,
    flexDirection: 'row',
  },
  tableCellRight: {
    flex: 0.3,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  headerTitleStyle: {
    fontWeight: 'bold',
    color: '#000',
    fontSize: 14,
  },
  sectionHeaderStyle: {
    fontWeight: 'bold',
    color: '#2F855A',
    fontSize: 16,
    marginBottom: -10,
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
})

async function setItem(key: string, stringValue: string, unit: string) {
  const decimal = parseFloat(stringValue)
  const isUnitPrefix = unit === '$'
  let display = `${decimal.toFixed(2)} ${unit}`
  if (Number.isNaN(decimal)) {
    display = stringValue
  } else if (isUnitPrefix) {
    display = `${unit}${decimal.toFixed(2)}`
  } else if (unit === '') {
    display = `${decimal.toFixed(2)}`
  }
  // console.log(key, display)
  await AsyncStorage.setItem(key, display.toString())
}

export function TreeBenefits(props: TreeBenefitsProps) {
  const [isModalVisible, setIsModalVisible] = React.useState<boolean>(false)
  const [isCalculatorloader, setIsCalculatorloader] = React.useState<boolean>(false)
  const theme = useTheme()

  const [benefits, setBenefits] = React.useState<OutputInformation>()
  const [benefitsError, setBenefitsError] = React.useState('')
  const [, setFormattedResponse] = React.useState('')
  const { values, loadBenefitsCall, onModalClose, setModalClosed } = props
  const { crownLightExposureCategory, dbh, speciesData, treeConditionCategory } = values
  const canCalculateBenefits = !!(
    (
      speciesData &&
      crownLightExposureCategory !== null &&
      dbh &&
      parseInt(dbh) !== 0 &&
      treeConditionCategory
    )
    // speciesData.TYPE.toLowerCase() !== 'unknown' &&
  )

  //gets Location form Location useContext
  const value = useContext(LocationContext)
  const address = value.address
  const location = value.currentCoords

  const calculateTreezBenefits = async (state: any) => {
    setIsCalculatorloader(true)
    const url =
      `${CONFIG.API_TREE_BENEFIT}?` +
      `key=${CONFIG.ITREE_KEY}&` +
      // `NationFullName=${address.country}&` +
      `Longitude=${location.longitude}&` +
      // `StateAbbr=${state}&` +
      `Latitude=${location.latitude}&` +
      // `CountyName=${address.subregion}&` +
      // `CityName=${address.city}&` +
      `Species=${speciesData.ITREECODE}&` +
      `DBHInch=${dbh}&` +
      `condition=${treeConditionCategory}&` +
      `CLE=${crownLightExposureCategory}&` +
      `TreeHeightMeter=-1&` +
      `TreeCrownWidthMeter=-1&` +
      `TreeCrownHeightMeter=-1&`

    const response = await axios.get(url)
    // console.log('iSeaTreeApi response ===', response)
    if (response.data) {
      const formattedResponse: string = xml2json(response.data, { compact: true, spaces: 2 })
      const root: RootObject = xml2js(response.data, { compact: true }) as RootObject
      if (root) {
        const err = root.Result.Error

        if (Object.keys(err).length > 0) {
          setBenefitsError(
            'The USFS iTree API was not able to calculate the Tree Benefits for this tree.',
          )
        } else {
          const inputInformation = root.Result.InputInformation
          setItem('NationFullName', inputInformation.Location.NationFullName._text, '')
          setItem('StateAbbr', inputInformation.Location.StateAbbr._text, '')
          setItem('CountyName', inputInformation.Location.CountyName._text, '')
          setItem('CityName', inputInformation.Location.CityName._text, '')

          setItem('CalculatedHeightMeter', inputInformation.Tree.CalculatedHeightMeter._text, '')
          setItem(
            'CalculatedCrownHeightMeter',
            inputInformation.Tree.CalculatedCrownHeightMeter._text,
            '',
          )
          setItem(
            'CalculatedCrownWidthMeter',
            inputInformation.Tree.CalculatedCrownWidthMeter._text,
            '',
          )

          const outputInformation = root.Result.OutputInformation

          setItem('RunoffAvoided', outputInformation.Benefit.HydroBenefit.RunoffAvoided._text, '')
          setItem(
            'RunoffAvoidedValue',
            outputInformation.Benefit.HydroBenefit.RunoffAvoidedValue._text,
            '$',
          )
          setItem('Interception', outputInformation.Benefit.HydroBenefit.Interception._text, '')
          setItem(
            'PotentialEvaporation',
            outputInformation.Benefit.HydroBenefit.PotentialEvaporation._text,
            '',
          )
          setItem(
            'PotentialEvapotranspiration',
            outputInformation.Benefit.HydroBenefit.PotentialEvapotranspiration._text,
            '',
          )
          setItem('Evaporation', outputInformation.Benefit.HydroBenefit.Evaporation._text, '')
          setItem('Transpiration', outputInformation.Benefit.HydroBenefit.Transpiration._text, '')

          setItem('CORemoved', outputInformation.Benefit.AirQualityBenefit.CORemoved._text, 'lb')
          setItem(
            'CORemovedValue',
            outputInformation.Benefit.AirQualityBenefit.CORemovedValue._text,
            '$',
          )
          setItem('NO2Removed', outputInformation.Benefit.AirQualityBenefit.NO2Removed._text, 'lb')
          setItem(
            'NO2RemovedValue',
            outputInformation.Benefit.AirQualityBenefit.NO2RemovedValue._text,
            '$',
          )
          setItem('SO2Removed', outputInformation.Benefit.AirQualityBenefit.SO2Removed._text, 'lb')
          setItem(
            'SO2RemovedValue',
            outputInformation.Benefit.AirQualityBenefit.SO2RemovedValue._text,
            '$',
          )
          setItem('O3Removed', outputInformation.Benefit.AirQualityBenefit.O3Removed._text, 'lb')
          setItem(
            'O3RemovedValue',
            outputInformation.Benefit.AirQualityBenefit.O3RemovedValue._text,
            '$',
          )
          setItem(
            'PM25Removed',
            outputInformation.Benefit.AirQualityBenefit.PM25Removed._text,
            'lb',
          )
          setItem(
            'PM25RemovedValue',
            outputInformation.Benefit.AirQualityBenefit.PM25RemovedValue._text,
            '$',
          )

          setItem(
            'CO2Sequestered',
            outputInformation.Benefit.CO2Benefits.CO2Sequestered._text,
            'lb',
          )
          setItem(
            'CO2SequesteredValue',
            outputInformation.Benefit.CO2Benefits.CO2SequesteredValue._text,
            '$',
          )

          setItem('CarbonStorage', outputInformation.Carbon.CarbonStorage._text, 'lb')
          setItem('CarbonDioxideStorage', outputInformation.Carbon.CarbonDioxideStorage._text, 'lb')
          setItem(
            'CarbonDioxideStorageValue',
            outputInformation.Carbon.CarbonDioxideStorageValue._text,
            '$',
          )
          setItem('DryWeight', outputInformation.Carbon.DryWeight._text, 'lb')

          setBenefits(root.Result.OutputInformation)
        }
        setIsCalculatorloader(false)

        setIsModalVisible(true)
        setFormattedResponse(formattedResponse)
        props.setCalculatedFormValues(true)
      }
    }
  }

  const loadBenefits = async () => {
    if (canCalculateBenefits) {
      console.log('iSeaTreeApi called ===')
      // checks to see if the address has been calculated
      if (!address) return
      let state = address.region
      //checks to see fit the state name needs to be abbrevated
      if (state.length > 2) {
        state = convertRegion(address.region, 2)
      }

      if (canCalculateBenefits) {
        if (speciesData.TYPE.toLowerCase() === 'unknown') {
          Alert.alert(
            'Tree Benefits Pending',
            "Tree benefits cannot be calculated on 'Unknown' species. Your data will be saved so that the benefits can be calculated later.",
            [
              {
                text: 'Ok',
                onPress: () => {
                  console.log('ok')
                  // calculateTreezBenefits(state)
                  if (speciesData.TYPE.toLowerCase() === 'unknown') {
                    console.log('unknown case ===')
                  } else {
                    calculateTreezBenefits(state)
                  }
                },
              },
            ],
          )
        } else {
          calculateTreezBenefits(state)
        }
      }
    } else {
      console.log('iSeaTreeApi not called ---', canCalculateBenefits)
      props.setCalculatedFormValues(false)
    }
  }

  useEffect(() => {
    ;(async function () {
      if (loadBenefitsCall) {
        await loadBenefits()
      }
    })()
  }, [loadBenefitsCall])

  const getBenefit = (benefitName: string) => {
    if (benefits && benefits.Benefit) {
      let stringValue = ''
      let unit = ''
      switch (benefitName) {
        case 'AirPollutionRemoved': {
          const total =
            parseFloat(benefits.Benefit.AirQualityBenefit.CORemoved._text) +
            parseFloat(benefits.Benefit.AirQualityBenefit.NO2Removed._text) +
            parseFloat(benefits.Benefit.AirQualityBenefit.SO2Removed._text) +
            parseFloat(benefits.Benefit.AirQualityBenefit.O3Removed._text) +
            parseFloat(benefits.Benefit.AirQualityBenefit.PM25Removed._text)
          stringValue = total.toString()
          unit = 'lbs'
          break
        }
        case 'AirPollutionRemovedValue': {
          const total =
            parseFloat(benefits.Benefit.AirQualityBenefit.CORemovedValue._text) +
            parseFloat(benefits.Benefit.AirQualityBenefit.NO2RemovedValue._text) +
            parseFloat(benefits.Benefit.AirQualityBenefit.SO2RemovedValue._text) +
            parseFloat(benefits.Benefit.AirQualityBenefit.O3RemovedValue._text) +
            parseFloat(benefits.Benefit.AirQualityBenefit.PM25RemovedValue._text)
          stringValue = total.toString()
          unit = benefits.Benefit.AirQualityBenefit.CORemovedValue._attributes.Unit
          break
        }
        case 'CO2Sequestered': {
          stringValue = benefits.Benefit.CO2Benefits.CO2Sequestered._text
          unit = 'lbs'
          break
        }
        case 'CO2SequesteredValue': {
          stringValue = benefits.Benefit.CO2Benefits.CO2SequesteredValue._text
          unit = benefits.Benefit.CO2Benefits.CO2SequesteredValue._attributes.Unit
          break
        }
        case 'RunoffAvoided': {
          stringValue = benefits.Benefit.HydroBenefit.RunoffAvoided._text
          const cubic = parseFloat(stringValue)
          const gallons = cubic * CUBIC_GALLONS_FACTOR
          unit = 'gal'
          return `${gallons.toFixed(2)} ${unit}`
        }
        case 'RunoffAvoidedValue': {
          stringValue = benefits.Benefit.HydroBenefit.RunoffAvoidedValue._text
          unit = benefits.Benefit.HydroBenefit.RunoffAvoidedValue._attributes.Unit
          break
        }
        case 'CO2Storage': {
          stringValue = benefits.Carbon.CarbonDioxideStorage._text
          unit = 'lbs'
          break
        }
        case 'CO2StorageValue': {
          stringValue = benefits.Carbon.CarbonDioxideStorageValue._text
          unit = benefits.Carbon.CarbonDioxideStorageValue._attributes.Unit
          break
        }
      }
      const decimal = parseFloat(stringValue)
      const isUnitPrefix = unit === '$'
      let display = `${decimal.toFixed(2)} ${unit}`
      if (isUnitPrefix) {
        display = `${unit}${decimal.toFixed(2)}`
      }
      return display
    }
  }

  return (
    <>
      {/* <Button
        mode="outlined"
        onPress={() => loadBenefits()}
        disabled={!canCalculateBenefits}
        icon="calculator"
      >
        Calculate Tree Benefits
      </Button> */}

      <Modal
        transparent={true}
        animationType={'none'}
        visible={isCalculatorloader}
        onRequestClose={() => {
          console.log('close modal')
        }}
      >
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            <ActivityIndicator
              color={theme.colors.primary}
              size="large"
              animating={isCalculatorloader}
            />
          </View>
        </View>
      </Modal>

      {!!speciesData && (benefits || benefitsError.length !== 0) && (
        <Modal
          visible={isModalVisible}
          animationType="slide"
          onDismiss={() => {
            setIsModalVisible(false)
            // onModalClose()
          }}
        >
          <StatusBar />

          <View
            style={{
              flex: 1,
              backgroundColor: '#fff',
            }}
          >
            <ScrollView style={{ marginTop: 10 }}>
              <View style={{ flex: 1, paddingHorizontal: 15 }}>
                <Headline>Calculated Tree Benefits</Headline>
                <Text
                  style={{
                    color: benefitsError ? '#B31816' : '#000',
                    // backgroundColor: benefitsError ? '#FCE1E3' : '#F0FFF4',
                    fontStyle: 'italic',
                    fontSize: 13,
                    marginBottom: 10,
                    // padding: 10
                  }}
                >
                  {benefitsError
                    ? benefitsError
                    : "Tree Benefits are calculated using the 'iTree API' with permission from the USDA US Forest Service."}
                </Text>
                <Divider style={{ padding: 0.75, marginBottom: 5 }} />
                <Text style={{ fontSize: 16, fontWeight: 'bold', paddingVertical: 5 }}>
                  {speciesData.COMMON} ({speciesData.SCIENTIFIC})
                </Text>
                <Text>
                  {address.city}, {address.region}, {address.country}
                </Text>
              </View>

              <View>
                <View style={[styles.tableRow, styles.tableRowHeader]}>
                  <View style={styles.tableCell}>
                    <Text style={styles.sectionHeaderStyle}>Annual:</Text>
                  </View>
                </View>

                <View style={[styles.tableRow, styles.tableRowHeader]}>
                  <View style={styles.tableCell}>
                    <Text style={styles.headerTitleStyle}>CO² Sequestered Value</Text>
                  </View>
                  <View style={styles.tableCellRight}>
                    <Text style={styles.headerTitleStyle}>{getBenefit('CO2SequesteredValue')}</Text>
                  </View>
                </View>

                <View style={[styles.tableRow, styles.tableRowHeader]}>
                  <View style={styles.tableCell}>
                    <Text style={styles.headerTitleStyle}>CO² Sequestered Volume</Text>
                  </View>
                  <View style={styles.tableCellRight}>
                    <Text style={styles.headerTitleStyle}>{getBenefit('CO2Sequestered')}</Text>
                  </View>
                </View>

                <View style={[styles.tableRow, styles.tableRowHeader]}>
                  <View style={styles.tableCell}>
                    <Text style={styles.headerTitleStyle}>Storm Water Runoff Avoided Value</Text>
                  </View>
                  <View style={styles.tableCellRight}>
                    <Text style={styles.headerTitleStyle}>{getBenefit('RunoffAvoidedValue')}</Text>
                  </View>
                </View>

                <View style={[styles.tableRow, styles.tableRowHeader]}>
                  <View style={styles.tableCell}>
                    <Text style={styles.headerTitleStyle}>Storm Water Runoff Avoided Volume</Text>
                  </View>
                  <View style={styles.tableCellRight}>
                    <Text style={styles.headerTitleStyle}>{getBenefit('RunoffAvoided')}</Text>
                  </View>
                </View>

                <View style={[styles.tableRow, styles.tableRowHeader]}>
                  <View style={styles.tableCell}>
                    <Text style={styles.headerTitleStyle}>Air Pollution Removed Value</Text>
                  </View>
                  <View style={styles.tableCellRight}>
                    <Text style={styles.headerTitleStyle}>
                      {getBenefit('AirPollutionRemovedValue')}
                    </Text>
                  </View>
                </View>

                <View style={[styles.tableRow, styles.tableRowHeader]}>
                  <View style={styles.tableCell}>
                    <Text style={styles.headerTitleStyle}>Air Pollution Removed Volume</Text>
                  </View>
                  <View style={styles.tableCellRight}>
                    <Text style={styles.headerTitleStyle}>{getBenefit('AirPollutionRemoved')}</Text>
                  </View>
                </View>

                <View style={[styles.tableRow, styles.tableRowHeader]}>
                  <View style={styles.tableCell}>
                    <Text style={styles.sectionHeaderStyle}>To Date:</Text>
                  </View>
                </View>

                <View style={[styles.tableRow, styles.tableRowHeader]}>
                  <View style={styles.tableCell}>
                    <Text style={styles.headerTitleStyle}>Total CO² Storage Value</Text>
                  </View>
                  <View style={styles.tableCellRight}>
                    <Text style={styles.headerTitleStyle}>{getBenefit('CO2StorageValue')}</Text>
                  </View>
                </View>

                <View style={[styles.tableRow, styles.tableRowHeader]}>
                  <View style={styles.tableCell}>
                    <Text style={styles.headerTitleStyle}>Total CO² Storage</Text>
                  </View>
                  <View style={styles.tableCellRight}>
                    <Text style={styles.headerTitleStyle}>{getBenefit('CO2Storage')}</Text>
                  </View>
                </View>
              </View>
            </ScrollView>

            <Button
              mode="contained"
              style={{ borderRadius: 0, padding: 10 }}
              onPress={() => {
                setBenefits({})
                setBenefitsError('')
                setIsModalVisible(false)
                setTimeout(() => {
                  Alert.alert('Success', 'You have added a new tree successfully.', [
                    {
                      text: 'Great',
                      onPress: () => {
                        onModalClose()
                        setModalClosed(true)
                      },
                    },
                  ])
                }, 2000)
              }}
            >
              Done
            </Button>
          </View>
        </Modal>
      )}
    </>
  )
}
