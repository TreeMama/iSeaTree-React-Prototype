import React from 'react'

import { StyleSheet, View, Keyboard } from 'react-native'
import { Button, TextInput, Text, Headline, withTheme, Theme } from 'react-native-paper'
import { useFormik, FormikErrors } from 'formik'
import { isValidEmail, isMinLength } from '../lib/formValidations'

const styles = StyleSheet.create({
  container: {},
})

interface AuthFormProps {
  headlineText: string
  submitText: string
  onSubmit: (values: { email: string; password: string }) => void
  isLoading: boolean

  theme: Theme
}

interface FormValues {
  email: string
  password: string
  passwordConfirmation: string
}

function validateForm(values: FormValues): FormikErrors<FormValues> {
  const errors: FormikErrors<FormValues> = {}

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

  return errors
}

function AuthForm(props: AuthFormProps) {
  const formik = useFormik<FormValues>({
    initialValues: { email: '', password: '', passwordConfirmation: '' },
    validate: validateForm,
    onSubmit: (values) => {
      props.onSubmit(values)
      Keyboard.dismiss()
    },
  })

  return (
    <View style={styles.container}>
      <Headline style={{ marginBottom: 20, color: props.theme.colors.primary }}>
        {props.headlineText}
      </Headline>

      {!!formik.errors.email && !!formik.touched.email && (
        <Text style={{ color: props.theme.colors.error }}>{formik.errors.email}</Text>
      )}
      <TextInput
        label="Email"
        onChangeText={(value) => {
          formik.setFieldValue('email', value)
        }}
        error={!!formik.errors.email && !!formik.touched.email}
        style={{ marginBottom: 20 }}
        autoCompleteType="email"
        keyboardType="email-address"
        dense
      />

      {!!formik.errors.password && !!formik.touched.password && (
        <Text style={{ color: props.theme.colors.error }}>{formik.errors.password}</Text>
      )}
      <TextInput
        label="Password"
        secureTextEntry
        onChangeText={(value) => {
          formik.setFieldValue('password', value)
        }}
        error={!!formik.errors.password && !!formik.touched.email}
        style={{ marginBottom: 20 }}
        dense
      />

      <Button mode="contained" onPress={formik.handleSubmit} loading={props.isLoading}>
        {props.submitText}
      </Button>
    </View>
  )
}

const WithTheme = withTheme(AuthForm)
export { WithTheme as AuthForm }
