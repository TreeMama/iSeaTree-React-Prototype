import React from 'react'

import { StyleSheet, Text, View } from 'react-native'
import { registerRootComponent } from 'expo'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export function App() {
  return (
    <View style={styles.container}>
      <Text>Hello, World!</Text>
    </View>
  )
}

// default export is required by expo
// eslint-disable-next-line import/no-default-export
export default registerRootComponent(App)
