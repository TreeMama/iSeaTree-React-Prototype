/* This code exports an object with a `transformer` property that contains an array of asset plugins.
Specifically, it includes the `expo-asset/tools/hashAssetFiles` plugin, which is used to hash asset
files in an Expo project. This code is typically used in a configuration file for a build tool or
bundler, such as Metro, to specify how to transform and process assets in a project. */

module.exports = {
  transformer: {
    assetPlugins: ['expo-asset/tools/hashAssetFiles'],
  },
};
