import React from 'react'

import { Platform, StatusBar as RNStatusBar, View } from 'react-native'
import Constants from 'expo-constants'

interface StatusBarProps {
  backgroundColor: string
  isHidden: boolean
}

StatusBar.defaultProps = {
  isHidden: false,
  backgroundColor: 'red',
  // backgroundColor: '#fff',
}

const STATUSBAR_HEIGHT = Constants.statusBarHeight

export const STATUSBAR_PADDING = Platform.OS === 'ios' ? Constants.statusBarHeight : 0

export function StatusBar(props: StatusBarProps) {
  return (
    <View style={{ height: STATUSBAR_HEIGHT, backgroundColor: props.backgroundColor }}>
      <RNStatusBar hidden={props.isHidden} translucent={false} backgroundColor={'green'} />
    </View>
  )
}
