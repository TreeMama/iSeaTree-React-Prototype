import React from 'react'

import { MaterialCommunityIcons } from '@expo/vector-icons'
import { StyleSheet, View, Modal } from 'react-native'
import { Button, Title, Paragraph } from 'react-native-paper'

import { Camera } from '../components/Camera'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
})

export function AddTreeScreen() {
  const [isCameraVisible, setIsCameraVisible] = React.useState<boolean>(false)

  return (
    <View style={styles.container}>
      <Title>AddTreeScreen</Title>
      <Paragraph>do something here</Paragraph>

      <Button
        onPress={() => {
          setIsCameraVisible(true)
        }}
      >
        <MaterialCommunityIcons name="camera" size={30} />
      </Button>

      <Modal visible={isCameraVisible} animationType="slide">
        <Camera
          onClose={() => {
            setIsCameraVisible(false)
          }}
        />
      </Modal>
    </View>
  )
}
