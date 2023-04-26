/* This code is importing the `registerRootComponent` function and the `App` component from the `expo`
and `./src/App` modules respectively. It then calls the `registerRootComponent` function with the
`App` component as an argument. This function registers the `App` component as the root component of
the application and sets up the environment for the app to run properly on both the Expo client and
native builds. */

import { registerRootComponent } from 'expo';

import App from './src/App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
