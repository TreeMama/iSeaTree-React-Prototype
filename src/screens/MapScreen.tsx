import React, { useContext, useRef } from 'react'

import {
  Platform,
  StyleSheet,
  View,
  Dimensions,
  Alert,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  FlatList,
  TouchableHighlight,
} from 'react-native'
import MapView from 'react-native-map-clustering'
import { Marker, Region, Callout, CalloutSubview, Polyline } from 'react-native-maps'
import Constants from 'expo-constants'
import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs'
import { getCurrentAuthUser, getUser } from '../lib/firebaseServices'
import { StatusBar } from '../components/StatusBar'
// import { firestore } from 'firebase';
import firestore from '@react-native-firebase/firestore'
import { colors } from '../styles/theme'
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'
import CheckBox from 'react-native-check-box'
import { suggestedTrees } from '../../data/suggestedTrees'
import RBSheet from 'react-native-raw-bottom-sheet'
import { LocationContext } from '../LocationContext'
import { getItreeData } from '../lib/iTreeAPIServices'
import { convertRegion } from './AddTreeScreen/geoHelper'

const treeConifer = require('../../assets/tree_Conifer3X-01.png')
const treeDeciduous = require('../../assets/tree_Deciduous3X-01.png')
const emptyCheckbox = require('../../assets/hexagon.png')
const fillCheckbox = require('../../assets/fill_hexagon.png')
const othersMap = require('../../assets/group.png')
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? Constants.statusBarHeight : 0

interface Coords {
  latitude: number
  longitude: number
}
const win = Dimensions.get('window')

type MapScreenNavigation = MaterialBottomTabNavigationProp<any, 'Profile'>

