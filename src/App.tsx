import 'react-native-gesture-handler'

import React from 'react'

import { StatusBar } from 'react-native'
import { registerRootComponent, SplashScreen } from 'expo'
import { Provider as PaperProvider } from 'react-native-paper'
import * as firebase from 'firebase'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import { RegisterScreen } from './screens/RegisterScreen'
import { LoginScreen } from './screens/LoginScreen'
import { initializeFirebase } from './config/initializeFirebase'
import { ScreenNames } from './lib/navigation'
import { theme } from './styles/theme'
import { ResetPasswordScreen } from './screens/ResetPasswordScreen/ResetPasswordScreen'
import { LoggedTabNavigator } from './LoggedTabNavigator'
import { usePrevious } from './hooks/usePrevious'

initializeFirebase()

function useAuthStateChange(): { isUserLogged: boolean | null } {
  const [isUserLogged, setIsUserLogged] = React.useState<null | boolean>(null)

  React.useEffect(() => {
    firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() => {
        firebase.auth().onAuthStateChanged((user) => {
          if (!!user) {
            setIsUserLogged(true)
          } else {
            setIsUserLogged(false)
          }
        })
      })
  }, [])

  return { isUserLogged }
}

function useManageSplashScreen(isUserLogged: null | boolean) {
  React.useEffect(() => {
    SplashScreen.preventAutoHide()
  }, [])

  const prevIsUserLogged = usePrevious(isUserLogged)

  React.useEffect(() => {
    if (prevIsUserLogged === null && isUserLogged !== null) {
      SplashScreen.hide()
    }
  }, [isUserLogged])
}

const Stack = createStackNavigator()

export function App() {
  const { isUserLogged } = useAuthStateChange()
  useManageSplashScreen(isUserLogged)

  if (isUserLogged === null) {
    return null
  }

  return (
    <PaperProvider theme={theme}>
      <StatusBar barStyle="dark-content" />

      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerTintColor: '#000' }}>
          {isUserLogged ? (
            <Stack.Screen
              name={ScreenNames.loggedTabNavigator}
              component={LoggedTabNavigator}
              options={{ headerShown: false }}
            />
          ) : (
            <>
              <Stack.Screen
                name={ScreenNames.login}
                component={LoginScreen}
                options={{ headerShown: false }}
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
    </PaperProvider>
  )
}

// default export is required by expo
// eslint-disable-next-line import/no-default-export
export default registerRootComponent(App)
