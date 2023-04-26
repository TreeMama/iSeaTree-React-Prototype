/**
 * The TtypeHelp function displays a help modal with an image and a close button when a help icon is
 * pressed.
 * @returns A React component called TtypeHelp that renders a button with a help icon. When the button
 * is pressed, a modal is displayed with an image and a "Close" button. The modal can be closed by
 * pressing the "Close" button.
 */

import React from 'react'

import { Modal, View, ScrollView, Image, TouchableOpacity } from 'react-native'
import { Text, Title, Headline, Button, useTheme } from 'react-native-paper'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import { StatusBar } from '../../components/StatusBar'

const imageStep1 = require('../../../assets/tree-help/InfoPopUp.png')

/**
 * This is a TypeScript React component that displays a help modal with an image and a close button
 * when a help icon is clicked.
 * @returns A React component that renders a help icon button. When the button is pressed, a modal is
 * displayed with an image and a "Close" button. The modal is controlled by the state variable
 * `isModalVisible`. The component also uses the `useTheme` hook from the `react-native-paper` library
 * to get the current theme.
 */
export function TtypeHelp() {
  const [isModalVisible, setIsModalVisible] = React.useState<boolean>(false)
  const theme = useTheme()

  return (
    <View>
      {/* <Button
        onPress={() => {
          setIsModalVisible(true)
        }}
      >
        <MaterialCommunityIcons name="help-circle-outline" size={20} color={theme.colors.primary} />
      </Button> */}
      <TouchableOpacity
        onPress={() => {
          setIsModalVisible(true)
        }}
        style={{
          marginLeft: 5,
          bottom: 5,
        }}
      >
        <MaterialCommunityIcons name="help-circle-outline" size={18} color={theme.colors.primary} />
      </TouchableOpacity>

      <Modal visible={isModalVisible} animationType="slide">
        <StatusBar />
        <View
          style={{
            flex: 1,
            backgroundColor: '#fff',
          }}
        >
          <View style={{ width: '100%', height: '90%', marginTop: 20 }}>
            <Image
              source={imageStep1}
              resizeMode={'contain'}
              style={{ width: '100%', height: '90%' }}
            />
          </View>
          <Button
            mode="contained"
            style={{ borderRadius: 0, position: 'absolute', bottom: 0, padding: 10, width: '100%' }}
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
