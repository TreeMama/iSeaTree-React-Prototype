import React from 'react';
import { TextStyle, StyleProp, TextProps, ViewProps, StatusBarProps, StatusBarStyle, ImageSourcePropType, ImageStyle, ViewStyle } from 'react-native';
import { RneFunctionComponent } from '../helpers';
import { IconObject } from '../icons/Icon';
interface HeaderIcon extends IconObject {
    icon?: string;
    text?: string;
    color?: string;
    style?: StyleProp<TextStyle>;
}
declare type HeaderSubComponent = React.ReactElement<{}> | TextProps | HeaderIcon;
export declare type HeaderProps = ViewProps & {
    ViewComponent?: typeof React.Component;
    linearGradientProps?: Object;
    statusBarProps?: StatusBarProps;
    barStyle?: StatusBarStyle;
    leftComponent?: HeaderSubComponent;
    centerComponent?: HeaderSubComponent;
    rightComponent?: HeaderSubComponent;
    backgroundColor?: string;
    backgroundImage?: ImageSourcePropType;
    backgroundImageStyle?: ImageStyle;
    placement?: 'left' | 'center' | 'right';
    containerStyle?: StyleProp<ViewStyle>;
    centerContainerStyle?: StyleProp<ViewStyle>;
    leftContainerStyle?: StyleProp<ViewStyle>;
    rightContainerStyle?: StyleProp<ViewStyle>;
    children?: JSX.Element[];
    elevated?: boolean;
};
declare const Header: RneFunctionComponent<HeaderProps>;
export { Header };
declare const _default: React.FunctionComponent<Omit<HeaderProps, keyof import("../config").ThemeProps<T>>> | React.ForwardRefExoticComponent<HeaderProps>;
export default _default;
