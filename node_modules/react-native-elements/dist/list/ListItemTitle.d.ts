import React from 'react';
import { TextProps } from 'react-native';
declare type TitleProps = TextProps & {
    right?: boolean;
};
declare const _default: React.FunctionComponent<Omit<TextProps & {
    right?: boolean;
} & Partial<import("../config").ThemeProps<TitleProps>>, keyof import("../config").ThemeProps<T>>> | React.ForwardRefExoticComponent<TextProps & {
    right?: boolean;
} & Partial<import("../config").ThemeProps<TitleProps>>>;
export default _default;
