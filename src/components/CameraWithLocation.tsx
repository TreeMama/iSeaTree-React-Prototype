/**
 * The `CameraWithLocation` component takes a picture with the device's camera and retrieves the
 * location coordinates either from the picture's EXIF data or from the device's GPS, and passes them
 * to a callback function.
 * @returns The `CameraWithLocation` component is being returned.
 */

import React from 'react'
import { View } from 'react-native'
import { ActivityIndicator, Button, Paragraph, Text, Dialog } from 'react-native-paper'
import * as Location from 'expo-location'
import { colors } from '../styles/theme'
import { Camera, CapturedPicture } from './Camera'

/* The `interface Coords` defines a type for an object that contains latitude and longitude
coordinates. This is used in the `CameraWithLocationProps` interface to specify the expected shape
of the `coords` parameter passed to the `onTakePictureFinish` callback function. It is also used in
the `getCurrentLocation` and `getLocationFromExif` functions to return an object with latitude and
longitude properties. */

interface Coords {
  latitude: number
  longitude: number
}

/* The `interface CameraWithLocationProps` is defining the expected props for the `CameraWithLocation`
component. It has two properties: `onClose`, which is a function that takes no arguments and returns
nothing, and `onTakePictureFinish`, which is a function that takes an object with two properties:
`capturedPicture`, which is of type `CapturedPicture`, and `coords`, which is of type `Coords`. The
`onTakePictureFinish` function returns nothing. */

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

/**
 * The `CameraWithLocation` function is a React component that allows the user to take a picture with
 * location data, either by using the device's current location or by extracting location data from the
 * picture's EXIF metadata.
 * @returns The `CameraWithLocation` component is being returned.
 */
export function CameraWithLocation(props: CameraWithLocationProps) {
  const [isLocationDialogVisible, setIsLocatDialogVisible] = React.useState<boolean>(false)
  const [isLoadingLocation, setIsLoadingLocation] = React.useState<boolean>(true)
  const [errorMessage, setErrorMessage] = React.useState<null | string>(null)

  /**
   * This function retrieves the current location of the device and returns it as an object with
   * rounded latitude and longitude values, or null if there is an error or access to location is
   * disallowed.
   * @returns a Promise that resolves to either `null` or an object with `latitude` and `longitude`
   * properties (`Coords`).
   */

  async function getCurrentLocation(): Promise<null | Coords> {
    try {
      const { status } = await Location.requestPermissionsAsync()
      if (status !== Location.PermissionStatus.GRANTED) {
        setIsLoadingLocation(false)
        setErrorMessage('Disallowed access to Location. Go to the settings and change permissions.')
        return null
      } else {
        let location
        try {
          location = await Location.getCurrentPositionAsync()
        } catch (error) {
          location = await Location.getLastKnownPositionAsync()
        }

        const decimals = 1000000
        const roundedLatitude = Math.round(location?.coords.latitude * decimals) / decimals
        const roundedLongitude = Math.round(location?.coords.longitude * decimals) / decimals
        console.log('location from device', location, location?.coords)
        console.log('rounded', roundedLatitude, roundedLongitude)
        return { latitude: roundedLatitude, longitude: roundedLongitude }
      }
    } catch (error) {
      if (__DEV__) {
        console.log(error)
      }
      setErrorMessage(
        'There was an unexpected error (CameraWithLocation::getCurrentLocation). Please try again later.',
      )
      setIsLoadingLocation(false)

      return null
    }
  }

  /**
   * This function extracts latitude and longitude coordinates from the EXIF data of a captured picture
   * and returns them as a Coords object, or null if the data is not available.
   * @param {CapturedPicture} capturedPicture - CapturedPicture object that contains the image and its
   * metadata, including the GPS coordinates in the EXIF data.
   * @returns either a Coords object or null.
   */

  function getLocationFromExif(capturedPicture: CapturedPicture): Coords | null {
    if (!capturedPicture.exif) {
      return null
    }

    var latitude: number | undefined = capturedPicture.exif.GPSLatitude
    if (capturedPicture.exif.GPSLatudeRef == 'S') {
      latitude = latitude * -1
    }
    var longitude: number | undefined = capturedPicture.exif.GPSLongitude
    if (capturedPicture.exif.GPSLongitudeRef == 'W') {
      longitude = longitude * -1
    }

    if (!latitude || !longitude) {
      return null
    }
    console.log('exif lon', longitude)
    console.log('exif lat', latitude)
    const timestring = capturedPicture.exif.DateTimeOriginal
    const offset = capturedPicture.exif.OffsetTimeOriginal
    console.log('captured', timestring, offset)
    return { latitude, longitude }
  }

  /**
   * This function handles taking a picture and getting its location data from either the picture's
   * EXIF metadata or the device's current location.
   * @param {CapturedPicture} capturedPicture - CapturedPicture is likely an object that contains
   * information about a picture that has been captured, such as the image data, file name, and other
   * metadata. It is likely used as an input parameter for the handleTakePicture function.
   * @returns The function `handleTakePicture` does not have a return statement, so it does not return
   * anything. It performs some actions such as setting a state variable, getting location data from
   * the EXIF metadata of an image, and calling another function to get the current location. It then
   * calls the `onTakePictureFinish` function with an object containing the captured picture and either
   * the location data from the EX
   */

  function handleTakePicture(capturedPicture: CapturedPicture) {
    setIsLocatDialogVisible(true)

    const coordsFromExif = getLocationFromExif(capturedPicture)
    console.log('coordsFromExif', coordsFromExif)

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
      {/* `<Camera onClose={props.onClose} onTakePicture={handleTakePicture} />` is rendering the
      `Camera` component with two props: `onClose` and `onTakePicture`. `onClose` is a function that
      will be called when the user wants to close the camera, and `onTakePicture` is a function that
      will be called when the user takes a picture with the camera. These props are passed down to
      the `Camera` component so that it can use them to handle user interactions and communicate
  with the parent component. */}

      <Camera onClose={props.onClose} onTakePicture={handleTakePicture} />

      {/* The `Dialog` component is being used to display a loading indicator while the app is retrieving
     the device's current location. The `visible` prop is set to the value of the
     `isLocationDialogVisible` state variable, which determines whether the dialog should be
     displayed or not. The `dismissable` prop is set to `false` to prevent the user from dismissing
the dialog while the app is still retrieving the location data. */}

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
