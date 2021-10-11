import { DefaultTheme, Theme } from 'react-native-paper'
import { getStatusBarHeight } from 'react-native-status-bar-height';

// https://tailwindcss.com/docs/customizing-colors#default-color-palette
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

export const StatusBarHeight = getStatusBarHeight();

export const theme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.green[700],
    accent: colors.purple[700],
  },
}
