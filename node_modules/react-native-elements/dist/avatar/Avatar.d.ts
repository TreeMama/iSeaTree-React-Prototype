import React from 'react';
import { StyleProp, ViewStyle, TextStyle, ImageSourcePropType, ImageStyle } from 'react-native';
import { RneFunctionComponent } from '../helpers';
import { IconObject } from '../icons/Icon';
import { ImageProps } from '../image/Image';
interface AvatarIcon extends IconObject {
    iconStyle?: StyleProp<TextStyle>;
}
export declare type AvatarProps = {
    Component?: typeof React.Component;
    onPress?(): void;
    onLongPress?(): void;
    containerStyle?: StyleProp<ViewStyle>;
    source?: ImageSourcePropType;
    avatarStyle?: ImageStyle;
    rounded?: boolean;
    title?: string;
    titleStyle?: StyleProp<TextStyle>;
    overlayContainerStyle?: StyleProp<TextStyle>;
    activeOpacity?: number;
    icon?: AvatarIcon;
    iconStyle?: StyleProp<TextStyle>;
    size?: ('small' | 'medium' | 'large' | 'xlarge') | number;
    placeholderStyle?: StyleProp<ViewStyle>;
    renderPlaceholderContent?: React.ReactElement<{}>;
    imageProps?: Partial<ImageProps>;
    ImageComponent?: React.ComponentClass;
};
interface Avatar extends RneFunctionComponent<AvatarProps> {
}
declare const Avatar: React.NamedExoticComponent<AvatarProps & Partial<import("../config").ThemeProps<AvatarProps>>>;
export { Avatar };
declare const ThemedAvatar: (React.FunctionComponent<Omit<AvatarProps & Partial<import("../config").ThemeProps<AvatarProps>>, keyof import("../config").ThemeProps<T>>> | React.ForwardRefExoticComponent<AvatarProps & Partial<import("../config").ThemeProps<AvatarProps>>>) & {
    Accessory: React.FunctionComponent<Omit<Partial<import("../icons/Icon").IconProps> & Partial<ImageProps> & {
        underlayColor?: import("react-native").ColorValue;
        style?: StyleProp<ViewStyle>;
    } & Partial<import("../config").ThemeProps<import("./Accessory").AccessoryProps>>, keyof import("../config").ThemeProps<T>>> | React.ForwardRefExoticComponent<Partial<import("../icons/Icon").IconProps> & Partial<ImageProps> & {
        underlayColor?: import("react-native").ColorValue;
        style?: StyleProp<ViewStyle>;
    } & Partial<import("../config").ThemeProps<import("./Accessory").AccessoryProps>>>;
};
export default ThemedAvatar;
