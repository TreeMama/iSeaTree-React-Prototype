import React from 'react'

import {
  StyleSheet,
  ScrollView,
  View,
  KeyboardAvoidingView,
  SafeAreaView,
  Linking,
  Text,
  TouchableOpacity
} from 'react-native'
import { Divider, Button, Menu, Headline, Subheading } from 'react-native-paper'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import { StatusBar } from '../components/StatusBar'
import { Badge } from '../components/Badge'
import {
  UserData,
  getUser,
  userDataListener,
  signOutUser,
  getCurrentAuthUser,
} from '../lib/firebaseServices'
import { colors } from '../styles/theme'

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
    paddingVertical: 5
  },
  linkColor: {
    color: '#87CEEB',
    fontSize: 12,
    textDecorationLine: "underline"
  }

})

export function ProfileScreen() {
  const [isMenuVisible, setIsMenuVisible] = React.useState<boolean>(false)
  const [userData, setUserData] = React.useState<null | UserData>(null)

  const authUser = getCurrentAuthUser()

  React.useEffect(() => {
    if (!authUser) {
      return
    }

    const unsubscribe = userDataListener(authUser.uid, (userData) => {
      if (!userData) {
        return
      }

      setUserData(userData)
    })

    return () => {
      unsubscribe()
    }
  }, [authUser?.email])

  function handleSignout() {
    signOutUser()
    setIsMenuVisible(false)
  }

  if (!authUser) {
    return null
  }

  function addBadges() {
    var badges = []
    if (userData?.badges?.includes('SEEDLING')) {
      badges.push(<Badge key="seedling" variant="seedling" />)
    }
    if (userData?.badges?.includes('SAPLING')) {
      badges.push(<Badge key="sapling" variant="sapling" />)
    }
    if (userData?.badges?.includes('OLD_GROWTH_EXPERT')) {
      badges.push(<Badge key="old_growth_expert" variant="old_growth_expert" />)
    }
    if (userData?.badges?.includes('FIRST_TREE')) {
      badges.push(<Badge key="first_tree" variant="first_tree" />)
    }
    if (userData?.badges?.includes('FIFTH_TREE')) {
      badges.push(<Badge key="fifth_tree" variant="fifth_tree" />)
    }
    if (userData?.badges?.includes('TENTH_TREE')) {
      badges.push(<Badge key="tenth_tree" variant="tenth_tree" />)
    }
    if (userData?.badges?.includes('DBH')) {
      badges.push(<Badge key="dbh" variant="dbh" />)
    }
    return badges
  }
  function addTreeCount(){
    if(userData?.treesCount == undefined){
      return 'You haven\'t added any trees yet.'
    }
    return userData?.treesCount;

  }
  return (
    <>
      <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
        <SafeAreaView style={styles.container}>
          <StatusBar />
          <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={styles.container}>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  height: 55,
                }}
              >
                <Menu
                  visible={isMenuVisible}
                  onDismiss={() => {
                    setIsMenuVisible(false)
                  }}
                  anchor={
                    <Button
                      onPress={() => {
                        setIsMenuVisible(!isMenuVisible)
                      }}
                    >
                      <MaterialCommunityIcons name="dots-vertical" size={30} />
                    </Button>
                  }
                >
                  <Menu.Item icon="logout" onPress={handleSignout} title="Sign out" />
                </Menu>
              </View>

              <View style={styles.content}>
                <View style={{ marginBottom: 20, alignItems: 'center' }}>
                  <View
                    style={{
                      width: 100,
                      height: 100,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <MaterialCommunityIcons name="account-box" size={100} color={colors.gray[400]} />
                  </View>
                  <Subheading>{userData?.username}</Subheading>
                  <Subheading>{userData?.email}</Subheading>
                </View>
                <View>
                  <TouchableOpacity onPress={() => {
                    Linking.openURL('https://treemama.org/forum');
                  }}>
                    <Text style={styles.helpSectionLink}>For Help: <Text style={styles.linkColor}>https://treemama.org/forum</Text></Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {
                    Linking.openURL('https://treemama.org/365-days-of-trees/dashboard');
                  }}>
                    <Text style={styles.helpSectionLink}>For Map: <Text style={styles.linkColor}>https://treemama.org/365-days-of-trees/dashboard</Text></Text>
                  </TouchableOpacity>
                </View>
                <Divider style={{ width: '100%' }} />

                <Headline style={{ marginTop: 20 }}>Your badges</Headline>

                <View
                  style={{
                    justifyContent: 'center',
                    flexDirection: 'row',
                    marginTop: 20,
                    flexWrap: 'wrap',
                  }}
                >
                  {addBadges()}
                </View>

                <Headline>Trees recorded</Headline>
                <Text>{ addTreeCount() }</Text>

              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </>
  )
}
