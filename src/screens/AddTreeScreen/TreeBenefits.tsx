import React from 'react'
import axios from 'axios';
import { xml2js, xml2json } from 'xml-js'
import { Modal, View, ScrollView, StyleSheet } from 'react-native'
import { Banner, Text, Headline, Button } from 'react-native-paper'
import { StatusBar } from '../../components/StatusBar'
import { CONFIG } from '../../../envVariables'
import { FormValues } from './addTreeForm';
import { Benefit, RootObject } from './TreeBenefitResponse';

interface TreeBenefitsProps {
  values: FormValues
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
})

export function TreeBenefits(props: TreeBenefitsProps) {
  const [isModalVisible, setIsModalVisible] = React.useState<boolean>(false)
  const [benefits, setBenefits] = React.useState<Benefit>()
  const [formattedResponse, setFormattedResponse] = React.useState("")
  const { values } = props;
  const { crownLightExposureCategory, dbh, speciesData, treeConditionCategory } = values;

  const canCalculateBenefits = !!(
    speciesData
    && crownLightExposureCategory
    && dbh
    && speciesData
    && treeConditionCategory);

  const loadBenefits = async() => {
    if (speciesData && speciesData.ID) {
      const url = `${CONFIG.API_TREE_BENEFIT}?`
      + `key=${CONFIG.ITREE_KEY}&`
      + `NationFullName=${CONFIG.NATION}&`
      + `StateAbbr=${CONFIG.STATE}&`
      + `CountyName=${CONFIG.COUNTYNAME}&`
      + `CityName=${CONFIG.CITYNAME}&`
      + `Species=${speciesData.ITREECODE}&`
      + `DBHInch=${dbh}&`
      + `condition=${treeConditionCategory}&`
      + `CLE=${crownLightExposureCategory}&`
      + `TreeHeightMeter=-1&`
      + `TreeCrownWidthMeter=-1&`
      + `TreeCrownHeightMeter=-1&`;

      const response = await axios.get(url);
      if (response.data) {
        const formattedResponse: string = xml2json(response.data, {compact: true, spaces: 2});
        const root: RootObject = xml2js(response.data, {compact: true}) as RootObject;
        if (root) {
          setBenefits(root.Result.OutputInformation.Benefit);
          setFormattedResponse(formattedResponse);
          setIsModalVisible(true);
        }
      }
    }
  }

  const getBenefit = (benefitName: string) => {
    if (benefits && benefits.CO2Benefits) {
        let stringValue = ""
        let unit = ""
        switch (benefitName) {
          case "CORemoved": {
            stringValue = benefits.AirQualityBenefit.CORemovedValue._text;
            unit = benefits.AirQualityBenefit.CORemovedValue._attributes.Unit;
            break;
          }
          case "CO2Sequestered": {
            stringValue = benefits.CO2Benefits.CO2SequesteredValue._text;
            unit = benefits.CO2Benefits.CO2SequesteredValue._attributes.Unit;
            break;
          }
          case "RunoffAvoided": {
            stringValue = benefits.HydroBenefit.RunoffAvoidedValue._text;
            unit = benefits.HydroBenefit.RunoffAvoidedValue._attributes.Unit;
          }
        }
        const decimal = parseFloat(stringValue);
        const isUnitPrefix = (unit === "$")
        let display =  `${decimal.toFixed(2)} ${unit}`;
        if (isUnitPrefix) {
          display =  `${unit}${decimal.toFixed(2)}`;
        }
        return display;
    }
  }

  return (
    <>
      <Button
        mode="outlined"
        onPress={loadBenefits}
        disabled={!canCalculateBenefits}
        icon="calculator"
      >
        Calculate Tree Benefits
      </Button>

      {!!speciesData && benefits && (
        <Modal
          visible={isModalVisible}
          animationType="slide"
          onDismiss={() => {
            setIsModalVisible(false)
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
                <Text>
                  {speciesData.COMMON} ({speciesData.SCIENTIFIC})
                </Text>

                <Banner visible actions={[]} style={{ marginTop: 15, backgroundColor: '#F0FFF4' }}>
                  This feature is currently under active development and will be made available in a
                  future beta release
                </Banner>
              </View>

              <View>
                <View style={[styles.tableRow, styles.tableRowHeader]}>
                  <View style={styles.tableCell}>
                    <Text style={styles.headerTitleStyle}>Carbon Dioxide (CO2) Sequestered</Text>
                  </View>
                  <View style={styles.tableCellRight}>
                    <Text style={styles.headerTitleStyle}>
                      {getBenefit("CO2Sequestered")}
                    </Text>
                  </View>
                </View>

                {/* <View style={styles.tableRow}>
                  <View style={styles.tableCell}>
                    <Text>Annual CO2 equivalent of carbon</Text>
                  </View>
                  <View style={styles.tableCellRight}>
                    <Text>{'<'} 0.10 lbs</Text>
                  </View>
                </View> */}

                <View style={[styles.tableRow, styles.tableRowHeader]}>
                  <View style={styles.tableCell}>
                    <Text style={styles.headerTitleStyle}>Storm Water Runoff Avoided</Text>
                  </View>
                  <View style={styles.tableCellRight}>
                    <Text style={styles.headerTitleStyle}>
                      {'<'} {getBenefit("RunoffAvoided")}
                    </Text>
                  </View>
                </View>

                {/* <View style={styles.tableRow}>
                  <View style={styles.tableCell}>
                    <Text>Runoff Avoided</Text>
                  </View>
                  <View style={styles.tableCellRight}>
                    <Text>{'<'} 0.10 gal</Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableCell}>
                    <Text>Rainfall Intercepted</Text>
                  </View>
                  <View style={styles.tableCellRight}>
                    <Text>{'<'} 0.10 gal</Text>
                  </View>
                </View> */}

                <View style={[styles.tableRow, styles.tableRowHeader]}>
                  <View style={styles.tableCell}>
                    <Text style={styles.headerTitleStyle}>Air Pollution Removed Each Year</Text>
                  </View>
                  <View style={styles.tableCellRight}>
                    <Text style={styles.headerTitleStyle}>
                      {getBenefit("CORemoved")}
                    </Text>
                  </View>
                </View>

                <View style={[styles.tableRow, styles.tableRowHeader]}>
                  <View style={styles.tableCell}>
                    <Text style={styles.headerTitleStyle}>Energy Usage Per Year</Text>
                  </View>
                  <View style={styles.tableCellRight}>
                    <Text style={styles.headerTitleStyle}>US$0.00</Text>
                  </View>
                </View>

                <View style={[styles.tableRow, styles.tableRowHeader]}>
                  <View style={styles.tableCell}>
                    <Text style={styles.headerTitleStyle}>Avoided Energy Emissions</Text>
                  </View>
                  <View style={styles.tableCellRight}>
                    <Text style={styles.headerTitleStyle}>US$0.00</Text>
                  </View>
                </View>
              </View>

              <Text>
                {formattedResponse}
              </Text>
            </ScrollView>

            <Button
              mode="contained"
              style={{ borderRadius: 0 }}
              onPress={() => {
                setIsModalVisible(false)
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
