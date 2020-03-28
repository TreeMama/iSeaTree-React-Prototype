import 'react-native-gesture-handler'

import React from 'react'

import { registerRootComponent, SplashScreen } from 'expo'
import { Provider as PaperProvider } from 'react-native-paper'
import * as firebase from 'firebase'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import { RegisterScreen } from './screens/RegisterScreen'
import { initializeFirebase } from './config/initializeFirebase'
import { DashboardScreen } from './screens/DashboardScreen'

initializeFirebase()

function useAuthStateChange(): { isUserLogged: boolean } {
  const [isUserLogged, setIsUserLogged] = React.useState<boolean>(false)

  React.useEffect(() => {
    firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() => {
        firebase.auth().onAuthStateChanged((user) => {
          SplashScreen.hide()

          if (!!user) {
            setIsUserLogged(true)
          }
        })
      })
  }, [])

  return { isUserLogged }
}

function usePreventSplashHideout() {
  React.useEffect(() => {
    SplashScreen.preventAutoHide()
  }, [])
}

const Stack = createStackNavigator()

enum ScreenNames {
  register = 'Register',
  dashboard = 'Dashboard',
}

export function App() {
  usePreventSplashHideout()
  const { isUserLogged } = useAuthStateChange()

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator>
          {isUserLogged ? (
            <Stack.Screen
              name={ScreenNames.dashboard}
              component={DashboardScreen}
              options={{ headerShown: false }}
            />
          ) : (
            <Stack.Screen
              name={ScreenNames.register}
              component={RegisterScreen}
              options={{ headerShown: false }}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  )
}

// default export is required by expo
// eslint-disable-next-line import/no-default-export
export default registerRootComponent(App)
