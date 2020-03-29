import React from 'react'

import { MaterialCommunityIcons } from '@expo/vector-icons'
import { StyleSheet, View, Modal, Image, Alert, ScrollView } from 'react-native'
import { Button } from 'react-native-paper'
import Constants from 'expo-constants'

import { CameraWithLocation } from '../../components/CameraWithLocation'
import { colors } from '../../styles/theme'
import { SpeciesSelect } from './SpeciesSelect'

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
  const [coords, setCoords] = React.useState<null | { latitude: number; longitude: number }>(null)

  function clearAll() {
    setSelectedPictureUri(null)
    setCoords(null)
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
        {!!selectedPictureUri && (
          <Image
            style={{ height: '100%', width: '100%', resizeMode: 'contain' }}
            source={{ uri: selectedPictureUri }}
          />
        )}

        {!selectedPictureUri && (
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

      <View style={{ marginTop: 20 }}>
        <SpeciesSelect />
      </View>

      <Modal visible={isCameraVisible} animationType="slide">
        <CameraWithLocation
          onClose={() => {
            setIsCameraVisible(false)
          }}
          onTakePictureFinish={({ capturedPicture }) => {
            setSelectedPictureUri(capturedPicture.uri)
            setIsCameraVisible(false)
          }}
        />
      </Modal>
    </ScrollView>
  )
}
