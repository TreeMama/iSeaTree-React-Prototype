import 'react-native-gesture-handler'

import React from 'react'

import { registerRootComponent } from 'expo'
import { ActivityIndicator, Provider as PaperProvider } from 'react-native-paper'
import * as firebase from 'firebase'

import { RegisterScreen } from './screens/RegisterScreen'
import { initializeFirebase } from './config/initializeFirebase'

initializeFirebase()

function useAuthStateChange(): { isAuthLoading: boolean } {
  const [isAuthLoading, setIsAuthLoading] = React.useState<boolean>(true)

  React.useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      setIsAuthLoading(false)

      if (!!user) {
        console.log('user is logged:', user)
      } else {
        console.log('user is not logged')
      }
    })
  }, [])

  return { isAuthLoading }
}

export function App() {
  const { isAuthLoading } = useAuthStateChange()

  return (
    <PaperProvider>
      {/* Instead of ActivityIndicator there could be a splash screen */}
      <ActivityIndicator animating={isAuthLoading} size="large" style={{ marginTop: 100 }} />

      {!isAuthLoading && <RegisterScreen />}
    </PaperProvider>
  )
}

// default export is required by expo
// eslint-disable-next-line import/no-default-export
export default registerRootComponent(App)
