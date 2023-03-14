/// <reference types="react" />
import { ListItemProps } from './ListItemBase';
import ListItemContent from './ListItemContent';
import ListItemChevron from './ListItemChevron';
import ListItemInput from './ListItemInput';
import ListItemCheckBox from './ListItemCheckBox';
import ListItemButtonGroup from './ListItemButtonGroup';
import ListItemTitle from './ListItemTitle';
import ListItemSubtitle from './ListItemSubtitle';
import ListItemSwipeable from './ListItemSwipeable';
import ListItemAccordion from './ListItemAccordion';
import { RneFunctionComponent } from '../helpers';
interface ListItem extends RneFunctionComponent<ListItemProps> {
    Accordion: typeof ListItemAccordion;
    Chevron: typeof ListItemChevron;
    Content: typeof ListItemContent;
    Input: typeof ListItemInput;
    Title: typeof ListItemTitle;
    Subtitle: typeof ListItemSubtitle;
    Swipeable: typeof ListItemSwipeable;
    CheckBox: typeof ListItemCheckBox;
    ButtonGroup: typeof ListItemButtonGroup;
}
declare const ListItem: ListItem;
export { ListItem };
declare const ThemedListItem: (import("react").FunctionComponent<Omit<import("react-native").TouchableHighlightProps & {
    containerStyle?: import("react-native").StyleProp<import("react-native").ViewStyle>;
    disabledStyle?: import("react-native").StyleProp<import("react-native").ViewStyle>;
    topDivider?: boolean;
    bottomDivider?: boolean;
    pad?: number;
    Component?: typeof import("react").Component;
    ViewComponent?: typeof import("react").Component;
    linearGradientProps?: any;
    children?: any;
} & Partial<import("../config").ThemeProps<ListItemProps>>, keyof import("../config").ThemeProps<T>>> | import("react").ForwardRefExoticComponent<import("react-native").TouchableHighlightProps & {
    containerStyle?: import("react-native").StyleProp<import("react-native").ViewStyle>;
    disabledStyle?: import("react-native").StyleProp<import("react-native").ViewStyle>;
    topDivider?: boolean;
    bottomDivider?: boolean;
    pad?: number;
    Component?: typeof import("react").Component;
    ViewComponent?: typeof import("react").Component;
    linearGradientProps?: any;
    children?: any;
} & Partial<import("../config").ThemeProps<ListItemProps>>>) & {
    Accordion: import("react").FunctionComponent<Omit<import("react-native").TouchableHighlightProps & {
        containerStyle?: import("react-native").StyleProp<import("react-native").ViewStyle>;
        disabledStyle?: import("react-native").StyleProp<import("react-native").ViewStyle>;
        topDivider?: boolean;
        bottomDivider?: boolean;
        pad?: number;
        Component?: typeof import("react").Component;
        ViewComponent?: typeof import("react").Component;
        linearGradientProps?: any;
        children?: any;
    } & {
        isExpanded?: boolean;
        icon?: import("../icons/Icon").IconNode;
        expandIcon?: import("../icons/Icon").IconNode;
        content?: import("react").ReactNode;
        noRotation?: boolean;
        noIcon?: boolean;
        animation?: boolean | {
            type?: "spring" | "timing";
            duration?: number;
        };
    } & Partial<import("../config").ThemeProps<import("./ListItemAccordion").ListItemAccordionProps>>, keyof import("../config").ThemeProps<T>>> | import("react").ForwardRefExoticComponent<import("react-native").TouchableHighlightProps & {
        containerStyle?: import("react-native").StyleProp<import("react-native").ViewStyle>;
        disabledStyle?: import("react-native").StyleProp<import("react-native").ViewStyle>;
        topDivider?: boolean;
        bottomDivider?: boolean;
        pad?: number;
        Component?: typeof import("react").Component;
        ViewComponent?: typeof import("react").Component;
        linearGradientProps?: any;
        children?: any;
    } & {
        isExpanded?: boolean;
        icon?: import("../icons/Icon").IconNode;
        expandIcon?: import("../icons/Icon").IconNode;
        content?: import("react").ReactNode;
        noRotation?: boolean;
        noIcon?: boolean;
        animation?: boolean | {
            type?: "spring" | "timing";
            duration?: number;
        };
    } & Partial<import("../config").ThemeProps<import("./ListItemAccordion").ListItemAccordionProps>>>;
    Chevron: import("react").FunctionComponent<Omit<Partial<import("..").IconProps> & Partial<import("../config").ThemeProps<Partial<import("..").IconProps>>>, keyof import("../config").ThemeProps<T>>> | import("react").ForwardRefExoticComponent<Partial<import("..").IconProps> & Partial<import("../config").ThemeProps<Partial<import("..").IconProps>>>>;
    Content: import("react").FunctionComponent<Omit<import("react-native").TextProps & {
        style?: import("react-native").StyleProp<import("react-native").TextStyle>;
        h1?: boolean;
        h2?: boolean;
        h3?: boolean;
        h4?: boolean;
        h1Style?: import("react-native").StyleProp<import("react-native").TextStyle>;
        h2Style?: import("react-native").StyleProp<import("react-native").TextStyle>;
        h3Style?: import("react-native").StyleProp<import("react-native").TextStyle>;
        h4Style?: import("react-native").StyleProp<import("react-native").TextStyle>;
    } & {
        right?: boolean;
    } & Partial<import("../config").ThemeProps<import("react-native").TextProps & {
        style?: import("react-native").StyleProp<import("react-native").TextStyle>;
        h1?: boolean;
        h2?: boolean;
        h3?: boolean;
        h4?: boolean;
        h1Style?: import("react-native").StyleProp<import("react-native").TextStyle>;
        h2Style?: import("react-native").StyleProp<import("react-native").TextStyle>;
        h3Style?: import("react-native").StyleProp<import("react-native").TextStyle>;
        h4Style?: import("react-native").StyleProp<import("react-native").TextStyle>;
    } & {
        right?: boolean;
    }>>, keyof import("../config").ThemeProps<T>>> | import("react").ForwardRefExoticComponent<import("react-native").TextProps & {
        style?: import("react-native").StyleProp<import("react-native").TextStyle>;
        h1?: boolean;
        h2?: boolean;
        h3?: boolean;
        h4?: boolean;
        h1Style?: import("react-native").StyleProp<import("react-native").TextStyle>;
        h2Style?: import("react-native").StyleProp<import("react-native").TextStyle>;
        h3Style?: import("react-native").StyleProp<import("react-native").TextStyle>;
        h4Style?: import("react-native").StyleProp<import("react-native").TextStyle>;
    } & {
        right?: boolean;
    } & Partial<import("../config").ThemeProps<import("react-native").TextProps & {
        style?: import("react-native").StyleProp<import("react-native").TextStyle>;
        h1?: boolean;
        h2?: boolean;
        h3?: boolean;
        h4?: boolean;
        h1Style?: import("react-native").StyleProp<import("react-native").TextStyle>;
        h2Style?: import("react-native").StyleProp<import("react-native").TextStyle>;
        h3Style?: import("react-native").StyleProp<import("react-native").TextStyle>;
        h4Style?: import("react-native").StyleProp<import("react-native").TextStyle>;
    } & {
        right?: boolean;
    }>>>;
    Input: import("react").FunctionComponent<Omit<import("react-native").TextInputProps & import("react").RefAttributes<import("react-native").TextInput> & {
        containerStyle?: import("react-native").StyleProp<import("react-native").ViewStyle>;
        disabled?: boolean;
        disabledInputStyle?: import("react-native").StyleProp<import("react-native").TextStyle>;
        inputContainerStyle?: import("react-native").StyleProp<import("react-native").ViewStyle>;
        leftIcon?: import("../icons/Icon").IconNode;
        leftIconContainerStyle?: import("react-native").StyleProp<import("react-native").ViewStyle>;
        rightIcon?: import("../icons/Icon").IconNode;
        rightIconContainerStyle?: import("react-native").StyleProp<import("react-native").ViewStyle>;
        inputStyle?: import("react-native").StyleProp<import("react-native").TextStyle>;
        InputComponent?: typeof import("react").Component;
        errorProps?: object;
        errorStyle?: import("react-native").StyleProp<import("react-native").TextStyle>;
        errorMessage?: string;
        label?: import("react").ReactNode;
        labelStyle?: import("react-native").StyleProp<import("react-native").TextStyle>;
        labelProps?: object;
        renderErrorMessage?: boolean;
    } & Partial<import("../config").ThemeProps<import("..").InputProps>>, keyof import("../config").ThemeProps<T>>> | import("react").ForwardRefExoticComponent<import("react-native").TextInputProps & import("react").RefAttributes<import("react-native").TextInput> & {
        containerStyle?: import("react-native").StyleProp<import("react-native").ViewStyle>;
        disabled?: boolean;
        disabledInputStyle?: import("react-native").StyleProp<import("react-native").TextStyle>;
        inputContainerStyle?: import("react-native").StyleProp<import("react-native").ViewStyle>;
        leftIcon?: import("../icons/Icon").IconNode;
        leftIconContainerStyle?: import("react-native").StyleProp<import("react-native").ViewStyle>;
        rightIcon?: import("../icons/Icon").IconNode;
        rightIconContainerStyle?: import("react-native").StyleProp<import("react-native").ViewStyle>;
        inputStyle?: import("react-native").StyleProp<import("react-native").TextStyle>;
        InputComponent?: typeof import("react").Component;
        errorProps?: object;
        errorStyle?: import("react-native").StyleProp<import("react-native").TextStyle>;
        errorMessage?: string;
        label?: import("react").ReactNode;
        labelStyle?: import("react-native").StyleProp<import("react-native").TextStyle>;
        labelProps?: object;
        renderErrorMessage?: boolean;
    } & Partial<import("../config").ThemeProps<import("..").InputProps>>>;
    Title: import("react").FunctionComponent<Omit<import("react-native").TextProps & {
        right?: boolean;
    } & Partial<import("../config").ThemeProps<import("react-native").TextProps & {
        right?: boolean;
    }>>, keyof import("../config").ThemeProps<T>>> | import("react").ForwardRefExoticComponent<import("react-native").TextProps & {
        right?: boolean;
    } & Partial<import("../config").ThemeProps<import("react-native").TextProps & {
        right?: boolean;
    }>>>;
    Subtitle: import("react").FunctionComponent<Omit<import("react-native").TextProps & {
        right?: boolean;
    } & Partial<import("../config").ThemeProps<import("react-native").TextProps & {
        right?: boolean;
    }>>, keyof import("../config").ThemeProps<T>>> | import("react").ForwardRefExoticComponent<import("react-native").TextProps & {
        right?: boolean;
    } & Partial<import("../config").ThemeProps<import("react-native").TextProps & {
        right?: boolean;
    }>>>;
    Swipeable: RneFunctionComponent<import("./ListItemSwipeable").ListItemSwipeableProps>;
    CheckBox: import("react").FunctionComponent<Omit<import("react-native").TouchableOpacityProps & import("../checkbox/CheckBoxIcon").CheckBoxIconProps & {
        Component?: typeof import("react").Component;
        iconRight?: boolean;
        title?: string | import("react").ReactElement<{}, string | import("react").JSXElementConstructor<any>>;
        titleProps?: import("react-native").TextProps;
        center?: boolean;
        right?: boolean;
        containerStyle?: import("react-native").StyleProp<import("react-native").ViewStyle>;
        wrapperStyle?: import("react-native").StyleProp<import("react-native").ViewStyle>;
        textStyle?: import("react-native").StyleProp<import("react-native").TextStyle>;
        checkedTitle?: string;
        fontFamily?: string;
    } & Partial<import("../config").ThemeProps<import("..").CheckBoxProps>>, keyof import("../config").ThemeProps<T>>> | import("react").ForwardRefExoticComponent<import("react-native").TouchableOpacityProps & import("../checkbox/CheckBoxIcon").CheckBoxIconProps & {
        Component?: typeof import("react").Component;
        iconRight?: boolean;
        title?: string | import("react").ReactElement<{}, string | import("react").JSXElementConstructor<any>>;
        titleProps?: import("react-native").TextProps;
        center?: boolean;
        right?: boolean;
        containerStyle?: import("react-native").StyleProp<import("react-native").ViewStyle>;
        wrapperStyle?: import("react-native").StyleProp<import("react-native").ViewStyle>;
        textStyle?: import("react-native").StyleProp<import("react-native").TextStyle>;
        checkedTitle?: string;
        fontFamily?: string;
    } & Partial<import("../config").ThemeProps<import("..").CheckBoxProps>>>;
    ButtonGroup: import("react").FunctionComponent<Omit<import("..").ButtonGroupProps & Partial<import("../config").ThemeProps<import("..").ButtonGroupProps>>, keyof import("../config").ThemeProps<T>>> | import("react").ForwardRefExoticComponent<import("..").ButtonGroupProps & Partial<import("../config").ThemeProps<import("..").ButtonGroupProps>>>;
};
export default ThemedListItem;
