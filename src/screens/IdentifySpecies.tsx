/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/camelcase */
import React from 'react'

import {
  Modal,
  View,
  FlatList,
  TouchableOpacity,
  TouchableHighlight,
  Text as RNText,
  StyleSheet,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native'
import { Subheading, useTheme, Button, TextInput, DefaultTheme, Badge } from 'react-native-paper'

import { StatusBar } from '../components/StatusBar'
import { colors } from '../styles/theme'
import speciesDataList from '../../data/species.json'
import { CONFIG } from '../../envVariables'
import Carousel, { Pagination } from 'react-native-snap-carousel'
import { ScrollView } from 'react-native-gesture-handler'

const info_image = require('../../assets/info.png')
const arrow_up = require('../../assets/arrow_up.png')
const arrow_down = require('../../assets/arrow_down.png')
const search_image = require('../../assets/trees.png')
const treeConifer = require('../../assets/tree_Conifer3X-01.png')
const treeBroadleaf = require('../../assets/tree_Deciduous3X-01.png')

/* The code is defining an interface called "SpeciesData" in TypeScript for a set of properties
that describe a species. The properties include ID, TYPE, COMMON, DESCRIPTION, SCIENTIFIC, LEVEL,
ITREECODE, FULL_PIC_180x110, FULL_PIC_1024x768, THUMB_PIC_1024x768, LEAF_COLOR, and TREE_SHAPE. The
"?" symbol after LEVEL and ITREECODE indicates that these properties are optional. */
export interface SpeciesData {
  ID: string
  TYPE: string
  COMMON: string
  DESCRIPTION: string
  SCIENTIFIC: string
  LEVEL?: string
  ITREECODE?: string
  FULL_PIC_180x110?: string
  FULL_PIC_1024x768?: string
  THUMB_PIC_1024x768?: string
  LEAF_COLOR?: string
  TREE_SHAPE?: string
}

/* The code is defining an interface `SpeciesSelectProps` with three properties:
1. `speciesType` which can be either `null` or a string.
2. `speciesData` which can be either `null` or an object of type `SpeciesData`.
3. `onSelect` which is a function that takes `speciesData` as an argument and returns `void`. */
interface SpeciesSelectProps {
  speciesType: null | string
  speciesData: null | SpeciesData
  onSelect: (speciesData: null | SpeciesData) => void
}

const MIN_SEARCH_TERM_LENGTH = 3

function getSpeciesFlatListData(
  type: string | null,
  query?: string,
): { ID: string; COMMON: string; SCIENTIFIC: string; TYPE: string }[] {
  const $speciesDataList: { ID: string; COMMON: string; SCIENTIFIC: string; TYPE: string }[] = []
  speciesDataList.forEach((item) => {
    if (typeof type == 'string') {
      if (type.toLowerCase() == item.TYPE.toLowerCase() || item.TYPE.toLowerCase() === 'unknown') {
        $speciesDataList.push(item)
      } else if (type.toLowerCase() == 'null') {
        $speciesDataList.push(item)
      }
    } else {
      $speciesDataList.push(item)
    }
  })

  /* The code is checking if the variable `query` is falsy (undefined, null, false, 0, "", NaN),
  and if it is, it returns the value of the variable ``. */
  if (!query) {
    return $speciesDataList
  }

  const inputValue = query.trim().toLowerCase()
  const inputLength = inputValue.length

  /* The code is checking if the length of a search term is less than a minimum search term length. If
  it is, it returns a list of species data. */
  if (inputLength < MIN_SEARCH_TERM_LENGTH) {
    return $speciesDataList
  }

  /* The above code is filtering an array of objects `` based on whether the `COMMON`
  or `SCIENTIFIC` property of each object includes a given `inputValue` (converted to lowercase for
  case-insensitive matching). The filtered array is then returned. */
  return $speciesDataList.filter(
    (datum) =>
      datum.COMMON.toLowerCase().includes(inputValue) ||
      datum.SCIENTIFIC.toLowerCase().includes(inputValue),
  )
}

/**
 * This function returns the species data object with the matching ID or undefined if not found.
 * @param {string} speciesNameId - The parameter `speciesNameId` is a string that represents the ID of
 * a species. The function `getSpeciesNames` takes this ID as input and returns either `undefined` if
 * the ID is not found in the `speciesDataList`, or a `SpeciesData` object if the ID is
 * @returns either `undefined` or an object of type `SpeciesData`. The `undefined` value is returned if
 * the `speciesNameId` parameter does not match any `ID` property in the `speciesDataList` array. If a
 * match is found, the corresponding `SpeciesData` object is returned.
 */
export function getSpeciesNames(speciesNameId: string): undefined | SpeciesData {
  return speciesDataList.find((speciesDatum) => speciesDatum.ID === speciesNameId)
}

/* The code is using destructuring assignment to extract the `width` and `height` properties from
the `Dimensions.get('window')` object and assign them to the constants `viewportWidth` and
`viewportHeight`, respectively. This code is likely being used in a React component to get the
dimensions of the current viewport. */
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window')

/* The above code is defining a StyleSheet object with various styles for a list item component in a
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

/**
 * The function returns a color code based on the level of difficulty passed as an argument.
 * @param {string} level - The level parameter is a string that represents the difficulty level of a
 * coding challenge. It can be one of three values: 'easy', 'medium', or 'expert'.
 * @returns The function `getTreeBadgeColor` returns a color code based on the input level. If the
 * level is 'easy', it returns '#C6F6D5', if it is 'medium', it returns '#FEEBC8', if it is 'expert',
 * it returns '#FEB2B2', and if it is anything else, it returns '#ddd'.
 */
function getTreeBadgeColor(level: string) {
  switch (level.toLowerCase()) {
    case 'easy':
      return '#C6F6D5'

    case 'medium':
      return '#FEEBC8'

    case 'expert':
      return '#FEB2B2'

    default:
      return '#ddd'
  }
}

/**
 * The function takes a level parameter and returns a string indicating the difficulty level.
 * @param {string} level - string parameter representing the level of difficulty for a game.
 * @returns The function `rendergramtext` takes a string parameter `level` and returns a string based
 * on the value of `level`. If `level` is `'easy'`, the function returns `'an easy'`. If `level` is
 * `'medium'`, the function returns `'a medium'`. If `level` is `'expert'`, the function returns `'an
 * expert'`. If `level
 */
function rendergramtext(level: string) {
  switch (level.toLowerCase()) {
    case 'easy':
      return 'an easy'

    case 'medium':
      return 'a medium'

    case 'expert':
      return 'an expert'

    default:
      return ''
  }
}
/**
 * The IdentifySpecies function is a React component that renders a modal with a search bar and a list
 * of species, allowing the user to select a species and view its details in a carousel with pagination
 * and an info section.
 * @param {SpeciesData} speciesData - The `speciesData` parameter is an object that contains
 * information about the currently selected species, such as its ID, common name, scientific name, and
 * image URLs. It is used to display information about the selected species and to highlight it in the
 * list of available species.
 */

export function IdentifySpecies(props: any) {
  const [query, setQuery] = React.useState<undefined | string>(undefined)
  const [isSelected, setisSelected] = React.useState<null | Boolean>(false)
  const [isModalVisible, setIsModalVisible] = React.useState<boolean>(true)
  const [secondaryModalVisibility, setSecondaryModalVisibility] = React.useState<boolean>(false)
  const [thirdModalVisibility, setThirdModalVisibility] = React.useState<boolean>(false)

  const [isInfo, setInfo] = React.useState<boolean>(false)
  const [currentScreen, setCurrentScreen] = React.useState(0)
  const [currentData, setCurrentData] = React.useState<SpeciesData>()
  const [loading, setLoading] = React.useState<boolean>(false)

  const theme = useTheme()

  /* The code is using the React `useMemo` hook to memoize the result of calling the
  `getSpeciesFlatListData` function with `params.treeType` and `query` as arguments. The memoized
  result is stored in the `currentSpeciesNamesItems` variable. The `useMemo` hook will only
  recompute the memoized value if either `query` or `isModalVisible` changes. */
  const currentSpeciesNamesItems = React.useMemo(() => {
    const { params } = props.route
    return getSpeciesFlatListData(params.treeType, query)
  }, [query, isModalVisible])

  /**
   * This function handles the selection of a species and sets a timeout to reset the selection state.
   * @param {SpeciesData} speciesData - The `speciesData` parameter is of type `SpeciesData`, which is
   * likely an object containing information about a particular species. The exact properties and
   * structure of the `SpeciesData` type are not shown in the code snippet.
   */
  function handleSpeciesSelect(speciesData: SpeciesData) {
    const { params } = props.route
    if (!isSelected) {
      params.onSelect(speciesData)
      props.navigation.goBack()
      setisSelected(true)
    }
    setTimeout(() => {
      setisSelected(false)
    }, 1000)
  }

  /* The above code is defining a function called `renderFlatListItem` that takes an object with an
  `item` property of type `SpeciesData` as its argument. It returns a `TouchableHighlight` component
  that displays information about the `item` passed in. The `item`'s image is displayed if it has a
  `FULL_PIC_180x110` property, and the `item`'s `COMMON` and `SCIENTIFIC` properties are displayed
  in horizontal `ScrollView` components. The background color of the `TouchableHighlight` component
  is set to green if the `item */
  function renderFlatListItem({ item }: { item: SpeciesData }) {
    const imageUrl = `${CONFIG.AWS_S3_URL}` + item.FULL_PIC_180x110

    return (
      <TouchableHighlight
        key={item.ID}
        onPress={() => {
          handleSpeciesSelect(item)
        }}
        underlayColor={colors.gray[500]}
        activeOpacity={0.8}
      >
        <View
          style={[
            styles.listItem,
            {
              backgroundColor: item.ID === props.speciesData?.ID ? colors.green[100] : '#fff',
            },
          ]}
        >
          {item.FULL_PIC_180x110 ? (
            <TouchableOpacity
              onPress={() => {
                setCurrentScreen(0)
                setCurrentData(item)
                setSecondaryModalVisibility(true)
                setInfo(false)
              }}
            >
              <Image source={{ uri: imageUrl }} style={styles.smallImage} />
            </TouchableOpacity>
          ) : (
            <></>
          )}
          <View style={styles.listTile}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ width: '90%' }}>
              <RNText style={styles.listItemTitle}>{item.COMMON}</RNText>
            </ScrollView>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ width: '80%' }}>
              <RNText style={styles.listItemDescription}>{item.SCIENTIFIC}</RNText>
            </ScrollView>
          </View>
        </View>
      </TouchableHighlight>
    )
  }

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

  /* The code is defining a function called `renderItem` that takes an object with an `item`
  property as its argument. It returns a `View` component that contains an `Image` component with a
  source URL generated from a constant `CONFIG.AWS_S3_URL` and the `item` property. It also
  conditionally renders an `ActivityIndicator` component while the image is loading and a
  `TouchableOpacity` component that displays an image based on the value of `currentData.TYPE`. When
  the `TouchableOpacity` component is pressed, it sets the visibility of a third modal to true. */
  const renderItem = ({ item }) => {
    const imgURL = `${CONFIG.AWS_S3_URL}` + item
    let treeDetailImg = ''

    /* The code is a switch statement that checks the value of the `TYPE` property of an object
    called `currentData`. If the value is `'conifer'`, it sets the `treeDetailImg` variable to an
    image of a conifer tree. If the value is `'broadleaf'`, it sets the `treeDetailImg` variable to
    an image of a broadleaf tree. The `?.` operator is used to check if `currentData` is not null or
    undefined before accessing its `TYPE` property. */
    switch (currentData?.TYPE) {
      case 'conifer':
        treeDetailImg = treeConifer
        break
      case 'broadleaf':
        treeDetailImg = treeBroadleaf
        break
    }

    /* The code is rendering an image component with a given image URL and a cover resize mode.
    It also includes an activity indicator that is displayed while the image is loading.
    Additionally, there is a button with a tree detail image that can be pressed to open a third
    modal. */
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

        <TouchableOpacity
          onPress={() => {
            setThirdModalVisibility(true)
          }}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 5,
            position: 'absolute',
            top: 15,
            right: 15,
            backgroundColor: 'white',
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
    )
  }

  /* The above code is defining a functional component called `pagination` that returns a Pagination
  component from a third-party library. The Pagination component is used to display dots that
  represent the number of images in an array and the currently active image. The component takes in
  several props such as `dotsLength`, `activeDotIndex`, `containerStyle`, `dotStyle`,
  `inactiveDotStyle`, `inactiveDotOpacity`, and `inactiveDotScale` to customize the appearance of
  the dots. */
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

  /* The code is creating a string variable `imageUrl1` using a ternary operator. It checks if
  `currentData` is truthy and if so, it concatenates the `CONFIG.AWS_S3_URL` string with the
  `FULL_PIC_1024x768` property of `currentData`. If `currentData` is falsy, it sets `imageUrl1` to
  an empty string. */
  const imageUrl1 = currentData ? `${CONFIG.AWS_S3_URL}` + currentData?.FULL_PIC_1024x768 : ''

  /* The code is creating a string variable `imageUrl2` using a ternary operator. If
  `currentData` is truthy, it concatenates the `CONFIG.AWS_S3_URL` string with the
  `FULL_PIC_180x110` property of `currentData`. If `currentData` is falsy, it sets `imageUrl2` to an
  empty string. */
  const imageUrl2 = currentData ? `${CONFIG.AWS_S3_URL}` + currentData?.FULL_PIC_180x110 : ''

  /* The code is declaring a constant variable `imageArray` and assigning it a value based on a
  conditional expression. If `currentData?.THUMB_PIC_1024x768` is truthy (not null or undefined), it
  will split the string value of `currentData?.THUMB_PIC_1024x768` using commas as the delimiter and
  assign the resulting array to `imageArray`. If `currentData?.THUMB_PIC_1024x768` is falsy, it will
  assign an empty array to `imageArray`. The `?.` operator is used */
  const imageArray = currentData?.THUMB_PIC_1024x768
    ? currentData?.THUMB_PIC_1024x768.split(',')
    : []

  /* The code is checking if the property `FULL_PIC_1024x768` exists in the `currentData` object using
  optional chaining (`?.`). If it exists, it adds the value of that property to the beginning of
  the `imageArray` using the `unshift()` method. */
  if (currentData?.FULL_PIC_1024x768) {
    imageArray.unshift(currentData?.FULL_PIC_1024x768)
  }

  let treeDetailImg = ''

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

  /* The code is rendering a view that displays information about a species, including its level,
  images, and details such as its type, common name, scientific name, leaf color, and tree shape. It
  also includes a search feature to find specific species and a modal to display more information
  about a selected species. The code is written in TypeScript and uses React components such as
  View, Subheading, Badge, Modal, StatusBar, Image, ScrollView, TextInput, FlatList, and Button. */
  return (
    <View>
      <Subheading>Species</Subheading>

      <View
        style={{
          marginTop: 5,
        }}
      >
        {!!props.speciesData?.LEVEL && (
          <Badge
            visible
            style={{
              marginBottom: 5,
              backgroundColor: getTreeBadgeColor(props.speciesData?.LEVEL),
            }}
          >
            {`You've found ${rendergramtext(props.speciesData.LEVEL)}-level tree!`}
          </Badge>
        )}

        <Modal visible={isModalVisible} animationType="slide">
          <Modal animationType="slide" transparent={true} visible={secondaryModalVisibility}>
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
                        source={search_image}
                        style={{ height: 100, width: 100 }}
                        resizeMode={'contain'}
                      />
                    </View>
                  )}
                </View>
              </View>
              <View
                style={{ height: '60%', width: '100%', backgroundColor: 'white', paddingTop: 50 }}
              >
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
                        <RNText style={{ fontSize: 16, color: '#7F7F7F' }}>
                          {currentData?.TYPE}
                        </RNText>
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
                    <View
                      style={{ marginLeft: 10, width: '80%', marginRight: 10, marginBottom: 10 }}
                    >
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
                      //  flexDirection: 'row',
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
                      source={info_image}
                      style={{ height: 20, width: 20 }}
                      resizeMode={'contain'}
                    />
                    {isInfo ? (
                      <Image
                        source={arrow_up}
                        style={{ height: 15, width: 15 }}
                        resizeMode={'contain'}
                      />
                    ) : (
                      <Image
                        source={arrow_down}
                        style={{ height: 15, width: 15 }}
                        resizeMode={'contain'}
                      />
                    )}
                  </TouchableOpacity>
                </View>
                {isInfo ? (
                  // <View
                  //   style={{ marginTop: 15, marginHorizontal: 10, height: 180, marginBottom: 100 }}
                  // >
                  <ScrollView
                    style={{ marginTop: 15, marginHorizontal: 10, height: 180, marginBottom: 88 }}
                    showsVerticalScrollIndicator={true}
                  >
                    <RNText style={{ fontWeight: 'normal', fontSize: 16 }}>
                      {currentData?.DESCRIPTION}
                    </RNText>
                  </ScrollView>
                ) : // </View>
                  null}
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
                    setSecondaryModalVisibility(false)
                  }}
                >
                  CLOSE
                </Button>
              </View>
            </View>
          </Modal>

          <StatusBar />

          <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <Button mode="contained" style={{ borderRadius: 0 }}>
              done
            </Button>

            <TextInput
              value={query}
              onChangeText={(value) => setQuery(value)}
              placeholder="search..."
              mode="flat"
              style={{ backgroundColor: theme.colors.background }}
              theme={{ roundness: 0 }}
              autoCorrect={false}
            />

            <FlatList
              data={currentSpeciesNamesItems}
              keyExtractor={(item, index) => `${item.ID}-${index}`}
              renderItem={renderFlatListItem}
              initialNumToRender={20}
            />
          </View>
        </Modal>
      </View>
    </View>
  )
}
