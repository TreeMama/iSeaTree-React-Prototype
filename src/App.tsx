import React from 'react'

import { registerRootComponent } from 'expo'
import { Provider as PaperProvider } from 'react-native-paper'

import { RegisterScreen } from './screens/RegisterScreen'

export function App() {
  return (
    <PaperProvider>
      <RegisterScreen />
    </PaperProvider>
  )
}

// default export is required by expo
// eslint-disable-next-line import/no-default-export
export default registerRootComponent(App)
