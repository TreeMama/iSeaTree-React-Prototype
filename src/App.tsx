/**
 * This is the main App component for a React Native app that handles authentication, navigation, and
 * rendering different screens based on user login status.
 * @returns The App component wrapped in a PaperProvider and other context providers, with a
 * NavigationContainer and a StackNavigator. The StackNavigator conditionally renders screens based on
 * whether the user is logged in or not. The component also uses various hooks to manage the splash
 * screen, check if the user has seen the app intro, and manage the app version. Finally, the component
 * returns a TipProvider component for displaying tips
 */
import 'react-native-gesture-handler'

import React from 'react'

import { StatusBar } from 'react-native'
import { registerRootComponent } from 'expo'
import * as SplashScreen from 'expo-splash-screen'
import { Provider as PaperProvider } from 'react-native-paper'
import auth, { firebase } from '@react-native-firebase/auth'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import { RegisterScreen } from './screens/RegisterScreen'
import { LoginScreen } from './screens/LoginScreen'
import { ShowImage } from './screens/ShowImage'
import { IdentifySpecies } from './screens/IdentifySpecies'
/* `import { ScreenNames } from './lib/navigation'` is importing an object `ScreenNames` from a file
located at `./lib/navigation`. This object likely contains string constants that represent the names
of different screens in the app, which are used as keys in the `Stack.Navigator` component to
navigate between screens. By importing this object, the component can reference these screen names
without having to hard-code them as strings, which can help prevent errors and make the code more
maintainable. */
import { ScreenNames } from './lib/navigation'
import { theme } from './styles/theme'
import { ResetPasswordScreen } from './screens/ResetPasswordScreen/ResetPasswordScreen'
import { LoggedTabNavigator } from './LoggedTabNavigator'
import { usePrevious } from './hooks/usePrevious'
import { LocationProvider } from './LocationContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Constants from 'expo-constants'
import DeviceInfo from 'react-native-device-info'
import TipProvider from 'react-native-tip'
import AppIntroScreen from './screens/AppIntroScreen/index'

/* `console.disableYellowBox = true` is disabling the yellow box warning messages that can appear in
the console when running a React Native app. These warnings can be helpful for debugging, but can
also be distracting or irrelevant in some cases. By setting this property to `true`, the yellow box
warnings will be suppressed. */
console.disableYellowBox = true

/**
 * This function uses React hooks to track changes in the authentication state of a user and returns a
 * boolean value indicating whether the user is logged in or not.
 * @returns an object with a single property `isUserLogged`, which is a boolean or null value. The
 * value of `isUserLogged` is determined by the `onAuthStateChanged` event listener from the Firebase
 * authentication library. If a user is logged in, `isUserLogged` will be set to `true`, if not, it
 * will be set to `false`. If the
 */
function useAuthStateChange(): { isUserLogged: boolean | null } {
  const [isUserLogged, setIsUserLogged] = React.useState<null | boolean>(null)

  React.useEffect(() => {
    auth().onAuthStateChanged((user) => {
      if (!!user) {
        setIsUserLogged(true)
      } else {
        setIsUserLogged(false)
      }
    })
  }, [])

  return { isUserLogged }
}

/**
 * This function manages the splash screen in a TypeScript React app based on the user's login status.
 * @param {null | boolean} isUserLogged - A nullable boolean value that indicates whether the user is
 * logged in or not. If it is null, it means that the user's authentication status is not yet
 * determined.
 */
function useManageSplashScreen(isUserLogged: null | boolean) {
  React.useEffect(() => {
    // SplashScreen.preventAutoHide()
    SplashScreen.preventAutoHideAsync()
  }, [])

  const prevIsUserLogged = usePrevious(isUserLogged)

  React.useEffect(() => {
    if (prevIsUserLogged === null && isUserLogged !== null) {
      // SplashScreen.hide()
      SplashScreen.hideAsync()
    }
  }, [isUserLogged])
}

