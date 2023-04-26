/**
 * This is a React Native screen component for the user profile page, which displays user information,
 * status data, and badges earned.
 * @param {any} savedVersion - The saved version of the app that was stored in AsyncStorage.
 * @param {string} currentVersion - The current version of the app.
 * @returns The `ProfileScreen` component is being returned.
 */

import React from 'react'

import {
  StyleSheet,
  ScrollView,
  View,
  KeyboardAvoidingView,
  SafeAreaView,
  Dimensions,
  Image,
  FlatList,
  Linking,
  Text,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native'

import { Button } from 'react-native-paper'
import Constants from 'expo-constants'
import { StatusBar } from '../components/StatusBar'
import { Badge } from '../components/Badge'
import {
  UserData,
  getUser,
  userDataListener,
  signOutUser,
  getCurrentAuthUser,
  updateTreeAndDeleteAccount,
  setUserAvatarSeed,
} from '../lib/firebaseServices'
import { colors } from '../styles/theme'
import Slider from './SliderScreen'
import AppIntroScreen from './AppIntroScreen'
import AsyncStorage from '@react-native-async-storage/async-storage'
import DeviceInfo from 'react-native-device-info'
import { useNavigationActions } from '../lib/navigation'

const win = Dimensions.get('window')
const imagePlaceholder = require('../../assets/profile/image_placeholder.png')
const imageReward = require('../../assets/profile/reward_icon.png')
const imageTree = require('../../assets/profile/tree_icon.png')
// const informationIcon = require('../../assets/profile/information.png')
const logoutIcon = require('../../assets/profile/logout.png')
const compassIcon = require('../../assets/profile/compass.png')
const deleteIcon = require('../../assets/profile/delete.png')
const randomIcon = require('../../assets/profile/random.png')

/* The above code is defining a StyleSheet object with various styles for a React Native app. The
styles include container styles, content styles, link styles, profile styles, status cell styles,
and badge styles. These styles are used to define the layout and appearance of various components in
the app. */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    paddingTop: 0,
  },
  helpSectionLink: {
    fontSize: 12,
    paddingVertical: 5,
  },
  linkColor: {
    color: '#87CEEB',
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  profileContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: win.height / 2.6,
    backgroundColor: colors.green[700],
    paddingTop: 40,
  },
  profileImageContainer: {
    height: win.width / 3,
    width: win.width / 3,
    borderRadius: win.width / 6,
    alignSelf: 'center',
    justifyContent: 'center',
    borderWidth: 5,
    borderColor: '#fff',
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  profileImage: {
    height: win.width / 4,
    width: win.width / 4,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  profiledetailContainer: {
    marginTop: 10,
    alignContent: 'center',
    justifyContent: 'center',
  },
  userNameText: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    lineHeight: 30,
  },
  userakaNameText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    color: '#fff',
    lineHeight: 25,
  },
  profileRightMenuContainer: {
    right: 15,
    top: Platform.OS === 'ios' ? Constants.statusBarHeight + 5 : Constants.statusBarHeight,
    position: 'absolute',
  },
  menuIcon: {
    height: 30,
    width: 30,
    resizeMode: 'contain',
    tintColor: '#fff',
  },
  avatarIcon: {
    height: 30,
    width: 30,
  },
  statusCell: {
    height: Platform.OS === 'ios' ? win.height / 6 : win.height / 5,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 0.5,
  },
  statuscellImage: {
    height: 40,
    width: 40,
    alignSelf: 'center',
    justifyContent: 'center',
    tintColor: colors.green[700],
  },
  statusCellValueText: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    color: colors.gray[700],
  },
  statusCellTitleText: {
    fontSize: 14,
    textAlign: 'center',
    color: colors.gray[600],
  },
  badgeViewContainer: {
    flex: 1,
    margin: 12,
    borderRadius: 18,
  },
  badgeCell: {
    height: win.height / 6,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 12,
  },
})

