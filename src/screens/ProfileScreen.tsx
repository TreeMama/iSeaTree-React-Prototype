import React from 'react'

import { StyleSheet, View } from 'react-native'
import { Button, Menu, Title, useTheme } from 'react-native-paper'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import Constants from 'expo-constants'

import { signOutUser, getCurrentUser } from '../lib/firebaseServices'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Constants.statusBarHeight + 10,
  },
  content: {
    padding: 20,
    paddingTop: 0,
    alignItems: 'center',
  },
})

export function ProfileScreen() {
  const [isMenuVisible, setIsMenuVisible] = React.useState<boolean>(false)

  const theme = useTheme()
  const user = getCurrentUser()

  function handleSignout() {
    signOutUser()
    setIsMenuVisible(false)
  }

  if (!user) {
    return
  }

  return (
    <View style={styles.container}>
      <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-end' }}>
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
        <MaterialCommunityIcons name="account-box" size={100} color={theme.colors.backdrop} />
        <Title>{user.email}</Title>
      </View>
    </View>
  )
}