/* `const Stack = createStackNavigator()` is creating a new stack navigator object using the
`createStackNavigator` function from the `@react-navigation/stack` library. This stack navigator
will be used to manage the navigation between different screens in the app. The `Stack` constant is
used to reference this navigator object throughout the component. */
const Stack = createStackNavigator()

/**
 * This is the main component of a React Native app that handles authentication, navigation, and
 * displaying different screens based on user login status.
 * @param savedVersion - The saved version of the app, which is retrieved from AsyncStorage.
 * @param currentVersion - The `currentVersion` parameter is a string representing the current version
 * number of the app. It is used in the `versionChanged` function to compare with the saved version
 * number and determine if the app version has changed.
 * @returns The App component is being returned, which contains the navigation stack and screens for
 * the app, as well as providers for the Paper theme and location. The component also checks for the
 * user's authentication state and whether to show the app introduction screen.
*/

// eslint-disable-next-line import/no-default-export
export default function App() {
  const { isUserLogged } = useAuthStateChange()
  const [isShowIntro, setisShowIntro] = React.useState<null | boolean>(null)

  useManageSplashScreen(isUserLogged)

  const apps = firebase.apps
  apps.forEach((app) => {
    console.log('app name +++', app)
  })

  async function versionChanged(savedVersion, currentVersion) {
    if (savedVersion === currentVersion) {
      return false
    } else {
      return true
    }
  }

  async function checkIntro() {
    const isShowIntro = await AsyncStorage.getItem('FIRST_TIME_OPEN_APP')
    const savedAppversion = await AsyncStorage.getItem('APP_VERSION')
    const parseisShowIntro = JSON.parse(isShowIntro)
    const parsesavedAppversion = JSON.parse(savedAppversion)
    const currentVersionNum = DeviceInfo.getVersion()

    const isVersionChanged = await versionChanged(parsesavedAppversion, currentVersionNum)

    if (parseisShowIntro) {
      if (isVersionChanged) {
        setisShowIntro(true)
      } else {
        setisShowIntro(false)
      }
    } else {
      setisShowIntro(true)
    }
  }

  React.useEffect(() => {
    checkIntro()
  }, [isUserLogged])

  if (isUserLogged == null || isShowIntro == null) {
    return null
  }

  return (
    <PaperProvider theme={theme}>
      <StatusBar barStyle="dark-content" />
      <LocationProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerTintColor: '#000' }}>
            {isUserLogged ? (
              <>
                <Stack.Screen
                  name={ScreenNames.loggedTabNavigator}
                  component={LoggedTabNavigator}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name={ScreenNames.showImage}
                  component={ShowImage}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name={ScreenNames.identifySpecies}
                  component={IdentifySpecies}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name={ScreenNames.tutorial}
                  component={AppIntroScreen}
                  options={{ headerShown: false }}
                />
              </>
            ) : (
              <>
                <Stack.Screen
                  name={ScreenNames.login}
                  component={LoginScreen}
                  options={{ headerShown: false }}
                  initialParams={{ isShowIntro: isShowIntro }}
                />
                <Stack.Screen
                  name={ScreenNames.register}
                  component={RegisterScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name={ScreenNames.resetPassword}
                  component={ResetPasswordScreen}
                  options={{ title: 'Password reset' }}
                />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
        <TipProvider
          overlayOpacity={0.5}
          titleStyle={{
            fontWeight: 'bold',
            fontSize: 13,
            marginBottom: 10,
          }}
          bodyStyle={{
            fontSize: 13,
          }}
          tipContainerStyle={{
            padding: 15,
            borderRadius: 15,
            maxWidth: 350,
            elevation: 5,
          }}
          // darkMode={isDarkMode}
          prevNextTextStyle={{}}
          prevNextButtonStyle={{}}
        />
      </LocationProvider>
    </PaperProvider>
  )
}

// default export is required by expo
// eslint-disable-next-line import/no-default-export
// export default registerRootComponent(App)
