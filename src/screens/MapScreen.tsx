import React, { useRef } from 'react'

import { Platform, StyleSheet, View, Dimensions, Alert, Text, Image, TouchableOpacity } from 'react-native'
import MapView, { Marker, Region, Callout, CalloutSubview } from 'react-native-maps'
import Constants from 'expo-constants'
import * as Location from 'expo-location'
import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs'
import { getTree } from '../lib/firebaseServices/getTree'
import { getCurrentAuthUser, getUser } from '../lib/firebaseServices'
import { StatusBar } from '../components/StatusBar'
import TreeTypeSelect from './AddTreeScreen/TreeTypeSelect'
import { firestore } from 'firebase';
import { colors } from '../styles/theme'
import { MaterialIcons } from '@expo/vector-icons'
import CheckBox from 'react-native-check-box'
import { suggestedTrees } from '../../data/suggestedTrees'

const treeConifer = require('../../assets/tree_Conifer3X-01.png');
const treeDeciduous = require('../../assets/tree_Deciduous3X-01.png');
const emptyCheckbox = require('../../assets/hexagon.png');
const fillCheckbox = require('../../assets/fill_hexagon.png');
const othersMap = require('../../assets/group.png');

interface Coords {
  latitude: number
  longitude: number
}
const win = Dimensions.get('window');

type MapScreenNavigation = MaterialBottomTabNavigationProp<any, 'Profile'>

