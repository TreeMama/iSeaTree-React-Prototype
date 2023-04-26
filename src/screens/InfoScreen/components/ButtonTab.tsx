/* This is a TypeScript React component that renders a button tab with two options: "Genus" and
"Species". The component takes in two props: `activeTab` and `setActiveTab`, which are used to
determine which tab is currently active and to update the active tab respectively. The component
uses `TouchableOpacity` and `Text` components from `react-native` and `react-native-paper` libraries
respectively to render the tab options. The `styles` object is imported from a separate file and
used to style the component. */

import React from 'react'
import { Dimensions, TouchableOpacity, View } from 'react-native'
import { Text } from 'react-native-paper'
import { styles } from '../styles'

/**
 * The Button Tab at the top of Info screen containing Genus | Species.
 * @param props
 */
export const ButtonTab = (props: {
  activeTab: string
  setActiveTab: React.Dispatch<React.SetStateAction<string>>
}) => {
  const activeBackgroundColor = '#287B51'
  const inactiveBackgroundColor = 'white'
  const activeTextColor = 'white'
  const inactiveTextColor = '#62717A'
  const switchTab = () => {
    props.setActiveTab(props.activeTab == 'Genus' ? 'Species' : 'Genus')
  }
  return (
    <View style={styles.buttonTab}>
      <TouchableOpacity
        style={{
          width: '50%',
          backgroundColor:
            props.activeTab == 'Genus' ? activeBackgroundColor : inactiveBackgroundColor,
          borderBottomLeftRadius: 6,
          borderTopLeftRadius: 6,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => switchTab()}
      >
        {/* @ts-ignore: skip props */}
        <Text
          numberOfLines={1}
          style={{ color: props.activeTab == 'Genus' ? activeTextColor : inactiveTextColor }}
        >
          {'Genus'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          width: '50%',
          backgroundColor:
            props.activeTab == 'Species' ? activeBackgroundColor : inactiveBackgroundColor,
          borderBottomRightRadius: 6,
          borderTopRightRadius: 6,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => switchTab()}
      >
        {/* @ts-ignore: skip props */}
        <Text
          numberOfLines={1}
          style={{ color: props.activeTab == 'Species' ? activeTextColor : inactiveTextColor }}
        >
          {'Species'}
        </Text>
      </TouchableOpacity>
    </View>
  )
}
