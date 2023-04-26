/**
 * This is a React component that displays an image and a back button, and retrieves the image data
 * from the previous screen.
 * @param props - "props" is an object that contains all the properties passed to the component. It can
 * include navigation, route, and other custom props defined by the parent component. In this case, the
 * component is a screen in a React Native app and the props likely include navigation and route
 * objects provided by React Navigation
 */

import React from 'react'
import { View, StyleSheet, Image, Dimensions, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../../styles/theme'
import { TouchableOpacity } from 'react-native-gesture-handler'

const win = Dimensions.get('window')

/* `const styles = StyleSheet.create({...})` is creating a JavaScript object that contains a set of
styles for different elements in the React component. The styles are defined using CSS-like
properties and values, and are applied to the corresponding elements in the JSX code using the
`style` attribute. In this case, the styles are defining the appearance and layout of the different
elements in the `ShowImage` component, such as the container, the image, and the back button. The
`StyleSheet.create()` method is used to optimize the performance of the component by creating a
cached stylesheet that can be reused across multiple instances of the component. */
const styles = StyleSheet.create({
  safeAreacontainer: {
    flex: 1,
    width: win.width,
    backgroundColor: '#000',
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  imageContainer: {
    height: win.height,
    width: win.width,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  headerContainer: {
    top: 0,
    position: 'absolute',
    zIndex: 99,
    alignItems: 'flex-start',
    height: 40,
    width: win.width,
  },
  backIconContainer: {
    marginLeft: 12,
  },
  backIcon: {
    lineHeight: 40,
    textAlign: 'center',
    alignSelf: 'flex-start',
    color: '#fff',
    flex: 1,
  },
})

/**
 * The `ShowImage` function is a React component that displays an image retrieved from the previous
 * screen and adds and removes a listener to the `focus` event of the navigation object passed in the
 * props of the component.
 * @param props - `props` is an object that contains the properties passed to the `ShowImage`
 * component. It includes the `route` and `navigation` objects, which are used to retrieve data and
 * navigate between screens in a React Navigation stack.
 */
export function ShowImage(props) {
  const [imageData, setImageData] = React.useState<any[]>([])

  // set image data after navigate from map screen
  /**
   * The function retrieves image data from the props of a React component.
   */
  function getImageData() {
    const { params } = props.route
    setImageData(params.selectedImage)
  }

  /* `React.useEffect()` is a hook in React that allows you to perform side effects in functional
  components. In this case, it is used to add and remove a listener to the `focus` event of the
  navigation object passed in the `props` of the component. */
  React.useEffect(() => {
    props.navigation.addListener('focus', getImageData)

    /* `return () => { props.navigation.removeListener('focus', getImageData) }` is a cleanup function
    that is executed when the component is unmounted or when the `focus` event listener is removed.
    It removes the `getImageData` function as a listener for the `focus` event of the navigation
    object passed in the `props` of the component. This is done to prevent memory leaks and improve
    performance by removing unnecessary event listeners. */
    return () => {
      props.navigation.removeListener('focus', getImageData)
    }
  }, [])

  /* The `return` statement is returning the JSX code that defines the layout and appearance of the
  `ShowImage` component. The code is enclosed in parentheses and contains a `SafeAreaView` component,
  a `View` component, and an `Image` component. The `SafeAreaView` component is used to ensure that
  the content of the screen is displayed within the safe area of the device, while the `View`
  component is used to group and position the different elements of the screen. The `Image` component
  is used to display the image data retrieved from the previous screen. */
  return (
    <SafeAreaView style={styles.safeAreacontainer}>
      <View style={styles.bodyContent}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.backIconContainer}
            onPress={() => props.navigation.goBack()}
          >
            <Ionicons name="ios-arrow-back" size={28} style={styles.backIcon} />
          </TouchableOpacity>
        </View>
        {imageData !== [] && (
          <>
            <ActivityIndicator
              size="large"
              style={{ alignSelf: 'center', justifyContent: 'center', position: 'absolute' }}
            />
            <Image source={{ uri: imageData.url }} style={styles.imageContainer} />
          </>
        )}
      </View>
    </SafeAreaView>
  )
}
