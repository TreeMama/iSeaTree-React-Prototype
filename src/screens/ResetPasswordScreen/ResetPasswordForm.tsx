/**
 * This is a TypeScript React component for a reset password form that uses Formik for form handling
 * and validation.
 * @param {FormValues} values - `values` is an object that contains the current values of the form
 * fields. In this case, it contains a single property `email` which represents the value of the email
 * input field. The `validateForm` function uses this object to validate the form and return any errors
 * that may exist.
 * @returns The `ResetPasswordForm` component is being returned.
 */

import React from 'react'
import { Keyboard } from 'react-native'
import { Button, TextInput, Text, withTheme, Theme } from 'react-native-paper'
import { useFormik, FormikErrors } from 'formik'
import { isValidEmail } from '../../lib/formValidations'

/* The `interface ResetPasswordFormProps` is defining the props that the `ResetPasswordForm` component
expects to receive. It includes three properties:
- `onSubmit`: a function that takes an email string as an argument and returns nothing (`void`).
This function is called when the form is submitted.
- `isLoading`: a boolean value that indicates whether the form is currently submitting or not.
- `theme`: a `Theme` object that is used to style the component using the `withTheme` higher-order
component from `react-native-paper`. */
interface ResetPasswordFormProps {
  onSubmit: (email: string) => void
  isLoading: boolean
  theme: Theme
}

/* The `interface FormValues` is defining the shape of an object that contains the current values of
the form fields. In this case, it contains a single property `email` which represents the value of
the email input field. This interface is used by the `useFormik` hook to initialize the form values
and to type-check the `validate` function. */
interface FormValues {
  email: string
}

/**
 * This function validates a form's email input and returns an error message if the input is blank or
 * an invalid email format.
 * @param {FormValues} values - FormValues is a type that represents the shape of the form values
 * object. It likely includes properties such as email, password, name, etc.
 * @returns The function `validateForm` is returning an object of type `FormikErrors<FormValues>`,
 * which contains any validation errors that were found during the validation process.
 */
function validateForm(values: FormValues): FormikErrors<FormValues> {
  const errors: FormikErrors<FormValues> = {}

  if (!values.email) {
    errors.email = "Can't be blank"
  } else if (!isValidEmail(values.email)) {
    errors.email = 'Incorrect email'
  }

  return errors
}

/* The `ResetPasswordForm` function is defining a React component that renders a form for resetting a
password. It uses the `useFormik` hook from Formik to handle form state and validation. The
component takes in three props: `onSubmit`, `isLoading`, and `theme`. */
function ResetPasswordForm(props: ResetPasswordFormProps) {
  /* `const formik = useFormik<FormValues>({...})` is using the `useFormik` hook from Formik to
  initialize the form state and validation. It takes an object with three properties:
  - `initialValues`: an object that contains the initial values of the form fields. In this case, it
  contains a single property `email` with an empty string as its value.
  - `validate`: a function that validates the form fields and returns any errors that may exist. In
  this case, it calls the `validateForm` function to validate the email input field.
  - `onSubmit`: a function that is called when the form is submitted. In this case, it takes the
  `email` value from the form values object and passes it to the `onSubmit` prop function that was
  passed to the `ResetPasswordForm` component. It also dismisses the keyboard. The `useFormik` hook
  returns an object with various properties and methods that can be used to interact with the form
  state and behavior. This object is assigned to the `formik` constant. */
  const formik = useFormik<FormValues>({
    initialValues: { email: '' },
    validate: validateForm,
    onSubmit: ({ email }) => {
      props.onSubmit(email)
      Keyboard.dismiss()
    },
  })

  /* The `return` statement is returning the JSX code that defines the layout and behavior of the
  `ResetPasswordForm` component. */
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
