/**
 * This is a TypeScript React component for a login form with form validation and submission
 * functionality.
 * @param {FormValues} values - `values` is an object that contains the current values of the form
 * fields. In this case, it contains the values for `email`, `password`, and `passwordConfirmation`.
 * These values are initialized as empty strings in the `useFormik` hook. The `onSubmit` function
 * passed to
 * @returns The LoginForm component wrapped with the withTheme HOC (Higher Order Component) is being
 * exported.
 */

import React from 'react'
import { StyleSheet, View, Keyboard } from 'react-native'
import { Button, TextInput, Text, Headline, withTheme, Theme } from 'react-native-paper'
import { useFormik, FormikErrors } from 'formik'
import { isValidEmail, isMinLength } from '../../lib/formValidations'

/* `const styles = StyleSheet.create({ container: {} })` is creating a stylesheet object using the
`StyleSheet.create()` method from the `react-native` library. The `container` property is an empty
object that can be used to define styles for a container element in the component. This is a common
pattern in React Native development to define styles in a separate object to keep the component code
clean and organized. */
const styles = StyleSheet.create({
  container: {},
})

/* The `interface LoginFormProps` is defining the props that can be passed to the `LoginForm`
component. It includes the `headlineText` and `submitText` strings that will be displayed in the
component, the `onSubmit` function that will be called when the form is submitted, the `isLoading`
boolean that will be used to indicate if the form is currently submitting, and the `theme` object
that is used to style the component using the `withTheme` HOC. */
interface LoginFormProps {
  headlineText: string
  submitText: string
  onSubmit: (values: { email: string; password: string }) => void
  isLoading: boolean

  theme: Theme
}

/* The `interface FormValues` is defining the shape of an object that contains the values for the
email, password, and passwordConfirmation fields in the login form. This interface is used to type
the `values` object passed to the `useFormik` hook, which initializes these fields as empty strings.
The `validateForm` function also uses this interface to ensure that the values for these fields are
of the correct type and format. */
interface FormValues {
  email: string
  password: string
  passwordConfirmation: string
}

/**
 * This function validates a form's email and password fields and returns any errors.
 * @param {FormValues} values - an object containing the values of the form fields that need to be
 * validated. In this case, it contains the email and password fields.
 * @returns an object of errors, where the keys are the names of the fields that have errors and the
 * values are the error messages. The errors object is of type `FormikErrors<FormValues>`, which is a
 * generic type that specifies the shape of the form values object.
 */
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

/* The `LoginForm` function is a React component that takes in props of type `LoginFormProps`. It uses
the `useFormik` hook from the `formik` library to create a formik instance, which handles the form
state, validation, and submission. */
function LoginForm(props: LoginFormProps) {
  /* `const formik = useFormik<FormValues>({...})` is using the `useFormik` hook from the `formik`
  library to create a formik instance. The `useFormik` hook takes an object with three properties:
  `initialValues`, `validate`, and `onSubmit`. */
  const formik = useFormik<FormValues>({
    initialValues: { email: '', password: '', passwordConfirmation: '' },
    validate: validateForm,
    onSubmit: (values) => {
      props.onSubmit(values)
      Keyboard.dismiss()
    },
  })

  /* The `return` statement is rendering the JSX code that defines the login form component. It
  includes a `View` component that wraps the form, a `Headline` component that displays the headline
  text passed as a prop, two `TextInput` components for the email and password fields, and a
  `Button` component for submitting the form. */
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
        autoCapitalize='none'
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

const WithTheme = withTheme(LoginForm)
export { WithTheme as LoginForm }
