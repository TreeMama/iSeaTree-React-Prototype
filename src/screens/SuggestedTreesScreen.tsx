import React from 'react'

import { View, ScrollView, Dimensions, Image, ImageSourcePropType } from 'react-native'
import { Text, Badge, Title, Paragraph, useTheme, Subheading } from 'react-native-paper'
import RNPickerSelect, { Item } from 'react-native-picker-select'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import { colors } from '../styles/theme'
import { StatusBar } from '../components/StatusBar'

const slideHeight = 300

interface SuggestedTreeData {
  imageUris?: string[]
  images?: ImageSourcePropType[] // TODO
  name: string
  level: string
  description: string

  levelText?: string
  identifiable_attributes?: string[]
  known_public_locations?: string[]
  fun_facts?: string[]
}

const suggestedTrees: SuggestedTreeData[] = [
  {
    images: [
      require('../../assets/suggested-trees/atlas-cedar-1.png'),
      require('../../assets/suggested-trees/atlas-cedar-2.jpg'),
    ],
    name: 'Atlas Cedar',
    level: 'Medium',
    levelText: 'Difficulty Level: Medium, Rare in Seattle region. Non-native.',
    description:
      'The most distinctive characteristic of the Atlas Cedar (Cedrus atlantica) are its needles. The needle colors range from being a mild olive-green to a vivid bluish-green, and even sometimes a vivid silvery blue color.',
    identifiable_attributes: [
      'Grows in a large, pyramidal shape.',
      'Has silvery blue to bluish-green needles up to 1½" long that are somewhat stiff but not very sharp.',
      "Develops very large 'purple-tipped' female cones on the upper branches.",
      'Cones tend to easily break when they fall (depending on the time of year, you might be able to find broken cone shells dispersed over the ground).',
      'Grows to an average height of 40–60 ft. ',
    ],
    known_public_locations: [
      'East side of Green Lake has a mature specimen. Try looking near the play area, on the southeast streetside of 67th street.',
      'West Seattle has mature specimens located near the SW Charleston St Standpipe and Scenic Heights Pump Station (3919 SW Charlestown St, Seattle, WA 98116). ',
    ],
    fun_facts: [
      'The Atlas cedar produces an aromatic oil that is a natural deterrent for insects. Wood from this cedar is commonly used in chests and furniture drawers.',
    ],
  },
  {
    imageUris: [
      'https://picsum.photos/1200/600',
      'https://picsum.photos/600/1200',
      'https://picsum.photos/1000/1000',
    ],
    name: 'Garry Oak',
    level: 'Easy',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt, dignissimos? Quisquam eius voluptatum, iure tempora maiores a ex amet nemo velit molestiae quos nam eum cum, nulla maxime. A, nemo.',
  },
  {
    imageUris: [
      'https://picsum.photos/1200/600',
      'https://picsum.photos/600/1200',
      'https://picsum.photos/1000/1000',
    ],
    name: 'Northern Red Oak',
    level: 'Easy',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt, dignissimos? Quisquam eius voluptatum, iure tempora maiores a ex amet nemo velit molestiae quos nam eum cum, nulla maxime. A, nemo.',
  },
  {
    imageUris: [
      'https://picsum.photos/1200/600',
      'https://picsum.photos/600/1200',
      'https://picsum.photos/1000/1000',
    ],
    name: 'Shaggybark Hickory',
    level: 'Medium',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt, dignissimos? Quisquam eius voluptatum, iure tempora maiores a ex amet nemo velit molestiae quos nam eum cum, nulla maxime. A, nemo.',
  },
  {
    imageUris: [
      'https://picsum.photos/1200/600',
      'https://picsum.photos/600/1200',
      'https://picsum.photos/1000/1000',
    ],
    name: 'Northern White Cedar',
    level: 'Expert',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt, dignissimos? Quisquam eius voluptatum, iure tempora maiores a ex amet nemo velit molestiae quos nam eum cum, nulla maxime. A, nemo.',
  },
  {
    imageUris: [
      'https://picsum.photos/1200/600',
      'https://picsum.photos/600/1200',
      'https://picsum.photos/1000/1000',
    ],
    name: 'Western Red Cedar ',
    level: 'Easy',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt, dignissimos? Quisquam eius voluptatum, iure tempora maiores a ex amet nemo velit molestiae quos nam eum cum, nulla maxime. A, nemo.',
  },
]

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
      />

      <ScrollView>
        <View>
          <ScrollView
            ref={sliderRef}
            style={{ backgroundColor: theme.colors.background }}
            horizontal
            pagingEnabled
          >
            {currentSuggestedTreeData.imageUris &&
              currentSuggestedTreeData.imageUris.map((imageUri) => (
                <View
                  key={`${currentSuggestedTreeData.name}-${imageUri}`}
                  style={{ width: sliderWidth, height: slideHeight }}
                >
                  <Image
                    style={{ width: '100%', height: '100%' }}
                    source={{ uri: imageUri }}
                    resizeMode="cover"
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
                    resizeMode="cover"
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

          <Paragraph style={{ marginBottom: 50 }}>{currentSuggestedTreeData.description}</Paragraph>

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
