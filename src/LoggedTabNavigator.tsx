/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react'

// import { MaterialCommunityIcons, SimpleLineIcons } from '@expo/vector-icons'
// import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useTheme } from 'react-native-paper'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { TabScreenNames } from './lib/navigation'
import { ProfileScreen } from './screens/ProfileScreen'
import { AddTreeScreen } from './screens/AddTreeScreen'
import { MapScreen } from './screens/MapScreen'
import { InfoScreen } from './screens/InfoScreen/InfoScreen'
import { colors } from './styles/theme'
import { ChallengeScreen } from './screens/ChallengeScreen'

const Tab = createBottomTabNavigator()

const profileIcon = require('../assets/nav_profile_inactive.png')
const profileActiveIcon = require('../assets/nav_profile.png')
const mapIcon = require('../assets/nav_map_inactive.png')
const mapActiveIcon = require('../assets/nav_map.png')
// const treeCameraIcon = require('../assets/nav_addtree_inactive.png')
const treeCameraActiveIcon = require('../assets/nav_addtree.png')
const challengeIcon = require('../assets/nav_callenge_inactive.png')
const challengeAcitiveIcon = require('../assets/nav_callenge.png')
const infoIcon = require('../assets/nav_tree_inactive.png')
const infoActiveIcon = require('../assets/nav_tree.png')

export function LoggedTabNavigator() {
  const theme = useTheme()

  const CustomTabButton = ({ children, onPress }) => (
    <TouchableOpacity style={styles.cameraTab} onPress={onPress}>
      <View style={styles.cameraChildren}>{children}</View>
    </TouchableOpacity>
  )
  return (
    <Tab.Navigator
      activeColor={theme.colors.primary}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          // bottom: 5,
          elevation: 0,
          backgroundColor: 'white',
          // height: 90,
        },
      }}
      tabBarOptions={{
        showLabel: false,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name={TabScreenNames.profile}
        component={ProfileScreen}
        options={{
          // headerShown: true,
          tabBarLabel: 'Profile',
          // tabBarIcon: ({ color }) => (
          //   <MaterialCommunityIcons name="account-circle" color={color} size={26} />
          // ),
          // tabBarIcon: ({ color }) => (
          //   <Image
          //     source={profileIcon}
          //     fadeDuration={0}
          //     style={{ width: 23, height: 23, tintColor: color }}
          //   />
          // ),
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center', top: 10, width: 150 }}>
              <Image
                source={focused ? profileActiveIcon : profileIcon}
                fadeDuration={0}
                style={{ width: 23, height: 23 }}
              />
              <Text style={{ fontSize: 10, color: focused ? '#373C3F' : colors.gray[700] }}>
                Profile
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name={TabScreenNames.mapScreen}
        component={MapScreen}
        options={{
          tabBarLabel: 'Explore',
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center', top: 10, width: 150 }}>
              <Image
                source={focused ? mapActiveIcon : mapIcon}
                fadeDuration={0}
                style={{ width: 23, height: 23 }}
              />
              <Text style={{ fontSize: 10, color: focused ? '#373C3F' : colors.gray[700] }}>
                Explore
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name={TabScreenNames.addTree}
        component={AddTreeScreen}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? treeCameraActiveIcon : treeCameraActiveIcon}
              fadeDuration={0}
              style={{
                width: 60,
                height: 60,
              }}
            />
          ),

          tabBarButton: (props) => <CustomTabButton {...props} />,
        }}
      />
      <Tab.Screen
        name={TabScreenNames.challengeScreen}
        component={ChallengeScreen}
        options={{
          tabBarLabel: 'Challenge',
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center', top: 10, width: 150 }}>
              <Image
                source={focused ? challengeAcitiveIcon : challengeIcon}
                fadeDuration={0}
                style={{ width: 23, height: 23 }}
              />
              <Text style={{ fontSize: 10, color: focused ? '#373C3F' : colors.gray[700] }}>
                Challenge
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name={TabScreenNames.infoScreen}
        component={InfoScreen}
        options={{
          tabBarLabel: 'Info',
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center', top: 10, width: 150 }}>
              <Image
                source={focused ? infoActiveIcon : infoIcon}
                fadeDuration={0}
                style={{ width: 23, height: 23 }}
              />
              <Text style={{ fontSize: 10, color: focused ? '#373C3F' : colors.gray[700] }}>
                Info
              </Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  )
}
const styles = StyleSheet.create({
  cameraTab: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraChildren: { width: 70, height: 70, borderRadius: 35 },
})
