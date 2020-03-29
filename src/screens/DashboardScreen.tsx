import React from 'react'

import { StyleSheet, View } from 'react-native'
import { Button, Title, Paragraph } from 'react-native-paper'

import { signOutUser } from '../lib/firebaseServices'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    padding: 20,
  },
})

export function DashboardScreen() {
  return (
    <View style={styles.container}>
      <Title>TODO: Dashboard</Title>

      <Button style={{ marginTop: 150 }} onPress={signOutUser}>
        Sign out
      </Button>
    </View>
  )
}
