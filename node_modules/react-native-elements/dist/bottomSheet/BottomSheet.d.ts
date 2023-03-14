import React from 'react';
import { StyleProp, ViewStyle, ModalProps } from 'react-native';
import { RneFunctionComponent } from '../helpers';
export declare type BottomSheetProps = {
    containerStyle?: StyleProp<ViewStyle>;
    modalProps?: ModalProps;
    isVisible?: boolean;
};
declare const BottomSheet: RneFunctionComponent<BottomSheetProps>;
export { BottomSheet };
declare const _default: React.FunctionComponent<Omit<BottomSheetProps & Partial<import("../config").ThemeProps<BottomSheetProps>>, keyof import("../config").ThemeProps<T>>> | React.ForwardRefExoticComponent<BottomSheetProps & Partial<import("../config").ThemeProps<BottomSheetProps>>>;
export default _default;
