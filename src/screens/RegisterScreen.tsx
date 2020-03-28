import React from 'react'

import { StyleSheet, View } from 'react-native'
import { Banner, Button } from 'react-native-paper'
import * as firebase from 'firebase'

import { AuthForm } from '../components/AuthForm'
import { useNavigationActions } from '../lib/navigation'
import { setUser } from '../lib/firebaseServices'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    padding: 20,
  },
  content: {
    flex: 1,
    paddingTop: 50,
  },
})

export function RegisterScreen() {
  const [errorMessage, setErrorMessage] = React.useState<null | string>(null)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const navigationActions = useNavigationActions()

  function handleRegister({ email, password }: { email: string; password: string }) {
    setIsLoading(true)
    setErrorMessage(null)

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        setIsLoading(false)
        setUser({ uid: result.user.uid, email })
      })
      .catch((error) => {
        setIsLoading(false)
        const errorMEssage = !!error.message
          ? error.message
          : 'There was an unexpected error. Please try again later.'

        setErrorMessage(errorMEssage)
      })
  }

  return (
    <View style={styles.container}>
      <Banner
        visible={!!errorMessage}
        actions={[{ label: 'OK', onPress: () => setErrorMessage(null) }]}
      >
        {errorMessage}
      </Banner>

      <View style={styles.content}>
        <AuthForm
          headlineText="Create new account"
          submitText="Register"
          onSubmit={handleRegister}
          isLoading={isLoading}
        />
      </View>

      <Button style={{ marginTop: 10, marginBottom: 20 }} onPress={navigationActions.login}>
        log in to your account
      </Button>
    </View>
  )
}
