import React from 'react'

import { View } from 'react-native'
import { ActivityIndicator, Button, Paragraph, Text, Dialog } from 'react-native-paper'
import * as Location from 'expo-location'

import { colors } from '../styles/theme'
import { Camera, CapturedPicture } from './Camera'

interface CameraWithLocationProps {
  onClose: () => void
  onTakePictureFinish: ({
    capturedPicture,
    location,
  }: {
    capturedPicture: CapturedPicture
    location: Location.LocationData
  }) => void
}

export function CameraWithLocation(props: CameraWithLocationProps) {
  const [isLocationDialogVisible, setIsLocatDialogVisible] = React.useState<boolean>(false)
  const [isLoadingLocation, setIsLoadingLocation] = React.useState<boolean>(true)
  const [errorMessage, setErrorMessage] = React.useState<null | string>(null)

  async function getCurrentLocation(): Promise<null | { location: Location.LocationData }> {
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

        return { location }
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

  function handleTakePicture(capturedPicture: CapturedPicture) {
    setIsLocatDialogVisible(true)
    getCurrentLocation().then((result) => {
      if (!!result) {
        props.onTakePictureFinish({ capturedPicture, location: result.location })
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
