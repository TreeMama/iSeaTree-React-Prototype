/* eslint-disable import/no-default-export */
import React from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native'
import AppIntroSlider from 'react-native-app-intro-slider'
import Constants from 'expo-constants'
import AsyncStorage from '@react-native-async-storage/async-storage'
import DeviceInfo from 'react-native-device-info'

const data = [
  {
    key: 1,
    text: 'iSeaTree is an app that allows you to identify and learn about different tree species in the US and Canada!',
    image: require('../../../assets/TutorialPics/1.png'),
    backgroundColor: '#002642',
  },
  {
    key: 2,
    text: `Your profile page will contain the number of trees you found, and the badges you have earned. Don't forget to click the profile icon to choose your 'TreeBot' avatar!`,
    image: require('../../../assets/TutorialPics/2.png'),
    backgroundColor: '#840032',
  },
  {
    key: 3,
    text: `The 'Explore' map page shows trees that you have entered, as well as trees that others have entered. Currently the map view is set to ONLY show the trees that you have entered.`,
    image: require('../../../assets/TutorialPics/3.png'),
    backgroundColor: '#E59500',
  },
  {
    key: 4,
    text: `Change to the multiperson view to show trees that other people have entered.`,
    image: require('../../../assets/TutorialPics/4.png'),
    backgroundColor: '#064420',
  },
  {
    key: 5,
    text: `On the 'Explore' page you can also help with validating 'Unknown' tree entries to make our data even better!`,
    image: require('../../../assets/TutorialPics/5.png'),
    backgroundColor: '#033F63',
  },
  {
    key: 6,
    text: `The 'Add Tree' page is where you load new tree data. Our AI-assist feature is available to help you correctly identify what species (or genus) of tree you are identifying.`,
    image: require('../../../assets/TutorialPics/6.png'),
    backgroundColor: '#993520',
  },
  {
    key: 7,
    text: `For help identifying tree species, click on the 'Info' menu to review tree details and images.`,
    image: require('../../../assets/TutorialPics/7.png'),
    backgroundColor: '#488520',
  },
  {
    key: 8,
    text: 'There are many options we offer for helping you measure the DBH (Diameter at Breast Height) of a tree - one option uses the camera on your phone!',
    image: require('../../../assets/TutorialPics/8.png'),
    backgroundColor: '#64c7dd',
  },
  {
    key: 9,
    text: `After you add new tree data you will be able to calculate and save the 'Tree Benefits' of your tree for others to learn about!`,
    image: require('../../../assets/TutorialPics/9.png'),
    backgroundColor: '#28666E',
  },
  {
    key: 10,
    text: `Find & replay this tutorial using this icon!`,
    image: require('../../../assets/TutorialPics/10.png'),
    backgroundColor: '#13292A',
  },
]

type Item = typeof data[0]

/* `const styles` is an object that contains a set of styles for various components in the
`AppIntroScreen` component. The `StyleSheet.create()` method is used to create a stylesheet object
that can be used to style React Native components. Each key in the `styles` object represents a
component or a group of components, and the value is an object that contains the styles for that
component or group of components. For example, the `slide` key contains styles for the slides in the
tutorial, such as setting the background color to blue and centering the content. The `text` key
contains styles for the text in the slides, such as setting the font size and color. These styles
can be applied to components using the `style` prop. */
const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'blue',
  },
  itemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 320,
    height: 320,
    marginVertical: 32,
  },
  text: {
    marginHorizontal: '10%',
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
    // textAlign: 'justify',
    textAlign: 'center',
  },
  title: {
    fontSize: 22,
    color: 'white',
    textAlign: 'center',
  },
  compassIconContainer: {
    height: 50,
    width: 50,
    zIndex: 999,
    position: 'absolute',
    left: 18,
    alignItems: 'center',
    justifyContent: 'center',
    top: Constants.statusBarHeight,
    // backgroundColor: '#fff'
  },
  compassIcon: {
    height: 40,
    width: 40,
    alignSelf: 'center',
    tintColor: '#fff',
  },
})

/* This is a React component called `AppIntroScreen` that renders a series of slides using the
`AppIntroSlider` component from the `react-native-app-intro-slider` library. The slides contain
information and images about the features of an app called "iSeaTree". The component also includes
functions for handling user interactions with the slides, such as skipping the tutorial, restarting
the tutorial, and dismissing the tutorial. It also uses `AsyncStorage` to store information about
whether the user has completed the tutorial and the version of the app they are using. */

export default class AppIntroScreen extends React.Component {
  introRef: any
  constructor(props: Readonly<{}>) {
    super(props)

    this.state = {
      isShowCompass: false,
    }
  }

  _renderItem = ({ item }: { item: Item }) => {
    return (
      <View
        style={[
          styles.slide,
          {
            backgroundColor: item.backgroundColor,
          },
        ]}
      >
        <View style={styles.itemContainer}>
          <Image source={item.image} style={styles.image} resizeMode="contain" />
          <Text style={styles.text}>{item.text}</Text>
        </View>
      </View>
    )
  }

  _keyExtractor = (item: Item) => item.key.toString()

  dismissIntroSlider = async () => {
    // console.log('on dismissIntroSlider')
    const currentVersionNum = DeviceInfo.getVersion()
    await AsyncStorage.setItem('FIRST_TIME_OPEN_APP', JSON.stringify(true))
    await AsyncStorage.setItem('APP_VERSION', JSON.stringify(currentVersionNum))
    // this.props.dismissSlider()
    typeof this.props.dismissSlider === 'function'
      ? this.props.dismissSlider()
      : this.props.navigation.goBack(null)
  }

  onSkipIntro = () => {
    this.introRef.goToSlide(data.length - 1)
    this.setState({ isShowCompass: true })
  }

  onSlideChangeValue = (index: number, _lastIndex: any) => {
    if (index === data.length - 1) {
      this.setState({ isShowCompass: true })
    } else {
      this.setState({ isShowCompass: false })
    }
  }

  onRestartTutorial = () => {
    this.introRef.goToSlide(0)
    this.setState({ isShowCompass: false })
  }

  render() {
    const { isShowCompass } = this.state
    return (
      <View style={{ flex: 1 }}>
        {isShowCompass && (
          <View style={styles.compassIconContainer}>
            <TouchableOpacity activeOpacity={0.7} onPress={this.onRestartTutorial}>
              <Image
                source={require('../../../assets/profile/compass.png')}
                style={styles.compassIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        )}
        <AppIntroSlider
          ref={(el) => (this.introRef = el)}
          style={{ flex: 1, width: '100%' }}
          showSkipButton
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          data={data}
          onDone={this.dismissIntroSlider}
          onSlideChange={this.onSlideChangeValue}
          onSkip={this.onSkipIntro}
        />
      </View>
    )
  }
}
