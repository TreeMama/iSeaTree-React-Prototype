import React, { Component } from "react";
import { StyleProp, ViewStyle } from "react-native";
declare const fractionsType: any;
export declare type SwipeRatingProps = {
    /**
     * Graphic used for represent a rating
     *
     * Default is 'star'
     */
    type?: string;
    /**
     * Pass in a custom image source; use this along with type='custom' prop above
     */
    ratingImage?: React.ReactNode;
    /**
     * Pass in a custom fill-color for the rating icon; use this along with type='custom' prop above
     *
     * Default is '#f1c40f'
     */
    ratingColor?: string;
    /**
     * Pass in a custom background-fill-color for the rating icon; use this along with type='custom' prop above
     *
     * Default is 'white'
     */
    ratingBackgroundColor?: string;
    /**
     * Number of rating images to display
     *
     * Default is 5
     */
    ratingCount?: number;
    /**
     * Color used for the text labels
     */
    ratingTextColor?: string;
    /**
     * The size of each rating image
     *
     * Default is 50
     */
    imageSize?: number;
    /**
     * Callback method when the user starts rating.
     */
    onStartRating?: Function;
    /**
     * Callback method when the user finishes rating. Gives you the final rating value as a whole number
     */
    onFinishRating?: Function;
    /**
     * Displays the Built-in Rating UI to show the rating value in real-time
     *
     * Default is false
     */
    showRating?: boolean;
    /**
     * Exposes style prop to add additonal styling to the container view
     */
    style?: StyleProp<ViewStyle>;
    /**
     * Whether the rating can be modiefied by the user
     *
     * Default is false
     */
    readonly?: boolean;
    /**
     * Whether the text is read only
     *
     * Default is false
     */
    showReadOnlyText?: boolean;
    /**
     * The initial rating to render
     *
     * Default is ratingCount/2
     */
    startingValue?: number;
    /**
     * The number of decimal places for the rating value; must be between 0 and 20
     */
    fractions?: typeof fractionsType;
    /**
     * The minimum value the user can select
     *
     * Default is 0
     */
    minValue?: number;
    /**
     * Callback method when the user is swiping.
     */
    onSwipeRating?: (number: any) => void;
    /**
     * Color used for the background
     */
    tintColor?: string;
    /**
     * The number to jump per swipe
     * Default is 0 (not to jump)
     */
    jumpValue?: number;
};
declare type SwipeRatingState = {
    isComponentMounted: boolean;
    position: any;
    value?: number;
    centerX?: number;
    display: boolean;
    panResponder: any;
};
export default class SwipeRating extends Component<SwipeRatingProps, SwipeRatingState> {
    static defaultProps: {
        type: string;
        ratingImage: any;
        ratingColor: string;
        ratingBackgroundColor: string;
        ratingCount: number;
        showReadOnlyText: boolean;
        imageSize: number;
        minValue: number;
        jumpValue: number;
    };
    ratingRef: any;
    constructor(props: any);
    componentDidMount(): void;
    componentDidUpdate(prevProps: any): void;
    handleLayoutChange(): void;
    getPrimaryViewStyle(): {
        backgroundColor: any;
        width: any;
        height: number;
    };
    getSecondaryViewStyle(): {
        backgroundColor: any;
        width: any;
        height: number;
    };
    renderRatings(): any;
    getCurrentRating(value: any): number;
    setCurrentRating(rating: any): void;
    displayCurrentRating(): JSX.Element;
    render(): JSX.Element;
    componentWillUnmount(): void;
}
export {};
