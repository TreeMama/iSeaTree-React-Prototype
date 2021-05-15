import React from 'react'

import { MaterialCommunityIcons } from '@expo/vector-icons'
import { View, Image, Alert, Platform } from 'react-native'
import { Camera as ExpoCamera } from 'expo-camera'
import { Text, Button } from 'react-native-paper'
import * as ImageManipulator from 'expo-image-manipulator'

import { StatusBar } from './StatusBar'

export interface CapturedPicture {
  width: number
  height: number
  uri: string
  base64?: string
  exif?: any
}

interface CameraProps {
  onClose: () => void
  onTakePicture: (picture: CapturedPicture) => void
}

export function Camera(props: CameraProps) {
  const [hasCameraPermission, setHasCameraPermission] = React.useState<null | boolean>(null)
  const [selectedPhotoUri, setSelectedPhotoUri] = React.useState<null | string>(null)

  const cameraRef = React.useRef<ExpoCamera>(null)

  React.useEffect(() => {
    ExpoCamera.requestPermissionsAsync().then(({ status }) => {
      setHasCameraPermission(status === 'granted')
    })
  }, [])

  if (hasCameraPermission === null) {
    return <View />
  }

  function handleTakePicture() {
    const cameraRefObj = cameraRef.current

    if (!cameraRefObj) {
      return
    }

    cameraRefObj.takePictureAsync({ exif: true, quality: 0.6 }).then((photo) => {
      cameraRefObj.pausePreview()
      if (Platform.OS === 'android' && photo.exif.Orientation === 6) {
        console.log('Image is rotated. Fixing.')
        ImageManipulator.manipulateAsync(photo.uri, [{ rotate: -90 }], {
          compress: 1,
          format: ImageManipulator.SaveFormat.JPEG,
        }).then((fixedPhoto) => {
          props.onTakePicture(fixedPhoto)
        })
      } else {
        props.onTakePicture(photo)
      }
    })
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar />

      <Button
        mode="outlined"
        onPress={props.onClose}
        style={{ backgroundColor: 'white', borderRadius: 0 }}
      >
        Cancel
      </Button>

      {selectedPhotoUri && (
        <View style={{ flex: 1, backgroundColor: '#000' }}>
          <Image
            source={{ uri: selectedPhotoUri }}
            style={{ height: '100%', width: '100%', resizeMode: 'contain' }}
          />
        </View>
      )}

      {hasCameraPermission == false && (
        <View style={{ flex: 1 }}>
          <Text style={{ marginTop: 50, padding: 20 }}>
            Please allow access to your camera. Go to the settings and change permissions.
          </Text>
        </View>
      )}

      {!selectedPhotoUri && hasCameraPermission && (
        <ExpoCamera style={{ flex: 1 }} type={ExpoCamera.Constants.Type.back} ref={cameraRef}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              flexDirection: 'row',
              justifyContent: 'center',
            }}
          >
            <Button
              style={{
                alignSelf: 'flex-end',
                alignItems: 'center',
                marginBottom: 20,
                borderRadius: 20,
              }}
              onPress={handleTakePicture}
            >
              <MaterialCommunityIcons name="camera-iris" size={80} color="white" />
            </Button>
          </View>
        </ExpoCamera>
      )}

    </View>
  )
}
