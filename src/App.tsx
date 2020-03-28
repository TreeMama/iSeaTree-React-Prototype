import 'react-native-gesture-handler'

import React from 'react'

import { registerRootComponent, SplashScreen } from 'expo'
import { Provider as PaperProvider } from 'react-native-paper'
import * as firebase from 'firebase'

import { RegisterScreen } from './screens/RegisterScreen'
import { initializeFirebase } from './config/initializeFirebase'

initializeFirebase()

function useAuthStateChange(): void {
  React.useEffect(() => {
    firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() => {
        firebase.auth().onAuthStateChanged((user) => {
          SplashScreen.hide()

          if (!!user) {
            console.log('user is logged:', user)
          } else {
            console.log('user is not logged')
          }
        })
      })
  }, [])
}

function usePreventSplashHideout() {
  React.useEffect(() => {
    SplashScreen.preventAutoHide()
  }, [])
}

export function App() {
  useAuthStateChange()
  usePreventSplashHideout()

  return (
    <PaperProvider>
      <RegisterScreen />
    </PaperProvider>
  )
}

// default export is required by expo
// eslint-disable-next-line import/no-default-export
export default registerRootComponent(App)
