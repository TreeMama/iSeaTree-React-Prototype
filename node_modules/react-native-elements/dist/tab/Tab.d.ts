import React from 'react';
import { StyleProp, ViewStyle, ViewProps } from 'react-native';
import { ButtonProps } from '../buttons/Button';
import { RneFunctionComponent } from '../helpers';
export declare type TabItemProps = ButtonProps & {
    active?: boolean;
    variant?: 'primary' | 'default';
};
declare const TabItem: RneFunctionComponent<TabItemProps>;
export declare type TabProps = ViewProps & {
    value?: number;
    onChange?: (value: number) => void;
    disableIndicator?: boolean;
    indicatorStyle?: StyleProp<ViewStyle>;
    variant?: 'primary' | 'default';
};
interface Tab extends RneFunctionComponent<TabProps> {
    Item: typeof TabItem;
}
declare const Tab: Tab;
export { Tab };
declare const _default: (React.FunctionComponent<Omit<ViewProps & {
    value?: number;
    onChange?: (value: number) => void;
    disableIndicator?: boolean;
    indicatorStyle?: StyleProp<ViewStyle>;
    variant?: "default" | "primary";
} & Partial<import("../config").ThemeProps<TabProps>>, keyof import("../config").ThemeProps<T>>> | React.ForwardRefExoticComponent<ViewProps & {
    value?: number;
    onChange?: (value: number) => void;
    disableIndicator?: boolean;
    indicatorStyle?: StyleProp<ViewStyle>;
    variant?: "default" | "primary";
} & Partial<import("../config").ThemeProps<TabProps>>>) & {
    Item: React.FunctionComponent<Omit<import("react-native").TouchableOpacityProps & import("react-native").TouchableNativeFeedbackProps & {
        title?: string | React.ReactElement<{}, string | React.JSXElementConstructor<any>>;
        titleStyle?: StyleProp<import("react-native").TextStyle>;
        titleProps?: import("..").TextProps;
        buttonStyle?: StyleProp<ViewStyle>;
        type?: "solid" | "clear" | "outline";
        loading?: boolean;
        loadingStyle?: StyleProp<ViewStyle>;
        loadingProps?: import("react-native").ActivityIndicatorProps;
        containerStyle?: StyleProp<ViewStyle>;
        icon?: import("../icons/Icon").IconNode;
        iconContainerStyle?: StyleProp<ViewStyle>;
        iconRight?: boolean;
        linearGradientProps?: object;
        TouchableComponent?: typeof React.Component;
        ViewComponent?: typeof React.Component;
        disabled?: boolean;
        disabledStyle?: StyleProp<ViewStyle>;
        disabledTitleStyle?: StyleProp<import("react-native").TextStyle>;
        raised?: boolean;
        iconPosition?: "bottom" | "left" | "right" | "top";
    } & {
        active?: boolean;
        variant?: "default" | "primary";
    } & Partial<import("../config").ThemeProps<TabItemProps>>, keyof import("../config").ThemeProps<T>>> | React.ForwardRefExoticComponent<import("react-native").TouchableOpacityProps & import("react-native").TouchableNativeFeedbackProps & {
        title?: string | React.ReactElement<{}, string | React.JSXElementConstructor<any>>;
        titleStyle?: StyleProp<import("react-native").TextStyle>;
        titleProps?: import("..").TextProps;
        buttonStyle?: StyleProp<ViewStyle>;
        type?: "solid" | "clear" | "outline";
        loading?: boolean;
        loadingStyle?: StyleProp<ViewStyle>;
        loadingProps?: import("react-native").ActivityIndicatorProps;
        containerStyle?: StyleProp<ViewStyle>;
        icon?: import("../icons/Icon").IconNode;
        iconContainerStyle?: StyleProp<ViewStyle>;
        iconRight?: boolean;
        linearGradientProps?: object;
        TouchableComponent?: typeof React.Component;
        ViewComponent?: typeof React.Component;
        disabled?: boolean;
        disabledStyle?: StyleProp<ViewStyle>;
        disabledTitleStyle?: StyleProp<import("react-native").TextStyle>;
        raised?: boolean;
        iconPosition?: "bottom" | "left" | "right" | "top";
    } & {
        active?: boolean;
        variant?: "default" | "primary";
    } & Partial<import("../config").ThemeProps<TabItemProps>>>;
};
export default _default;
