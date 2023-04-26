/**
 * The SuggestedTreesScreen function displays information and images about suggested trees and allows
 * the user to select a specific tree from a dropdown menu.
 * @param {string} level - The `level` parameter is a string that represents the difficulty level of a
 * suggested tree. It is used in the `getBadgeColor` function to determine the background color of the
 * badge displayed next to the tree name. The possible values for `level` are "Easy", "Medium", and "
 * @returns The SuggestedTreesScreen component is being returned.
 */

import React from 'react'

import {
  View,
  ScrollView,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
} from "react-native"
import { Text, Badge, Title, useTheme } from 'react-native-paper'
import RNPickerSelect, { Item } from 'react-native-picker-select'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { suggestedTrees, SuggestedTreeData } from '../../data/suggestedTrees'
import { colors } from '../styles/theme'
import { StatusBar } from '../components/StatusBar'

const slideHeight = 300

/* `const pickerItems: Item[] = suggestedTrees.map((datum) => ({ value: datum.name, label: datum.name
}))` is creating an array of `Item` objects that will be used to populate a dropdown menu. The
`suggestedTrees` array contains data about suggested trees, and the `map` function is used to
iterate over each object in the array and create a new `Item` object with a `value` and `label`
property set to the name of the tree. This array of `Item` objects is then assigned to the
`pickerItems` constant. */
const pickerItems: Item[] = suggestedTrees.map((datum) => ({
  value: datum.name,
  label: datum.name,
}))

/**
 * The function returns a color code based on the level of difficulty passed as an argument.
 * @param {string} level - a string representing the difficulty level of a task or challenge. The
 * function returns a color code (in hexadecimal format) based on the level provided.
 * @returns a color code in the form of a string based on the input level. If the level is 'Easy', it
 * returns '#C6F6D5', if it is 'Medium', it returns '#FEEBC8', if it is 'Expert', it returns '#FEB2B2',
 * and if it is anything else, it returns '#ddd'.
 */
function getBadgeColor(level: string) {
  switch (level) {
    case 'Easy':
      return '#C6F6D5'

    case 'Medium':
      return '#FEEBC8'

    case 'Expert':
      return '#FEB2B2'

    default:
      return '#ddd'
  }
}

/**
 * This is a React component that displays information and images about suggested trees, with the
 * ability to switch between different tree options.
 */
