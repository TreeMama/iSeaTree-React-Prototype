/**
 * The LoginScreen function is a React component that displays a login form and handles user
 * authentication using Firebase.
 */

import React from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { Banner, Button } from 'react-native-paper'
import auth from '@react-native-firebase/auth'
import { LoginForm } from './LoginForm'
import { useNavigationActions } from '../../lib/navigation'

import AppIntroScreen from '../AppIntroScreen'
import { StatusBar } from '../../components/StatusBar'

/* `const styles = StyleSheet.create({...})` is creating a JavaScript object that contains styles for
the LoginScreen component. The `container` style sets the flexbox properties of the main container
view, including its background color and padding. The `content` style sets the flexbox properties of
the content view, including its padding and top margin. These styles are then used in the JSX code
to apply the styles to the appropriate components. */
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
  const navigationActions = useNavigationActions()
  const { isShowIntro } = props.route.params
  const [isSliderVisible, setIsSliderVisible] = React.useState<boolean>(isShowIntro)

  /**
   * The function sets the state of a slider visibility to false.
   */
  function sliderDismissHanlder() {
    setIsSliderVisible(false)
  }

  /**
   * This function handles user login by authenticating their email and password using Firebase and
   * sets loading and error messages accordingly.
   * @param  - The function `handleLogin` takes an object as its parameter with two properties: `email`
   * and `password`. Both properties are of type `string`. The object is destructured using ES6 syntax.
   */
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

  /* The `return` statement is returning the JSX code that defines the UI of the `LoginScreen`
  component. It is using conditional rendering to display either the `AppIntroScreen` component or
  the login form depending on the value of the `isSliderVisible` state variable. If
  `isSliderVisible` is true, the `AppIntroScreen` component is displayed with the `dismissSlider`
  function passed as a prop. If `isSliderVisible` is false, the login form is displayed with the
  `LoginForm` component and a "Forgot your password?" button. At the bottom of the screen, there is
  a "create new account" button that navigates to the registration screen when pressed. The `Banner`
  component is used to display error messages if there are any. */
  return (
    <>
      {isSliderVisible ? (
        <AppIntroScreen dismissSlider={sliderDismissHanlder} />
      ) : (
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
      )}
    </>
  )
}
