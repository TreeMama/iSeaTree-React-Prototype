import React from 'react';
import { TextProps as TextProperties, TextStyle, StyleProp } from 'react-native';
import { RneFunctionComponent } from '../helpers';
export declare type TextProps = TextProperties & {
    style?: StyleProp<TextStyle>;
    h1?: boolean;
    h2?: boolean;
    h3?: boolean;
    h4?: boolean;
    h1Style?: StyleProp<TextStyle>;
    h2Style?: StyleProp<TextStyle>;
    h3Style?: StyleProp<TextStyle>;
    h4Style?: StyleProp<TextStyle>;
};
declare const TextElement: RneFunctionComponent<TextProps>;
export { TextElement };
declare const _default: React.FunctionComponent<Omit<TextProperties & {
    style?: StyleProp<TextStyle>;
    h1?: boolean;
    h2?: boolean;
    h3?: boolean;
    h4?: boolean;
    h1Style?: StyleProp<TextStyle>;
    h2Style?: StyleProp<TextStyle>;
    h3Style?: StyleProp<TextStyle>;
    h4Style?: StyleProp<TextStyle>;
} & Partial<import("../config").ThemeProps<TextProps>>, keyof import("../config").ThemeProps<T>>> | React.ForwardRefExoticComponent<TextProperties & {
    style?: StyleProp<TextStyle>;
    h1?: boolean;
    h2?: boolean;
    h3?: boolean;
    h4?: boolean;
    h1Style?: StyleProp<TextStyle>;
    h2Style?: StyleProp<TextStyle>;
    h3Style?: StyleProp<TextStyle>;
    h4Style?: StyleProp<TextStyle>;
} & Partial<import("../config").ThemeProps<TextProps>>>;
export default _default;
