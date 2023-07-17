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
//     top: Platform.OS === 'ios' ? Constants.statusBarHeight + 5 : Constants.statusBarHeight,
    top: Platform.OS === 'ios' ? Constants.statusBarHeight > 0 ? Constants.statusBarHeight : 10 + 5 : Constants.statusBarHeight,
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

  async function versionChanged(savedVersion: any, currentVersion: string) {
    if (savedVersion === currentVersion) {
      return false
    } else {
      return true
    }
  }

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

  React.useEffect(() => {
    checkIntro()
  }, [])

  React.useEffect(() => {
    if (!authUser) {
      return
    }

    const unsubscribe = userDataListener(authUser.uid, (userData) => {
      if (!userData) {
        return
      }

      const treecount = addTreeCount(userData)
      let badgeLength: number
      if (userData?.badges !== undefined) {
        badgeLength = userData?.badges.length
      } else {
        badgeLength = 0
      }

      setStatusData(
        statusData.map((item) =>
          item.id === 1
            ? { ...item, value: treecount }
            : item.id === 2
            ? { ...item, value: badgeLength }
            : item,
        ),
      )
      setAvatarUrl(getAvatarUrl(userData.avatarSeed ?? 'default_seed'))
      setUserData(userData)
    })

    return () => {
      unsubscribe()
    }
  }, [authUser?.email])

  function handleSignout() {
    setIsMenuVisible(false)
    signOutUser()
  }

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

  if (!authUser) {
    return null
  }

  function addTreeCount(data) {
    if (data?.treesCount == undefined) {
      // return 'You haven\'t added any trees yet.'
      return 0
    }
    return data?.treesCount
  }

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

  function goToSliderHandler() {
    setIsSliderVisible(true)
  }

  function sliderDismissHanlder() {
    setIsSliderVisible(false)
  }

  function getAvatarUrl(seed: string) {
    return `https://avatars.dicebear.com/api/bottts/${seed}.png`
  }

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
