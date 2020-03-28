import React from 'react'

import { MaterialCommunityIcons } from '@expo/vector-icons'
import { StyleSheet, View, Modal, Image, Alert, ScrollView } from 'react-native'
import { Button } from 'react-native-paper'
import Constants from 'expo-constants'

import { Camera } from '../components/Camera'
import { colors } from '../styles/theme'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Constants.statusBarHeight,
  },
})

export function AddTreeScreen() {
  const [isCameraVisible, setIsCameraVisible] = React.useState<boolean>(false)
  const [selectedPictureUri, setSelectedPictureUri] = React.useState<string | null>(null)

  function clearAll() {
    setSelectedPictureUri(null)
  }

  function handleClear() {
    Alert.alert('', 'Are you sure?', [
      { text: 'Cancel' },
      {
        text: 'Yes, clear all',
        onPress: () => {
          clearAll()
        },
      },
    ])
  }

  const canClear: boolean = !!selectedPictureUri

  return (
    <ScrollView style={styles.container}>
      <Button
        style={{ alignSelf: 'flex-end', marginVertical: 5 }}
        icon="close"
        onPress={handleClear}
        disabled={!canClear}
      >
        Clear
      </Button>

      <View
        style={{
          backgroundColor: colors.gray[200],
          height: 220,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {!!selectedPictureUri ? (
          <Image
            style={{ height: '100%', width: '100%', resizeMode: 'contain' }}
            source={{ uri: selectedPictureUri }}
          />
        ) : (
          <MaterialCommunityIcons name="image" size={60} color={colors.gray[400]} />
        )}
      </View>

      <Button
        onPress={() => {
          setIsCameraVisible(true)
        }}
        icon="camera"
      >
        Add photo
      </Button>

      <Modal visible={isCameraVisible} animationType="slide">
        <Camera
          onClose={() => {
            setIsCameraVisible(false)
          }}
          onTakePicture={(capturedPicture) => {
            console.log(capturedPicture)
            setSelectedPictureUri(capturedPicture.uri)
            setIsCameraVisible(false)
          }}
        />
      </Modal>
    </ScrollView>
  )
}
