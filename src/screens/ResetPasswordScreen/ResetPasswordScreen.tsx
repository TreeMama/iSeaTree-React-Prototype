import React from 'react'

import { StyleSheet, View } from 'react-native'
import { Banner } from 'react-native-paper'
import auth from '@react-native-firebase/auth';

import { ResetPasswordForm } from './ResetPasswordForm'
import { useNavigationActions } from '../../lib/navigation'

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

export function ResetPasswordScreen(props) {
  const [errorMessage, setErrorMessage] = React.useState<null | string>(null)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false)

  const navigationActions = useNavigationActions()

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
