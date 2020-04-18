import { ImageSourcePropType } from 'react-native'

export interface SuggestedTreeData {
  imageUris?: string[]
  images?: ImageSourcePropType[] // TODO
  name: string
  level: string

  levelText?: string
  identifiable_attributes?: string[]
  known_public_locations?: string[]
  fun_facts?: string[]
}

export const suggestedTrees: SuggestedTreeData[] = [
  {
    images: [
      require('../assets/suggested-trees/garry-oak-1.jpg'),
      require('../assets/suggested-trees/garry-oak-2.png'),
      require('../assets/suggested-trees/garry-oak-3.jpg'),
      require('../assets/suggested-trees/garry-oak-4.jpg'),
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
      require('../assets/suggested-trees/atlas-cedar-1.png'),
      require('../assets/suggested-trees/atlas-cedar-2.jpg'),
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
      require('../assets/suggested-trees/northern-red-oak-1.jpg'),
      require('../assets/suggested-trees/northern-red-oak-2.png'),
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
      require('../assets/suggested-trees/northern-white-cedar-1.jpg'),
      require('../assets/suggested-trees/northern-white-cedar-2.jpg'),
      require('../assets/suggested-trees/northern-white-cedar-3.jpg'),
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
