import React from 'react'

import { Modal, View, ScrollView, Image } from 'react-native'
import { Text, Title, Headline, Button, useTheme } from 'react-native-paper'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import { StatusBar } from '../../components/StatusBar'

const imageStep1 = require('../../../assets/tree-help/InfoPopUp.png')

export function TtypeHelp() {
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
          <View style={{ width: '100%', height: '90%',marginTop:20 }}>
            <Image source={imageStep1} resizeMode={'contain'} style={{ width: '100%', height: '90%' }} />
          </View>
          <Button
            mode="contained"
            style={{ borderRadius: 0, position: 'absolute', bottom: 0, padding: 15, width: '100%' }}
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
