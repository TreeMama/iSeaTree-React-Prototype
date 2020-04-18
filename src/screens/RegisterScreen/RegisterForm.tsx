import React from 'react'

import { StyleSheet, View, Keyboard } from 'react-native'
import { Button, TextInput, Text, Headline, useTheme } from 'react-native-paper'
import { useFormik, FormikErrors } from 'formik'
import { isValidEmail, isMinLength } from '../../lib/formValidations'

const styles = StyleSheet.create({
  container: {},
})

interface RegisterFormProps {
  headlineText: string
  submitText: string
  onSubmit: (values: { username: string; email: string; password: string }) => void
  isLoading: boolean
}

interface FormValues {
  username: string
  email: string
  password: string
  passwordConfirmation: string
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

  return errors
}

export function RegisterForm(props: RegisterFormProps) {
  const theme = useTheme()

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
      <Headline style={{ marginBottom: 20, color: theme.colors.primary }}>
        {props.headlineText}
      </Headline>

      {!!formik.errors.username && !!formik.touched.username && (
        <Text style={{ color: theme.colors.error }}>{formik.errors.username}</Text>
      )}
      <TextInput
        label="Username"
        onChangeText={(value) => {
          formik.setFieldValue('username', value)
        }}
        error={!!formik.errors.email && !!formik.touched.email}
        style={{ marginBottom: 20 }}
        autoCompleteType="username"
        dense
      />

      {!!formik.errors.email && !!formik.touched.email && (
        <Text style={{ color: theme.colors.error }}>{formik.errors.email}</Text>
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
        <Text style={{ color: theme.colors.error }}>{formik.errors.password}</Text>
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
