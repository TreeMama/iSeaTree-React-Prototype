import React from 'react'

import { StyleSheet, View, ScrollView } from 'react-native'
import { Banner, Button, Paragraph, Text } from 'react-native-paper'
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

        if (!!result.user) {
          setUser({ uid: result.user.uid, email })
        } else {
          setErrorMessage('There was an unexpected error. Please try again later.')
        }
      })
      .catch((error) => {
        console.log('error: ', error)

        setIsLoading(false)
        const errorMEssage = !!error.message
          ? error.message
          : 'There was an unexpected error. Please try again later.'

        setErrorMessage(errorMEssage)
      })
  }

  return (
    <ScrollView style={styles.container}>
      <Banner
        visible={!!errorMessage}
        actions={[{ label: 'OK', onPress: () => setErrorMessage(null) }]}
      >
        {errorMessage ? errorMessage : ''}
      </Banner>

      <View style={styles.content}>
        <AuthForm
          headlineText="Create new account"
          submitText="Register"
          onSubmit={handleRegister}
          isLoading={isLoading}
        />

        <Button style={{ marginTop: 20, marginBottom: 20 }} onPress={navigationActions.login}>
          log in to your account
        </Button>

        <Paragraph style={{ fontSize: 12 }}>
          <Text style={{ fontWeight: 'bold' }}>iSeaTree</Text> v.1 is a prototype application
          designed by{' '}
          <Text style={{ fontWeight: 'bold', textDecorationLine: 'underline' }}>treemama.org</Text>{' '}
          and Copyrighted ©2020 by project contributors. Please ALWAYS exercise caution and
          awareness of your surroundings when surveying and measuring trees. The iSeaTree project
          takes no personal responsibility for improper harm made when surveying a tree, and
          expressly requests that any surveying taking place ONLY be done on public property or at
          sites where the private landowner has given express permission to the surveyor.
        </Paragraph>
      </View>
    </ScrollView>
  )
}
