/**
 * The `Camera` function is a React component that allows the user to take pictures using the device's
 * camera and returns the captured picture to the parent component.
 * @returns The `Camera` component is being returned.
 */
import React from 'react'

import { MaterialCommunityIcons } from '@expo/vector-icons'
import { View, Image, Alert, Platform, PermissionsAndroid, TouchableOpacity } from 'react-native'
import { RNCamera } from 'react-native-camera'
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

  const cameraRef = React.useRef<RNCamera>(null)

  const checkPermission = async () => {
    if (Platform.OS === 'android') {
      const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA)
      if (result === PermissionsAndroid.RESULTS.GRANTED || result === true) {
        setHasCameraPermission(true)
      }
    } else {
      setHasCameraPermission(true)
    }
  }

  React.useEffect(() => {
    checkPermission()
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
      props.onTakePicture(photo)
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
        <RNCamera style={{ flex: 1 }} type={RNCamera.Constants.Type.back} ref={cameraRef}>
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
              onPress={() => handleTakePicture()}
            >
              <MaterialCommunityIcons name="camera-iris" size={80} color="white" />
            </Button>
          </View>
        </RNCamera>
      )}
    </View>
  )
}