export function SuggestedTreesScreen(props) {
  const theme = useTheme()

  const initialSuggestedTreeData = suggestedTrees[0]
  const initialSliderWidth = Dimensions.get('screen').width

  const [currentSuggestedTreeData, setCurrentSuggestedTreeData] = React.useState<SuggestedTreeData>(
    initialSuggestedTreeData,
  )
  const [sliderWidth, setSliderWidth] = React.useState<number>(initialSliderWidth)
  const sliderRef = React.useRef<ScrollView>(null)

  /**
   * The function updates the width of a slider based on the screen dimensions when the device
   * orientation changes.
   */
  function handleOrientationChange() {
    setSliderWidth(Dimensions.get('screen').width)
  }

  // set the suggestedTrees data after navigate from map screen
  /**
   * This function retrieves a tree index from the props and sets the current suggested tree data based
   * on that index.
   */
  async function getTreeIndex() {
    const { params } = props.route;

    if (params !== undefined) {
      const treeIndex = parseInt(params.showIndex)
      setCurrentSuggestedTreeData(suggestedTrees[treeIndex])
    }
  }

  /* This `useEffect` hook is used to scroll the slider back to the first image whenever the
  `currentSuggestedTreeData.name` changes. It first checks if the `sliderRef.current` exists, and if
  it does, it calls the `scrollTo` method on it with an `x` value of 0 and `animated` set to `true`.
  This ensures that the slider always starts at the first image whenever a new tree is selected from
  the dropdown menu. The `currentSuggestedTreeData.name` is included as a dependency in the second
  argument of the `useEffect` hook, so that the effect is triggered whenever the `name` property of
  the `currentSuggestedTreeData` object changes. */
  React.useEffect(() => {
    if (!sliderRef.current) {
      return
    }

    sliderRef.current.scrollTo({ x: 0, animated: true })
  }, [currentSuggestedTreeData.name])

  /* This `useEffect` hook is adding a listener to the `focus` event of the navigation prop, which is
  triggered when the screen comes into focus. When the `focus` event is triggered, the `getTreeIndex`
  function is called, which retrieves a tree index from the props and sets the current suggested tree
  data based on that index. */
  React.useEffect(() => {
    props.navigation.addListener('focus', getTreeIndex);

    return () => {
      props.navigation.removeListener('focus', getTreeIndex)
    }
  })

  /* This `useEffect` hook is adding an event listener to the `change` event of the `Dimensions` object,
  which is triggered when the device orientation changes. When the `change` event is triggered, the
  `handleOrientationChange` function is called, which updates the `sliderWidth` state variable based
  on the new screen dimensions. The `[]` as the second argument of the `useEffect` hook means that the
  effect will only be triggered once, when the component mounts. The `return` statement in the
  `useEffect` hook is used to remove the event listener when the component unmounts, to prevent memory
  leaks. */
  React.useEffect(() => {
    Dimensions.addEventListener('change', handleOrientationChange)

    return () => {
      Dimensions.removeEventListener('change', handleOrientationChange)
    }
  }, [])

  /* The code is rendering a screen with a dropdown menu to select a suggested tree, and
  displaying information about the selected tree including images, name, level, identifiable
  attributes, known public locations, and fun facts. The screen is designed to avoid the keyboard
  and has a white background. The images of the tree are displayed in a horizontal slider. The code
  is written in TypeScript and uses React Native components such as KeyboardAvoidingView,
  SafeAreaView, StatusBar, ScrollView, View, Text, Image, and Badge. It also uses third-party
  libraries such as RNPickerSelect and MaterialCommunityIcons. */
  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <StatusBar />

        <RNPickerSelect
          items={pickerItems}
          value={currentSuggestedTreeData.name}
          onValueChange={(value) => {
            const newCurrentSuggestedTreeData = suggestedTrees.find((datum) => datum.name === value)
            if (!newCurrentSuggestedTreeData) {
              return
            }

            setCurrentSuggestedTreeData(newCurrentSuggestedTreeData)
          }}
          Icon={() => <MaterialCommunityIcons name="menu-down" size={30} color={colors.gray[500]} />}
          style={{
            modalViewMiddle: { justifyContent: 'flex-end' },
            modalViewBottom: { backgroundColor: '#fff' },
            chevronContainer: { display: 'none' },
            done: { color: theme.colors.primary },
            iconContainer: {
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              paddingRight: 15,
            },
          }}
          textInputProps={{
            height: 58,
            borderBottomWidth: 1,
            borderColor: '#ddd',
            paddingHorizontal: 15,
            fontSize: 15,
          }}
          useNativeAndroidPickerStyle={false}
          placeholder={{}}
        />

        <ScrollView>
          <View>
            <ScrollView ref={sliderRef} style={{ backgroundColor: '#fff' }} horizontal pagingEnabled>
              {currentSuggestedTreeData.imageUris &&
                currentSuggestedTreeData.imageUris.map((imageUri) => (
                  <View
                    key={`${currentSuggestedTreeData.name}-${imageUri}`}
                    style={{ width: sliderWidth, height: slideHeight }}
                  >
                    <Image
                      style={{ width: '100%', height: '100%' }}
                      source={{ uri: imageUri }}
                      resizeMode="contain"
                    />
                  </View>
                ))}

              {currentSuggestedTreeData.images &&
                currentSuggestedTreeData.images.map((imageSource) => (
                  <View
                    key={`${currentSuggestedTreeData.name}-${imageSource}`}
                    style={{ width: sliderWidth, height: slideHeight }}
                  >
                    <Image
                      style={{ width: '100%', height: '100%' }}
                      source={imageSource}
                      resizeMode="contain"
                    />
                  </View>
                ))}
            </ScrollView>
          </View>

          <View style={{ flex: 1, padding: 15 }}>
            <View style={{ flexDirection: 'row' }}>
              {
                currentSuggestedTreeData.name === 'Western Red Cedar (Giant Arborvitae)' ?
                  <Title>Western Red Cedar</Title> :
                  <Title>{currentSuggestedTreeData.name}</Title>
              }
              <Badge
                visible
                style={{
                  marginLeft: 5,
                  alignSelf: 'flex-start',
                  backgroundColor: getBadgeColor(currentSuggestedTreeData.level),
                }}
              >
                {currentSuggestedTreeData.level}
              </Badge>
            </View>
            {!!currentSuggestedTreeData.levelText && (
              <Text style={{ fontStyle: 'italic', marginBottom: 15 }}>
                {currentSuggestedTreeData.levelText}
              </Text>
            )}

            {!!currentSuggestedTreeData.identifiable_attributes && (
              <View style={{ marginBottom: 15 }}>
                <Text style={{ fontWeight: 'bold' }}>Key Identifiable Attributes:</Text>

                <View style={{ paddingLeft: 15 }}>
                  {currentSuggestedTreeData.identifiable_attributes.map((attribute) => (
                    <Text key={attribute}>
                      {'\u2022'} {attribute}
                    </Text>
                  ))}
                </View>
              </View>
            )}

            {!!currentSuggestedTreeData.known_public_locations && (
              <View style={{ marginBottom: 15 }}>
                <Text style={{ fontWeight: 'bold' }}>Known Public Locations:</Text>

                <View style={{ paddingLeft: 15 }}>
                  {currentSuggestedTreeData.known_public_locations.map((attribute) => (
                    <Text key={attribute}>
                      {'\u2022'} {attribute}
                    </Text>
                  ))}
                </View>
              </View>
            )}

            {!!currentSuggestedTreeData.fun_facts && (
              <View style={{ marginBottom: 15 }}>
                <Text style={{ fontWeight: 'bold' }}>Fun Fact:</Text>

                <View style={{ paddingLeft: 15 }}>
                  {currentSuggestedTreeData.fun_facts.map((attribute) => (
                    <Text key={attribute}>
                      {'\u2022'} {attribute}
                    </Text>
                  ))}
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}
