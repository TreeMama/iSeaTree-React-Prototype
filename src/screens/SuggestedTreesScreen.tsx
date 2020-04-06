import React from 'react'

import { View } from 'react-native'
import { Title, Text } from 'react-native-paper'
import Constants from 'expo-constants'

interface SuggestedTreesScreenProps {}

export function SuggestedTreesScreen(props: SuggestedTreesScreenProps) {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: Constants.statusBarHeight + 10 }}>
      <Title>SuggestedTreesScreen</Title>

      <Text>TODO: how to scroll between species</Text>
      <Text>TODO: how to scroll between images</Text>
    </View>
  )
}
