/* This code exports a function that configures Babel for a React Native project using the Expo
framework. The function takes an `api` object as a parameter and calls its `cache` method with a
value of `true` to enable caching of Babel configuration. The function then returns an object with
presets and environment-specific plugins for Babel. In the production environment, the
`react-native-paper/babel` plugin is added to the list of plugins. */

module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    env: {
      production: {
        plugins: ['react-native-paper/babel'],
      },
    },
  }
}
