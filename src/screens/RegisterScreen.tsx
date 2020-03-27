import React from 'react'

import { StyleSheet, View } from 'react-native'
import { AuthForm } from '../components/AuthForm'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 100,
    padding: 20,
  },
})

export function RegisterScreen() {
  return (
    <View style={styles.container}>
      <AuthForm headlineText="Create new account" submitText="Register" />
    </View>
  )
}
