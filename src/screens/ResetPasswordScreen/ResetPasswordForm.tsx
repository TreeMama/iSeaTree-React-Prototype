import React from 'react'

import { Keyboard } from 'react-native'
import { Button, TextInput, Text, withTheme, Theme } from 'react-native-paper'
import { useFormik, FormikErrors } from 'formik'
import { isValidEmail } from '../../lib/formValidations'

interface ResetPasswordFormProps {
  onSubmit: (email: string) => void
  isLoading: boolean

  theme: Theme
}

interface FormValues {
  email: string
}

function validateForm(values: FormValues): FormikErrors<FormValues> {
  const errors: FormikErrors<FormValues> = {}

  if (!values.email) {
    errors.email = "Can't be blank"
  } else if (!isValidEmail(values.email)) {
    errors.email = 'Incorrect email'
  }

  return errors
}

function ResetPasswordForm(props: ResetPasswordFormProps) {
  const formik = useFormik<FormValues>({
    initialValues: { email: '' },
    validate: validateForm,
    onSubmit: ({ email }) => {
      props.onSubmit(email)
      Keyboard.dismiss()
    },
  })

  return (
    <>
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
      />

      <Button mode="contained" onPress={formik.handleSubmit} loading={props.isLoading}>
        Reset my password
      </Button>
    </>
  )
}

const WithTheme = withTheme(ResetPasswordForm)
export { WithTheme as ResetPasswordForm }
