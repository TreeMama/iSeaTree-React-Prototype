/**
 * The RegisterForm component is a form for user registration with validation and submission
 * functionality.
 * @param {FormValues} values - `values` is an object that contains the current values of the form
 * fields. In this case, it contains the values for `username`, `email`, `password`, and
 * `passwordConfirmation`. These values are used for validation and submission of the form.
 * @returns The code is returning a functional component called `RegisterForm` that takes in props of
 * type `RegisterFormProps`. It renders a form with input fields for username, email, and password, and
 * a submit button. It uses `useFormik` hook to manage form state and validation. The `validateForm`
 * function is used to validate the form inputs. The `onSubmit` function is called
 */

import React from 'react'
import { StyleSheet, View, Keyboard } from 'react-native'
import { Button, TextInput, Text, Headline, useTheme } from 'react-native-paper'
import { useFormik, FormikErrors } from 'formik'
import { isValidEmail, isMinLength } from '../../lib/formValidations'

/* `const styles = StyleSheet.create({ container: {} })` is creating a stylesheet object using the
`StyleSheet.create` method from the `react-native` library. The `container` property is an empty
object that can be used to define styles for a container element in the component. This is a common
pattern in React Native development to define styles in a separate object to keep the component code
clean and organized. */
const styles = StyleSheet.create({
  container: {},
})

/* The `interface RegisterFormProps` is defining the props that can be passed to the `RegisterForm`
component. It specifies that the component expects a `headlineText` prop of type `string`, a
`submitText` prop of type `string`, an `onSubmit` prop of type function that takes in an object with
`username`, `email`, and `password` properties of type `string` and returns `void`, and an
`isLoading` prop of type `boolean`. These props are used in the component to render the form and
handle form submission. */
interface RegisterFormProps {
  headlineText: string
  submitText: string
  onSubmit: (values: { username: string; email: string; password: string }) => void
  isLoading: boolean
}

/* The `interface FormValues` is defining the shape of an object that represents the values of the form
fields in the `RegisterForm` component. It specifies that the object should have four properties:
`username`, `email`, `password`, and `passwordConfirmation`, all of which are of type `string`. This
interface is used to provide type safety and ensure that the form values are correctly typed
throughout the component. */
interface FormValues {
  username: string
  email: string
  password: string
  passwordConfirmation: string
}

/**
 * This is a function that validates a form's input values and returns any errors.
 * @param {FormValues} values - an object containing the values of a form, with properties for
 * username, email, and password.
 * @returns The function `validateForm` returns an object of type `FormikErrors<FormValues>`, which
 * contains any validation errors for the input values passed to the function.
 */
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

/* The `export function RegisterForm(props: RegisterFormProps)` is defining a functional component
called `RegisterForm` that takes in props of type `RegisterFormProps`. The component renders a form
with input fields for username, email, and password, and a submit button. It uses the `useFormik`
hook to manage form state and validation. The `validateForm` function is used to validate the form
inputs. The `onSubmit` function is called when the form is submitted, which triggers the
`props.onSubmit` function passed down from the parent component with the form values as an argument.
The `Keyboard.dismiss()` function is called to dismiss the keyboard after form submission. The
component returns a `View` component with the form elements and a `Button` component for form
submission. */
export function RegisterForm(props: RegisterFormProps) {
  const theme = useTheme()

  /* `const formik = useFormik<FormValues>({...})` is using the `useFormik` hook from the `formik`
  library to create a formik instance that manages the state and validation of the form. The
  `FormValues` type is passed as a generic type argument to ensure that the form values are
  correctly typed. The `initialValues` property is an object that contains the initial values of the
  form fields. The `validate` property is a function that validates the form inputs and returns any
  errors. The `onSubmit` property is a function that is called when the form is submitted, which
  triggers the `props.onSubmit` function passed down from the parent component with the form values
  as an argument. The `Keyboard.dismiss()` function is called to dismiss the keyboard after form
  submission. The `formik` object returned by the `useFormik` hook is used to access the form state
  and validation functions in the component. */
  const formik = useFormik<FormValues>({
    initialValues: { username: '', email: '', password: '', passwordConfirmation: '' },
    validate: validateForm,
    onSubmit: (values) => {
      props.onSubmit(values)
      Keyboard.dismiss()
    },
  })

  /* The `return` statement is rendering the JSX code that defines the UI of the `RegisterForm`
  component. It creates a `View` component with a `style` prop that sets the `styles.container`
  style object defined earlier. Inside the `View`, there is a `Headline` component that displays the
  `props.headlineText` passed down from the parent component. */
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
        autoCapitalize='none'
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
        autoCapitalize='none'
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