export function MapScreen(props: { navigation: MapScreenNavigation }) {
  const [currentCoords, setCurrentCoords] = React.useState<null | Coords>(null)
  const [errorMessage, setErrorMessage] = React.useState<null | string>(null)
  const [trees, setTrees] = React.useState<any[]>([]);
  const [isChecked, setisChecked] = React.useState<null | Boolean>(false)
  const [isActiveown, setActiveown] = React.useState<null | Boolean>(true) // show current active map on screen
  let markerref = useRef(null); // Create map marker refrence
  let mapref = useRef(null); // Create map refrence
  let calloutref = useRef(null); // Create callout refrence

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

  React.useEffect(() => {
    if (mapref !== null && trees.length > 0 && currentCoords !== null) {
      onfitToSuppliedMarkers()
    }
  })

  // calculate distance based on latitude and longitude
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number, unit: string | number) => {
    let radlat1 = Math.PI * lat1 / 180
    let radlat2 = Math.PI * lat2 / 180
    let radlon1 = Math.PI * lon1 / 180
    let radlon2 = Math.PI * lon2 / 180
    let theta = lon1 - lon2
    let radtheta = Math.PI * theta / 180
    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180 / Math.PI
    dist = dist * 60 * 1.1515
    if (unit == "K") { dist = dist * 1.609344 }
    if (unit == "N") { dist = dist * 0.8684 }
    return dist
  }

  React.useEffect(() => {
    props.navigation.addListener('focus', getCurrentLocation);
    // console.log('props', props);
    const authUser = getCurrentAuthUser();
    if (!authUser) {
      throw Error('User is not authenticated')
    }
    // const trees = await getTree(authUser.uid);
    const TREES_COLLECTION = 'trees'
    firestore()
      .collection(TREES_COLLECTION)
      .where('userId', '==', authUser.uid)
      .get()
      .then(data => {
        let trees: any = [];
        data.forEach((doc) => {
          let currentID = doc.id
          let appObj = { ...doc.data(), ['id']: currentID }
          trees.push(appObj)
        });
        // return trees;
        setTrees(trees);
        console.log('tree3', trees);
      })

    return () => {
      props.navigation.removeListener('focus', getCurrentLocation)
    }
  }, [])

  // set current user tree data
  async function setOwnmap() {
    setActiveown(true);
    setTrees([]);
    const authUser = getCurrentAuthUser();
    if (!authUser) {
      throw Error('User is not authenticated')
    }
    const TREES_COLLECTION = 'trees'
    firestore()
      .collection(TREES_COLLECTION)
      .where('userId', '==', authUser.uid)
      .get()
      .then(data => {
        let trees: any = [];
        data.forEach((doc) => {
          let currentID = doc.id
          let appObj = { ...doc.data(), ['id']: currentID }
          trees.push(appObj)
        });
        setTrees(trees);
      })
  }

  // show trees that are closest to user current location
  async function setPublicmap() {
    const TREES_COLLECTION = 'trees'

    setActiveown(false);
    setTrees([]);
    firestore()
      .collection(TREES_COLLECTION)
      .get()
      .then(async data => {
        let trees: any = [];
        let alltrees: any = [];
        data.forEach((doc) => {
          let currentID = doc.id
          let appObj = { ...doc.data(), ['id']: currentID }
          alltrees.push(appObj)
        });
        alltrees = alltrees.filter((obj: { isValidated: string }) => obj.isValidated !== "SPAM");
        for (let i = 0; i < alltrees.length; i++) {
          alltrees[i]["distance"] = await calculateDistance(currentCoords?.latitude, currentCoords?.longitude, alltrees[i]["coords"]["U"], alltrees[i]["coords"]["k"], "K");
        }
        let sortarray = alltrees.sort((a: { distance: number }, b: { distance: number }) => {
          return a.distance - b.distance;
        });
        trees = sortarray.slice(0, 10)
        setTrees(alltrees);
      })
  }

  function timeConverter(UNIX_timestamp) {
    let a = new Date(UNIX_timestamp * 1000);
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let year = a.getFullYear();
    let month = months[a.getMonth()];
    let date = a.getDate();
    let hour = a.getHours();
    let min = a.getMinutes();
    let sec = a.getSeconds();
    // let time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
    let time = date + ' ' + month + ' ' + year;
    return time;
  }

  const currentRegion: undefined | Region = !currentCoords
    ? undefined
    : {
      latitude: currentCoords.latitude,
      longitude: currentCoords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }

  // validate the tree
  const onValidated = (selectedItem) => {
    try {
      firestore()
        .collection('trees')
        .doc(selectedItem.id)
        .update({
          isValidated: 'VALIDATED'
        })
        .then(() => {
          console.log('Trees status updated!');
          setisChecked(!isChecked)
          setTrees(
            trees.map(item =>
              item.id === selectedItem.id
                ? { ...item, isValidated: 'VALIDATED' }
                : item
            ))
        });
    } catch (error) {
      console.log('update trees status error ', error)
    }

  }

  // set check box to vilidate tree
  const renderCheckBox = (item) => {
    let rightText = item.isValidated === 'VALIDATED' ? 'VALIDATED' : 'VALIDATE THIS TREE!';
    return (
      <CheckBox
        style={{ flex: 1, padding: 10 }}
        onClick={() => console.log('checkbox click')}
        isChecked={item.isValidated === 'VALIDATED' ? true : false}
        rightText={rightText}
        rightTextStyle={{ color: 'rgb(67,166,85)', fontSize: 10, }}
        checkedImage={<Image source={fillCheckbox} style={{ height: 15, width: 15, tintColor: colors.green[700], resizeMode: 'cover' }} />}
        unCheckedImage={<Image source={emptyCheckbox} style={{ height: 15, width: 15, tintColor: colors.green[700], resizeMode: 'cover' }} />}
      />);
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

  // navigate to suggestedTrees screen to show MORE TREE INFO 
  const onSuggestedTree = async (treename) => {
    const index = await suggestedTrees.findIndex(x => x.name === treename);
    props.navigation.navigate('suggestedTrees', { showIndex: index })
  }

  // custome callout component for IOS
  const CalloutComponentIos = (item) => {
    return (
      <View style={[styles.calloutContainer, { zIndex: 999 }]} >
        <View style={[styles.horizontalContainer, { paddingBottom: 4 }]}>
          <Text style={styles.calloutTitle}>{item.item.speciesNameCommon}</Text>
          <CalloutSubview onPress={() => markerref.hideCallout()}>
            <MaterialIcons name="close" size={18} style={{ lineHeight: 20, textAlign: 'center', color: colors.gray[700] }} />
          </CalloutSubview>
        </View>
        <View style={styles.horizontalContainer}>
          <View style={styles.container}>
            <Text style={styles.statusText}>Status: {item.item.isValidated === 'SPAM' ? 'PROCESSING' : item.item.isValidated}</Text>
            <Text style={styles.statusText}>Date Entered: {timeConverter(item.item.created_at.seconds)}</Text>
            <Text style={styles.statusText}>User: {item.item.username}</Text>
            <Text style={styles.statusText}>DBH: {item.item.dbh}</Text>
            <CalloutSubview onPress={() => item.item.isValidated === 'NOT VALIDATED' && onValidated(item.item)}>
              {item.item.isValidated !== 'SPAM' && renderCheckBox(item.item)}
            </CalloutSubview>
          </View>
          <View style={[styles.redirectionOuterContainer, { paddingBottom: item.item.isValidated === 'SPAM' ? 0 : 20 }]}>
            <CalloutSubview onPress={() => props.navigation.navigate('showImage', { selectedImage: item.item.photo })}>
              <TouchableOpacity style={styles.redirectionContainer} onPress={() => console.log("on show")}>
                <Text style={[styles.redirectionText, { flex: 1 }]}>SHOW PICTURE</Text>
                <MaterialIcons name="navigate-next" style={[styles.redirectionText, { fontSize: 14 }]} />
              </TouchableOpacity>
            </CalloutSubview>
            {(suggestedTrees.some(obj => obj.name === item.item.speciesNameCommon) || (item.item.speciesNameCommon === 'Western Red Cedar (aka Giant Arborvitae or Shinglewood)'))
              &&
              <CalloutSubview onPress={() => (item.item.speciesNameCommon === 'Western Red Cedar (aka Giant Arborvitae or Shinglewood)') ? onSuggestedTree('Western Red Cedar (Giant Arborvitae)') : onSuggestedTree(item.item.speciesNameCommon)}>
                <TouchableOpacity style={styles.redirectionContainer}>
                  <Text style={[styles.redirectionText, { flex: 1 }]}>MORE TREE INFO</Text>
                  <MaterialIcons name="navigate-next" style={[styles.redirectionText, { fontSize: 14 }]} />
                </TouchableOpacity>
              </CalloutSubview>
            }

          </View>
        </View>

      </View>
    )
  }

  // custome callout component for Android
  const CalloutComponent = (item) => {
    return (
      <View style={[styles.calloutContainer, { zIndex: 999 }]} >
        <View style={[styles.horizontalContainer, { paddingBottom: 4 }]}>
          <Text style={styles.calloutTitle}>{item.item.speciesNameCommon}</Text>
          <MaterialIcons name="close" size={18} style={{ lineHeight: 20, textAlign: 'center', color: colors.gray[700] }} />
        </View>
        <View style={styles.horizontalContainer}>
          <View style={styles.container}>
            <Text style={styles.statusText}>Status: {item.item.isValidated === 'SPAM' ? 'PROCESSING' : item.item.isValidated}</Text>
            <Text style={styles.statusText}>Date Entered: {timeConverter(item.item.created_at.seconds)}</Text>
            <Text style={styles.statusText}>User: {item.item.username}</Text>
            <Text style={styles.statusText}>DBH: {item.item.dbh}</Text>
            {item.item.isValidated !== 'SPAM' && renderCheckBox(item.item)}
          </View>
          <View style={[styles.redirectionOuterContainer, { paddingBottom: item.item.isValidated === 'SPAM' ? 0 : 20 }]}>
            <TouchableOpacity style={styles.redirectionContainer} onPress={() => console.log("on show")}>
              <Text style={[styles.redirectionText, { flex: 1 }]}>SHOW PICTURE</Text>
              <MaterialIcons name="navigate-next" style={[styles.redirectionText, { fontSize: 14 }]} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.redirectionContainer}>
              <Text style={[styles.redirectionText, { flex: 1 }]}>MORE TREE INFO</Text>
              <MaterialIcons name="navigate-next" style={[styles.redirectionText, { fontSize: 14 }]} />
            </TouchableOpacity>
          </View>
        </View>

      </View>
    )
  }

  // zoomout map to show all trees located on map
  const onfitToSuppliedMarkers = () => {
    const m1 = { latitude: currentCoords?.latitude, longitude: currentCoords?.longitude }
    const m2 = { latitude: trees[trees.length - 1]["coords"]["U"], longitude: trees[trees.length - 1]["coords"]["k"] }
    const m3 = [m1, m2]
    mapref.fitToCoordinates(m3, {
      edgePadding:
      {
        top: Platform.OS === 'ios' ? 150 : 200,
        right: Platform.OS === 'ios' ? 150 : 200,
        bottom: Platform.OS === 'ios' ? 150 : 200,
        left: Platform.OS === 'ios' ? 150 : 200
      }
    })
  }

  return (
    <View style={styles.container}>
      <StatusBar />
      {/* <View style={{ borderWidth: 1, borderColor: '#bbb', width: '40%', position: 'absolute', top: 30, left: 10, zIndex: 5000, paddingVertical: 5 }}>
        {renderMaker('conifer', 'Conifer')}
        {renderMaker('broadleaf', 'Broadleaf')}
      </View> */}

      <MapView
        style={styles.mapStyle}
        ref={el => mapref = el}
        initialRegion={{
          latitude: 47.649019,
          longitude: -122.347977,
          latitudeDelta: 1,
          longitudeDelta: 1,
        }}
        // region={currentRegion}
        showsUserLocation
        showsScale={true}

        // // zoomTapEnabled={true}
        zoomControlEnabled={true}
      >
        {!!currentCoords && <Marker coordinate={currentCoords} />}
        {/* {console.log('trees in render', trees)} */}
        {trees && trees.length > 0 && trees.map((item, index) => {
          // console.log('item1', item.coords.U);
          const coords: Coords = {
            latitude: item.coords.U || 0,
            longitude: item.coords.k || 0,
          };

          let treeImg = '';
          switch (item.treeType) {
            case 'conifer':
              treeImg = treeConifer;
              break;
            case 'broadleaf':
              treeImg = treeDeciduous;
          }
          // { console.log('trees in treeImg', treeImg) }
          let calloutText = "Tree Name : " + item.speciesNameCommon + '\n' + "Tree Status : " + item.isValidated + '\n' + 'Date Entered : ' + timeConverter(item.created_at.seconds) + '\n' + 'User : ' + item.username;
          return (<Marker key={index} coordinate={coords} ref={el => markerref = el} >
            <Image source={treeImg} style={{ width: 100, height: 100, resizeMode: 'contain' }} ref={el => calloutref = el} />
            <Callout alphaHitTest style={{ minWidth: 200, backgroundColor: '#FFF', padding: 5 }}  >
              {Platform.OS === 'android'
                ?
                <CalloutComponent item={item} />
                :
                <CalloutComponentIos item={item} {...markerref} />
              }
            </Callout>

          </Marker>)
        })}

      </MapView>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setOwnmap()}
        style={[styles.touchableOpacityStyle, { backgroundColor: isActiveown ? colors.gray[600] : '#fff' }]}>
        <Image
          source={fillCheckbox}
          style={[styles.floatingButtonStyle, { tintColor: isActiveown ? '#fff' : colors.gray[600] }]}
        />
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setPublicmap()}
        style={[styles.touchableOpacityStyle, { bottom: 105, backgroundColor: !isActiveown ? colors.gray[600] : '#fff' }]}>
        <Image
          source={othersMap}
          style={[styles.floatingButtonStyle, { tintColor: !isActiveown ? '#fff' : colors.gray[600] }]}
        />
      </TouchableOpacity>
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
  // CalloutComponent styale

  calloutContainer: {
    width: win.width - 130,
    flex: 1
  },
  horizontalContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'left',
    flex: 1,
    color: colors.gray[700]
  },
  redirectionOuterContainer: {
    justifyContent: 'flex-end',
    flex: 0.8
  },
  redirectionContainer: {
    flexDirection: 'row',
    zIndex: 99
  },
  redirectionText: {
    fontSize: 12,
    color: colors.green[700],
    textAlign: 'left',
    lineHeight: 20,
    fontWeight: '700'
  },
  statusText: {
    fontSize: 10,
    color: colors.gray[700]
  },

  touchableOpacityStyle: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 2,
  },
  floatingButtonStyle: {
    resizeMode: 'contain',
    width: 28,
    height: 28,
    alignSelf: 'center',
    justifyContent: 'center'
  },
})
