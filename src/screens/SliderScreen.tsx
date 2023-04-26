import React from 'react';
import { View, Text, Image, StyleSheet, StatusBar, SafeAreaView } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';

/* `const data` is an array of objects that contains information about the slides to be displayed in
the app intro slider. Each object in the array represents a slide and contains the following
properties:
- `title`: a string representing the title of the slide
- `text`: a string representing the description of the slide
- `image`: an image source representing the image to be displayed on the slide
- `bg`: a string representing the background color of the slide. */
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

/* `const styles` is an object that contains a set of styles defined using the `StyleSheet.create()`
method. Each key in the object represents a style name, and its value is an object that contains the
style properties and their values. These styles are used to define the appearance of the slides in
the app intro slider. For example, the `slide` style defines the layout and background color of the
slide, the `image` style defines the size and margin of the image displayed on the slide, and the
`text` and `title` styles define the font size, color, and alignment of the text displayed on the
slide. These styles are then used in the `_renderItem` method to apply the styles to the components
that make up the slide. */
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
/* The code is defining a React component called `Slider` that extends the `React.Component` class. The
component takes a single prop called `dismissSlider`, which is a function that takes no arguments
and returns nothing. */

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
