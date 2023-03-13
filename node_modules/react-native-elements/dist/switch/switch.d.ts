import React from 'react';
import { SwitchProps as NativeSwitchProps } from 'react-native';
import { RneFunctionComponent } from '../helpers';
export declare type SwitchProps = NativeSwitchProps & {
    color?: string;
};
declare const Switch: RneFunctionComponent<SwitchProps>;
export { Switch };
declare const _default: React.FunctionComponent<Omit<NativeSwitchProps & {
    color?: string;
} & Partial<import("../config").ThemeProps<SwitchProps>>, keyof import("../config").ThemeProps<T>>> | React.ForwardRefExoticComponent<NativeSwitchProps & {
    color?: string;
} & Partial<import("../config").ThemeProps<SwitchProps>>>;
export default _default;
