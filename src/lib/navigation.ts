import { useNavigation } from '@react-navigation/native'

export enum ScreenNames {
  login = 'login',
  register = 'register',
  resetPassword = 'resetPassword',
  loggedTabNavigator = 'loggedTabNavigator',
}

export enum TabScreenNames {
  dashboard = 'dashboard',
  addTree = 'addTree',
}

type NavigationActions = { [key in ScreenNames]: () => void }
type TabNavigationActions = { [key in TabScreenNames]: () => void }

export function useNavigationActions(): NavigationActions {
  const navigation = useNavigation()

  return {
    login: () => {
      navigation.navigate(ScreenNames.login)
    },
    register: () => {
      navigation.navigate(ScreenNames.register)
    },
    loggedTabNavigator: () => {
      navigation.navigate(ScreenNames.loggedTabNavigator)
    },
    resetPassword: () => {
      navigation.navigate(ScreenNames.resetPassword)
    },
  }
}

export function useTabNavigationActions(): TabNavigationActions {
  const navigation = useNavigation()

  return {
    dashboard: () => {
      navigation.navigate(TabScreenNames.dashboard)
    },
    addTree: () => {
      navigation.navigate(TabScreenNames.addTree)
    },
  }
}
