import React from 'react'

import { MaterialCommunityIcons } from '@expo/vector-icons'
import { StyleSheet, View, Modal, Image, Alert, ScrollView } from 'react-native'
import { ActivityIndicator, Button, Text } from 'react-native-paper'
import Constants from 'expo-constants'
import * as Location from 'expo-location'

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
  const [coords, setCoords] = React.useState<null | { latitude: number; longitude: number }>(null)
  const [isGettingCoords, setIsGettingCoords] = React.useState<boolean>(false)

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

  async function getPhotoLocation() {
    setIsGettingCoords(true)
    // TODO
    // if photo exif does not have location data get current location
    // but only if image was taken just captured!

    try {
      const { status } = await Location.requestPermissionsAsync()
      if (status !== Location.PermissionStatus.GRANTED) {
        // TODO
        // alert message -> no permission for location
        return
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
      })

      console.log('location: ', location)

      setCoords({ longitude: location.coords.longitude, latitude: location.coords.latitude })
      setIsGettingCoords(false)
    } catch (error) {
      if (__DEV__) {
        console.log(error)
      }

      setIsGettingCoords(false)
      // TODO: handle possible errors
    }
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
        {/* TODO: maybe refactor below condition  */}
        {!!selectedPictureUri &&
          (isGettingCoords ? (
            <>
              <ActivityIndicator animating={true} size="large" color={colors.gray[400]} />
              <Text style={{ color: colors.gray[400], marginTop: 15 }}>Getting coordinates</Text>
            </>
          ) : (
            <Image
              style={{ height: '100%', width: '100%', resizeMode: 'contain' }}
              source={{ uri: selectedPictureUri }}
            />
          ))}

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

      <Modal visible={isCameraVisible} animationType="slide">
        <Camera
          onClose={() => {
            setIsCameraVisible(false)
          }}
          onTakePicture={(capturedPicture) => {
            setSelectedPictureUri(capturedPicture.uri)
            setIsCameraVisible(false)
            getPhotoLocation()
          }}
        />
      </Modal>
    </ScrollView>
  )
}
