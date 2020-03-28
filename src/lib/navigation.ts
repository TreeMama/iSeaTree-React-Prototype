import { useNavigation } from '@react-navigation/native'

export enum ScreenNames {
  login = 'login',
  register = 'register',
  dashboard = 'dashboard',
}

type NavigationActions = { [key in ScreenNames]: () => void }

export function useNavigationActions(): NavigationActions {
  const navigation = useNavigation()

  return {
    login: () => {
      navigation.navigate(ScreenNames.login)
    },
    register: () => {
      navigation.navigate(ScreenNames.register)
    },
    dashboard: () => {
      navigation.navigate(ScreenNames.dashboard)
    },
  }
}
