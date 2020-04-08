import React from 'react'

import { View, ScrollView, Dimensions, Image, ImageSourcePropType } from 'react-native'
import { Text, Badge, Title, Paragraph, useTheme } from 'react-native-paper'
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
    images: [
      require('../../assets/suggested-trees/garry-oak-1.jpg'),
      require('../../assets/suggested-trees/garry-oak-2.png'),
      require('../../assets/suggested-trees/garry-oak-3.jpg'),
      require('../../assets/suggested-trees/garry-oak-4.jpg'),
    ],
    name: 'Garry Oak',
    level: 'Easy',
    levelText:
      'Medium, Rare in Seattle region, but common in other Pacific Northwest areas. Native.',
    identifiable_attributes: [
      'Mature trees have a wide spreading crown, and are capable of growing more then 130 feet wide.',
      'Has deeply lobed leaves that are richly green and glossy on the upperside, and paler on the underside.',
      'Acorns are small in size with a shallow scaly cup on one end.',
      'Bark is dark gray with deep grooves.',
      'Grows to an average height of 50–90 ft.',
    ],
    known_public_locations: [
      `Seward Park (one of the last old-growth forest areas in all of Seattle) has several specimens. A mature Garry oak can be found not far east from the parking lot by the entrance, in an area known as "Clark's Prarie".`,
      'Oak Manor, 730 Belmont Avenue E is home to a specimen that is likely over 170 years old. This Capitol Hill neighborhood oak is on private property, however, it is so large and visible that it can easily be seen from the street.',
    ],
    fun_facts: ["Whidbey Island's Oak Harbor was named after this tree."],
  },
  {
    images: [
      require('../../assets/suggested-trees/northern-red-oak-1.jpg'),
      require('../../assets/suggested-trees/northern-red-oak-2.png'),
    ],
    name: 'Northern Red Oak',
    level: 'Easy',
    levelText: 'Easy, common in Seattle region. Non-Native.',
    identifiable_attributes: [
      'Mature trees have a rounded crown, consisting of stout branches.',
      'Has shallow, wavy lobed leaves that have bristle tips (*very different than the White Oak, which has no bristle tips).',
      'Upperside of the leaf is a dull green, and the underside is a dull light green.',
      'Acorns are medium to large in size (5-11 in.). A reddish brown scaly cup, which is slightly hairy at the margins of the cup.',
      'Bark is dark gray or black with shallow grooves.',
      'Grows to an average height of 65–100 ft. ',
    ],
    known_public_locations: [
      'Hiawatha Playfield, the largest red oak can be found North of the gym. ',
    ],
    fun_facts: [
      'Native American tribes have used red oak bark as a medicine for bronchial and heart ailments. It has also been used as an astingent, disinfectant, and cleanser.',
    ],
  },
  {
    imageUris: [
      'https://picsum.photos/1200/600',
      'https://picsum.photos/600/1200',
      'https://picsum.photos/1000/1000',
    ],
    name: 'Shaggybark Hickory',
    level: 'Medium',
    levelText: '',
    identifiable_attributes: [],
    known_public_locations: [],
    fun_facts: [],
  },
  {
    images: [
      require('../../assets/suggested-trees/northern-white-cedar-1.jpg'),
      require('../../assets/suggested-trees/northern-white-cedar-2.jpg'),
      require('../../assets/suggested-trees/northern-white-cedar-3.jpg'),
    ],
    name: 'Northern White Cedar',
    level: 'Expert',
    levelText:
      'Expert, common in Seattle region - however can be easily mistaken for its native cousin - the Western Red Cedar. Non-Native.',
    identifiable_attributes: [
      `Key difference between the Western Red Cedar and the Northern White Cedar is in its size. Western Red Cedar's tend to be much larger (particularly in the Pacific Northwest, where they can grow up to 200 ft tall).`,
      'Leaves are evergreen. The leaves have a pattern of flat and filigree sprays made up of many tiny, scaly leaves.',
      'Sprays are a bright green shade.',
      'Seed cones are slender, yellow-green / brown color. Usually under 1/2 an inch in length.',
      'Bark is red-brown, furrowed and peels in longitudinal strips.',
      'Grows to an average height of 30–60 ft, but in Seattle more commonly seen to be around 30-40 ft tall. ',
    ],
    known_public_locations: ['Ravenna Park: east of the 15tg Ave NE bridge.'],
    fun_facts: [
      `This cedar is sometimes called "Arborvitae" (tree of life), and it was the first North American tree to be transplanted and cultivated in Europe. Jacques Cartier, a 16th century explorer, learned from Native Americans how to use the tree's Vitamin C-rich foliage to treat scurvy.`,
    ],
  },
  {
    imageUris: [
      'https://picsum.photos/1200/600',
      'https://picsum.photos/600/1200',
      'https://picsum.photos/1000/1000',
    ],
    name: 'Western Red Cedar ',
    level: 'Easy',
    levelText: '',
    identifiable_attributes: [],
    known_public_locations: [],
    fun_facts: [],
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
        placeholder={{}}
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
