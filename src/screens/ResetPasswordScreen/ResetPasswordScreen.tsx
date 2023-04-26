/**
 * This is a React component for a reset password screen that allows users to reset their password by
 * sending a password reset email.
 * @param {string} email - The email parameter is a string that represents the email address of the
 * user who wants to reset their password. It is used in the handleResetPassword function to send a
 * password reset email to the specified email address.
 */

import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Banner } from 'react-native-paper'
import auth from '@react-native-firebase/auth';
import { ResetPasswordForm } from './ResetPasswordForm'
import { useNavigationActions } from '../../lib/navigation'

/* `const styles = StyleSheet.create({...})` is creating a stylesheet object using the
`StyleSheet.create()` method from the `react-native` library. The object contains three properties:
`container`, `bannerContainer`, and `content`, each with their own set of styles. These styles are
used to define the layout and appearance of the `ResetPasswordScreen` component. For example,
`container` sets the flexbox properties, background color, and padding of the main container view,
while `content` sets the background color and top padding of the content view. These styles can be
referenced in the JSX code using the `style` prop. */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  bannerContainer: {
    paddingTop: 20,
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 80,
  },
})

/**
 * This is a React component for a reset password screen that handles sending a password reset email
 * and displays error or success messages.
 * @param {string} email - The email parameter is a string representing the email address of the user
 * who wants to reset their password. It is used as an argument in the
 * `auth().sendPasswordResetEmail(email)` function to send a password reset email to the user's email
 * address.
 */
export function ResetPasswordScreen(props) {

  /* `const [errorMessage, setErrorMessage] = React.useState<null | string>(null)` is declaring a state
  variable `errorMessage` using the `useState` hook from the `react` library. The initial value of
  `errorMessage` is `null`. The `useState` hook returns an array with two elements: the current
  state value (`errorMessage`) and a function to update the state value (`setErrorMessage`). The
  type of `errorMessage` is specified as `null | string`, which means it can either be `null` or a
  `string`. This is done using TypeScript syntax. */
  const [errorMessage, setErrorMessage] = React.useState<null | string>(null)

  /* `const [isLoading, setIsLoading] = React.useState<boolean>(false)` is declaring a state variable
  `isLoading` using the `useState` hook from the `react` library. The initial value of `isLoading`
  is `false`. The `useState` hook returns an array with two elements: the current state value
  (`isLoading`) and a function to update the state value (`setIsLoading`). The type of `isLoading`
  is specified as `boolean`, which means it can either be `true` or `false`. This is done using
  TypeScript syntax. The `isLoading` state variable is used to track whether the password reset
  request is currently being processed, and the `setIsLoading` function is used to update the
  `isLoading` state variable. */
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  /* `const [isSuccess, setIsSuccess] = React.useState<boolean>(false)` is declaring a state variable
  `isSuccess` using the `useState` hook from the `react` library. The initial value of `isSuccess`
  is `false`. The `useState` hook returns an array with two elements: the current state value
  (`isSuccess`) and a function to update the state value (`setIsSuccess`). The type of `isSuccess`
  is specified as `boolean`, which means it can either be `true` or `false`. This is done using
  TypeScript syntax. The `isSuccess` state variable is used to track whether the password reset
  request was successful, and the `setIsSuccess` function is used to update the `isSuccess` state
  variable. */
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false)

  /* `const navigationActions = useNavigationActions()` is calling a custom hook `useNavigationActions`
  to get an object containing navigation actions. These navigation actions can be used to navigate
  to different screens in the app. The `navigationActions` object is then used in the
  `ResetPasswordScreen` component to navigate to the login screen after a successful password reset. */
  const navigationActions = useNavigationActions()

  /**
   * This function handles resetting a user's password by sending a password reset email and handling
   * any errors that may occur.
   * @param {string} email - The email parameter is a string that represents the email address of the
   * user who wants to reset their password. This email address will be used to send a password reset
   * link to the user's email.
   */
  function handleRessetPassword(email: string) {
    setIsLoading(true)
    setErrorMessage(null)

    auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        setIsLoading(false)
        setIsSuccess(true)
      })
      .catch((error) => {
        setIsLoading(false)
        const errorMEssage = !!error.message
          ? error.message
          : 'There was an unexpected error (ResetPasswordScreen::setIsLoading). Please try again later.'

        setErrorMessage(errorMEssage)
      })
  }

  /* The `return` statement is returning the JSX code that defines the layout and appearance of the
  `ResetPasswordScreen` component. It consists of a `View` component with two child components: a
  `Banner` component for displaying error or success messages, and a `ResetPasswordForm` component
  for allowing users to enter their email address and submit a password reset request. The `styles`
  object is used to define the layout and appearance of the `View`, `Banner`, and
  `ResetPasswordForm` components. The `onSubmit` and `isLoading` props are passed to the
  `ResetPasswordForm` component to handle the password reset request and track whether the request
  is currently being processed. The `visible` prop is used to conditionally show or hide the
  `Banner` components based on whether there is an error message or the password reset request was
  successful. The `actions` prop is used to define the action(s) that can be taken when the user
  interacts with the `Banner` component. The `onPress` function is called when the user presses the
  action button. The `navigationActions.login()` function is called when the user presses the "OK"
  button on the success `Banner` */
  return (
    <View style={styles.container}>
      <View style={styles.bannerContainer}>
        <Banner
          visible={!!errorMessage}
          icon="alert-circle-outline"
          actions={[
            {
              label: 'OK',
              onPress: () => {
                setErrorMessage(null)
              },
            },
          ]}
        >
          {errorMessage}
        </Banner>
        <Banner
          visible={isSuccess}
          icon="check"
          actions={[
            {
              label: 'OK',
              onPress: () => {
                navigationActions.login()
              },
            },
          ]}
        >
          Please follow instructions in the email we've just sent you to finish setting a new
          password
        </Banner>
      </View>

      <View style={styles.content}>
        <ResetPasswordForm onSubmit={handleRessetPassword} isLoading={isLoading} />
      </View>
    </View>
  )
}
