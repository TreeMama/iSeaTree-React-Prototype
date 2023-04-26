/**
 * This TypeScript code defines navigation actions for different screens and tabs using React
 * Navigation.
 * @property [: undefined] - It seems like the code snippet is written in TypeScript and it defines two
 * sets of enums and two custom hooks that return navigation actions for the specified screens and
 * tabs. The `ScreenNames` enum lists the names of all the screens in the app, while the
 * `TabScreenNames` enum lists the names
 */
import { useNavigation } from '@react-navigation/native'

/* This code defines an enum called `ScreenNames` using the `export` keyword, which means it can be
accessed from other modules. The enum lists the names of all the screens in the app, with each
screen name assigned a string value. This enum is used to define the `NavigationActions` type, which
is a type that maps each screen name to a function that navigates to that screen. */

export enum ScreenNames {
  login = 'login',
  register = 'register',
  resetPassword = 'resetPassword',
  loggedTabNavigator = 'loggedTabNavigator',
  showImage = 'showImage',
  identifySpecies = 'identifySpecies',
  tutorial = 'tutorial'
}

/* The `export enum TabScreenNames` is defining an enum in TypeScript that lists the names of different
screens within a tab navigator in the app. Each screen name is assigned a string value. This enum is
used to define the `TabNavigationActions` type, which is a type that maps each screen name to a
function that navigates to that screen. The `export` keyword means that this enum can be accessed
from other modules. */

export enum TabScreenNames {
  profile = 'profile',
  addTree = 'addTree',
  // legacy tree info page
  suggestedTrees = 'suggestedTrees',
  infoScreen = 'infoScreen',
  mapScreen = 'mapScreen',
  challengeScreen = 'challengeScreen',
}

/**
 * The above type defines two objects that map screen names to functions for navigation in TypeScript.
 * @property [: undefined] - The above code defines two types: `NavigationActions` and
 * `TabNavigationActions`.
 */


/**
 * The type NavigationActions is an object with keys of ScreenNames and values of functions that take
 * no arguments and return void.
 * @property [: undefined] - The above code defines a type `NavigationActions` which is an object with
 * keys of type `ScreenNames` and values of type function that takes no arguments and returns void.
 * However, since `ScreenNames` is not defined in the code snippet, its type is undefined.
 */
type NavigationActions = { [key in ScreenNames]: () => void }


/**
 * The type `TabNavigationActions` is an object with keys of `TabScreenNames` and values of functions
 * that take no arguments and return nothing.
 * @property [: undefined] - The above code defines a type `TabNavigationActions` which is an object
 * with keys of type `TabScreenNames` (presumably a string literal union type representing the names of
 * screens in a tab navigator) and values of type `() => void` (a function that takes no arguments and
 * returns
 */
type TabNavigationActions = { [key in TabScreenNames]: () => void }

/**
 * This function returns an object with navigation actions for different screens in a mobile app.
 * @returns A JavaScript object with several functions that navigate to different screens in a mobile
 * app using the `useNavigation` hook from the React Navigation library. The returned object is of type
 * `NavigationActions`.
 */

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

/**
 * This function returns an object with methods that navigate to different screens in a tab navigation
 * using React Navigation.
 * @returns A JavaScript object with functions that navigate to different screens in the app. The
 * object is of type `TabNavigationActions`.
 */

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
