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
  Dimensions,
} from 'react-native'
import AppIntroSlider from 'react-native-app-intro-slider'
import Constants from 'expo-constants'
import AsyncStorage from '@react-native-async-storage/async-storage'
import DeviceInfo from 'react-native-device-info'
import { Dimensions } from 'react-native'

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
    text: `The 'Add Tree' page is where you load new tree data. Our AI feature is available to help you correctly identify what species (or genus) of tree you are identifying.`,
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

const screenWidth = Dimensions.get('screen').width
const screenHeight = Dimensions.get('screen').height

type Item = (typeof data)[0]

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'blue',
    paddingBottom: screenHeight <= 550 ? '15%' : 0,
  },
  itemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 320,
    height: 320,
    // marginVertical: 32,
    marginVertical: screenHeight <= 550 ? 16 : 32,
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

export default class AppIntroScreen extends React.Component {
  introRef: any
  constructor(props: Readonly<{}>) {
    super(props)

    this.state = {
      isShowCompass: false,
    }
  }

  _renderItem = ({ item }: { item: Item }) => {
    const windowHeight = Dimensions.get('window').height;
    const ImageHeight = (windowHeight) < 550 ? 240 : 320;
    const ImageWidth = ImageHeight;
    // console.log(windowHeight);
    // console.log(ImageHeight);
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
          <Image source={item.image} style={{ marginVertical: 32, height: ImageHeight, width: ImageWidth }} resizeMode="contain" />
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
