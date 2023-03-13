import React from 'react';
import { RneFunctionComponent } from '../helpers';
import { ButtonProps } from './Button';
export declare type ChipProps = Omit<ButtonProps, 'loading' | 'loadingStyle' | 'loadingProps'> & {
    type?: 'solid' | 'outline';
};
declare const Chip: RneFunctionComponent<ChipProps>;
export { Chip };
declare const _default: React.FunctionComponent<Omit<ChipProps, keyof import("../config").ThemeProps<T>>> | React.ForwardRefExoticComponent<ChipProps>;
export default _default;
