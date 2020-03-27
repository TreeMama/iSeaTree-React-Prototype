import React from 'react'

import { StyleSheet, View } from 'react-native'
import { Banner } from 'react-native-paper'

import { AuthForm } from '../components/AuthForm'
import { registerUser } from '../lib/authentication'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    padding: 20,
  },
})

export function RegisterScreen() {
  const [errorMessage, setErrorMessage] = React.useState<null | string>(null)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  function handleRegister({ email, password }: { email: string; password: string }) {
    setIsLoading(true)
    setErrorMessage(null)

    registerUser({ email, password })
      .then(() => {
        setIsLoading(false)
        console.log('Registered....')
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
    </View>
  )
}
