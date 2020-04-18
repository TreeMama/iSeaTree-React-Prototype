import React from 'react'

import { Modal, View, ScrollView, StyleSheet } from 'react-native'
import { Banner, Text, Headline, Button } from 'react-native-paper'

import { StatusBar } from '../../components/StatusBar'

interface TreeBenefitsProps {
  speciesData: null | { ID: string; COMMON: string; SCIENTIFIC: string }
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

  const canCalculateBenefits: boolean = !!props.speciesData

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
