import React from 'react'

import { Platform, StyleSheet, View, Dimensions } from 'react-native'
import MapView from 'react-native-maps'
import Constants from 'expo-constants'

import { StatusBar } from '../components/StatusBar'

export function MapScreen() {
  return (
    <View style={styles.container}>
      <StatusBar />
      <MapView style={styles.mapStyle} />
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
    height: mapHeight,
  },
})
