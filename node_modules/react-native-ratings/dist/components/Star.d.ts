import React from "react";
import { StyleProp, ViewStyle } from "react-native";
export declare type StarProps = {
    starImage?: string;
    fill?: boolean;
    size?: number;
    selectedColor?: string;
    unSelectedColor?: string;
    isDisabled?: boolean;
    starStyle?: StyleProp<ViewStyle>;
    position?: number;
    starSelectedInPosition?: (number: any) => void;
};
declare const Star: React.FunctionComponent<StarProps>;
export default Star;
