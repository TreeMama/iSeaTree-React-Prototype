/* This code exports an object with two functions as properties: `getTransformModulePath` and
`getSourceExts`. */

module.exports = {
  getTransformModulePath() {
    return require.resolve('react-native-typescript-transformer');
  },
  getSourceExts() {
    return ['ts', 'tsx'];
  },
};
