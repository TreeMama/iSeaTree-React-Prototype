/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react'

// import { MaterialCommunityIcons, SimpleLineIcons } from '@expo/vector-icons'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import { useTheme } from 'react-native-paper'
import { Image, View } from 'react-native'

import { TabScreenNames } from './lib/navigation'
import { ProfileScreen } from './screens/ProfileScreen'
import { AddTreeScreen } from './screens/AddTreeScreen'
import { SuggestedTreesScreen } from './screens/SuggestedTreesScreen'
import { MapScreen } from './screens/MapScreen'
// import { colors } from './styles/theme';
import { ChallengeScreen } from './screens/ChallengeScreen'

const Tab = createMaterialBottomTabNavigator()

const profileIcon = require('../assets/nav_profile_inactive.png')
const profileActiveIcon = require('../assets/nav_profile.png')
const mapIcon = require('../assets/nav_map_inactive.png')
const mapActiveIcon = require('../assets/nav_map.png')
const treeCameraIcon = require('../assets/nav_addtree_inactive.png')
const treeCameraActiveIcon = require('../assets/nav_addtree.png')
const challengeIcon = require('../assets/nav_callenge_inactive.png')
const challengeAcitiveIcon = require('../assets/nav_callenge.png')
const infoIcon = require('../assets/nav_tree_inactive.png')
const infoActiveIcon = require('../assets/nav_tree.png')

export function LoggedTabNavigator() {
  const theme = useTheme()

  return (
    <Tab.Navigator
      activeColor={theme.colors.primary}
      barStyle={{ padding: 12, paddingBottom: 8, backgroundColor: 'white' }}
      labeled
    >
      <Tab.Screen
        name={TabScreenNames.profile}
        component={ProfileScreen}
        options={{
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
            <Image
              source={focused ? profileActiveIcon : profileIcon}
              fadeDuration={0}
              style={{ width: 23, height: 23 }}
            />
          ),
        }}
      />
      <Tab.Screen
        name={TabScreenNames.mapScreen}
        component={MapScreen}
        options={{
          tabBarLabel: 'Explore',
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? mapActiveIcon : mapIcon}
              fadeDuration={0}
              style={{ width: 23, height: 23 }}
            />
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
              source={focused ? treeCameraActiveIcon : treeCameraIcon}
              fadeDuration={0}
              style={{ width: 50, height: 50, bottom: 8 }}
            />
            //   {/* // <MaterialCommunityIcons
            // //   name="plus"
            // //   size={32}
            // //   color={focused ? colors.green[700] : colors.gray[700]}
            // // /> */}
          ),
        }}
      />
      <Tab.Screen
        name={TabScreenNames.challengeScreen}
        component={ChallengeScreen}
        options={{
          tabBarLabel: 'Challenge',
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? challengeAcitiveIcon : challengeIcon}
              fadeDuration={0}
              style={{ width: 23, height: 23 }}
            />
          ),
        }}
      />
      <Tab.Screen
        name={TabScreenNames.suggestedTrees}
        component={SuggestedTreesScreen}
        options={{
          tabBarLabel: 'Info',
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? infoActiveIcon : infoIcon}
              fadeDuration={0}
              style={{ width: 23, height: 23 }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  )
}
