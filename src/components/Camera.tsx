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

/* The `export interface CapturedPicture` is defining the structure of an object that represents a
picture that has been captured by the camera. It has properties for the width and height of the
image, the URI of the image file, and optional properties for the base64-encoded image data and the
EXIF metadata associated with the image. This interface is used as the type for the `picture`
parameter in the `onTakePicture` callback function passed to the `Camera` component. */
export interface CapturedPicture {
  width: number
  height: number
  uri: string
  base64?: string
  exif?: any
}

/* The `interface CameraProps` is defining the structure of an object that represents the props passed
to the `Camera` component. It has two properties: `onClose`, which is a function that takes no
arguments and returns nothing, and `onTakePicture`, which is a function that takes a
`CapturedPicture` object as an argument and returns nothing. These props are used to handle the
closing of the camera and the capturing of pictures, respectively. */
interface CameraProps {
  onClose: () => void
  onTakePicture: (picture: CapturedPicture) => void
}

/**
 * This is a TypeScript React component that allows the user to take a picture using their device's
 * camera and displays the captured image.
 * @returns The `Camera` component is being returned, which renders a camera view with the ability to
 * take pictures and display them. The component also handles camera permissions and displays
 * appropriate messages if permission is not granted.
 */
export function Camera(props: CameraProps) {
  /* These lines are defining two state variables using the `useState` hook from React. */
  const [hasCameraPermission, setHasCameraPermission] = React.useState<null | boolean>(null)
  const [selectedPhotoUri, setSelectedPhotoUri] = React.useState<null | string>(null)

  /* `const cameraRef = React.useRef<RNCamera>(null)` is creating a reference to the `RNCamera` component
  using the `useRef` hook from React. This reference can be used to access the methods and properties
  of the `RNCamera` component, such as `takePictureAsync()`, which is used to capture a picture. The
  initial value of the reference is `null`, which means that it is not pointing to any component yet. */
  const cameraRef = React.useRef<RNCamera>(null)

  /**
   * This function checks for camera permission on Android and sets a state variable accordingly.
   */
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

  /* `React.useEffect(() => {
      checkPermission()
    }, [])` is a hook that is used to perform side effects in a functional component. In this case,
  it is being used to check for camera permission when the component mounts. The `checkPermission()`
  function is called inside the `useEffect` hook with an empty dependency array `[]`, which means
  that it will only be called once when the component mounts. This ensures that the camera
  permission is checked only once when the component is rendered. */

  React.useEffect(() => {
    checkPermission()
  }, [])



  /* This code block is checking if the `hasCameraPermission` state variable is `null`. If it is `null`,
  it means that the camera permission has not been checked yet, so the component returns an empty
  `View` element. This is done to prevent the component from rendering anything until the camera
  permission has been checked. Once the camera permission has been checked, the component will render
  the appropriate content based on the value of `hasCameraPermission`. */
  if (hasCameraPermission === null) {
    return <View />
  }

  /**
   * This function handles taking a picture using a camera reference object and returns the photo with
   * EXIF data and a quality of 0.6, then pauses the camera preview and passes the photo to a callback
   * function.
   * @returns If `cameraRefObj` is falsy (e.g. `null`, `undefined`, `false`, `0`, `NaN`, or an empty
   * string), the function will return nothing (`undefined`). Otherwise, it will take a picture using the
   * camera reference object and call the `onTakePicture` function passed in as a prop with the resulting
   * photo.
   */

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

  /* The `return` statement is returning a JSX element that represents the UI of the `Camera`
  component. */
  return (
    <View style={{ flex: 1 }}>
      <StatusBar />

      /* The `<Button>` component is rendering a button with the text "Cancel" and an outlined style.
        It has an `onPress` prop that is set to the `onClose` function passed in as a prop to the
        `Camera` component. When the button is pressed, the `onClose` function will be called. The
        `style` prop is setting the background color of the button to white and the border radius to
        0. */

        <Button
          mode="outlined"
          onPress={props.onClose}
          style={{ backgroundColor: 'white', borderRadius: 0 }}
        >
          Cancel
        </Button>

     /* This code block is conditionally rendering an `<Image>` component inside a `<View>` component
          based on the value of the `selectedPhotoUri` state variable. If `selectedPhotoUri` is truthy,
          meaning it contains a string value, the `<Image>` component will be rendered with the `uri`
            prop set to the value of `selectedPhotoUri`. The `<View>` component has a black background
              color and takes up the full height and width of its parent container due to the `flex: 1` style
              property. The `<Image>` component has a height and width of 100% of its parent container and is
                set to resize its contents to fit within its container using the `resizeMode: 'contain'` style
                property. This code block is used to display the captured photo after it has been taken. */
                {selectedPhotoUri && (
                  <View style={{ flex: 1, backgroundColor: '#000' }}>
                    <Image
                      source={{ uri: selectedPhotoUri }}
                      style={{ height: '100%', width: '100%', resizeMode: 'contain' }}
                    />
                  </View>
                )}

     /* This code block is conditionally rendering a message to the user if the `hasCameraPermission`
                state variable is `false`. It checks if `hasCameraPermission` is equal to `false` using the
                `==` operator, and if it is, it renders a `<View>` component with a black background color and
                  takes up the full height and width of its parent container due to the `flex: 1` style property.
                  Inside the `<View>` component, a `<Text>` component is rendered with a message instructing the
                    user to allow access to their camera by going to the settings and changing permissions. This
                    message is displayed to the user if they have not granted permission for the app to access
                    their camera. */
                    {hasCameraPermission == false && (
                      <View style={{ flex: 1 }}>
                        <Text style={{ marginTop: 50, padding: 20 }}>
                          Please allow access to your camera. Go to the settings and change permissions.
                        </Text>
                      </View>
                    )}

/* This code block is conditionally rendering the camera view using the `RNCamera` component if the
                    `selectedPhotoUri` state variable is falsy and the `hasCameraPermission` state variable is truthy. */
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
           /* This code block is rendering a button with a camera icon that the user can press to take
                          a picture using the device's camera. The `style` prop is setting the position of the
                          button to the bottom right corner of the screen (`alignSelf: 'flex-end'`), centering the
                          contents of the button (`alignItems: 'center'`), adding a margin of 20 pixels to the
                          bottom of the button (`marginBottom: 20`), and rounding the corners of the button
                          (`borderRadius: 20`). The `onPress` prop is setting the function `handleTakePicture()` to
                          be called when the button is pressed. This function takes a picture using the `RNCamera`
                          component and passes the resulting photo to the `onTakePicture` callback function passed
                          in as a prop to the `Camera` component. */
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
