/**
 * This is a TypeScript React component that renders a status bar with customizable background color
 * and visibility.
 * @param {StatusBarProps} props - `props` is an object that contains the props passed to the
 * `StatusBar` component. The props are defined by the `StatusBarProps` interface, which specifies that
 * the component expects two props: `backgroundColor` and `isHidden`. These props are used to set the
 * background color and visibility of the
 * @returns The `StatusBar` component is being returned. It takes in two props: `backgroundColor` and
 * `isHidden`, both of which are optional and have default values if not provided. The component
 * renders a `View` with a height equal to the device's status bar height and a background color
 * specified by the `backgroundColor` prop. Inside the `View`, the `RNStatusBar` component is rendered
 * with
 */
import React from 'react'

import { Platform, StatusBar as RNStatusBar, View } from 'react-native'
import Constants from 'expo-constants'
import theme from '../styles/theme';

/* The `interface StatusBarProps` is defining the type of props that the `StatusBar` component expects
to receive. It specifies that the component expects two props: `backgroundColor` which is a string
representing the background color of the status bar, and `isHidden` which is a boolean indicating
whether the status bar should be hidden or not. By defining this interface, the component can ensure
that it receives the correct props and can use them appropriately. */

interface StatusBarProps {
  backgroundColor: string
  isHidden: boolean
}

/* `StatusBar.defaultProps` is setting default values for the `isHidden` and `backgroundColor` props of
the `StatusBar` component. If these props are not passed in when the component is used, they will
default to `false` for `isHidden` and `'#fff'` for `backgroundColor`. This ensures that the
component will still render correctly even if these props are not provided. */
StatusBar.defaultProps = {
  isHidden: false,
  backgroundColor: '#fff',
}

/* `const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? Constants.statusBarHeight : 0` is setting the
height of the status bar based on the platform the app is running on. If the platform is iOS, it
sets the height to the value of `Constants.statusBarHeight`, which is a constant provided by the
`expo-constants` library that represents the height of the status bar on iOS devices. If the
platform is not iOS, it sets the height to 0. This ensures that the `View` component that contains
the `RNStatusBar` component has the correct height to match the height of the status bar on iOS
devices, while not affecting the layout on other platforms. */
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? Constants.statusBarHeight : 0

/**
 * This is a TypeScript React function that renders a status bar with customizable background color and
 * visibility.
 * @param {StatusBarProps} props - The `props` parameter is an object that contains the properties
 * passed to the `StatusBar` component. These properties include:
 * @returns A functional component named `StatusBar` is being returned. It takes in a `StatusBarProps`
 * object as its parameter and returns a `View` component that contains a `RNStatusBar` component. The
 * `View` component has a height of `STATUSBAR_HEIGHT` and a background color that is passed in as a
 * prop. The `RNStatusBar` component has its `hidden`, `translucent`,
 */
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
