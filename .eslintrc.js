/* This is a configuration file for ESLint, a popular JavaScript linter. It specifies the parser to use
(in this case, the TypeScript ESLint parser), the rules to enforce (including some recommended rules
from plugins for importing modules and working with React), and some settings (such as detecting the
version of React being used). This configuration file can be used to ensure consistent code style
and catch potential errors in a JavaScript or TypeScript project. */

module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  extends: [
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:react/recommended', // Uses the recommended rules from @eslint-plugin-react
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
  },
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/member-delimiter-style': [
      'warn',
      {
        multiline: {
          delimiter: 'none',
        },
      },
    ],
    'import/no-default-export': 'error',
  },
  settings: {
    react: {
      version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
    },
  },
}
