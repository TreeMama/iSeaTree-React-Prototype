import React, { useEffect } from 'react'
import axios from 'axios';
import { parseString } from 'react-native-xml2js';
import { Modal, View, ScrollView, StyleSheet } from 'react-native'
import { Banner, Text, Headline, Button } from 'react-native-paper'
import { StatusBar } from '../../components/StatusBar'
import { CONFIG } from '../../../envVariables'

interface TreeBenefitsProps {
  speciesData: null | { ID: string; COMMON: string; ITREECODE: string; SCIENTIFIC: string }
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
  const [benefits, setBenefits] = React.useState<boolean>()

  const canCalculateBenefits: boolean = !!props.speciesData

  useEffect(() => {
    const loadBenefits = async() => {
      console.log("loadBenefits: " + JSON.stringify(props.speciesData))
      if (props.speciesData && props.speciesData.ID) {
        const url = `${CONFIG.API_TREE_BENEFIT}?key=${CONFIG.ITREE_KEY}&NationFullName=${CONFIG.NATION}&StateAbbr=${CONFIG.STATE}&CountyName=${CONFIG.CITY}&CityName=${CONFIG.CITYNAME}&Species=${props.speciesData.ITREECODE}&DBHInch=42&condition=Good&CLE=2&TreeHeightMeter=-1&TreeCrownWidthMeter=-1&TreeCrownHeightMeter=-1`;
        const response = await axios.get(url, {
          headers: {
            "Content-Type": "application/xml"
          }
        });
        if (response.data) {
          parseString(response.data, function (error, result) {
            setBenefits(result);
            console.log(JSON.stringify(result.Result));
          });
        }
      }
    }
    loadBenefits();
  }, [props.speciesData])

  return (
    <>
      <Button
        mode="outlined"
        onPress={() => {
          setIsModalVisible(true)
        }}
        disabled={!canCalculateBenefits}
        icon="calculator"
      >
        Calculate Tree Benefits
      </Button>

      {!!props.speciesData && (
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
                  {benefits && JSON.stringify(benefits)}
                </Text>
                <Text>
                  {props.speciesData.COMMON} ({props.speciesData.SCIENTIFIC})
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
                    <Text style={styles.headerTitleStyle}>US$0.00</Text>
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
                    <Text style={styles.headerTitleStyle}>{'<'} $0.10</Text>
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
                    <Text style={styles.headerTitleStyle}>US$0.00</Text>
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
