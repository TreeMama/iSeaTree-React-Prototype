import React from 'react'

import { MaterialCommunityIcons, SimpleLineIcons } from '@expo/vector-icons'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import { useTheme } from 'react-native-paper'
import { Image } from 'react-native'

import { TabScreenNames } from './lib/navigation'
import { ProfileScreen } from './screens/ProfileScreen'
import { AddTreeScreen } from './screens/AddTreeScreen'
import { SuggestedTreesScreen } from './screens/SuggestedTreesScreen'
import { MapScreen } from './screens/MapScreen'

const Tab = createMaterialBottomTabNavigator()

const treeCameraIcon = require('../assets/tree_camera_inactive.png')
const treeCameraActiveIcon = require('../assets/tree_camera_active.png')
const infoIcon = require('../assets/info_tree.png')
const mapIcon = require('../assets/map_icon.png')

export function LoggedTabNavigator() {
  const theme = useTheme()

  return (
    <Tab.Navigator
      activeColor={theme.colors.primary}
      barStyle={{ paddingBottom: 8, backgroundColor: 'white' }}
      labeled
    >
      <Tab.Screen
        name={TabScreenNames.profile}
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account-circle" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name={TabScreenNames.mapScreen}
        component={MapScreen}
        options={{
          tabBarLabel: 'Explore',
          tabBarIcon: ({ color }) => (
            <Image
              source={mapIcon}
              fadeDuration={0}
              style={{ width: 26, height: 26, tintColor: color }}
            />
          ),
        }}
      />
      <Tab.Screen
        name={TabScreenNames.suggestedTrees}
        component={SuggestedTreesScreen}
        options={{
          tabBarLabel: 'Information',
          tabBarIcon: ({ color }) => (
            <Image
              source={infoIcon}
              fadeDuration={0}
              style={{ width: 26, height: 26, tintColor: color }}
            />
          ),
        }}
      />
      <Tab.Screen
        name={TabScreenNames.addTree}
        component={AddTreeScreen}
        options={{
          tabBarLabel: 'Add new',
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? treeCameraActiveIcon : treeCameraIcon}
              fadeDuration={0}
              style={{ width: 30, height: 30 }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  )
}
