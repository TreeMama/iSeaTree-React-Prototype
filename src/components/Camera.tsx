import React from 'react'

import { MaterialCommunityIcons } from '@expo/vector-icons'
import { View, StatusBar } from 'react-native'
import { Camera as ExpoCamera } from 'expo-camera'
import { Text, Button } from 'react-native-paper'

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
  const [hasPermission, setHasPermission] = React.useState<null | boolean>(null)
  const cameraRef = React.useRef<ExpoCamera>(null)

  React.useEffect(() => {
    ExpoCamera.requestPermissionsAsync().then(({ status }) => {
      setHasPermission(status === 'granted')
    })
  }, [])

  if (hasPermission === null) {
    return <View />
  }

  if (hasPermission === false) {
    return (
      <View style={{ flex: 1, alignItems: 'center' }}>
        <StatusBar hidden />

        <Button onPress={props.onClose} style={{ backgroundColor: 'white' }}>
          Cancel
        </Button>

        <Text style={{ marginTop: 50, padding: 20 }}>
          No access to the camera. Go to the settings and change permissions.
        </Text>
      </View>
    )
  }

  function handleTakePicture() {
    const cameraRefObj = cameraRef.current

    if (!cameraRefObj) {
      return
    }

    cameraRefObj.takePictureAsync({ exif: true }).then((photo) => {
      cameraRefObj.pausePreview()
      props.onTakePicture(photo)
    })
  }

  return (
    <>
      <StatusBar hidden />
      <Button onPress={props.onClose} style={{ backgroundColor: 'white' }}>
        Cancel
      </Button>

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
    </>
  )
}
