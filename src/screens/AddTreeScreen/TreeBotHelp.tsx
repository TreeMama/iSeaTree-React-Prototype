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
