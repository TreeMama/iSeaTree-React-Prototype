import React from 'react'

import { View } from 'react-native'
import { ActivityIndicator, Button, Paragraph, Text, Dialog } from 'react-native-paper'
import * as Location from 'expo-location'

import { colors } from '../styles/theme'
import { Camera, CapturedPicture } from './Camera'

interface Coords {
  latitude: number
  longitude: number
}

interface CameraWithLocationProps {
  onClose: () => void
  onTakePictureFinish: ({
    capturedPicture,
    coords,
  }: {
    capturedPicture: CapturedPicture
    coords: Coords
  }) => void
}

export function CameraWithLocation(props: CameraWithLocationProps) {
  const [isLocationDialogVisible, setIsLocatDialogVisible] = React.useState<boolean>(false)
  const [isLoadingLocation, setIsLoadingLocation] = React.useState<boolean>(true)
  const [errorMessage, setErrorMessage] = React.useState<null | string>(null)

  async function getCurrentLocation(): Promise<null | Coords> {
    try {
      const { status } = await Location.requestPermissionsAsync()
      if (status !== Location.PermissionStatus.GRANTED) {
        setIsLoadingLocation(false)
        setErrorMessage('Disallowed access to Location. Go to the settings and change permissions.')
        return null
      } else {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.BestForNavigation,
        })

        const decimals = 1000000
        const roundedLatitude = Math.round(location.coords.latitude * decimals) / decimals
        const roundedLongitude = Math.round(location.coords.longitude * decimals) / decimals
        console.log("location from device", location, location.coords)
        console.log("rounded", roundedLatitude, roundedLongitude)
        return { latitude: roundedLatitude, longitude: roundedLongitude }
      }
    } catch (error) {
      if (__DEV__) {
        console.log(error)
      }
      setErrorMessage('There was an unexpected error. Please try again later.')
      setIsLoadingLocation(false)

      return null
    }
  }

  function getLocationFromExif(capturedPicture: CapturedPicture): Coords | null {
    if (!capturedPicture.exif) {
      return null
    }

    var latitude: number | undefined = capturedPicture.exif.GPSLatitude
    if (capturedPicture.exif.GPSLatudeRef == "S") {
      latitude = latitude * -1
    }
    var longitude: number | undefined = capturedPicture.exif.GPSLongitude
    if (capturedPicture.exif.GPSLongitudeRef == "W") {
      longitude = longitude * -1
    }

    if (!latitude || !longitude) {
      return null
    }
    console.log("exif lon", longitude)
    console.log("exif lat", latitude)
    const timestring = capturedPicture.exif.DateTimeOriginal
    const offset = capturedPicture.exif.OffsetTimeOriginal
    console.log("captured", timestring, offset)
    return { latitude, longitude }
  }

  function handleTakePicture(capturedPicture: CapturedPicture) {
    setIsLocatDialogVisible(true)

    const coordsFromExif = getLocationFromExif(capturedPicture)
    console.log("coordsFromExif", coordsFromExif)

    if (!!coordsFromExif) {
      props.onTakePictureFinish({ capturedPicture, coords: coordsFromExif })
      return
    }

    getCurrentLocation().then((coords) => {
      if (!!coords) {
        props.onTakePictureFinish({ capturedPicture, coords })
      }
    })
  }

  return (
    <>
      <Camera onClose={props.onClose} onTakePicture={handleTakePicture} />

      <Dialog visible={isLocationDialogVisible} dismissable={false}>
        {isLoadingLocation && (
          <Dialog.Content>
            <View style={{ alignItems: 'center', padding: 10 }}>
              <ActivityIndicator animating={true} size="large" color={colors.gray[700]} />
              <Text style={{ color: colors.gray[700], marginTop: 15 }}>Getting coordinates</Text>
            </View>
          </Dialog.Content>
        )}

        {!isLoadingLocation && !!errorMessage && (
          <>
            <Dialog.Content style={{ padding: 15 }}>
              <Paragraph>{errorMessage}</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={props.onClose}>Ok</Button>
            </Dialog.Actions>
          </>
        )}
      </Dialog>
    </>
  )
}
