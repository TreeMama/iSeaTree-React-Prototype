import React from 'react';
import { ViewProps, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { RneFunctionComponent } from '../helpers';
export declare type DividerProps = ViewProps & {
    color?: string;
    inset?: boolean;
    insetType?: 'left' | 'right' | 'middle';
    style?: StyleProp<ViewStyle>;
    subHeader?: string;
    subHeaderStyle?: StyleProp<TextStyle>;
    orientation?: 'horizontal' | 'vertical';
    width?: number;
};
declare const Divider: RneFunctionComponent<DividerProps>;
export { Divider };
declare const _default: React.FunctionComponent<Omit<ViewProps & {
    color?: string;
    inset?: boolean;
    insetType?: "left" | "right" | "middle";
    style?: StyleProp<ViewStyle>;
    subHeader?: string;
    subHeaderStyle?: StyleProp<TextStyle>;
    orientation?: "horizontal" | "vertical";
    width?: number;
} & Partial<import("../config").ThemeProps<DividerProps>>, keyof import("../config").ThemeProps<T>>> | React.ForwardRefExoticComponent<ViewProps & {
    color?: string;
    inset?: boolean;
    insetType?: "left" | "right" | "middle";
    style?: StyleProp<ViewStyle>;
    subHeader?: string;
    subHeaderStyle?: StyleProp<TextStyle>;
    orientation?: "horizontal" | "vertical";
    width?: number;
} & Partial<import("../config").ThemeProps<DividerProps>>>;
export default _default;
