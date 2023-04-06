/**
 * The code exports two functions to check if a given string is a valid email and if it meets a minimum
 * length requirement.
 * @param {string} email - The email parameter is a string representing an email address that needs to
 * be validated.
 * @returns The code exports two functions: `isValidEmail` and `isMinLength`.
 */
const EMAIL_REGEX = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i

export function isValidEmail(email: string) {
  return EMAIL_REGEX.test(email)
}

export function isMinLength(value: string, minLength: number) {
  return value.length >= minLength
}
