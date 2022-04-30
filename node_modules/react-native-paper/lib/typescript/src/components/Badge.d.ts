import * as React from 'react';
import { Animated, StyleProp, TextStyle } from 'react-native';
import { Theme } from '../types';
declare type Props = React.ComponentProps<typeof Animated.Text> & {
    /**
     * Whether the badge is visible
     */
    visible: boolean;
    /**
     * Content of the `Badge`.
     */
    children?: string | number;
    /**
     * Size of the `Badge`.
     */
    size?: number;
    style?: StyleProp<TextStyle>;
    ref?: React.RefObject<typeof Animated.Text>;
    /**
     * @optional
     */
    theme: Theme;
};
declare type State = {
    opacity: Animated.Value;
};
/**
 * Badges are small status descriptors for UI elements.
 * A badge consists of a small circle, typically containing a number or other short set of characters, that appears in proximity to another object.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img class="small" src="screenshots/badge-1.png" />
 *     <figcaption>Badge with content</figcaption>
 *   </figure>
 *   <figure>
 *     <img class="small" src="screenshots/badge-2.png" />
 *     <figcaption>Badge without content</figcaption>
 *   </figure>
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Badge } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <Badge>3</Badge>
 * );
 *
 * export default MyComponent;
 * ```
 */
declare class Badge extends React.Component<Props, State> {
    static defaultProps: {
        visible: boolean;
        size: number;
    };
    state: {
        opacity: Animated.Value;
    };
    componentDidUpdate(prevProps: Props): void;
    render(): JSX.Element;
}
declare const _default: (React.ComponentClass<Pick<any, string | number | symbol> & {
    theme?: import("@callstack/react-theme-provider").$DeepPartial<Theme> | undefined;
}, any> & import("@callstack/react-theme-provider/typings/hoist-non-react-statics").NonReactStatics<(React.ComponentClass<any, any> & typeof Badge) | (React.FunctionComponent<any> & typeof Badge), {}>) | (React.FunctionComponent<Pick<any, string | number | symbol> & {
    theme?: import("@callstack/react-theme-provider").$DeepPartial<Theme> | undefined;
}> & import("@callstack/react-theme-provider/typings/hoist-non-react-statics").NonReactStatics<(React.ComponentClass<any, any> & typeof Badge) | (React.FunctionComponent<any> & typeof Badge), {}>);
export default _default;
