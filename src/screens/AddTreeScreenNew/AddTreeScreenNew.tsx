import React from "react";
import {
    View,
    Dimensions,
    Text,
} from 'react-native'
import { Button } from 'react-native-paper'
import Constants from 'expo-constants';
import DeviceInfo from 'react-native-device-info';

const window = Dimensions.get('window');

export function AddTreeScreenNew() {
    return (
        <>
            <View>
                <Text style={{ marginTop: 50 }}>Start here</Text>
            </View>
        </>
    )
}