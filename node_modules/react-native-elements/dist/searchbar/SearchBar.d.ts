import React from 'react';
import IOSSearchBar, { SearchBarIosProps } from './SearchBar-ios';
import { SearchBarAndroidProps } from './SearchBar-android';
import { SearchBarDefaultProps } from './SearchBar-default';
import { ActivityIndicatorProps, StyleProp, TextStyle, ViewStyle, TextInput } from 'react-native';
import { IconNode } from '../icons/Icon';
import { ThemeProps } from '../config';
export declare type SearchBarBaseProps = React.ComponentPropsWithRef<typeof TextInput> & {
    platform: 'default' | 'ios' | 'android';
    containerStyle?: StyleProp<ViewStyle>;
    inputContainerStyle?: StyleProp<ViewStyle>;
    clearIcon?: IconNode;
    searchIcon?: IconNode;
    inputStyle?: StyleProp<TextStyle>;
    loadingProps?: ActivityIndicatorProps;
    showLoading?: boolean;
    leftIconContainerStyle?: StyleProp<ViewStyle>;
    rightIconContainerStyle?: StyleProp<ViewStyle>;
    onClear?(): void;
    onFocus?(): void;
    onBlur?(): void;
    onChangeText?(text: string): void;
    onCancel?(): void;
};
export declare type SearchBarProps = SearchBarBaseProps & SearchBarDefaultProps & SearchBarAndroidProps & SearchBarIosProps;
declare class SearchBar extends React.Component<SearchBarProps & Partial<ThemeProps<SearchBarProps>>> {
    searchbar: IOSSearchBar;
    static defaultProps: {
        platform: "default";
    };
    focus: () => void;
    blur: () => void;
    clear: () => void;
    cancel: () => void;
    render(): JSX.Element;
}
export { SearchBar };
declare const _default: React.FunctionComponent<Omit<import("react-native").TextInputProps & React.RefAttributes<TextInput> & {
    platform: "ios" | "android" | "default";
    containerStyle?: StyleProp<ViewStyle>;
    inputContainerStyle?: StyleProp<ViewStyle>;
    clearIcon?: IconNode;
    searchIcon?: IconNode;
    inputStyle?: StyleProp<TextStyle>;
    loadingProps?: ActivityIndicatorProps;
    showLoading?: boolean;
    leftIconContainerStyle?: StyleProp<ViewStyle>;
    rightIconContainerStyle?: StyleProp<ViewStyle>;
    onClear?(): void;
    onFocus?(): void;
    onBlur?(): void;
    onChangeText?(text: string): void;
    onCancel?(): void;
} & {
    value: string;
    loadingProps: {};
    showLoading: boolean;
    lightTheme: boolean;
    round: boolean;
    onClear: () => any;
    onFocus: () => any;
    onBlur: () => any;
    onChangeText: () => any;
} & {
    containerStyle?: StyleProp<ViewStyle>;
    disabled?: boolean;
    disabledInputStyle?: StyleProp<TextStyle>;
    inputContainerStyle?: StyleProp<ViewStyle>;
    leftIcon?: IconNode;
    leftIconContainerStyle?: StyleProp<ViewStyle>;
    rightIcon?: IconNode;
    rightIconContainerStyle?: StyleProp<ViewStyle>;
    inputStyle?: StyleProp<TextStyle>;
    InputComponent?: typeof React.Component;
    errorProps?: object;
    errorStyle?: StyleProp<TextStyle>;
    errorMessage?: string;
    label?: React.ReactNode;
    labelStyle?: StyleProp<TextStyle>;
    labelProps?: object;
    renderErrorMessage?: boolean;
} & {
    onClear: () => any;
    onCancel: () => any;
    onFocus: () => any;
    onBlur: () => any;
    onChangeText: () => any;
} & {
    cancelIcon?: IconNode;
} & {
    value: string;
    cancelButtonTitle: string;
    loadingProps: {};
    cancelButtonProps: {};
    showLoading: boolean;
    onClear: () => any;
    onCancel: () => any;
    onFocus: () => any;
    onBlur: () => any;
    onChangeText: () => any;
    searchIcon: {
        name: string;
    };
    clearIcon: {
        name: string;
    };
    showCancel: boolean;
} & {
    cancelButtonProps?: Partial<import("react-native").TouchableOpacityProps> & {
        buttonStyle?: StyleProp<ViewStyle>;
        buttonTextStyle?: StyleProp<TextStyle>;
        color?: string;
        buttonDisabledStyle?: StyleProp<ViewStyle>;
        buttonDisabledTextStyle?: StyleProp<ViewStyle>;
    };
    cancelButtonTitle?: string;
    showCancel?: boolean;
} & Partial<ThemeProps<SearchBarProps>>, keyof ThemeProps<T>>> | React.ForwardRefExoticComponent<import("react-native").TextInputProps & React.RefAttributes<TextInput> & {
    platform: "ios" | "android" | "default";
    containerStyle?: StyleProp<ViewStyle>;
    inputContainerStyle?: StyleProp<ViewStyle>;
    clearIcon?: IconNode;
    searchIcon?: IconNode;
    inputStyle?: StyleProp<TextStyle>;
    loadingProps?: ActivityIndicatorProps;
    showLoading?: boolean;
    leftIconContainerStyle?: StyleProp<ViewStyle>;
    rightIconContainerStyle?: StyleProp<ViewStyle>;
    onClear?(): void;
    onFocus?(): void;
    onBlur?(): void;
    onChangeText?(text: string): void;
    onCancel?(): void;
} & {
    value: string;
    loadingProps: {};
    showLoading: boolean;
    lightTheme: boolean;
    round: boolean;
    onClear: () => any;
    onFocus: () => any;
    onBlur: () => any;
    onChangeText: () => any;
} & {
    containerStyle?: StyleProp<ViewStyle>;
    disabled?: boolean;
    disabledInputStyle?: StyleProp<TextStyle>;
    inputContainerStyle?: StyleProp<ViewStyle>;
    leftIcon?: IconNode;
    leftIconContainerStyle?: StyleProp<ViewStyle>;
    rightIcon?: IconNode;
    rightIconContainerStyle?: StyleProp<ViewStyle>;
    inputStyle?: StyleProp<TextStyle>;
    InputComponent?: typeof React.Component;
    errorProps?: object;
    errorStyle?: StyleProp<TextStyle>;
    errorMessage?: string;
    label?: React.ReactNode;
    labelStyle?: StyleProp<TextStyle>;
    labelProps?: object;
    renderErrorMessage?: boolean;
} & {
    onClear: () => any;
    onCancel: () => any;
    onFocus: () => any;
    onBlur: () => any;
    onChangeText: () => any;
} & {
    cancelIcon?: IconNode;
} & {
    value: string;
    cancelButtonTitle: string;
    loadingProps: {};
    cancelButtonProps: {};
    showLoading: boolean;
    onClear: () => any;
    onCancel: () => any;
    onFocus: () => any;
    onBlur: () => any;
    onChangeText: () => any;
    searchIcon: {
        name: string;
    };
    clearIcon: {
        name: string;
    };
    showCancel: boolean;
} & {
    cancelButtonProps?: Partial<import("react-native").TouchableOpacityProps> & {
        buttonStyle?: StyleProp<ViewStyle>;
        buttonTextStyle?: StyleProp<TextStyle>;
        color?: string;
        buttonDisabledStyle?: StyleProp<ViewStyle>;
        buttonDisabledTextStyle?: StyleProp<ViewStyle>;
    };
    cancelButtonTitle?: string;
    showCancel?: boolean;
} & Partial<ThemeProps<SearchBarProps>>>;
export default _default;
