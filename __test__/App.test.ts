/* This is a test file written in TypeScript for a React Native app. It imports the necessary modules,
including React and the renderer from 'react-native-renderer'. It then imports the main component of
the app, 'App', from a separate file. */

import React from 'react';
import renderer from 'react-native-renderer';

import App from './App';

/* This is a test suite using the Jest testing framework. It is testing the component `<App />` to
ensure that it has only one child component. The `describe` function is used to group together
related tests, and the `it` function is used to define individual test cases. The test case creates
an instance of the `<App />` component using the `renderer.create` method, and then checks the
number of children components using the `expect` function. */

describe('<App />', () => {
    it('has 1 child', () => {
        const tree = renderer.create(<App />).toJSON();
        expect(tree.children.length).toBe(1);
    });
});
