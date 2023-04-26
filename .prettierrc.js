/* This code exports an object with various configuration options for a code formatter called Prettier.
These options specify how Prettier should format code, such as whether to use semicolons, single or
double quotes, and how to handle trailing commas and arrow function parentheses. The exported object
can be used as a configuration file for Prettier to ensure consistent code formatting across a
project. */

module.exports = {
  trailingComma: 'all',
  semi: false,
  singleQuote: true,
  arrowParens: 'always',
  printWidth: 100,
};
