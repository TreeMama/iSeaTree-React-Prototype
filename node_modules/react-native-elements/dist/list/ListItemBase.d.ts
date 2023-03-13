import React from 'react';
import { StyleProp, TouchableHighlightProps, ViewStyle } from 'react-native';
import { RneFunctionComponent } from '../helpers';
export declare type ListItemProps = TouchableHighlightProps & {
    containerStyle?: StyleProp<ViewStyle>;
    disabledStyle?: StyleProp<ViewStyle>;
    topDivider?: boolean;
    bottomDivider?: boolean;
    pad?: number;
    Component?: typeof React.Component;
    ViewComponent?: typeof React.Component;
    linearGradientProps?: any;
    children?: any;
};
declare const ListItemBase: RneFunctionComponent<ListItemProps>;
export { ListItemBase };
declare const _default: React.FunctionComponent<Omit<TouchableHighlightProps & {
    containerStyle?: StyleProp<ViewStyle>;
    disabledStyle?: StyleProp<ViewStyle>;
    topDivider?: boolean;
    bottomDivider?: boolean;
    pad?: number;
    Component?: typeof React.Component;
    ViewComponent?: typeof React.Component;
    linearGradientProps?: any;
    children?: any;
} & Partial<import("../config").ThemeProps<ListItemProps>>, keyof import("../config").ThemeProps<T>>> | React.ForwardRefExoticComponent<TouchableHighlightProps & {
    containerStyle?: StyleProp<ViewStyle>;
    disabledStyle?: StyleProp<ViewStyle>;
    topDivider?: boolean;
    bottomDivider?: boolean;
    pad?: number;
    Component?: typeof React.Component;
    ViewComponent?: typeof React.Component;
    linearGradientProps?: any;
    children?: any;
} & Partial<import("../config").ThemeProps<ListItemProps>>>;
export default _default;
