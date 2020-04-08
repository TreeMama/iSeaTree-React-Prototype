import React from 'react'

import { StyleSheet, ScrollView, View } from 'react-native'
import { Divider, Button, Menu, Headline, Subheading } from 'react-native-paper'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import { StatusBar } from '../components/StatusBar'
import { Badge } from '../components/Badge'
import { signOutUser, getCurrentUser } from '../lib/firebaseServices'
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
})

export function ProfileScreen() {
  const [isMenuVisible, setIsMenuVisible] = React.useState<boolean>(false)

  const user = getCurrentUser()

  function handleSignout() {
    signOutUser()
    setIsMenuVisible(false)
  }

  if (!user) {
    return null
  }

  return (
    <>
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
              <Subheading>{user.email}</Subheading>
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
              <Badge variant="seedling" />
              <Badge variant="sapling" />
              <Badge variant="old_growth_expert" />
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  )
}
