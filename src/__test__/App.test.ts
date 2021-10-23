import React from 'react';
import renderer from 'react-native-renderer';

import App from '../App';
import { Platform } from 'react-native';


jest.mock('react-native', () => ({
    Platform: {OS: 'android'}
}));

describe('React Native Platoform', ()=> {
    test("Platform.OS should be android", ()=> {
        expect(Platform.OS).toBe('android');
    });
});

// describe('<App />', () => {
//     it('has 1 child', () => {
//         const tree = renderer.create(<App/>).toJSON();
//         console.log(tree.children.length)
//         expect(tree.children.length).toBe(tree.children.length);
//     });
// });
