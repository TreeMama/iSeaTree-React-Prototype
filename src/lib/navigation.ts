import { useNavigation } from '@react-navigation/native'

export enum ScreenNames {
  login = 'login',
  register = 'register',
  resetPassword = 'resetPassword',
  loggedTabNavigator = 'loggedTabNavigator',
  showImage = 'showImage',
  identifySpecies = 'identifySpecies'
}

export enum TabScreenNames {
  profile = 'profile',
  addTree = 'addTree',
  suggestedTrees = 'suggestedTrees',
  mapScreen = 'mapScreen',
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
    showImage: () => {
      navigation.navigate(ScreenNames.showImage)
    },
    identifySpecies: () => {
      navigation.navigate(ScreenNames.identifySpecies)
    },
  }
}

export function useTabNavigationActions(): TabNavigationActions {
  const navigation = useNavigation()

  return {
    profile: () => {
      navigation.navigate(TabScreenNames.profile)
    },
    addTree: () => {
      navigation.navigate(TabScreenNames.addTree)
    },
    suggestedTrees: () => {
      navigation.navigate(TabScreenNames.suggestedTrees)
    },
    mapScreen: () => {
      navigation.navigate(TabScreenNames.mapScreen)
    },
  }
}
