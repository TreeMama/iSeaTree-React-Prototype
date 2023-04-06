/**
 * This TypeScript code defines navigation actions for different screens and tabs using React
 * Navigation.
 * @property [: undefined] - It seems like the code snippet is written in TypeScript and it defines two
 * sets of enums and two custom hooks that return navigation actions for the specified screens and
 * tabs. The `ScreenNames` enum lists the names of all the screens in the app, while the
 * `TabScreenNames` enum lists the names
 */
import { useNavigation } from '@react-navigation/native'

export enum ScreenNames {
  login = 'login',
  register = 'register',
  resetPassword = 'resetPassword',
  loggedTabNavigator = 'loggedTabNavigator',
  showImage = 'showImage',
  identifySpecies = 'identifySpecies',
  tutorial = 'tutorial'
}

export enum TabScreenNames {
  profile = 'profile',
  addTree = 'addTree',
  // legacy tree info page
  suggestedTrees = 'suggestedTrees',
  infoScreen = 'infoScreen',
  mapScreen = 'mapScreen',
  challengeScreen = 'challengeScreen',
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
    tutorial: () => {
      navigation.navigate(ScreenNames.tutorial)
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
      navigation.navigate(TabScreenNames.infoScreen)   // legacy tree info page
    },
    infoScreen: () => {
      navigation.navigate(TabScreenNames.infoScreen)
    },
    mapScreen: () => {
      navigation.navigate(TabScreenNames.mapScreen)
    },
    challengeScreen: () => {
      navigation.navigate(TabScreenNames.challengeScreen)
    }
  }
}