export function MapScreen(props: { navigation: MapScreenNavigation }) {
  //const [currentCoords, setCurrentCoords] = React.useState<null | Coords>(null)
  const [errorMessage, setErrorMessage] = React.useState<null | string>(null)
  const [trees, setTrees] = React.useState<any[]>([])
  const [isChecked, setisChecked] = React.useState<null | boolean>(false)
  const [isActiveown, setActiveown] = React.useState<null | boolean>(true) // show current active map on screen
  const [isDataLoaded, setDataLoaded] = React.useState<null | boolean>(false) // show load data indicator
  const [showAlertHandler, setshowAlertHandler] = React.useState<null | boolean>(false) // show validate unknown popup
  const [selectTrees, setSelectTrees] = React.useState<any[]>([])
  const [speciesName, setSpeciesName] = React.useState<undefined | string>(
    'Please identify this species',
  )
  const [speciesData, setSpeciesData] = React.useState<any[]>([])
  const markerref = useRef([]) // Create map marker refrence
  const mapref = useRef(null) // Create map refrence
  let calloutref = useRef(null) // Create callout refrence
  let RBSheetref = useRef(null) // Create RBSheet refrence

  //get values coords
  let value = useContext(LocationContext)
  let currentCoords = value.currentCoords

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
    //if(!trees) return
    try {
      if (mapref !== null && trees.length > 0 && currentCoords !== null) {
        onfitToSuppliedMarkers()
        setDataLoaded(true)
      }
    } catch (error) {
      console.log(error)
    }
  }, [currentCoords, isDataLoaded])

  // calculate distance based on latitude and longitude
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
    unit: string | number,
  ) => {
    const radlat1 = (Math.PI * lat1) / 180
    const radlat2 = (Math.PI * lat2) / 180
    const radlon1 = (Math.PI * lon1) / 180
    const radlon2 = (Math.PI * lon2) / 180
    const theta = lon1 - lon2
    const radtheta = (Math.PI * theta) / 180
    let dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta)
    dist = Math.acos(dist)
    dist = (dist * 180) / Math.PI
    dist = dist * 60 * 1.1515
    if (unit == 'K') {
      dist = dist * 1.609344
    }
    if (unit == 'N') {
      dist = dist * 0.8684
    }
    return dist
  }

  React.useEffect(() => {
    //props.navigation.addListener('focus', getCurrentLocation);
    // console.log('props', props);
    if (!isActiveown) return
    const authUser = getCurrentAuthUser()
    if (!authUser) {
      throw Error('User is not authenticated')
    }
    // const trees = await getTree(authUser.uid);
    try {
      const TREES_COLLECTION = 'trees'
      const subscriber = firestore()
        .collection(TREES_COLLECTION)
        .where('userId', '==', authUser.uid)
        .onSnapshot((data) => {
          const trees: any = []
          try {
            data.forEach((doc) => {
              const currentID = doc.id
              const appObj = { ...doc.data(), ['id']: currentID }
              trees.push(appObj)
            })
          } catch (error) { }
          // return trees;
          setTrees(trees)
          setDataLoaded(true)
        })
      return () => subscriber()
    } catch (error) {
      console.log('something went wrong')
      setErrorMessage('There was an unexpected error getting data')
    }
  }, [isActiveown])

  React.useEffect(() => {
    //props.navigation.addListener('focus', getCurrentLocation);
    // console.log('props', props);
    if (isActiveown) return
    const authUser = getCurrentAuthUser()
    if (!authUser) {
      throw Error('User is not authenticated')
    }
    // const trees = await getTree(authUser.uid);
    try {
      const TREES_COLLECTION = 'trees'
      setActiveown(false)
      setTrees([])
      setDataLoaded(false)
      const subscriber = firestore()
        .collection(TREES_COLLECTION)
        .onSnapshot(async (data) => {
          let trees: any = []
          let alltrees: any = []
          try {
            data.forEach((doc) => {
              const currentID = doc.id
              const appObj = { ...doc.data(), ['id']: currentID }
              alltrees.push(appObj)
            })
          } catch (error) { }

          alltrees = alltrees.filter((obj: { isValidated: string }) => obj.isValidated !== 'SPAM')
          for (let i = 0; i < alltrees.length; i++) {
            try {
              alltrees[i]['distance'] = await calculateDistance(
                currentCoords?.latitude,
                currentCoords?.longitude,
                alltrees[i]['coords']['_latitude'],
                alltrees[i]['coords']['_longitude'],
                'K',
              )
            } catch (e) {
              // delete item that is the problem
              alltrees.splice(i, 1)
              console.log(e)
            }
          }
          const sortarray = alltrees.sort((a: { distance: number }, b: { distance: number }) => {
            return a.distance - b.distance
          })
          trees = sortarray.slice(0, 10)
          setTrees(alltrees)
          setDataLoaded(true)
        })
      return () => subscriber()
    } catch (error) {
      console.log('something went wrong public map')
      setErrorMessage('There was an unexpected error getting data')
    }
  }, [isActiveown])

  // set current user tree data
  async function setOwnmap() {
    setActiveown(true)
  }

  // show trees that are closest to user current location
  async function setPublicmap() {
    setActiveown(false)
  }

  function timeConverter(UNIX_timestamp) {
    const a = new Date(UNIX_timestamp * 1000)
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]
    const year = a.getFullYear()
    const month = months[a.getMonth()]
    const date = a.getDate()
    const hour = a.getHours()
    const min = a.getMinutes()
    const sec = a.getSeconds()
    // let time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
    const time = date + ' ' + month + ' ' + year
    return time
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
          isValidated: 'VALIDATED',
        })
        .then(() => {
          console.log('Trees status updated!')
          setisChecked(!isChecked)
          setTrees(
            trees.map((item) =>
              item.id === selectedItem.id ? { ...item, isValidated: 'VALIDATED' } : item,
            ),
          )
          if (Platform.OS === 'android') {
            const updatedItem = { ...selectedItem, isValidated: 'VALIDATED' }
            setSelectTrees(updatedItem)
          }
          setshowAlertHandler(false)
          setSpeciesName('Please identify this species')
        })
    } catch (error) {
      console.log('update trees status error ', error)
    }
  }

  const callITreeAPI = async (
    selectedItem: { crownLightExposureCategory: any; dbh: any; treeConditionCategory: any },
    speciesName: string | undefined,
    speciesData: any[],
  ) => {
    const { crownLightExposureCategory, dbh, treeConditionCategory } = selectedItem

    const canCalculateBenefits = !!(
      speciesData &&
      speciesData.TYPE.toLowerCase() !== 'unknown' &&
      crownLightExposureCategory !== null &&
      dbh &&
      parseInt(dbh) !== 0 &&
      treeConditionCategory
    )

    const address = value.address
    if (!address) return null
    let state = address.region
    //checks to see fit the state name needs to be abbrevated
    if (state.length > 2) {
      state = convertRegion(address.region, 2)
    }
    if (canCalculateBenefits) {
      const data = {
        crownLightExposureCategory,
        dbh,
        treeConditionCategory,
        speciesData,
        address,
        state,
      }
      const resultData = await getItreeData(data)

      return resultData
    } else {
      return null
    }
  }

  const Validatewithspecies = async (selectedItem) => {
    try {
      const iTreeResponse = await callITreeAPI(selectedItem, speciesName, speciesData)
      const treeValidationResponse = {
        isValidated: 'VALIDATED',
        speciesNameCommon: speciesName?.trim(),
        speciesNameScientific: String(speciesData.SCIENTIFIC).trim(),
        treeType: String(speciesData.TYPE).trim(),
      }
      if (iTreeResponse === null) {
        firestore()
          .collection('trees')
          .doc(selectedItem.id)
          .update(treeValidationResponse)
          .then(() => {
            console.log('Trees status updated!')
            setisChecked(!isChecked)
            if (Platform.OS === 'android') {
              const updatedItem = { ...selectedItem, isValidated: 'VALIDATED' }
              setSelectTrees(updatedItem)
            }
            setshowAlertHandler(false)
            setSpeciesName('Please identify this species')
          })
      } else {
        firestore()
          .collection('trees')
          .doc(selectedItem.id)
          .update({ ...iTreeResponse, ...treeValidationResponse })
          .then(() => {
            console.log('Trees status updated!')
            setisChecked(!isChecked)
            if (Platform.OS === 'android') {
              const updatedItem = { ...selectedItem, isValidated: 'VALIDATED' }
              setSelectTrees(updatedItem)
            }
            setshowAlertHandler(false)
            setSpeciesName('Please identify this species')
          })
      }
    } catch (error) {
      console.log('update trees status error ', error)
    }
  }

  const validateAlertHandler = (selectedItem: any) => {
    if (Platform.OS === 'ios') {
      setSelectTrees(selectedItem)
    } else {
      RBSheetref.close()
    }
    setshowAlertHandler(true)
  }

  // set check box to vilidate tree
  const renderCheckBox = (item) => {
    const rightText = item.isValidated === 'VALIDATED' ? 'VALIDATED' : 'VALIDATE THIS TREE!'
    return (
      <CheckBox
        style={{ flex: 1, padding: 8 }}
        onClick={() =>
          Platform.OS === 'ios'
            ? console.log('checkbox click')
            : (item.isValidated === 'NOT VALIDATED' || item.isValidated === 'NEEDS VALIDATION') &&
            validateAlertHandler(item)
        }
        isChecked={item.isValidated === 'VALIDATED' ? true : false}
        rightText={rightText}
        rightTextStyle={{ color: 'rgb(67,166,85)', fontSize: 12 }}
        checkedImage={
          <Image
            source={fillCheckbox}
            style={{ height: 15, width: 15, tintColor: colors.green[700], resizeMode: 'cover' }}
          />
        }
        unCheckedImage={
          <Image
            source={emptyCheckbox}
            style={{ height: 15, width: 15, tintColor: colors.green[700], resizeMode: 'cover' }}
          />
        }
      />
    )
  }

  const renderMaker = (treeType: string, text: string) => {
    let treeImg = ''
    switch (treeType) {
      case 'conifer':
        treeImg = treeConifer
        break
      case 'broadleaf':
        treeImg = treeDeciduous
    }
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
        <Image source={treeImg} style={{ width: 40, height: 40, resizeMode: 'contain' }} />
        <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{text}</Text>
      </View>
    )
  }

  const extractTreeNameQuery = (item) => {
    console.log(item)
    const treename = item.item.name
    const extractTreeName = treename.split('(')[0]
    return extractTreeName
  }

  // navigate to Tree Info screen to show MORE TREE INFO
  const onSuggestedTree = async (item) => {
    props.navigation.navigate('treeInfo', {
      treeNameQuery: extractTreeNameQuery(item)
    })
  }

  // custome callout component for IOS
  const CalloutComponentIos = (item) => {
    const extractTreeName = item.item.speciesNameCommon.split('(')[0]
    const isMoreinfo = suggestedTrees.some((obj) => obj.name.split('(')[0] === extractTreeName)
    const isCarbonDioxideStorage = item.item.CarbonDioxideStorage !== undefined
    return (
      <View style={[styles.calloutContainer, { zIndex: 999 }]}>
        <View style={[styles.horizontalContainer, { paddingBottom: 4 }]}>
          <Text style={styles.calloutTitle}>
            {speciesName === 'Please identify this species'
              ? item.item.speciesNameCommon
              : speciesName}
          </Text>
          <CalloutSubview onPress={() => markerref.current[item.index].hideCallout()}>
            <MaterialIcons
              name="close"
              size={18}
              style={{ lineHeight: 20, textAlign: 'center', color: colors.gray[700] }}
            />
          </CalloutSubview>
        </View>
        <View style={styles.horizontalContainer}>
          <View style={styles.container}>
            <Text style={styles.statusText}>
              Status: {item.item.isValidated === 'SPAM' ? 'PROCESSING' : item.item.isValidated}
            </Text>
            {/* "these changes as for build 2.1" */}
            <Text style={styles.statusText}>
              Date Entered:{' '}
              {timeConverter(
                item.item.created_at == null
                  ? Math.floor(Date.now() / 1000)
                  : item.item.created_at.seconds,
              )}
            </Text>
            <Text style={styles.statusText}>User: {item.item.username}</Text>
            <Text style={styles.statusText}>DBH (in.): {item.item.dbh}</Text>
            <Text style={styles.statusText}>
              CO2 Storage (to date):{' '}
              {isCarbonDioxideStorage ? item.item.CarbonDioxideStorage : 'Unreported'}
            </Text>
            <CalloutSubview
              onPress={() =>
                (item.item.isValidated === 'NOT VALIDATED' ||
                  item.item.isValidated === 'NEEDS VALIDATION') &&
                validateAlertHandler(item.item)
              }
            >
              {item.item.isValidated !== 'SPAM' && renderCheckBox(item.item)}
            </CalloutSubview>
          </View>
          <View
            style={[
              styles.redirectionOuterContainer,
              { paddingBottom: item.item.isValidated === 'SPAM' ? 0 : isMoreinfo ? 0 : 4 },
            ]}
          >
            <CalloutSubview
              onPress={() =>
                props.navigation.navigate('showImage', { selectedImage: item.item.photo })
              }
            >
              <TouchableOpacity
                style={styles.redirectionContainer}
                onPress={() => console.log('on show')}
              >
                <Text style={[styles.redirectionText, { flex: 1 }]}>SHOW PICTURE</Text>
                <MaterialIcons
                  name="navigate-next"
                  style={[styles.redirectionText, { fontSize: 14 }]}
                />
              </TouchableOpacity>
            </CalloutSubview>
            {isMoreinfo && (
              <CalloutSubview onPress={() => onSuggestedTree(item)}>
                <TouchableOpacity style={styles.redirectionContainer}>
                  <Text style={[styles.redirectionText, { flex: 1 }]}>MORE TREE INFO</Text>
                  <MaterialIcons
                    name="navigate-next"
                    style={[styles.redirectionText, { fontSize: 14 }]}
                  />
                </TouchableOpacity>
              </CalloutSubview>
            )}
          </View>
        </View>
      </View>
    )
  }

  const onShowImage = (item) => {
    RBSheetref.close()
    setTimeout(function () {
      props.navigation.navigate('showImage', { selectedImage: item.item.photo })
    }, 500)
  }

  const onSuggestedTreeAndroid = async (item) => {
    RBSheetref.close()
    setTimeout(function () {
      props.navigation.navigate('treeInfo', { treeNameQuery: extractTreeNameQuery(item) })
    }, 500)
  }

  // custome callout component for Android
  const CalloutComponent = (item) => {
    const extractTreeName = item.item.speciesNameCommon.split('(')[0]
    const isMoreinfo = suggestedTrees.some((obj) => obj.name.split('(')[0] === extractTreeName)
    const isCarbonDioxideStorage = item.item.CarbonDioxideStorage !== undefined
    return (
      <>
        <View
          style={{
            flexGrow: 1,
            width: '100%',
            padding: 8,
            paddingBottom: item.item.isValidated !== 'SPAM' ? 8 : 0,
          }}
        >
          <View style={{ paddingBottom: 4, flexDirection: 'row' }}>
            <Text style={styles.calloutTitle}>
              {speciesName === 'Please identify this species'
                ? item.item.speciesNameCommon
                : speciesName}
            </Text>
            <TouchableOpacity onPress={() => RBSheetref.close()}>
              <MaterialIcons
                name="close"
                size={18}
                style={{ lineHeight: 30, width: 40, textAlign: 'center', color: colors.gray[700] }}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.horizontalContainerAndroid}>
            <View style={styles.container}>
              <Text style={styles.statusText}>
                Status: {item.item.isValidated === 'SPAM' ? 'PROCESSING' : item.item.isValidated}
              </Text>
              {/* "these changes as for build 2.1" */}
              <Text style={styles.statusText}>
                Date Entered:{' '}
                {timeConverter(
                  item.item.created_at == null
                    ? Math.floor(Date.now() / 1000)
                    : item.item.created_at.seconds,
                )}
              </Text>
              <Text style={styles.statusText}>User: {item.item.username}</Text>
              <Text style={styles.statusText}>DBH (in.): {item.item.dbh}</Text>
              <Text style={styles.statusText}>
                CO2 Storage (lbs. to date):{' '}
                {isCarbonDioxideStorage ? item.item.CarbonDioxideStorage : 'Unreported'}
              </Text>
              <View style={{ paddingTop: 12 }}>
                {item.item.isValidated !== 'SPAM' && renderCheckBox(item.item)}
              </View>
            </View>
            <View
              style={[
                styles.redirectionOuterContainer,
                { paddingBottom: item.item.isValidated === 'SPAM' ? 8 : isMoreinfo ? 0 : 0 },
              ]}
            >
              <TouchableOpacity
                style={styles.redirectionContainer}
                onPress={() => onShowImage(item)}
              >
                <Text style={[styles.redirectionText, { flex: 1 }]}>SHOW PICTURE</Text>
                <MaterialIcons
                  name="navigate-next"
                  style={[styles.redirectionText, { fontSize: 14 }]}
                />
              </TouchableOpacity>
              {isMoreinfo && (
                <TouchableOpacity
                  style={styles.redirectionContainer}
                  onPress={() => onSuggestedTreeAndroid(item)}
                >
                  <Text style={[styles.redirectionText, { flex: 1 }]}>MORE TREE INFO</Text>
                  <MaterialIcons
                    name="navigate-next"
                    style={[styles.redirectionText, { fontSize: 14 }]}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </>
    )
  }

  // zoomout map to show all trees located on map
  const onfitToSuppliedMarkers = () => {
    // const m1 = { latitude: currentCoords?.latitude, longitude: currentCoords?.longitude }
    const m1 = {
      latitude: trees[0]['coords']['_latitude'],
      longitude: trees[0]['coords']['_longitude'],
    }
    const m2 = {
      latitude: trees[trees.length - 1]['coords']['_latitude'],
      longitude: trees[trees.length - 1]['coords']['_longitude'],
    }

    const m3 = [m1, m2]
    mapref.current.fitToCoordinates(m3, {
      edgePadding: {
        top: Platform.OS === 'ios' ? 150 : 200,
        right: Platform.OS === 'ios' ? 150 : 200,
        bottom: Platform.OS === 'ios' ? 150 : 200,
        left: Platform.OS === 'ios' ? 150 : 200,
      },
    })
  }

  const onOpenSheet = (item) => {
    setSelectTrees(item)
    RBSheetref.open()
  }

  const modalHeader = (
    <View style={styles.modalHeader}>
      <Text style={styles.title}>VALIDATE THIS TREE!</Text>
      <View style={styles.divider}></View>
    </View>
  )

  const onSelect = (data) => {
    setshowAlertHandler(true)
    setSpeciesName(data.COMMON)
    setSpeciesData(data)
  }

  const modalBody = (
    <View style={styles.modalBody}>
      <Text style={styles.modalBodyText}>
        Do you validate that this tree has the correct species information?
      </Text>
      {selectTrees.speciesNameCommon === 'Unknown' && (
        <TouchableOpacity
          style={styles.redirectionContainer}
          onPress={() => {
            setshowAlertHandler(false)
            props.navigation.navigate('identifySpecies', {
              treeType: selectTrees.treeType,
              onSelect: (data) => onSelect(data),
            })
          }}
        >
          <Text style={[styles.redirectionText, { flex: 1 }]}>{speciesName}</Text>
          <MaterialIcons name="navigate-next" style={[styles.redirectionText, { fontSize: 14 }]} />
        </TouchableOpacity>
      )}
    </View>
  )

  const modalFooter = (
    <View style={styles.modalFooter}>
      <View style={styles.divider}></View>
      <View style={{ flexDirection: 'row-reverse', margin: 10 }}>
        <TouchableOpacity
          style={{ ...styles.actions, backgroundColor: '#db2828' }}
          onPress={() => {
            console.log('No Pressed')
            setSpeciesName('Please identify this species')
            setshowAlertHandler(false)
          }}
        >
          <Text style={styles.actionText}>No</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ ...styles.actions, backgroundColor: '#21ba45' }}
          onPress={() => {
            speciesName !== 'Unknown'
              ? selectTrees.speciesNameCommon === 'Unknown'
                ? Validatewithspecies(selectTrees)
                : onValidated(selectTrees)
              : alert('Needs Validation')
          }}
        >
          <Text style={styles.actionText}>Yes</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  const modalContainer = (
    <View style={styles.modalContainer}>
      {modalHeader}
      {modalBody}
      {modalFooter}
    </View>
  )

  return (
    <View style={styles.container}>
      <StatusBar />
      {/* <View style={{ borderWidth: 1, borderColor: '#bbb', width: '40%', position: 'absolute', top: 30, left: 10, zIndex: 5000, paddingVertical: 5 }}>
        {renderMaker('conifer', 'Conifer')}
        {renderMaker('broadleaf', 'Broadleaf')}
      </View> */}

      {trees.length <= 0 && isActiveown && isDataLoaded && (
        <View style={styles.emptyMapInfo}>
          <MaterialIcons name="info-outline" size={30} />
          <Text style={styles.emptyMapInfoText}>
            Welcome! When you enter your first tree, it will show up on the map.
          </Text>
        </View>
      )}

      {currentCoords != null && (
        <MapView
          style={styles.mapStyle}
          ref={mapref}
          initialRegion={currentRegion}
          showsScale={true}
          zoomControlEnabled={true}
          showsUserLocation={true}
        >
          {trees &&
            trees.length > 0 &&
            trees.map((item, index) => {
              // console.log('item1', item.coords.U);
              const coords: Coords = {
                latitude: item.coords._latitude || 0,
                longitude: item.coords._longitude || 0,
              }

              let treeImg = ''
              switch (item.treeType) {
                case 'conifer':
                  treeImg = treeConifer
                  break
                case 'broadleaf':
                  treeImg = treeDeciduous
              }
              // { console.log('trees in treeImg', treeImg) }
              // const calloutText = "Tree Name : " + item.speciesNameCommon + '\n' + "Tree Status : " + item.isValidated + '\n' + 'Date Entered : ' + timeConverter(item.created_at.seconds) + '\n' + 'User : ' + item.username;
              return (
                <Marker
                  key={index}
                  coordinate={coords}
                  pointerEvents="auto" // "these changes as for build 2.1"
                  ref={(el) => (markerref.current[index] = el)}
                  onPress={() => Platform.OS === 'android' && onOpenSheet(item)}
                >
                  <Image
                    source={treeImg}
                    style={{ width: 100, height: 100, resizeMode: 'contain' }}
                    ref={(el) => (calloutref = el)}
                  />
                  {Platform.OS === 'ios' && (
                    <Callout
                      pointerEvents="auto" // "these changes as for build 2.1"
                      alphaHitTest
                      style={{ minWidth: 200, backgroundColor: '#FFF', padding: 5 }}
                    >
                      <CalloutComponentIos item={item} index={index} />
                    </Callout>
                  )}
                </Marker>
              )
            })}
        </MapView>
      )}
      <View>
        <RBSheet
          ref={(el) => (RBSheetref = el)}
          openDuration={250}
          customStyles={{
            container: {
              justifyContent: 'center',
              alignItems: 'center',
              height: 'auto',
            },
          }}
        >
          <CalloutComponent item={selectTrees} />
        </RBSheet>
      </View>

      <Modal
        visible={showAlertHandler}
        transparent={true}
        style={styles.modal}
        onRequestClose={() => setshowAlertHandler(false)}
      >
        <View style={styles.modalInsetContainer}>{modalContainer}</View>
      </Modal>

      {!isDataLoaded ||
        (currentCoords == null && (
          <View style={styles.loaderContainer}>
            <View style={styles.loaderstyle}>
              <ActivityIndicator size="large" color={colors.green[700]} />
              <Text style={styles.loaderText}>Loading data...</Text>
            </View>
          </View>
        ))}

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setOwnmap()}
        style={[
          styles.touchableOpacityStyle,
          { backgroundColor: isActiveown ? colors.gray[600] : '#fff' },
        ]}
      >
        <MaterialCommunityIcons
          name="account"
          color={isActiveown ? '#fff' : colors.gray[600]}
          size={30}
        />
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setPublicmap()}
        style={[
          styles.touchableOpacityStyle,
          { bottom: 105, backgroundColor: !isActiveown ? colors.gray[600] : '#fff' },
        ]}
      >
        <Image
          source={othersMap}
          style={[
            styles.floatingButtonStyle,
            { tintColor: !isActiveown ? '#fff' : colors.gray[600] },
          ]}
        />
      </TouchableOpacity>
    </View>
  )
}

