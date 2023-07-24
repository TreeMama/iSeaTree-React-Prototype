import React from 'react'

import { StyleSheet, View, Keyboard } from 'react-native'
import { Button, TextInput, Text, Headline, useTheme } from 'react-native-paper'
import { useFormik, FormikErrors } from 'formik'
import { isValidEmail, isMinLength } from '../../lib/formValidations'

const styles = StyleSheet.create({
  container: {},
  header: {
    marginBottom: 20,
    marginTop: 20,
    fontSize: 15,
    alignSelf: 'center',
  },
})

interface RegisterFormProps {
  submitText: string
  onSubmit: (values: { username: string; email: string; password: string }) => void
  isLoading: boolean
  selectedId: string | undefined
}

interface FormValues {
  username: string
  email: string
  password: string
  passwordConfirmation: string
}

export function RegisterForm(props: RegisterFormProps) {
  let headlineText = ''
  const theme = useTheme()

  switch (props.selectedId) {
    case '1':
      headlineText = 'Link my Scistarter account to the iSeaTree app'
      break
    case '2':
      headlineText = 'Create a SciStarter and iSeaTree Account'
      break
    case '3':
      headlineText = 'Create an iSeaTree Account'
      break
    default:
      headlineText = 'Create an iSeaTree Account'
      break
  }

  function validateForm(values: FormValues): FormikErrors<FormValues> {
    const errors: FormikErrors<FormValues> = {}

    if (!values.username) {
      errors.username = "Can't be blank"
    }

    if (!values.email) {
      errors.email = "Can't be blank"
    } else if (!isValidEmail(values.email)) {
      errors.email = 'Incorrect email'
    }

    if (!values.password) {
      errors.password = "Can't be blank"
    } else if (!isMinLength(values.password, 8)) {
      errors.password = 'Must be min 8 characters'
    }

    if (props.selectedId === '2') {
      if (!values.passwordConfirmation) {
        errors.passwordConfirmation = "Can't be blank"
      }

      if (values.password !== values.passwordConfirmation) {
        errors.passwordConfirmation = 'Passwords must match'
      }
    }

    return errors
  }

  const formik = useFormik<FormValues>({
    initialValues: { username: '', email: '', password: '', passwordConfirmation: '' },
    validate: validateForm,
    onSubmit: (values) => {
      props.onSubmit(values)
      Keyboard.dismiss()
    },
  })

  return (
    <View style={styles.container}>
      <Headline style={styles.header}>{headlineText}</Headline>

      {!!formik.errors.username && !!formik.touched.username && (
        <Text style={{ color: theme.colors.error }}>{formik.errors.username}</Text>
      )}
      <TextInput
        label={props.selectedId === '1' ? 'Username for iSeaTree account' : 'Username'}
        onChangeText={(value) => {
          formik.setFieldValue('username', value)
        }}
        error={!!formik.errors.username && !!formik.touched.username}
        style={{ marginBottom: 20 }}
        autoCapitalize="none"
        autoCompleteType="username"
        dense
      />

      {!!formik.errors.email && !!formik.touched.email && (
        <Text style={{ color: theme.colors.error }}>{formik.errors.email}</Text>
      )}
      <TextInput
        label={props.selectedId === '1' ? 'Email used to login SciStarter' : 'Email'}
        onChangeText={(value) => {
          formik.setFieldValue('email', value)
        }}
        error={!!formik.errors.email && !!formik.touched.email}
        style={{ marginBottom: 20 }}
        autoCapitalize="none"
        autoCompleteType="email"
        keyboardType="email-address"
        dense
      />

      {!!formik.errors.password && !!formik.touched.password && (
        <Text style={{ color: theme.colors.error }}>{formik.errors.password}</Text>
      )}
      <TextInput
        label={props.selectedId === '1' ? 'Password for iSeaTree account' : 'Password'}
        secureTextEntry
        onChangeText={(value) => {
          formik.setFieldValue('password', value)
        }}
        error={!!formik.errors.password && !!formik.touched.password}
        style={{ marginBottom: 20 }}
        dense
      />

      {props.selectedId === '2' &&
        !!formik.errors.passwordConfirmation &&
        !!formik.touched.passwordConfirmation && (
          <Text style={{ color: theme.colors.error }}>{formik.errors.passwordConfirmation}</Text>
        )}
      {props.selectedId === '2' && (
        <TextInput
          label="Repeat Password"
          secureTextEntry
          onChangeText={(value) => {
            formik.setFieldValue('passwordConfirmation', value)
          }}
          error={!!formik.errors.passwordConfirmation && !!formik.touched.passwordConfirmation}
          style={{ marginBottom: 20 }}
          dense
        />
      )}

      <Button mode="contained" onPress={formik.handleSubmit} loading={props.isLoading}>
        {props.submitText}
      </Button>
    </View>
  )
}
