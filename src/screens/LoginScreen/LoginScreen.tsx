import React, { useEffect } from 'react'

import { StyleSheet, View, ScrollView } from 'react-native'
import { Banner, Button } from 'react-native-paper'
import auth from '@react-native-firebase/auth';
import { LoginForm } from './LoginForm'
import { useNavigationActions } from '../../lib/navigation'

import AppIntroScreen from '../AppIntroScreen';
import { StatusBar } from '../../components/StatusBar'

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

export function LoginScreen(props) {
  const [errorMessage, setErrorMessage] = React.useState<null | string>(null)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const navigationActions = useNavigationActions();
  const { isShowIntro } = props.route.params;
  const [isSliderVisible, setIsSliderVisible] = React.useState<boolean>(isShowIntro);

  function sliderDismissHanlder() {
    setIsSliderVisible(false);
  }

  function handleLogin({ email, password }: { email: string; password: string }) {
    setIsLoading(true)
    setErrorMessage(null)

    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        setIsLoading(false)
      })
      .catch((error) => {
        setIsLoading(false)
        const errorMEssage = !!error.message
          ? error.message
          : 'There was an unexpected error (LoginScreen:firebase). Please try again later.'

        setErrorMessage(errorMEssage)
      })
  }

  return (
    <>
      {isSliderVisible ?
        <AppIntroScreen dismissSlider={sliderDismissHanlder} />
        :
        <View style={styles.container}>
          <StatusBar />

          <ScrollView>
            <Banner
              visible={!!errorMessage}
              actions={[{ label: 'OK', onPress: () => setErrorMessage(null) }]}
            >
              {errorMessage ? errorMessage : ''}
            </Banner>

            <View style={styles.content}>
              <LoginForm
                headlineText="Log in to your account"
                submitText="Log in"
                onSubmit={handleLogin}
                isLoading={isLoading}
              />
              <Button style={{ marginTop: 10 }} onPress={navigationActions.resetPassword}>
                Forgot your password?
              </Button>
            </View>
          </ScrollView>

          <Button style={{ marginTop: 10, marginBottom: 20 }} onPress={navigationActions.register}>
            create new account
          </Button>
        </View>
      }
    </>
  )
}
