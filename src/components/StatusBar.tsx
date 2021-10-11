import React from 'react'

import { Platform, StatusBar as RNStatusBar, View } from 'react-native'
import Constants from 'expo-constants'
import theme from '../styles/theme';

interface StatusBarProps {
  backgroundColor: string
  isHidden: boolean
}

StatusBar.defaultProps = {
  isHidden: false,
  backgroundColor: '#fff',
}

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? Constants.statusBarHeight : 0

export function StatusBar(props: StatusBarProps) {
  return (
    <View style={{ height: STATUSBAR_HEIGHT, backgroundColor: props.backgroundColor }}>
      <RNStatusBar
        hidden={props.isHidden}
        translucent={false}
        backgroundColor={props.backgroundColor}
      />
    </View>
  )
}
