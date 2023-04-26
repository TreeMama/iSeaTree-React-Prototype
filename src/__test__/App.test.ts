/* This is a test file written in Jest, a JavaScript testing framework. It is testing the behavior of
the `Platform.OS` property in the `react-native` library when the platform is set to Android. */
import React from 'react';
import renderer from 'react-native-renderer';

import App from '../App';
import { Platform } from 'react-native';


jest.mock('react-native', () => ({
    Platform: { OS: 'android' }
}));

/* This code is testing the behavior of the `Platform.OS` property in the `react-native` library when
the platform is set to Android. It is using the Jest testing framework to create a test suite with a
single test case. The `describe` function is used to group related test cases together, and the
`test` function is used to define a single test case. The test case checks that the `Platform.OS`
property is set to `'android'` by using the `expect` function to compare the value of `Platform.OS`
to the string `'android'`. */

describe('React Native Platoform', () => {
    test("Platform.OS should be android", () => {
        expect(Platform.OS).toBe('android');
    });
});