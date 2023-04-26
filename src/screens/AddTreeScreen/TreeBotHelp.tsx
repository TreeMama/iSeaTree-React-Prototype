/**
 * The function TreeBotHelp displays a button with a tooltip that opens a modal with instructions when
 * clicked.
 * @returns The `TreeBotHelp` component is being returned, which renders a `ControlledTooltip`
 * component wrapped around a `Button` component. When the button is pressed, it sets the
 * `isModalVisible` state to `true`. The `TreeBotHelp` component also imports and uses various
 * components from `react-native`, `react-native-paper`, and `@rneui/themed`.
 */

import React from 'react'

import { Modal, View, ScrollView, Image } from 'react-native'
import { Text, Title, Headline, Button, useTheme } from 'react-native-paper'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Tooltip, lightColors } from '@rneui/themed';
import { StatusBar } from '../../components/StatusBar'

const imageStep1 = require('../../../assets/dbh-help/step_1.png')
const imageStep2 = require('../../../assets/dbh-help/step_2.png')
const imageStep3 = require('../../../assets/dbh-help/step_3.png')
const imageStep4 = require('../../../assets/dbh-help/step_4.png')
const imageStep5 = require('../../../assets/dbh-help/step_5.png')

/**
 * This is a TypeScript React component that renders a controlled tooltip.
 * @param props - The `props` parameter is an object that contains all the properties passed to the
 * `ControlledTooltip` component. These properties can include things like the content of the tooltip,
 * the placement of the tooltip, and any additional styling or classes to apply to the tooltip. The
 * `TooltipProps` type specifies
 * @returns A React functional component named `ControlledTooltip` that takes in `TooltipProps` as its
 * props and renders a `Tooltip` component with additional state management. The `open` state is
 * initialized to `false` using the `useState` hook. The `Tooltip` component is rendered with the
 * `visible` prop set to the `open` state, and the `onOpen` and `on
 */
const ControlledTooltip: React.FC<TooltipProps> = (props) => {
    const [open, setOpen] = React.useState(false);
    return (
        <Tooltip
            visible={open}
            onOpen={() => {
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
            }}
            {...props}
        />
    );
};

/**
 * This is a TypeScript React component that renders a button with a tooltip that displays a help modal
 * when clicked.
 * @returns A component that renders a button with a help icon. When the button is pressed, a modal is
 * displayed with additional help information. The modal is controlled by the `isModalVisible` state
 * variable. The component also uses a `ControlledTooltip` component to display a tooltip when the user
 * hovers over the button.
 */
export function TreeBotHelp() {
    const [isModalVisible, setIsModalVisible] = React.useState<boolean>(false)
    const theme = useTheme()

    return (
        <View>
            <ControlledTooltip
                popover={<Text>no caret!</Text>}
                withPointer={false}
            >
                <Button
                    onPress={() => {
                        setIsModalVisible(true)
                    }}
                >
                    <MaterialCommunityIcons name="help-circle-outline" size={20} color={theme.colors.primary} />
                </Button>
            </ControlledTooltip>
        </View>
    )
}
