import React from 'react'

import { StyleSheet, View } from 'react-native'
import { Button, TextInput, Text, Headline, withTheme, Theme } from 'react-native-paper'
import { useFormik, FormikErrors } from 'formik'
import { isValidEmail, isMinLength } from '../utils/formValidations'

const styles = StyleSheet.create({
  container: {},
})

interface AuthFormProps {
  headlineText: string
  submitText: string

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
      console.log('values', values)
    },
  })

  return (
    <View style={styles.container}>
      <Headline style={{ marginBottom: 20, color: props.theme.colors.primary }}>
        {props.headlineText}
      </Headline>

      <TextInput
        label="Email"
        onChangeText={(value) => {
          formik.setFieldValue('email', value)
        }}
        error={!!formik.errors.email}
        style={{ marginBottom: 20 }}
      />
      {!!formik.errors.email && <Text>{formik.errors.email}</Text>}

      <TextInput
        label="Password"
        secureTextEntry
        onChangeText={(value) => {
          formik.setFieldValue('password', value)
        }}
        error={!!formik.errors.password}
        style={{ marginBottom: 20 }}
      />
      {!!formik.errors.password && <Text>{formik.errors.password}</Text>}

      <Button mode="contained" onPress={formik.handleSubmit}>
        {props.submitText}
      </Button>
    </View>
  )
}

const WithTheme = withTheme(AuthForm)
export { WithTheme as AuthForm }
