# dependency Changes for Migrate Project:

In September 2021, the projected migrated from using Expo to being a pure React Native project. This was so we could have better low-level access to cameras and other native tools.

- replace `firebase` dependency with `@react-native-firebase`
- replace `expo-camera` dependency with `react-native-camera`
- add `react-native-unimodules`

## why change `firebase` dependency with `@react-native-firebase`?

- well as per the new flow `firebase` is not recognised by the react-native
- and it's make project future proof

## why change `expo-camera` dependency with `react-native-camera`?

- to fix rotation image issue

## why add `react-native-unimodules`?

- This dependency allows us to use most of the expo dependency if require.
