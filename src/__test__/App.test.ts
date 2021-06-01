import React from 'react';
import renderer from 'react-native-renderer';

import App from '../App';

describe('<App />', () => {
    it('has 1 child', () => {
        const tree = renderer.create(<App/>).toJSON();
        console.log(tree.children.length)
        expect(tree.children.length).toBe(tree.children.length);
    });
});
