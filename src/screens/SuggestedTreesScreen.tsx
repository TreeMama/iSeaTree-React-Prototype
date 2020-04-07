import React from 'react'

import { View, ScrollView, Dimensions, Image } from 'react-native'
import { Badge, Title, Paragraph, useTheme } from 'react-native-paper'
import Constants from 'expo-constants'
import RNPickerSelect, { Item } from 'react-native-picker-select'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import { colors } from '../styles/theme'

const slideHeight = 300

interface SuggestedTreeData {
  imageUris: string[]
  name: string
  level: string
  description: string
}

const suggestedTrees = [
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
    id: '2',
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
    id: '3',
    imageUris: [
      'https://picsum.photos/1200/600',
      'https://picsum.photos/600/1200',
      'https://picsum.photos/1000/1000',
    ],
    name: 'Atlas Cedar',
    level: 'Medium',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt, dignissimos? Quisquam eius voluptatum, iure tempora maiores a ex amet nemo velit molestiae quos nam eum cum, nulla maxime. A, nemo. Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt, dignissimos? Quisquam eius voluptatum, iure tempora maiores a ex amet nemo velit molestiae quos nam eum cum, nulla maxime. A, nemo. Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt, dignissimos? Quisquam eius voluptatum, iure tempora maiores a ex amet nemo velit molestiae quos nam eum cum, nulla maxime. A, nemo. Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt, dignissimos? Quisquam eius voluptatum, iure tempora maiores a ex amet nemo velit molestiae quos nam eum cum, nulla maxime. A, nemo.',
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
    <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: Constants.statusBarHeight + 10 }}>
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
          backgroundColor: theme.colors.background,
          paddingHorizontal: 15,
          fontSize: 15,
          // borderRadius: theme.roundness,
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
            {currentSuggestedTreeData.imageUris.map((imageUri) => (
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
          <Paragraph>{currentSuggestedTreeData.description}</Paragraph>
        </View>
      </ScrollView>
    </View>
  )
}
