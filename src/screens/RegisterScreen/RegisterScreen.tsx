import React from 'react'

import { StyleSheet, View, ScrollView, Linking } from 'react-native'
import { Banner, Button, Paragraph, Text } from 'react-native-paper'
import * as firebase from 'firebase'

import { StatusBar } from '../../components/StatusBar'
import { useNavigationActions } from '../../lib/navigation'
import { setUser } from '../../lib/firebaseServices'
import { RegisterForm } from './RegisterForm'

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
  },
})

const treemamaUrl = 'https://treemama.org'

export function RegisterScreen() {
  const [errorMessage, setErrorMessage] = React.useState<null | string>(null)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const navigationActions = useNavigationActions()

  function handleRegister({
    username,
    email,
    password,
  }: {
    username: string
    email: string
    password: string
  }) {
    setIsLoading(true)
    setErrorMessage(null)

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        setIsLoading(false)

        if (!!result.user) {
          setUser({ uid: result.user.uid, email, username })
        } else {
          setErrorMessage('There was an unexpected error (RegisterScreen::setUser). Please try again later.')
        }
      })
      .catch((error) => {
        setIsLoading(false)
        const errorMEssage = !!error.message
          ? error.message
          : 'There was an unexpected error (RegisterScreen::setIsLoading). Please try again later.'

        setErrorMessage(errorMEssage)
      })
  }

  async function openTreemamaWebsite() {
    const canOpen: boolean = await Linking.canOpenURL(treemamaUrl)

    if (!canOpen) {
      return
    }

    Linking.openURL(treemamaUrl)
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar />

      <View style={styles.content}>
        <Banner
          visible={!!errorMessage}
          actions={[{ label: 'OK', onPress: () => setErrorMessage(null) }]}
        >
          {errorMessage ? errorMessage : ''}
        </Banner>

        <RegisterForm
          headlineText="Create new account"
          submitText="Register"
          onSubmit={handleRegister}
          isLoading={isLoading}
        />

        <Button style={{ marginTop: 20, marginBottom: 20 }} onPress={navigationActions.login}>
          log in to your account
        </Button>

        <Paragraph>
          <Text style={{ fontWeight: 'bold' }}>iSeaTree</Text> v.1 is a prototype application
          designed by{' '}
          <Text
            style={{ fontWeight: 'bold', textDecorationLine: 'underline' }}
            onPress={openTreemamaWebsite}
          >
            treemama.org
          </Text>{' '}
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
