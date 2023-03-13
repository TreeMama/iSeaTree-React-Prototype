import React from 'react';
import { OverlayProps } from '../overlay/Overlay';
import { Theme } from '../config/theme';
import DialogLoading from './DialogLoading';
import DialogTitle from './DialogTitle';
import DialogButton from './DialogButton';
import DialogActions from './DialogActions';
export declare type DialogProps = Omit<OverlayProps, 'fullScreen'> & {
    theme?: Theme;
    children?: any;
};
interface Dialog extends React.FunctionComponent<DialogProps> {
    Loading: typeof DialogLoading;
    Title: typeof DialogTitle;
    Actions: typeof DialogActions;
    Button: typeof DialogButton;
}
declare const Dialog: Dialog;
export { Dialog };
declare const ThemedDialog: (React.FunctionComponent<Omit<Omit<OverlayProps, "fullScreen"> & {
    theme?: Theme;
    children?: any;
}, keyof import("../config").ThemeProps<T>>> | React.ForwardRefExoticComponent<Omit<OverlayProps, "fullScreen"> & {
    theme?: Theme;
    children?: any;
}>) & {
    Loading: React.FunctionComponent<Omit<import("./DialogLoading").DialogLoadingProps, keyof import("../config").ThemeProps<T>>> | React.ForwardRefExoticComponent<import("./DialogLoading").DialogLoadingProps>;
    Title: React.FunctionComponent<Omit<import("./DialogTitle").DialogTitleProps, keyof import("../config").ThemeProps<T>>> | React.ForwardRefExoticComponent<import("./DialogTitle").DialogTitleProps>;
    Actions: React.FunctionComponent<Omit<import("./DialogActions").DialogActionsProps, keyof import("../config").ThemeProps<T>>> | React.ForwardRefExoticComponent<import("./DialogActions").DialogActionsProps>;
    Button: React.FunctionComponent<Omit<import("react-native").TouchableOpacityProps & import("react-native").TouchableNativeFeedbackProps & {
        title?: string | React.ReactElement<{}, string | React.JSXElementConstructor<any>>;
        titleStyle?: import("react-native").StyleProp<import("react-native").TextStyle>;
        titleProps?: import("..").TextProps;
        buttonStyle?: import("react-native").StyleProp<import("react-native").ViewStyle>;
        type?: "solid" | "clear" | "outline";
        loading?: boolean;
        loadingStyle?: import("react-native").StyleProp<import("react-native").ViewStyle>;
        loadingProps?: import("react-native").ActivityIndicatorProps;
        containerStyle?: import("react-native").StyleProp<import("react-native").ViewStyle>;
        icon?: import("../icons/Icon").IconNode;
        iconContainerStyle?: import("react-native").StyleProp<import("react-native").ViewStyle>;
        iconRight?: boolean;
        linearGradientProps?: object;
        TouchableComponent?: typeof React.Component;
        ViewComponent?: typeof React.Component;
        disabled?: boolean;
        disabledStyle?: import("react-native").StyleProp<import("react-native").ViewStyle>;
        disabledTitleStyle?: import("react-native").StyleProp<import("react-native").TextStyle>;
        raised?: boolean;
        iconPosition?: "bottom" | "left" | "right" | "top";
    }, keyof import("../config").ThemeProps<T>>> | React.ForwardRefExoticComponent<import("react-native").TouchableOpacityProps & import("react-native").TouchableNativeFeedbackProps & {
        title?: string | React.ReactElement<{}, string | React.JSXElementConstructor<any>>;
        titleStyle?: import("react-native").StyleProp<import("react-native").TextStyle>;
        titleProps?: import("..").TextProps;
        buttonStyle?: import("react-native").StyleProp<import("react-native").ViewStyle>;
        type?: "solid" | "clear" | "outline";
        loading?: boolean;
        loadingStyle?: import("react-native").StyleProp<import("react-native").ViewStyle>;
        loadingProps?: import("react-native").ActivityIndicatorProps;
        containerStyle?: import("react-native").StyleProp<import("react-native").ViewStyle>;
        icon?: import("../icons/Icon").IconNode;
        iconContainerStyle?: import("react-native").StyleProp<import("react-native").ViewStyle>;
        iconRight?: boolean;
        linearGradientProps?: object;
        TouchableComponent?: typeof React.Component;
        ViewComponent?: typeof React.Component;
        disabled?: boolean;
        disabledStyle?: import("react-native").StyleProp<import("react-native").ViewStyle>;
        disabledTitleStyle?: import("react-native").StyleProp<import("react-native").TextStyle>;
        raised?: boolean;
        iconPosition?: "bottom" | "left" | "right" | "top";
    }>;
};
export default ThemedDialog;
