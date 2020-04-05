import React from 'react'

import { MaterialCommunityIcons } from '@expo/vector-icons'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import { useTheme } from 'react-native-paper'

import { TabScreenNames } from './lib/navigation'
import { ProfileScreen } from './screens/ProfileScreen'
import { AddTreeScreen } from './screens/AddTreeScreen/AddTreeScreen'

const Tab = createMaterialBottomTabNavigator()

export function LoggedTabNavigator() {
  const theme = useTheme()

  return (
    <Tab.Navigator
      activeColor={theme.colors.primary}
      barStyle={{ paddingBottom: 5, backgroundColor: 'white' }}
    >
      <Tab.Screen
        name={TabScreenNames.profile}
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name={TabScreenNames.addTree}
        component={AddTreeScreen}
        options={{
          tabBarLabel: 'Add new',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="plus" color={color} size={26} />,
        }}
      />
    </Tab.Navigator>
  )
}
