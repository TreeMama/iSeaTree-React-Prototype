import { DefaultTheme, Theme } from 'react-native-paper'

// https://tailwindcss.com/docs/customizing-colors#default-color-palette
const colors = {
  green: {
    '700': '#2F855A',
  },
  purple: {
    '700': '#6B46C1',
  },
}

export const theme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.green[700],
    accent: colors.purple[700],
  },
}
