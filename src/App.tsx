import React from 'react'

import { StyleSheet, View } from 'react-native'
import { registerRootComponent } from 'expo'
import { Provider as PaperProvider, Button } from 'react-native-paper'

import * as Google from 'expo-google-app-auth'
import { envVariables } from '../envVariables'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export function App() {
  async function handleGoogleLogin() {
    try {
      const result = await Google.logInAsync({
        androidClientId: envVariables.OAUTH_ANDROID_CLIENT_ID,
        scopes: ['profile', 'email'],
      })
      console.log(result)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Button onPress={handleGoogleLogin}>Login with Google!</Button>
      </View>
    </PaperProvider>
  )
}

// default export is required by expo
// eslint-disable-next-line import/no-default-export
export default registerRootComponent(App)
