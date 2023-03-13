import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { RneFunctionComponent } from '../helpers';
export declare type CardProps = {
    containerStyle?: StyleProp<ViewStyle>;
    wrapperStyle?: StyleProp<ViewStyle>;
};
interface Card extends RneFunctionComponent<CardProps> {
}
declare const Card: Card;
export { Card };
declare const ThemedCard: (React.FunctionComponent<Omit<CardProps & Partial<import("../config").ThemeProps<CardProps>>, keyof import("../config").ThemeProps<T>>> | React.ForwardRefExoticComponent<CardProps & Partial<import("../config").ThemeProps<CardProps>>>) & {
    Divider: React.FunctionComponent<Omit<import("react-native").ViewProps & {
        color?: string;
        inset?: boolean;
        insetType?: "left" | "right" | "middle";
        style?: StyleProp<ViewStyle>;
        subHeader?: string;
        subHeaderStyle?: StyleProp<import("react-native").TextStyle>;
        orientation?: "horizontal" | "vertical";
        width?: number;
    } & Partial<import("../config").ThemeProps<import("..").DividerProps>>, keyof import("../config").ThemeProps<T>>> | React.ForwardRefExoticComponent<import("react-native").ViewProps & {
        color?: string;
        inset?: boolean;
        insetType?: "left" | "right" | "middle";
        style?: StyleProp<ViewStyle>;
        subHeader?: string;
        subHeaderStyle?: StyleProp<import("react-native").TextStyle>;
        orientation?: "horizontal" | "vertical";
        width?: number;
    } & Partial<import("../config").ThemeProps<import("..").DividerProps>>>;
    Image: React.FunctionComponent<Omit<import("react-native").ImageProps & {
        Component?: typeof React.Component;
        onPress?(): void;
        onLongPress?(): void;
        ImageComponent?: React.ComponentType<any>;
        PlaceholderContent?: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
        containerStyle?: StyleProp<ViewStyle>;
        childrenContainerStyle?: StyleProp<ViewStyle>;
        placeholderStyle?: StyleProp<ViewStyle>;
        transition?: boolean;
        transitionDuration?: number;
    } & Partial<import("../config").ThemeProps<import("..").ImageProps>>, keyof import("../config").ThemeProps<T>>> | React.ForwardRefExoticComponent<import("react-native").ImageProps & {
        Component?: typeof React.Component;
        onPress?(): void;
        onLongPress?(): void;
        ImageComponent?: React.ComponentType<any>;
        PlaceholderContent?: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
        containerStyle?: StyleProp<ViewStyle>;
        childrenContainerStyle?: StyleProp<ViewStyle>;
        placeholderStyle?: StyleProp<ViewStyle>;
        transition?: boolean;
        transitionDuration?: number;
    } & Partial<import("../config").ThemeProps<import("..").ImageProps>>>;
    Title: React.FunctionComponent<Omit<import("react-native").TextProps & {
        style?: StyleProp<import("react-native").TextStyle>;
        h1?: boolean;
        h2?: boolean;
        h3?: boolean;
        h4?: boolean;
        h1Style?: StyleProp<import("react-native").TextStyle>;
        h2Style?: StyleProp<import("react-native").TextStyle>;
        h3Style?: StyleProp<import("react-native").TextStyle>;
        h4Style?: StyleProp<import("react-native").TextStyle>;
    } & Partial<import("../config").ThemeProps<import("..").TextProps>>, keyof import("../config").ThemeProps<T>>> | React.ForwardRefExoticComponent<import("react-native").TextProps & {
        style?: StyleProp<import("react-native").TextStyle>;
        h1?: boolean;
        h2?: boolean;
        h3?: boolean;
        h4?: boolean;
        h1Style?: StyleProp<import("react-native").TextStyle>;
        h2Style?: StyleProp<import("react-native").TextStyle>;
        h3Style?: StyleProp<import("react-native").TextStyle>;
        h4Style?: StyleProp<import("react-native").TextStyle>;
    } & Partial<import("../config").ThemeProps<import("..").TextProps>>>;
    FeaturedTitle: React.FunctionComponent<Omit<import("react-native").TextProps & {
        style?: StyleProp<import("react-native").TextStyle>;
        h1?: boolean;
        h2?: boolean;
        h3?: boolean;
        h4?: boolean;
        h1Style?: StyleProp<import("react-native").TextStyle>;
        h2Style?: StyleProp<import("react-native").TextStyle>;
        h3Style?: StyleProp<import("react-native").TextStyle>;
        h4Style?: StyleProp<import("react-native").TextStyle>;
    } & Partial<import("../config").ThemeProps<import("..").TextProps>>, keyof import("../config").ThemeProps<T>>> | React.ForwardRefExoticComponent<import("react-native").TextProps & {
        style?: StyleProp<import("react-native").TextStyle>;
        h1?: boolean;
        h2?: boolean;
        h3?: boolean;
        h4?: boolean;
        h1Style?: StyleProp<import("react-native").TextStyle>;
        h2Style?: StyleProp<import("react-native").TextStyle>;
        h3Style?: StyleProp<import("react-native").TextStyle>;
        h4Style?: StyleProp<import("react-native").TextStyle>;
    } & Partial<import("../config").ThemeProps<import("..").TextProps>>>;
    FeaturedSubtitle: React.FunctionComponent<Omit<import("react-native").TextProps & {
        style?: StyleProp<import("react-native").TextStyle>;
        h1?: boolean;
        h2?: boolean;
        h3?: boolean;
        h4?: boolean;
        h1Style?: StyleProp<import("react-native").TextStyle>;
        h2Style?: StyleProp<import("react-native").TextStyle>;
        h3Style?: StyleProp<import("react-native").TextStyle>;
        h4Style?: StyleProp<import("react-native").TextStyle>;
    } & Partial<import("../config").ThemeProps<import("..").TextProps>>, keyof import("../config").ThemeProps<T>>> | React.ForwardRefExoticComponent<import("react-native").TextProps & {
        style?: StyleProp<import("react-native").TextStyle>;
        h1?: boolean;
        h2?: boolean;
        h3?: boolean;
        h4?: boolean;
        h1Style?: StyleProp<import("react-native").TextStyle>;
        h2Style?: StyleProp<import("react-native").TextStyle>;
        h3Style?: StyleProp<import("react-native").TextStyle>;
        h4Style?: StyleProp<import("react-native").TextStyle>;
    } & Partial<import("../config").ThemeProps<import("..").TextProps>>>;
};
export default ThemedCard;
