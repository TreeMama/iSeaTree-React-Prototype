import React from 'react';
import { View, Text, Image, StyleSheet, StatusBar, SafeAreaView } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';

const data = [
    {
        title: 'Title 1',
        text: 'Description.\nSay something cool',
        image: require('../../assets/profile/image_placeholder.png'),
        bg: '#59b2ab',
    },
    {
        title: 'Title 2',
        text: 'Other cool stuff',
        image: require('../../assets/profile/image_placeholder.png'),
        bg: '#febe29',
    },
    {
        title: 'Rocket guy',
        text: "I'm already out of descriptions\n\nLorem ipsum bla bla bla",
        image: require('../../assets/profile/image_placeholder.png'),
        bg: '#22bcb5',
    },
];

type Item = typeof data[0];

const styles = StyleSheet.create({
    slide: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'blue',
    },
    image: {
        width: 320,
        height: 320,
        marginVertical: 32,
    },
    text: {
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
    },
    title: {
        fontSize: 22,
        color: 'white',
        textAlign: 'center',
    },
});

export default class Slider extends React.Component<{ dismissSlider: () => void }> {
    _renderItem = ({ item }: { item: Item }) => {
        return (
            <View
                style={[
                    styles.slide,
                    {
                        backgroundColor: item.bg,
                    },
                ]}>
                <SafeAreaView>
                    <Text style={styles.title}>{item.title}</Text>
                    <Image source={item.image} style={styles.image} />
                    <Text style={styles.text}>{item.text}</Text>
                </SafeAreaView>

            </View>
        );
    };

    _keyExtractor = (item: Item) => item.title;

    render() {
        return (
            <View style={{ alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                <StatusBar translucent backgroundColor="transparent" />
                <View style={{ width: '90%', height: '95%' }}>
                    <AppIntroSlider
                        style={{ height: '70%', width: 'auto' }}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderItem}
                        data={data}
                        onDone={this.props.dismissSlider}
                    />
                </View>
            </View>
        );
    }
}
