import React from 'react';
import { StyleProp, ViewStyle, ColorValue } from 'react-native';
import { ImageProps } from '../image/Image';
import { IconProps } from '../icons/Icon';
export declare type AccessoryProps = Partial<IconProps> & Partial<ImageProps> & {
    underlayColor?: ColorValue;
    style?: StyleProp<ViewStyle>;
};
declare const _default: React.FunctionComponent<Omit<Partial<IconProps> & Partial<ImageProps> & {
    underlayColor?: ColorValue;
    style?: StyleProp<ViewStyle>;
} & Partial<import("../config").ThemeProps<AccessoryProps>>, keyof import("../config").ThemeProps<T>>> | React.ForwardRefExoticComponent<Partial<IconProps> & Partial<ImageProps> & {
    underlayColor?: ColorValue;
    style?: StyleProp<ViewStyle>;
} & Partial<import("../config").ThemeProps<AccessoryProps>>>;
export default _default;
