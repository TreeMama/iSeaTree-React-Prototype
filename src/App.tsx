import React from 'react'

import { StyleSheet, View } from 'react-native'
import { registerRootComponent } from 'expo'
import { Provider as PaperProvider, Title } from 'react-native-paper'

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
    <PaperProvider>
      <View style={styles.container}>
        <Title>Hello, World!</Title>
      </View>
    </PaperProvider>
  )
}

// default export is required by expo
// eslint-disable-next-line import/no-default-export
export default registerRootComponent(App)
