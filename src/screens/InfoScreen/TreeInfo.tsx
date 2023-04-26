/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/namespace */
import React from 'react'
import {
  View,
  Image,
  Modal,
  Dimensions,
  Text as RNText,
  Alert,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native'
import { CONFIG } from '../../../envVariables'
import { Button, DefaultTheme } from 'react-native-paper'
import { ScrollView } from 'react-native-gesture-handler'
import { SpeciesData } from '../AddTreeScreen/SpeciesSelect'
import Carousel, { Pagination } from 'react-native-snap-carousel'
import { StatusBar } from '../../components/StatusBar'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs/lib/typescript/src/types'

const infoImage = require('../../../assets/info.png')
const arrowUp = require('../../../assets/arrow_up.png')
const arrowDown = require('../../../assets/arrow_down.png')
const searchImage = require('../../../assets/trees.png')
const treeConifer = require('../../../assets/tree_Conifer3X-01.png')
const treeBroadleaf = require('../../../assets/tree_Deciduous3X-01.png')

type TreeInfoNavigation = MaterialBottomTabNavigationProp<any, 'Profile'>

/* The code is defining an interface `ITreeInfoProps` with four properties: `selectedTree`,
`setSelectedTree`, `navigation`, `isFromMapScreen`, and `setIsFromMapScreen`. These properties are
used to pass data and functions as props to a React component that displays information about a
selected tree. The `selectedTree` property is of type `SpeciesData`, which is not defined in the
code snippet. The `setSelectedTree` property is a function that takes a `React.SetStateAction` of
`SpeciesData` or `undefined`. The `navigation` */
interface ITreeInfoProps {
  selectedTree: SpeciesData
  setSelectedTree: React.Dispatch<React.SetStateAction<SpeciesData | undefined>>
  navigation: TreeInfoNavigation
  isFromMapScreen: boolean
  setIsFromMapScreen: React.Dispatch<React.SetStateAction<boolean | false>>
}

/* The code is written in TypeScript for a React application. It is importing the `Dimensions`
module and using the `get` method to retrieve the width of the viewport from the `window` object.
The retrieved value is then assigned to a constant variable named `viewportWidth` using object
destructuring syntax. */
const { width: viewportWidth } = Dimensions.get('window')

/* The code is defining a StyleSheet object with various styles for a list item component in a
React Native app. It includes styles for the list item container, the title and description text,
and an image container. The styles are defined using various properties such as padding, border
width, flexbox layout, font size, color, and dimensions. These styles can be applied to the
corresponding components in the app to achieve a consistent and visually appealing design. */
const styles = StyleSheet.create({
  listItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  listTile: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: '82%',
    paddingLeft: 10,
    marginRight: 10,
  },
  listItemTitle: {
    fontSize: 16,
    color: DefaultTheme.colors.text,
    marginBottom: 5,
  },
  listItemDescription: {
    fontSize: 16,
    color: DefaultTheme.colors.backdrop,
  },
  smallImage: {
    width: 90,
    height: 55,
  },
  imageContainer: {
    flex: 1,
    width: '100%',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: { width: '100%', height: '100%' },
})

export function TreeInfo(props: ITreeInfoProps) {
  const selectedTree = props.selectedTree

  const [isInfo, setInfo] = React.useState<boolean>(false)
  const [secondaryModalVisibility, setSecondaryModalVisibility] = React.useState<boolean>(true)
  const [thirdModalVisibility, setThirdModalVisibility] = React.useState<boolean>(false)
  const [currentScreen, setCurrentScreen] = React.useState(0)
  const [loading, setLoading] = React.useState<boolean>(false)
  const [currentData, setCurrentData] = React.useState<SpeciesData>(selectedTree)

  const imageUrl1 = currentData ? `${CONFIG.AWS_S3_URL}` + currentData?.FULL_PIC_1024x768 : ''
  const imageUrl2 = currentData ? `${CONFIG.AWS_S3_URL}` + currentData?.FULL_PIC_180x110 : ''

  /* The code is defining a function that creates an array of image URLs based on the
  `currentData` object. It checks if `currentData` has a property called `THUMB_PIC_1024x768` and if
  it does, it splits the string value of that property by commas and adds each resulting URL to the
  `pictures` array. It also checks if `currentData` has a property called `FULL_PIC_1024x768` and if
  it does, it adds the URL of that property to the beginning of the `pictures` array using the
  `unshift */
  const imageArray = (() => {
    const pictures: string[] = []
    if (currentData?.THUMB_PIC_1024x768) {
      pictures.push(...currentData.THUMB_PIC_1024x768.split(','))
    }
    if (currentData?.FULL_PIC_1024x768) {
      pictures.unshift(currentData.FULL_PIC_1024x768)
    }
    return pictures
  })()

  /**
   * This function sets the loading state of a component in a TypeScript React application.
   * @param value - The value parameter is a variable that represents the loading state of a component
   * or function. It can be a boolean value (true/false) or a numerical value (0-100) depending on the
   * implementation.
   * @param label - The `label` parameter is likely a string that represents the label or description
   * of the loading process. It could be used to provide more context to the user about what is being
   * loaded. However, without more context about the code and its implementation, it's difficult to say
   * for sure.
   */
  function onLoading(value, label) {
    setLoading(value)
  }

  let treeDetailImg = treeConifer

  /* The code is a switch statement that checks the value of the `TYPE` property of an object
  called `currentData`. If the value is `'conifer'`, it sets the `treeDetailImg` variable to a
  specific image (`treeConifer`). If the value is `'broadleaf'`, it sets the `treeDetailImg`
  variable to a different image (`treeBroadleaf`). The `?.` operator is used to check if
  `currentData` is not null or undefined before accessing its `TYPE` property. */
  switch (currentData?.TYPE) {
    case 'conifer':
      treeDetailImg = treeConifer
      break
    case 'broadleaf':
      treeDetailImg = treeBroadleaf
      break
  }

  /* The code is defining a function called `renderItem` that takes an object with an `item`
  property as an argument. It returns a `View` component that contains an `Image` component with a
  source URL generated using a constant `imgURL` and some styling. The `Image` component also has
  `onLoadStart` and `onLoadEnd` event handlers that call a function called `onLoading` with boolean
  values and a string argument. If `loading` is true, it also renders an `ActivityIndicator`
  component in the center of the `View`. */
  const renderItem = ({ item }) => {
    const imgURL = `${CONFIG.AWS_S3_URL}` + item
    return (
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imgURL }}
          style={styles.image}
          resizeMode={'cover'}
          onLoadStart={() => onLoading(true, 'onLoadStart')}
          onLoadEnd={() => onLoading(false, 'onLoadStart')}
        ></Image>
        {loading && (
          <View
            style={{
              justifyContent: 'center',
              alignSelf: 'center',
              alignContent: 'center',
              zIndex: 0,
              width: '100%',
              position: 'absolute',
              height: 350,
            }}
          >
            <ActivityIndicator color={'green'} />
          </View>
        )}
      </View>
    )
  }

  /* The code is defining a functional component called `pagination` that returns a Pagination
  component from a third-party library. The Pagination component is used to display dots that
  represent the number of images in an array and the currently active image. The component takes in
  several props such as `dotsLength`, `activeDotIndex`, `containerStyle`, `dotStyle`,
  `inactiveDotStyle`, `inactiveDotOpacity`, and `inactiveDotScale` to customize the appearance of the
  dots. */
  const pagination = () => {
    return (
      <Pagination
        dotsLength={imageArray.length}
        activeDotIndex={currentScreen}
        containerStyle={{
          backgroundColor: 'transparent',
        }}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          marginHorizontal: -5,
          backgroundColor: '#4A5568',
        }}
        inactiveDotStyle={{
          width: 12,
          height: 12,
          borderRadius: 8,
          backgroundColor: '#A0AEC0',
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    )
  }

  /* The code is a React Native component that displays a modal with information about a selected
  tree. It includes a carousel of images, information about the tree's common and scientific names,
  type, description, and level, as well as buttons to add a record of the tree and view its type. It
  also includes functionality to toggle an information panel and return to the map screen. */
  return (
    <View
      style={{
        marginTop: 5,
      }}
    >
      <Modal animationType="slide" transparent={true} visible={props.selectedTree !== undefined}>
        <Modal animationType="slide" transparent={true} visible={thirdModalVisibility}>
          <StatusBar />
          <View
            style={{
              flex: 1,
              height: '60%',
              backgroundColor: 'white',
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <View
                style={{
                  width: viewportWidth / 1.5,
                  height: viewportWidth / 2,
                  overflow: 'hidden',
                  borderRadius: 20,
                }}
              >
                <Image
                  source={{ uri: imageUrl1 }}
                  style={{ height: '100%', width: '100%' }}
                  resizeMode={'cover'}
                  onLoadStart={() => onLoading(true, 'onLoadStart')}
                  onLoadEnd={() => onLoading(false, 'onLoadStart')}
                />

                {loading && (
                  <View
                    style={{
                      justifyContent: 'center',
                      alignSelf: 'center',
                      alignContent: 'center',
                      zIndex: 0,
                      width: '100%',
                      position: 'absolute',
                      height: viewportWidth / 2,
                    }}
                  >
                    <ActivityIndicator color={'green'} />
                  </View>
                )}
              </View>
              {!loading && (
                <View
                  style={{
                    position: 'absolute',
                    bottom: 10,
                    right: -10,
                  }}
                >
                  <Image
                    source={searchImage}
                    style={{ height: 100, width: 100 }}
                    resizeMode={'contain'}
                  />
                </View>
              )}
            </View>
          </View>
          <View style={{ height: '60%', width: '100%', backgroundColor: 'white', paddingTop: 50 }}>
            <View
              style={{
                alignItems: 'baseline',
                marginHorizontal: 20,
              }}
            >
              {currentData?.TYPE ? (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 20,
                  }}
                >
                  <Image
                    source={treeDetailImg}
                    style={{ height: 80, width: 80 }}
                    resizeMode={'contain'}
                  />
                  <View style={{ marginLeft: 5, width: '82%' }}>
                    <RNText style={{ fontWeight: 'bold', fontSize: 16 }}>Type</RNText>
                    <RNText style={{ fontSize: 16, color: '#7F7F7F' }}>{currentData?.TYPE}</RNText>
                  </View>
                </View>
              ) : null}
              {currentData?.COMMON ? (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 20,
                  }}
                >
                  <Image
                    source={treeDetailImg}
                    style={{ height: 80, width: 80 }}
                    resizeMode={'contain'}
                  />
                  <View style={{ marginLeft: 5, width: '82%' }}>
                    <RNText style={{ fontWeight: 'bold', fontSize: 16 }}>Common</RNText>
                    <RNText style={{ fontSize: 16, color: '#7F7F7F' }}>
                      {currentData?.COMMON}
                    </RNText>
                  </View>
                </View>
              ) : null}
              {currentData?.SCIENTIFIC ? (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 20,
                  }}
                >
                  <Image
                    source={treeDetailImg}
                    style={{ height: 80, width: 80 }}
                    resizeMode={'contain'}
                  />
                  <View style={{ marginLeft: 5, width: '82%' }}>
                    <RNText style={{ fontWeight: 'bold', fontSize: 16 }}>Scientific</RNText>
                    <RNText style={{ fontSize: 16, color: '#7F7F7F' }}>
                      {currentData?.SCIENTIFIC}
                    </RNText>
                  </View>
                </View>
              ) : null}
              {currentData?.LEAF_COLOR ? (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 20,
                  }}
                >
                  <Image
                    source={treeDetailImg}
                    style={{ height: 80, width: 80 }}
                    resizeMode={'contain'}
                  />
                  <View style={{ marginLeft: 5, width: '82%' }}>
                    <RNText style={{ fontWeight: 'bold', fontSize: 16 }}>Leaf Color</RNText>
                    <RNText style={{ fontSize: 16, color: '#7F7F7F' }}>
                      {currentData?.LEAF_COLOR}
                    </RNText>
                  </View>
                </View>
              ) : null}
              {currentData?.TREE_SHAPE ? (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 20,
                  }}
                >
                  <Image
                    source={treeDetailImg}
                    style={{ height: 80, width: 80 }}
                    resizeMode={'contain'}
                  />
                  <View style={{ marginLeft: 5, width: '82%' }}>
                    <RNText style={{ fontWeight: 'bold', fontSize: 16 }}>Tree Shape</RNText>
                    <RNText style={{ fontSize: 16, color: '#7F7F7F' }}>
                      {currentData?.TREE_SHAPE}
                    </RNText>
                  </View>
                </View>
              ) : null}
            </View>
            <Button
              mode="contained"
              style={{
                borderRadius: 0,
                //  alignContent: 'center',
                width: viewportWidth,
                alignSelf: 'center',
                // height: 45,
                padding: 10,
                paddingBottom: 20,
                // left: -60,
                position: 'absolute',
                bottom: 0,
              }}
              onPress={() => {
                setThirdModalVisibility(false)
              }}
            >
              CLOSE
            </Button>
          </View>
        </Modal>
        <StatusBar />

        {/* Main Screen Layout */}
        <View
          style={{
            flex: 1,
            height: '100%',
            backgroundColor: 'white',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* Carousel */}
          <View
            style={{
              backgroundColor: 'white',
              width: '100%',
              height: '70%',
              flex: 1,
              justifyContent: 'center',
            }}
          >
            <Carousel
              data={imageArray}
              renderItem={renderItem}
              itemWidth={viewportWidth * 1}
              sliderWidth={viewportWidth}
              loop={true}
              pagingEnabled
              firstItem={currentScreen}
              initialNumToRender={currentScreen}
              onSnapToItem={(index) => setCurrentScreen(index)}
            />
            <View
              style={{
                position: 'absolute',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                bottom: 0,
              }}
            >
              {pagination()}
            </View>
          </View>

          {/* Infomation Panel */}
          <View style={{ height: isInfo ? '40%' : '18%', width: '100%' }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 10,
                  marginLeft: 10,
                  width: '90%',
                }}
              >
                <Image
                  source={{ uri: imageUrl2 }}
                  style={{ height: 40, width: 60 }}
                  resizeMode={'contain'}
                />
                <View style={{ marginLeft: 10, width: '80%', marginRight: 10, marginBottom: 10 }}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <RNText style={{ fontWeight: 'bold', fontSize: 16 }}>
                      {currentData?.COMMON}
                    </RNText>
                  </ScrollView>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <RNText style={{ fontSize: 16, color: '#7F7F7F' }}>
                      {currentData?.SCIENTIFIC}
                    </RNText>
                  </ScrollView>
                </View>
              </View>
              <TouchableOpacity
                style={{
                  justifyContent: 'center',
                  marginRight: 10,
                  alignItems: 'center',
                  marginTop: 10,
                }}
                onPress={() => {
                  setInfo((current) => !current)
                }}
              >
                <Image
                  source={infoImage}
                  style={{ height: 20, width: 20 }}
                  resizeMode={'contain'}
                />
                {isInfo ? (
                  <Image
                    source={arrowUp}
                    style={{ height: 15, width: 15 }}
                    resizeMode={'contain'}
                  />
                ) : (
                  <Image
                    source={arrowDown}
                    style={{ height: 15, width: 15 }}
                    resizeMode={'contain'}
                  />
                )}
              </TouchableOpacity>
            </View>
            {isInfo ? (
              <ScrollView
                style={{ marginTop: 15, marginHorizontal: 10, height: 180, marginBottom: 88 }}
                showsVerticalScrollIndicator={true}
              >
                <RNText style={{ fontWeight: 'bold', fontSize: 18, marginTop: 10 }}>
                  Common Name
                </RNText>
                <RNText style={{ fontWeight: 'normal', fontSize: 16 }}>
                  {currentData?.COMMON}
                </RNText>
                <RNText style={{ fontWeight: 'bold', fontSize: 18, marginTop: 10 }}>
                  Scientific Name
                </RNText>
                <RNText style={{ fontWeight: 'normal', fontSize: 16 }}>
                  {currentData?.SCIENTIFIC}
                </RNText>
                <RNText style={{ fontWeight: 'bold', fontSize: 18, marginTop: 10 }}>Type</RNText>
                <RNText style={{ fontWeight: 'normal', fontSize: 16 }}>{currentData?.TYPE}</RNText>
                <RNText style={{ fontWeight: 'bold', fontSize: 18, marginTop: 10 }}>
                  Description
                </RNText>
                <RNText style={{ fontWeight: 'normal', fontSize: 16 }}>
                  {currentData?.DESCRIPTION}
                </RNText>
                <RNText style={{ fontWeight: 'bold', fontSize: 18, marginTop: 10 }}>Level</RNText>
                <RNText style={{ fontWeight: 'normal', fontSize: 16 }}>{currentData?.LEVEL}</RNText>
              </ScrollView>
            ) : // </View>
              null}
            {props.isFromMapScreen ? (
              <Button
                mode="contained"
                style={{
                  borderRadius: 0,
                  width: viewportWidth,
                  alignSelf: 'center',
                  padding: 10,
                  paddingBottom: 20,
                  position: 'absolute',
                  bottom: 0,
                }}
                onPress={() => {
                  // reset Info Screen
                  setSecondaryModalVisibility(false)
                  props.setSelectedTree(undefined)
                  props.setIsFromMapScreen(false)
                  // navigate back to Map Screen
                  props.navigation.goBack()
                }}
              >
                Back to Map
              </Button>
            ) : (
              <Button
                mode="contained"
                style={{
                  borderRadius: 0,
                  width: viewportWidth,
                  alignSelf: 'center',
                  padding: 10,
                  paddingBottom: 20,
                  position: 'absolute',
                  bottom: 0,
                }}
                onPress={() => {
                  Alert.alert('', 'Do you want to add a record of this tree?', [
                    { text: 'No' },
                    {
                      text: 'Yes',
                      onPress: () => {
                        setSecondaryModalVisibility(false)
                        props.setSelectedTree(undefined)
                        props.navigation.navigate('addTree', {
                          selectedSpeciesData: selectedTree,
                        })
                      },
                    },
                  ])
                }}
              >
                Add a Record
              </Button>
            )}
          </View>

          {/* Return Button */}
          {props.isFromMapScreen ? null : (
            <TouchableOpacity
              onPress={() => {
                setSecondaryModalVisibility(false)
                props.setSelectedTree(undefined)
              }}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 5,
                position: 'absolute',
                top: 25,
                left: 15,
                backgroundColor: 'white',
                opacity: 0.8,
                borderRadius: 30,
                height: 60,
                width: 60,
                borderColor: 'black',
                borderWidth: 2,
              }}
            >
              <MaterialCommunityIcons name="window-close" size={22} />
            </TouchableOpacity>
          )}

          {/* Tree Type Button */}
          <TouchableOpacity
            onPress={() => {
              setThirdModalVisibility(true)
            }}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 5,
              position: 'absolute',
              top: 25,
              right: 15,
              backgroundColor: 'white',
              opacity: 0.8,
              borderRadius: 30,
              height: 60,
              width: 60,
              borderColor: 'black',
              borderWidth: 2,
            }}
          >
            <Image
              style={{
                resizeMode: 'contain',
                height: '100%',
                width: '100%',
              }}
              source={treeDetailImg}
            />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  )
}
