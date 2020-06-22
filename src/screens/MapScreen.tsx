import React from 'react'

import { Platform, StyleSheet, View, Dimensions, Alert } from 'react-native'
import MapView, { Marker, Region } from 'react-native-maps'
import Constants from 'expo-constants'
import * as Location from 'expo-location'
import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs'

import { StatusBar } from '../components/StatusBar'

interface Coords {
  latitude: number
  longitude: number
}

type MapScreenNavigation = MaterialBottomTabNavigationProp<any, 'Profile'>

export function MapScreen(props: { navigation: MapScreenNavigation }) {
  const [currentCoords, setCurrentCoords] = React.useState<null | Coords>(null)
  const [errorMessage, setErrorMessage] = React.useState<null | string>(null)

  async function getCurrentLocation() {
    try {
      const { status } = await Location.requestPermissionsAsync()

      if (status !== Location.PermissionStatus.GRANTED) {
        setErrorMessage('Disallowed access to Location. Go to the settings and change permissions.')
        return null
      } else {
        const location = await Location.getCurrentPositionAsync()

        setCurrentCoords({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        })
      }
    } catch (error) {
      if (__DEV__) {
        console.log(error)
      }

      setErrorMessage('There was an unexpected error (MapScreen::getCurrentLocation). Please try again later.')
    }
  }

  React.useEffect(() => {
    if (!errorMessage) {
      return
    }

    Alert.alert('', errorMessage, [
      {
        text: 'Ok',
        onPress: () => {
          setErrorMessage(null)
        },
      },
    ])
  }, [errorMessage])

  React.useEffect(() => {
    props.navigation.addListener('focus', getCurrentLocation)

    return () => {
      props.navigation.removeListener('focus', getCurrentLocation)
    }
  }, [])

  const currentRegion: undefined | Region = !currentCoords
    ? undefined
    : {
      latitude: currentCoords.latitude,
      longitude: currentCoords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }

  return (
    <View style={styles.container}>
      <StatusBar />
      <MapView
        style={styles.mapStyle}
        initialRegion={{
          latitude: 47.649019,
          longitude: -122.347977,
          latitudeDelta: 1,
          longitudeDelta: 1,
        }}
        region={currentRegion}
      >
        {!!currentCoords && <Marker coordinate={currentCoords} />}
      </MapView>
    </View>
  )
}

const mapHeight =
  Platform.OS === 'ios'
    ? Dimensions.get('window').height - Constants.statusBarHeight
    : Dimensions.get('window').height

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: mapHeight - 60,
  },
})
