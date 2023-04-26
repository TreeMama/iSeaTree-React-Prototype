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

/* The code is defining an interface named "Coords" in TypeScript. This interface has two
properties: "latitude" and "longitude", both of which are of type number. This interface can be used
to define objects that have these two properties with their respective data types. */
interface Coords {
  latitude: number
  longitude: number
}

/* The code is incomplete and contains a syntax error. It appears to be written in a combination
of TypeScript and React, but the code block is missing the import statement for the `Dimensions`
module. */
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

  /* The code is a React useEffect hook that listens for changes in the `errorMessage` state
  variable. If `errorMessage` is truthy, it displays an alert dialog box with the error message and
  an "Ok" button. When the "Ok" button is pressed, the `errorMessage` state variable is set to null,
  effectively dismissing the alert dialog box. This code is commonly used to display error messages
  to the user in a mobile app. */
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

  /* The above code is a React useEffect hook that is triggered when either the `currentCoords` or
  `isDataLoaded` state variables change. It checks if the `mapref` variable is not null and if there
  are any trees in the `trees` array. If both conditions are true, it calls the
  `onfitToSuppliedMarkers` function and sets the `isDataLoaded` state variable to true. If there is
  an error, it logs the error to the console. */
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
  /**
   * The function calculates the distance between two points on Earth given their latitude and
   * longitude coordinates.
   * @param {number} lat1 - The latitude of the first location in degrees.
   * @param {number} lon1 - `lon1` is a parameter representing the longitude of the first location in
   * decimal degrees.
   * @param {number} lat2 - `lat2` is a number representing the latitude of the second location in
   * decimal degrees.
   * @param {number} lon2 - `lon2` is a number representing the longitude of the second location in
   * decimal degrees.
   * @param {string | number} unit - The `unit` parameter is a string or number that specifies the unit
   * of measurement for the distance calculation. It can be either 'K' for kilometers, 'N' for nautical
   * miles, or any other number for miles.
   * @returns The function `calculateDistance` returns the distance between two points on the Earth's
   * surface, given their latitude and longitude coordinates, in units specified by the `unit`
   * parameter. The distance is returned as a number.
   */
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

  /* The code is a React useEffect hook that fetches data from a Firestore collection called
  "trees" and sets the fetched data to the state variable "trees". The fetched data is filtered by
  the "userId" field, which is obtained from the currently authenticated user. The useEffect hook is
  triggered when the "isActiveown" state variable changes. If there is an error while fetching the
  data, the error message is set to the state variable "errorMessage". Once the data is fetched and
  set to the state variable "trees", the state variable "dataLoaded" is set to true. */
  React.useEffect(() => {
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

  /* The above code is a React useEffect hook that fetches data from a Firestore collection named
  "trees". It filters out any trees that have a "isValidated" property equal to "SPAM", calculates
  the distance between the user's current location and each tree's location using the
  "calculateDistance" function, sorts the trees by distance, and sets the state of the "trees" array
  with the 10 closest trees. If there is an error, it sets the "errorMessage" state with a message.
  The useEffect hook is triggered when the "isActiveown" state changes. */
  React.useEffect(() => {
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
  /**
   * This function sets the state of a variable called "activeown" to true.
   */
  async function setOwnmap() {
    setActiveown(true)
  }

  // show trees that are closest to user current location
  /**
   * The function sets the active own state to false.
   */
  async function setPublicmap() {
    setActiveown(false)
  }

  /**
   * The function converts a UNIX timestamp to a formatted date string.
   * @param UNIX_timestamp - The UNIX timestamp is a way to represent a specific point in time as the
   * number of seconds that have elapsed since January 1, 1970, at 00:00:00 UTC. This function takes a
   * UNIX timestamp as input and converts it into a human-readable date format.
   * @returns a formatted date string in the format "date month year", where date is the day of the
   * month (1-31), month is the abbreviated name of the month (e.g. Jan, Feb, Mar), and year is the
   * four-digit year.
   */
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

  /* The code is defining a variable `currentRegion` of type `undefined` or `Region`. If
  `currentCoords` is falsy (e.g. `null`, `undefined`, `0`, `false`, etc.), then `currentRegion` is
  set to `undefined`. Otherwise, `currentRegion` is set to an object of type `Region` with latitude,
  longitude, latitudeDelta, and longitudeDelta properties based on the values of
  `currentCoords.latitude` and `currentCoords.longitude`. */
  const currentRegion: undefined | Region = !currentCoords
    ? undefined
    : {
      latitude: currentCoords.latitude,
      longitude: currentCoords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }

  // validate the tree
  /**
   * This function updates the status of a tree to "VALIDATED" in a Firestore database and updates the
   * state of the corresponding tree object in a React component.
   * @param selectedItem - `selectedItem` is an object that represents a tree item that has been
   * selected for validation. It contains an `id` property that is used to identify the specific tree in
   * the Firestore database, and an `isValidated` property that indicates whether the tree has been
   * validated or not. The `on
   */
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

  /**
   * This function calls an API to retrieve data based on selected tree attributes and location
   * information.
   * @param selectedItem - An object containing the properties crownLightExposureCategory, dbh, and
   * treeConditionCategory.
   * @param {string | undefined} speciesName - The `speciesName` parameter is a string or undefined
   * value that represents the name of a tree species. However, it is not used in the function and is
   * not one of the parameters being destructured from the `selectedItem` object.
   * @param {any[]} speciesData - An array containing data about a specific tree species, including its
   * name, type, and various attributes such as its carbon sequestration rate and air pollution removal
   * rate.
   * @returns The function `callITreeAPI` returns either `resultData` (if `canCalculateBenefits` is
   * true) or `null` (if `canCalculateBenefits` is false or if `address` is falsy).
   */
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

  /**
   * This function validates a selected tree by calling an API and updating its status in a Firestore
   * database.
   * @param selectedItem - It is an object representing a selected tree item.
   */
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

  /**
   * This function sets the selected trees and shows an alert handler based on the platform.
   * @param {any} selectedItem - The `selectedItem` parameter is of type `any` and is used as an
   * argument in the `validateAlertHandler` function. It is likely that this parameter represents some
   * selected item or value that needs to be validated before proceeding with further actions. The
   * exact nature and purpose of this parameter would depend
   */
  const validateAlertHandler = (selectedItem: any) => {
    if (Platform.OS === 'ios') {
      setSelectTrees(selectedItem)
    } else {
      RBSheetref.close()
    }
    setshowAlertHandler(true)
  }

  // set check box to vilidate tree
  /* The code is defining a function called `renderCheckBox` that takes an item as an argument
  and returns a CheckBox component. The CheckBox component has various props such as style, onClick,
  isChecked, rightText, rightTextStyle, checkedImage, and unCheckedImage. The function sets the
  rightText based on the value of `item.isValidated` and sets the isChecked prop to true if
  `item.isValidated` is equal to 'VALIDATED'. The onClick function logs a message to the console if
  the platform is iOS, otherwise it calls the `validateAlertHandler` function if `item.isValidated` */
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

  /* The code is defining a function called `renderMaker` that takes in two parameters:
  `treeType` and `text`. The function then uses a switch statement to determine which image to use
  based on the `treeType` parameter. It returns a `View` component that contains an `Image`
  component with the appropriate image and a `Text` component with the `text` parameter. The `View`
  component has styling applied to it to align the `Image` and `Text` components. */
  const renderMaker = (treeType: string, text: string) => {
    let treeImg = ''

    /* The code is a switch statement that takes in a variable called `treeType`. Depending on
    the value of `treeType`, it assigns a specific image to the variable `treeImg`. If `treeType` is
    equal to `'conifer'`, it assigns the image `treeConifer` to `treeImg`. If `treeType` is equal to
    `'broadleaf'`, it assigns the image `treeDeciduous` to `treeImg`. */
    switch (treeType) {
      case 'conifer':
        treeImg = treeConifer
        break
      case 'broadleaf':
        treeImg = treeDeciduous
    }

    /* The code is rendering a React component that displays an image of a tree and some text in
    a row layout. The image is sourced from a file called "treeImg" and is displayed with a width
    and height of 40, and a resizeMode of "contain". The text is displayed with a font size of 14
    and a bold font weight. The row layout is aligned to the start and center of the container. */
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
        <Image source={treeImg} style={{ width: 40, height: 40, resizeMode: 'contain' }} />
        <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{text}</Text>
      </View>
    )
  }

  // function extractTreeNameQuery(item) {
  //   const treename = item.item.speciesNameCommon
  //   console.log(
  //     'Extracted Tree Common Name: ' +
  //       treename +
  //       '  from tooltip. Passing to InfoScreen to show more tree info',
  //   )
  //   return treename
  // }



  /**
   * This function extracts the scientific or common name of a tree from an item object and returns it.
   * @param item - The "item" parameter is an object that contains information about a tree species. It
   * is likely passed as an argument to a function that performs some operation on the tree species
   * data. The object may contain properties such as "speciesNameScientific" and "speciesNameCommon"
   * which are used to extract
   * @returns the extracted tree name, which is either the scientific name or the common name of a tree
   * species. The function also logs the extracted tree name to the console.
   */
  function extractTreeNameQuery(item) {
    const treename = item.item.speciesNameScientific ? item.item.speciesNameScientific : item.item.speciesNameCommon;
    console.log(` Extracted Tree Name:  ${treename}`);
    return treename
  }

  // navigate to Tree Info screen to show MORE TREE INFO
  /**
   * This function navigates to the infoScreen and passes a tree name query extracted from an item as a
   * parameter.
   * @param item - The `item` parameter is an object that represents a suggested tree. It likely
   * contains information such as the tree's name, location, and other relevant details. The
   * `onSuggestedTree` function is an asynchronous function that is called when a user selects a
   * suggested tree. It navigates the user
   */
  const onSuggestedTree = async (item) => {
    props.navigation.navigate('infoScreen', {
      treeNameQuery: extractTreeNameQuery(item),
    })
  }

  // custome callout component for IOS
  /* The code is defining a functional component called `CalloutComponentIos` that returns a JSX
  view. The view contains information about a tree marker, including its species name, status, date
  entered, user, diameter at breast height (DBH), and carbon dioxide storage. It also includes
  options to show the tree's picture and more information about the tree. The component takes an
  `item` object as a parameter and uses its properties to populate the view. */
  const CalloutComponentIos = (item) => {
    const isMoreinfo = item.item.speciesNameCommon.toUpperCase() !== 'UNKNOWN'
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

  /**
   * The function closes a modal and navigates to a new screen to show a selected image after a delay
   * of 500 milliseconds.
   * @param item - The `item` parameter is an object that contains information about the selected item.
   * It is likely being used in a list or grid view where each item has its own set of data. The `item`
   * object may contain properties such as `id`, `name`, `description`, `photo`, etc
   */
  const onShowImage = (item) => {
    RBSheetref.close()
    setTimeout(function () {
      props.navigation.navigate('showImage', { selectedImage: item.item.photo })
    }, 500)
  }

  /**
   * This function closes a modal and navigates to a screen with a tree name query after a delay.
   * @param item - The `item` parameter is likely an object that contains information about a suggested
   * tree on an Android device. It is being passed as an argument to the `onSuggestedTreeAndroid`
   * function.
   */
  const onSuggestedTreeAndroid = async (item) => {
    RBSheetref.close()
    setTimeout(function () {
      props.navigation.navigate('infoScreen', { treeNameQuery: extractTreeNameQuery(item) })
    }, 500)
  }

  // custome callout component for Android
  /* The code defines a functional component called `CalloutComponent` which takes an `item` object
  as a parameter. It renders a view with information about a tree, including its species name, status,
  date entered, user, diameter at breast height (DBH), and carbon dioxide storage. It also includes
  options to show the tree's picture and more information about the tree if available. The component
  uses various styles defined in the `styles` object. */
  const CalloutComponent = (item) => {
    const isMoreinfo = item.item.speciesNameCommon.toUpperCase() !== 'UNKNOWN'
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
  /**
   * The function sets the map view to fit the coordinates of the first and last tree markers with edge
   * padding.
   */
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

  /**
   * This function sets the selected trees and opens a bottom sheet.
   * @param item - The parameter "item" is likely an object or a value that is being passed into the
   * function "onOpenSheet". It is used to set the state of "selectTrees" and then open a reference to
   * a bottom sheet using "RBSheetref.open()". Without more context, it is
   */
  const onOpenSheet = (item) => {
    setSelectTrees(item)
    RBSheetref.open()
  }

  /* The code is defining a React component that renders a modal header with a title "VALIDATE
  THIS TREE!" and a divider. The component is defined using JSX syntax and uses the View and Text
  components from React Native. The styles for the modal header are defined using the styles object. */
  const modalHeader = (
    <View style={styles.modalHeader}>
      <Text style={styles.title}>VALIDATE THIS TREE!</Text>
      <View style={styles.divider}></View>
    </View>
  )

  /**
   * The function sets state variables for displaying an alert and storing selected species data.
   * @param data - The parameter `data` is an object that contains information about a species. It
   * likely includes properties such as `COMMON` (the common name of the species), `SCIENTIFIC` (the
   * scientific name of the species), and other relevant data. The function `onSelect` sets some state
   * variables
   */
  const onSelect = (data) => {
    setshowAlertHandler(true)
    setSpeciesName(data.COMMON)
    setSpeciesData(data)
  }

  /* The code is defining a React component that renders a modal body with a text message and a
  conditional rendering of a TouchableOpacity component. The TouchableOpacity component is only
  rendered if the value of the `speciesNameCommon` property of the `selectTrees` object is equal to
  'Unknown'. If the TouchableOpacity component is rendered, it displays a text and an icon, and when
  pressed, it sets the `showAlertHandler` state to false and navigates to the 'identifySpecies'
  screen with some props. */
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

  /* The code is defining a React component that renders a modal footer with two buttons, "Yes"
  and "No". The "Yes" button is conditionally enabled based on whether a species name has been
  selected or not. If a species name has been selected, the button triggers a validation function.
  If a species name has not been selected, the button triggers an alert. The "No" button resets the
  species name to a default value and closes the modal. */
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

  /* The code is creating a React component called `modalContainer` which renders a `View`
  component with three child components: `modalHeader`, `modalBody`, and `modalFooter`. The
  `styles.modalContainer` is a reference to a style object that defines the appearance of the `View`
  component. */
  const modalContainer = (
    <View style={styles.modalContainer}>
      {modalHeader}
      {modalBody}
      {modalFooter}
    </View>
  )

  /* The code is a React Native component that renders a map view with markers representing
  trees. It also includes functionality for displaying a callout when a marker is pressed, as well
  as a modal and a bottom sheet for displaying additional information about the selected tree. The
  component also includes buttons for toggling between the user's own map and a public map, as well
  as a loading indicator for when data is being loaded. */
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
          { backgroundColor: isActiveown ? colors.gray[600] : '#fff', bottom: '12%' },
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
          { bottom: '22%', backgroundColor: !isActiveown ? colors.gray[600] : '#fff' },
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

/* The code is checking the platform of the device and setting the `mapHeight` variable
accordingly. If the platform is iOS, it subtracts the height of the status bar from the height of
the window. Otherwise, it sets the `mapHeight` variable to the height of the window. This code is
written in TypeScript for a React application. */
const mapHeight =
  Platform.OS === 'ios'
    ? Dimensions.get('window').height - Constants.statusBarHeight
    : Dimensions.get('window').height

/* The code is defining a StyleSheet object with various styles for a React Native application.
It includes styles for a container, a map, a callout component, a floating button, a loader, a
modal, and other UI elements. These styles are used to define the appearance and layout of various
components in the application. */
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
