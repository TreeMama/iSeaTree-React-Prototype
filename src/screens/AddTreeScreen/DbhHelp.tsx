import React from 'react'

import { Modal, View, ScrollView, Image } from 'react-native'
import { Text, Title, Headline, Button, useTheme } from 'react-native-paper'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import { StatusBar } from '../../components/StatusBar'

const imageStep1 = require('../../../assets/dbh-help/step_1.png')
const imageStep2 = require('../../../assets/dbh-help/step_2.png')
const imageStep3 = require('../../../assets/dbh-help/step_3.png')
const imageStep4 = require('../../../assets/dbh-help/step_4.png')
const imageStep5 = require('../../../assets/dbh-help/step_5.png')

export function DbhHelp() {
  const [isModalVisible, setIsModalVisible] = React.useState<boolean>(false)
  const theme = useTheme()

  return (
    <View>
      <Button
        onPress={() => {
          setIsModalVisible(true)
        }}
      >
        <MaterialCommunityIcons name="help-circle-outline" size={20} color={theme.colors.primary} />
      </Button>

      <Modal visible={isModalVisible} animationType="slide">
        <StatusBar />

        <View
          style={{
            flex: 1,
            backgroundColor: '#fff',
          }}
        >
          <ScrollView>
            <View style={{ flex: 1, padding: 15, paddingBottom: 50 }}>
              <Headline>How to measure DBH</Headline>
              <Text style={{ fontStyle: 'italic' }}>DBH - Diameter at Breast Height</Text>

              <View style={{ marginTop: 20 }}>
                <Title>What you need</Title>
                <Text>{'\u2022'} Measuring tape</Text>
                <Text>{'\u2022'} String</Text>
                <Text>{'\u2022'} Thumbtack or tape</Text>
              </View>

              <View style={{ marginTop: 20 }}>
                <Title>Steps</Title>
                <Text>
                  1. With the measuring tape, measure 4.5 feet up along the center of the trunk
                  axis.
                </Text>
                <View style={{ marginTop: 15, alignItems: 'center' }}>
                  <Image source={imageStep1} />
                </View>

                <Text style={{ marginTop: 15 }}>
                  2. Using the thumbtack or tape, mark the height on the tree.
                </Text>
                <View style={{ marginTop: 15, alignItems: 'center' }}>
                  <Image source={imageStep2} />
                </View>

                <Text style={{ marginTop: 15 }}>
                  3. Tightly wrap your string around the tree trunk at 4.5 feet.
                </Text>
                <View style={{ marginTop: 15, alignItems: 'center' }}>
                  <Image source={imageStep3} />
                </View>

                <Text style={{ marginTop: 15 }}>
                  4. Measure the length of the string to get the circumference of the tree.
                </Text>
                <View style={{ marginTop: 15, alignItems: 'center' }}>
                  <Image source={imageStep4} style={{ width: '100%', resizeMode: 'contain' }} />
                </View>

                <Text style={{ marginTop: 15 }}>
                  5. Convert the circumference measure to diameter by dividing by pi (3.14).
                </Text>
                <View style={{ marginTop: 15, alignItems: 'center' }}>
                  <Image source={imageStep5} />
                </View>
              </View>

              <View style={{ marginTop: 20 }}>
                <Text>
                  For multi-stemmed trees, repeat steps 1 to 4 for each stem and add all
                  circumferences together. Convert the total circumference to diameter by dividing
                  by pi (3.14).
                </Text>
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
            Close
          </Button>
        </View>
      </Modal>
    </View>
  )
}
