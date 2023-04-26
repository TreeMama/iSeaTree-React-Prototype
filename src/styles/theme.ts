/* This code is importing two modules: `DefaultTheme` and `Theme` from the `react-native-paper`
library, and `getStatusBarHeight` from the `react-native-status-bar-height` library. It is also
defining a `colors` object with various color values, a `StatusBarHeight` constant that gets the
height of the device's status bar, and a `theme` object that extends the `DefaultTheme` and
overrides the `primary` and `accent` colors with values from the `colors` object. This code is used
to customize the theme and color palette of a React Native app. */

import { DefaultTheme, Theme } from 'react-native-paper'
import { getStatusBarHeight } from 'react-native-status-bar-height';

// https://tailwindcss.com/docs/customizing-colors#default-color-palette
/* `export const colors` is defining an object that contains various color values organized by color
name and shade. The color values are represented as hexadecimal color codes. This object can be
imported and used in other parts of the code to apply consistent color styling throughout the app. */
export const colors = {
  green: {
    100: '#F0FFF4',
    700: '#2F855A',
    900: '#22543D',
  },
  purple: {
    '700': '#6B46C1',
  },
  gray: {
    100: '#F7FAFC',
    200: '#EDF2F7',
    300: '#E2E8F0',
    400: '#CBD5E0',
    500: '#A0AEC0',
    600: '#718096',
    700: '#4A5568',
  },
}

/* `export const StatusBarHeight = getStatusBarHeight();` is defining a constant variable
`StatusBarHeight` that is exported and can be used in other parts of the code. It is using the
`getStatusBarHeight` function from the `react-native-status-bar-height` library to get the height of
the device's status bar and assigning that value to the `StatusBarHeight` constant. This value can
be used to adjust the layout of the app to avoid overlapping with the status bar. */
export const StatusBarHeight = getStatusBarHeight();

/* This code is defining a `theme` object that extends the `DefaultTheme` object from the
`react-native-paper` library. It overrides the `primary` and `accent` colors with values from the
`colors` object defined earlier in the code. The `...` syntax is used to spread the properties of
the `DefaultTheme` object and the `DefaultTheme.colors` object into the new `theme` object, and then
the `primary` and `accent` colors are overridden with the specified values from the `colors` object.
This `theme` object can be used to customize the color palette of a React Native app. */
export const theme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.green[700],
    accent: colors.purple[700],
  },
}
