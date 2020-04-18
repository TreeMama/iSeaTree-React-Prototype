import React from 'react'

import { View, ScrollView, Dimensions, Image } from 'react-native'
import { Text, Badge, Title, useTheme } from 'react-native-paper'
import RNPickerSelect, { Item } from 'react-native-picker-select'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import { suggestedTrees, SuggestedTreeData } from '../../data/suggestedTrees'
import { colors } from '../styles/theme'
import { StatusBar } from '../components/StatusBar'

const slideHeight = 300

const pickerItems: Item[] = suggestedTrees.map((datum) => ({
  value: datum.name,
  label: datum.name,
}))

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

export function SuggestedTreesScreen() {
  const theme = useTheme()

  const initialSuggestedTreeData = suggestedTrees[0]
  const initialSliderWidth = Dimensions.get('screen').width

  const [currentSuggestedTreeData, setCurrentSuggestedTreeData] = React.useState<SuggestedTreeData>(
    initialSuggestedTreeData,
  )
  const [sliderWidth, setSliderWidth] = React.useState<number>(initialSliderWidth)
  const sliderRef = React.useRef<ScrollView>(null)

  function handleOrientationChange() {
    setSliderWidth(Dimensions.get('screen').width)
  }

  React.useEffect(() => {
    if (!sliderRef.current) {
      return
    }

    sliderRef.current.scrollTo({ x: 0, animated: true })
  }, [currentSuggestedTreeData.name])

  React.useEffect(() => {
    Dimensions.addEventListener('change', handleOrientationChange)

    return () => {
      Dimensions.removeEventListener('change', handleOrientationChange)
    }
  }, [])

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
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
            <Title>{currentSuggestedTreeData.name}</Title>
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
    </View>
  )
}