/**
 * This is a TypeScript React component that renders a user profile screen with various user data and
 * options.
 * @param {any} savedVersion - The saved version of the app, stored in AsyncStorage.
 * @param {string} currentVersion - The current version of the app, obtained using
 * DeviceInfo.getVersion().
 * @returns The `ProfileScreen` component is being returned.
 */
export function ProfileScreen() {
  const navigationActions = useNavigationActions()
  const [isMenuVisible, setIsMenuVisible] = React.useState<boolean>(false)
  const [userData, setUserData] = React.useState<null | UserData>(null)
  const [statusData, setStatusData] = React.useState<any[]>([
    { id: 1, title: 'Trees Identified', value: 0, imgSrc: imageTree },
    { id: 2, title: 'Badges Earned', value: 0, imgSrc: imageReward },
  ])

  const [isSliderVisible, setIsSliderVisible] = React.useState<boolean>(false)

  const authUser = getCurrentAuthUser()
  const [avatarUrl, setAvatarUrl] = React.useState<String | null>(null)

  /**
   * The function checks if a saved version matches the current version and returns a boolean value
   * accordingly.
   * @param {any} savedVersion - The saved version is a variable that holds the version number that was
   * previously saved or stored somewhere, such as in a database or a file.
   * @param {string} currentVersion - The current version parameter is a string representing the current
   * version of something, such as a software application or a database schema.
   * @returns The function `versionChanged` returns a boolean value. If the `savedVersion` parameter is
   * equal to the `currentVersion` parameter, it returns `false`. Otherwise, it returns `true`.
   */
  async function versionChanged(savedVersion: any, currentVersion: string) {
    if (savedVersion === currentVersion) {
      return false
    } else {
      return true
    }
  }

  /**
   * The function prompts the user with a confirmation alert to delete their account and calls another
   * function to update the tree and delete the account if the user selects "OK".
   */
  const deleteAccount = () =>
    Alert.alert(
      'Confirmation',
      `Do you want to delete your account? If you select "OK" all user data will be impossible to restore in the future.`,
      [
        {
          text: 'OK',
          onPress: () => {
            console.log('ok pressed +++', authUser?.uid)
            updateTreeAndDeleteAccount(authUser?.uid)
          },
        },
        {
          text: 'Cancel',
          onPress: () => console.log('cancel button pressed +++'),
          style: 'cancel',
        },
      ],
      { cancelable: false },
    )

  /**
   * This function checks if the app is being opened for the first time or if the version has changed,
   * and sets a state variable accordingly to show or hide an intro slider.
   */
  async function checkIntro() {
    const isShowIntro = await AsyncStorage.getItem('FIRST_TIME_OPEN_APP')
    const savedAppversion = await AsyncStorage.getItem('APP_VERSION')
    const parseisShowIntro = JSON.parse(isShowIntro)
    const parsesavedAppversion = JSON.parse(savedAppversion)
    const currentVersionNum = DeviceInfo.getVersion()

    const isVersionChanged = await versionChanged(parsesavedAppversion, currentVersionNum)

    if (parseisShowIntro) {
      if (isVersionChanged) {
        setIsSliderVisible(true)
      } else {
        setIsSliderVisible(false)
      }
    } else {
      setIsSliderVisible(true)
    }
  }

  /* The code is using the `useEffect` hook from the React library to call the `checkIntro`
  function when the component mounts. The `[]` as the second argument to `useEffect` means that the
  effect will only run once, when the component mounts. */
  React.useEffect(() => {
    checkIntro()
  }, [])

  /* The code is a React useEffect hook that listens for changes in the authUser state variable.
  If authUser is not null, it subscribes to a userDataListener function that listens for changes in
  the user data associated with the authUser's uid. When the userDataListener function is triggered,
  the code updates the statusData state variable with the user's tree count and badge count, sets
  the user's avatar URL, and updates the userData state variable. Finally, the code returns a
  cleanup function that unsubscribes from the userDataListener. */
  React.useEffect(() => {
    if (!authUser) {
      return
    }

    /* The above code is subscribing to a listener for user data changes and updating the status data,
    avatar URL, and user data accordingly. It first checks if the user data exists and then
    calculates the tree count and badge length from the user data. It then updates the status data
    with the new values for tree count and badge length. Finally, it sets the avatar URL and user
    data using the avatar seed and updates the state with the new user data. */
    const unsubscribe = userDataListener(authUser.uid, (userData) => {
      /* The above code is checking if the variable `userData` is falsy (null, undefined, false, 0, "",
      NaN) and if it is, it immediately returns from the current function or method. */
      if (!userData) {
        return
      }

      /* The code is written in TypeScript for a React application. It is declaring a variable
      `treecount` and assigning it the value returned by a function `addTreeCount` which takes an
      argument `userData`. It is also declaring a variable `badgeLength` of type number. If
      `userData` has a property `badges` defined, `badgeLength` is assigned the length of the
      `badges` array. Otherwise, `badgeLength` is assigned the value 0. */
      const treecount = addTreeCount(userData)
      let badgeLength: number
      if (userData?.badges !== undefined) {
        badgeLength = userData?.badges.length
      } else {
        badgeLength = 0
      }

      /* The code is updating the `statusData` array by mapping over each item and checking if the
      `id` of the item matches a certain value. If the `id` matches 1, it updates the `value`
      property with the value of `treecount`. If the `id` matches 2, it updates the `value` property
      with the value of `badgeLength`. If the `id` does not match either 1 or 2, it returns the
      original item. The updated `statusData` array is then set as the new state using the
      `setStatusData */
      setStatusData(
        statusData.map((item) =>
          item.id === 1
            ? { ...item, value: treecount }
            : item.id === 2
              ? { ...item, value: badgeLength }
              : item,
        ),
      )

      /* The code is setting the avatar URL for a user in a TypeScript React application. It is
      using the `getAvatarUrl` function to generate the URL based on the user's `avatarSeed`
      property. If the `avatarSeed` property is null or undefined, it uses a default seed value to
      generate the URL. The resulting URL is then assigned to the `avatarUrl` variable. */
      setAvatarUrl(getAvatarUrl(userData.avatarSeed ?? 'default_seed'))

      setUserData(userData)
    })

    /* The above code is a TypeScript React function that returns another function. The returned
    function is used to unsubscribe from an event or observable. The `unsubscribe()` function is
    called when the returned function is invoked. */
    return () => {
      unsubscribe()
    }
  }, [authUser?.email])

  /**
   * The function handles signing out a user and hides the menu.
   */
  function handleSignout() {
    setIsMenuVisible(false)
    signOutUser()
  }

  /**
   * The function prompts the user with a confirmation alert and logs them out if they press "OK".
   */
  const redirectToSignIn = () =>
    Alert.alert(
      'Confirmation',
      'This will log you out and take you to the login screen. Ok?',
      [
        {
          text: 'OK',
          onPress: () => {
            console.log('ok pressed +++', authUser?.uid)
            handleSignout()
          },
        },
        {
          text: 'Cancel',
          onPress: () => console.log('cancel button pressed +++'),
          style: 'cancel',
        },
      ],
      { cancelable: false },
    )

  /* The code is checking if the variable `authUser` is falsy (null, undefined, false, 0, etc.).
  If it is falsy, the function or component that contains this code will return null, effectively
  rendering nothing. This is often used in React components to conditionally render content based on
  the presence of a user authentication object. */
  if (!authUser) {
    return null
  }

  /**
   * The function returns the number of trees in a given data object or 0 if there are none.
   * @param data - The input parameter "data" is an object that may or may not have a property called
   * "treesCount". If "treesCount" is not defined or is undefined, the function returns 0. Otherwise, it
   * returns the value of "treesCount".
   * @returns If the `data` object does not have a property `treesCount`, the function will return `0`.
   * Otherwise, it will return the value of the `treesCount` property in the `data` object.
   */
  function addTreeCount(data) {
    if (data?.treesCount == undefined) {
      // return 'You haven\'t added any trees yet.'
      return 0
    }
    return data?.treesCount
  }

  /* The code is defining a function called `renderStatusList` that takes an object with `item`
  and `index` properties as its argument. The function returns a `View` component that displays an
  image and some text values from the `item` object. The `index` value is used to determine whether
  to add a border to the left of the `View` component. This function is likely used to render a list
  of status items in a React component. */
  function renderStatusList({ item, index }) {
    return (
      <View
        style={[
          styles.statusCell,
          index % 2 !== 0 && { borderLeftWidth: 0.5, borderLeftColor: colors.gray[600] },
        ]}
      >
        <Image source={item.imgSrc} style={styles.statuscellImage} resizeMode="contain" />
        <View style={{ alignSelf: 'center', justifyContent: 'center', marginTop: 15 }}>
          <Text style={styles.statusCellValueText}>{item.value}</Text>
          <Text style={styles.statusCellTitleText}>{item.title}</Text>
        </View>
      </View>
    )
  }

  /* The code is defining a function `renderBadgeList` that takes an object with `item` and `index`
  properties as its argument. The function returns a `View` component that contains a list of `Badge`
  components based on the value of the `item` property. Each `Badge` component has a unique `variant`
  prop based on the value of the `item` property. The function is likely used to render a list of
  badges in a React component. */
  function renderBadgeList({ item, index }) {
    return (
      <View style={styles.badgeCell}>
        {item === 'SEEDLING' && <Badge key="seedling" variant="seedling" />}
        {item === 'SAPLING' && <Badge key="sapling" variant="sapling" />}
        {item === 'OLD_GROWTH_EXPERT' && (
          <Badge key="old_growth_expert" variant="old_growth_expert" />
        )}
        {item === 'FIRST_TREE' && <Badge key="first_tree" variant="first_tree" />}
        {item === 'FIFTH_TREE' && <Badge key="fifth_tree" variant="fifth_tree" />}
        {item === 'TENTH_TREE' && <Badge key="tenth_tree" variant="tenth_tree" />}
        {item === 'TWENTIETH_TREE' && <Badge key="twentieth_tree" variant="twentieth_tree" />}
        {item === 'FIFTIETH_TREE' && <Badge key="fiftieth_tree" variant="fiftieth_tree" />}
        {item === 'HUNDREDTH_TREE' && <Badge key="hundredth_tree" variant="hundredth_tree" />}
        {item === 'TWO_HUNDREDTH_TREE' && (
          <Badge key="two_hundredth_tree" variant="two_hundredth_tree" />
        )}
        {item === 'DBH' && <Badge key="dbh" variant="dbh" />}
      </View>
    )
  }

  /**
   * The function sets the state of a variable to make a slider visible.
   */
  function goToSliderHandler() {
    setIsSliderVisible(true)
  }

  /**
   * The function sets the state of a slider visibility to false.
   */
  function sliderDismissHanlder() {
    setIsSliderVisible(false)
  }

  /**
   * The function returns a URL for a randomly generated avatar image based on a given seed.
   * @param {string} seed - The seed parameter is a string value that is used to generate a unique
   * avatar image using the DiceBear Avatars API. The same seed value will always generate the same
   * avatar image, so it can be used to consistently represent a user or entity across different
   * applications or platforms.
   * @returns a URL string that generates a unique avatar image using the DiceBear Avatars API. The URL
   * includes the word "bottts" which specifies the type of avatar design, and the "seed" parameter is
   * used to generate a unique image based on the provided string.
   */
  function getAvatarUrl(seed: string) {
    return `https://avatars.dicebear.com/api/bottts/${seed}.png`
  }

  /**
   * The function prompts the user to confirm generating a new random avatar and sets the avatar URL
   * and seed accordingly.
   */
  function randomizeAvatarUrl() {
    Alert.alert(
      'Confirmation',
      'Generate a new random avatar?',
      [
        {
          text: 'OK',
          onPress: () => {
            const seed = Math.random().toString(36).slice(2)
            setAvatarUrl(getAvatarUrl(seed))
            if (authUser?.uid) {
              setUserAvatarSeed(authUser.uid, seed)
            }
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: false },
    )
  }

  /* The code is a React component that renders a user profile screen. It conditionally renders a
  slider or an AppIntroScreen component based on the value of the isSliderVisible state variable and
  the authUser variable. If isSliderVisible is true and authUser is false, it renders the
  AppIntroScreen component. Otherwise, it renders the user profile screen with the user's avatar,
  username, email, status updates, and badges. The component also includes buttons for logging out,
  accessing a tutorial, and deleting the user's account. */
  return (
    <>
      {/* { isSliderVisible ? <Slider dismissSlider={sliderDismissHanlder} /> : null} */}
      {isSliderVisible && !authUser ? (
        <SafeAreaView style={{ flex: 1 }}>
          <AppIntroScreen dismissSlider={sliderDismissHanlder} />
        </SafeAreaView>
      ) : (
        <>
          <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
              <View style={styles.container}>
                <View style={styles.profileContainer}>
                  <View style={styles.profileRightMenuContainer}>
                    {/* <TouchableOpacity onPress={() => {
                      Linking.openURL('https://treemama.org/forum');
                    }}>
                      <Image source={informationIcon} style={styles.menuIcon} />
                    </TouchableOpacity> */}
                    <TouchableOpacity onPress={() => redirectToSignIn()}>
                      <Image source={logoutIcon} style={[styles.menuIcon, { marginTop: 12 }]} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={navigationActions.tutorial}>
                      <Image source={compassIcon} style={[styles.menuIcon, { marginTop: 12 }]} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteAccount()}>
                      <Image source={deleteIcon} style={[styles.menuIcon, { marginTop: 12 }]} />
                    </TouchableOpacity>
                  </View>
                  <View>
                    <View style={styles.profileImageContainer}>
                      <Image
                        source={avatarUrl ? { uri: avatarUrl } : imagePlaceholder}
                        style={styles.profileImage}
                      />
                    </View>
                    <TouchableOpacity
                      onPress={() => randomizeAvatarUrl()}
                      style={[
                        {
                          zIndex: 1,
                          elevation: 1,
                          position: 'absolute',
                          top: 0,
                          right: 0,
                        },
                      ]}
                    >
                      <Image source={randomIcon} style={[styles.avatarIcon]} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.profiledetailContainer}>
                    <Text style={styles.userNameText}>{userData?.username}</Text>
                    <Text style={styles.userakaNameText}>{userData?.email}</Text>
                  </View>
                </View>

                <View style={{ flex: 1, backgroundColor: '#ff0' }}>
                  <FlatList
                    data={statusData}
                    style={styles.container}
                    renderItem={(object) => renderStatusList(object)}
                    numColumns={2}
                  />
                </View>

                {userData?.badges !== undefined && (
                  <View style={styles.container}>
                    <FlatList
                      data={userData?.badges}
                      style={styles.badgeViewContainer}
                      renderItem={(object) => renderBadgeList(object)}
                      numColumns={2}
                    />
                  </View>
                )}

                {/* <Button style={{ marginTop: 20, marginBottom: 20 }} onPress={goToSliderHandler}>
                  Click here for a walkthrough!
          </Button> */}
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
          {/* { isSliderVisible ? <Slider dismissSlider={sliderDismissHanlder} /> : null} */}
        </>
      )}
    </>
  )
}