const mapHeight = Dimensions.get('window').height

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
    width: win.width - 80,
    flex: 1,
  },
  horizontalContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  horizontalContainerAndroid: {
    flexGrow: 1,
    flexDirection: 'row',
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'left',
    flex: 1,
    color: colors.gray[700],
  },
  redirectionOuterContainer: {
    justifyContent: 'flex-end',
    flex: 0.7,
  },
  redirectionContainer: {
    flexDirection: 'row',
    zIndex: 99,
  },
  redirectionText: {
    fontSize: 12,
    color: colors.green[700],
    textAlign: 'left',
    lineHeight: 25,
    fontWeight: '700',
  },
  statusText: {
    fontSize: 10,
    color: colors.gray[700],
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
    justifyContent: 'center',
  },
  loaderContainer: {
    height: '100%',
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    zIndex: 99,
    position: 'absolute',
  },
  loaderstyle: {
    height: 110,
    width: 135,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  loaderText: {
    fontSize: 16,
    textAlign: 'center',
  },
  // modal
  modal: {
    backgroundColor: '#00000099',
    // flex:1,
    height: win.height,
    width: win.width,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
  },
  modalInsetContainer: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    height: win.height,
    width: win.width,
    position: 'absolute',
    backgroundColor: '#00000099',
  },
  modalContainer: {
    backgroundColor: '#f9fafb',
    width: '80%',
    borderRadius: 5,
    // bottom: 30
  },
  modalHeader: {},
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    padding: 15,
    color: '#000',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: 'lightgray',
  },
  modalBody: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  modalBodyText: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'left',
  },
  modalFooter: {},
  actions: {
    borderRadius: 5,
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  actionText: {
    color: '#fff',
  },
  emptyMapInfo: {
    width: '95%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    backgroundColor: '#FBE7C6',
    position: 'absolute',
    top: STATUSBAR_HEIGHT + 30,
    left: 10,
    zIndex: 5000,
    paddingVertical: 5,
  },

  emptyMapInfoText: {
    flex: 1,
    paddingLeft: 8,
    fontSize: 15,
    fontWeight: '500',
  },
})
