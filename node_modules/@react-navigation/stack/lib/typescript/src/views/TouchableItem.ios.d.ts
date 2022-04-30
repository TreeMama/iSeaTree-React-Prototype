import * as React from 'react';
import { BaseButton } from 'react-native-gesture-handler';
declare type Props = React.ComponentProps<typeof BaseButton> & {
    pressOpacity: number;
};
export default class TouchableItem extends React.Component<Props> {
    static defaultProps: {
        pressOpacity: number;
        borderless: boolean;
        enabled: boolean;
    };
    private opacity;
    private handleActiveStateChange;
    render(): JSX.Element;
}
export {};
