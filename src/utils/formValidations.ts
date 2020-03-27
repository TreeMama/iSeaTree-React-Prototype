const EMAIL_REGEX = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i

export function isValidEmail(email: string) {
  return EMAIL_REGEX.test(email)
}

export function isMinLength(value: string, minLength: number) {
  return value.length >= minLength
}
