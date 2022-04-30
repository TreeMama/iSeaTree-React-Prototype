import React from "react";
import { StyleProp, ViewStyle } from "react-native";
export declare type TapRatingProps = {
    /**
     * Total number of ratings to display
     *
     * Default is 5
     */
    count?: number;
    /**
     * Labels to show when each value is tapped
     *
     * e.g. If the first star is tapped, then value in index 0 will be used as the label
     *
     * Default is ['Terrible', 'Bad', 'Okay', 'Good', 'Great']
     */
    reviews?: string[];
    /**
     * Determines if to show the reviews above the rating
     *
     * Default is true
     */
    showRating?: boolean;
    /**
     * Color value for review.
     *
     * Default is #f1c40f
     */
    reviewColor?: string;
    /**
     * Size value for review.
     *
     * Default is 40
     */
    reviewSize?: number;
    /**
     * Initial value for the rating
     *
     * Default is 3
     */
    defaultRating?: number;
    /**
     * Style for star container
     *
     * Default is none
     */
    starContainerStyle?: StyleProp<ViewStyle>;
    /**
     * Callback method when the user finishes rating. Gives you the final rating value as a whole number
     */
    onFinishRating?: (number: any) => void;
    /**
     * Whether the rating can be modiefied by the user
     *
     * Default is false
     */
    isDisabled?: boolean;
    /**
     * Color value for filled stars.
     *
     * Default is #004666
     */
    selectedColor?: string;
    /**
     * Size of rating image
     *
     * Default is 40
     */
    size?: number;
    /**
     * Pass in a custom base image source
     */
    starImage?: string;
};
declare const TapRating: React.FunctionComponent<TapRatingProps>;
export default TapRating;
