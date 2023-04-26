/* This is a configuration file for Jest, a JavaScript testing framework. It specifies various settings
for Jest to use when running tests, such as the file extensions to look for, how to transform
certain file types, and which files to ignore. It also sets the cache directory for Jest to use. */

{
  "jest": {
    "preset": "react-native",
      "moduleFileExtensions": [
        "ts",
        "tsx",
        "js"
      ],
        "transform": {
      "^.+\\.(js)$": "<rootDir>/node_modules/babel-jest",
        "\\.(ts|tsx)$": "<rootDir>/node_modules/ts-jest/preprocessor.js"
    },
    "testRegex": "(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$",
      "testPathIgnorePatterns": [
        "\\.snap$",
        "<rootDir>/node_modules/"
      ],
        "cacheDirectory": ".jest/cache"
  }
}
