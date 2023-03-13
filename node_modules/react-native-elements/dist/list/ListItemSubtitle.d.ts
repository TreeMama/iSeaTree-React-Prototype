import React from 'react';
import { TextProps } from 'react-native';
declare type SubtitleProps = TextProps & {
    right?: boolean;
};
declare const _default: React.FunctionComponent<Omit<TextProps & {
    right?: boolean;
} & Partial<import("../config").ThemeProps<SubtitleProps>>, keyof import("../config").ThemeProps<T>>> | React.ForwardRefExoticComponent<TextProps & {
    right?: boolean;
} & Partial<import("../config").ThemeProps<SubtitleProps>>>;
export default _default;
