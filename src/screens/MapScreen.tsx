import React from 'react'

import { Platform, StyleSheet, View, Dimensions, Alert, Text, Image } from 'react-native'
import MapView, { Marker, Region, Callout } from 'react-native-maps'
import Constants from 'expo-constants'
import * as Location from 'expo-location'
import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs'
import { getTree } from '../lib/firebaseServices/getTree'
import { getCurrentAuthUser, getUser } from '../lib/firebaseServices'
import { StatusBar } from '../components/StatusBar'
import TreeTypeSelect from './AddTreeScreen/TreeTypeSelect'
import { firestore } from 'firebase';

const treeConifer = require('../../assets/tree_Conifer3X-01.png');
const treeDeciduous = require('../../assets/tree_Deciduous3X-01.png');
interface Coords {
  latitude: number
  longitude: number
}

type MapScreenNavigation = MaterialBottomTabNavigationProp<any, 'Profile'>

export function MapScreen(props: { navigation: MapScreenNavigation }) {
  const [currentCoords, setCurrentCoords] = React.useState<null | Coords>(null)
  const [errorMessage, setErrorMessage] = React.useState<null | string>(null)
  const [trees, setTrees] = React.useState<any[]>([]);

  async function getCurrentLocation() {
    try {
      const { status } = await Location.requestPermissionsAsync()

      if (status !== Location.PermissionStatus.GRANTED) {
        setErrorMessage('Disallowed access to Location. Go to the settings and change permissions.')
        return null
      } else {
        const location = await Location.getCurrentPositionAsync()

        console.log('location', location)
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

  React.useEffect(async () => {
    props.navigation.addListener('focus', getCurrentLocation);
    console.log('props', props);
    const authUser = getCurrentAuthUser();
    if (!authUser) {
      throw Error('User is not authenticated')
    }
    const trees = await getTree(authUser.uid);
    const TREES_COLLECTION = 'trees'
    firestore()
      .collection(TREES_COLLECTION)
      .get()
      .then(data => {
        let trees: any = [];
        data.forEach((doc) => {
          trees.push(doc.data());
        });
        // return trees;
        setTrees(trees);
        console.log('tree3', trees);
      })

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

  const renderMaker = (treeType: string, text: string) => {
    let treeImg = '';
    switch (treeType) {
      case 'conifer':
        treeImg = treeConifer;
        break;
      case 'broadleaf':
        treeImg = treeDeciduous;
    }
    return <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
      <Image source={treeImg} style={{ width: 40, height: 40, resizeMode: 'contain' }} />
      <Text style={{ fontSize: 14, fontWeight: "bold" }}>{text}</Text>
    </View>
  }

  return (
    <View style={styles.container}>
      <StatusBar />
      <View><Text>My iSeaTree Status Map</Text></View>
      <View style={{ borderWidth: 1, borderColor: '#bbb', width: '40%', position: 'absolute', top: 30, left: 10, zIndex: 5000, paddingVertical: 5 }}>
        {renderMaker('conifer', 'Conifer')}
        {renderMaker('broadleaf', 'Broadleaf')}
      </View>

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
        {console.log('trees in render', trees)}
        {trees && trees.length > 0 && trees.map((item, index) => {
          console.log('item1', item.coords.U);
          const coords: Coords = {
            latitude: item.coords.U | 0,
            longitude: item.coords.k | 0,
          };

          let treeImg = '';
          switch (item.treeType) {
            case 'conifer':
              treeImg = treeConifer;
              break;
            case 'broadleaf':
              treeImg = treeDeciduous;
          }
          { console.log('trees in treeImg', treeImg) }
          let calloutText = "Tree Name : " + item.speciesNameCommon + '\n' + "Tree Status : " + item.isValidated + '\n' + 'Date Entered : ' + item.created_at.seconds + '\n' + 'User : ' + item.username;
          return (<Marker key={index} coordinate={coords}>
            <Image source={treeImg} style={{ width: 100, height: 100, resizeMode: 'contain' }} />
            <Callout tooltip style={{ minWidth: 200 }}>
              <Text>{calloutText}</Text>
            </Callout>

          </Marker>)
        })}
      </MapView>
    </View >
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
