/**
 * The code exports two functions to check if a given string is a valid email and if it meets a minimum
 * length requirement.
 * @param {string} email - The email parameter is a string representing an email address that needs to
 * be validated.
 * @returns The code exports two functions: `isValidEmail` and `isMinLength`.
 */
const EMAIL_REGEX = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i

/**
 * The function checks if a given string is a valid email address.
 * @param {string} email - The email parameter is a string that represents an email address. The
 * function checks whether the email address is valid or not by using a regular expression pattern
 * defined in the EMAIL_REGEX constant.
 * @returns The function `isValidEmail` is returning a boolean value, which indicates whether the input
 * `email` string matches the regular expression `EMAIL_REGEX`. If the input string matches the regular
 * expression, the function will return `true`, otherwise it will return `false`.
 */
export function isValidEmail(email: string) {
  return EMAIL_REGEX.test(email)
}


/**
 * The function checks if a given string has a minimum length.
 * @param {string} value - a string that we want to check the length of.
 * @param {number} minLength - The minimum length that the value parameter should have in order for the
 * function to return true.
 * @returns The function `isMinLength` is being returned. It takes two parameters: `value` which is a
 * string and `minLength` which is a number. The function checks if the length of the `value` is
 * greater than or equal to the `minLength` and returns a boolean value. If the length of the `value`
 * is greater than or equal to the `minLength`,
 */
export function isMinLength(value: string, minLength: number) {
  return value.length >= minLength
}
