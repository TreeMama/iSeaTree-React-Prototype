import { ImageSourcePropType } from 'react-native'

export interface SuggestedTreeData {
  images?: ImageSourcePropType[]
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
      'Easy-level difficulty, Rare in Seattle region, but common in other Pacific Northwest areas. Native.',
    identifiable_attributes: [
      'Mature trees have a wide spreading crown, and are capable of growing more then 130 feet wide.',
      'Has deeply lobed leaves that are richly green and glossy on the upperside, and paler on the underside.',
      'Acorns are small in size with a shallow scaly cup on one end.',
      'Bark is dark gray with deep grooves.',
      'Grows to an average height of 50–90 ft.',
    ],
    known_public_locations: [
      `Seward Park (one of the last old-growth forest areas in all of Seattle) has several specimens. A mature Garry Oak can be found not far east from the parking lot by the entrance, in an area known as "Clark's Prairie".`,
      'Oak Manor, 730 Belmont Avenue E is home to a specimen that is likely over 170 years old. This Capitol Hill neighborhood oak is on private property, however, it is so large and visible that it can easily be seen from the street.',
    ],
    fun_facts: ["Whidbey Island's Oak Harbor was named after this tree."],
  },
  {
    images: [
      require('../assets/suggested-trees/atlas-cedar-1.png'),
      require('../assets/suggested-trees/atlas-cedar-2.jpg'),
    ],
    name: 'Blue Atlas Cedar',
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
      require('../assets/suggested-trees/northern-red-oak-3.jpg'),
      require('../assets/suggested-trees/northern-red-oak-4.jpg'),
      require('../assets/suggested-trees/northern-red-oak-5.png'),
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
    images: [
      require('../assets/suggested-trees/shagbark-hickory-1.jpg'),
      require('../assets/suggested-trees/shagbark-hickory-2.jpg'),
      require('../assets/suggested-trees/shagbark-hickory-3.jpg'),
      require('../assets/suggested-trees/shagbark-hickory-4.jpg'),
      require('../assets/suggested-trees/shagbark-hickory-5.jpg'),
      require('../assets/suggested-trees/shagbark-hickory-6.jpg'),
    ],
    name: 'Shagbark Hickory',
    level: 'Expert',
    levelText: 'Expert, very rare in Seattle region. Non-Native.',
    identifiable_attributes: [
      'The compound leaves generally have 5 leaflets (and occassionally 3 or 7 leaflets) that are about 8-14" long (see picture).',
      'The leaf color is yellow-green, that turns a vivid golden yellow in the fall.',
      'In its mature size it has a broad, round crown with drooping and twisted branches.',
      'Husked nuts are very large and round. Squirrels are very fond of them, and will leave shreds of the emptied husk to be easily found.',
      `Bark is a deep gray color, that has a loose 'shredding' characteristic to it (hence the name).`,
      'Grows to an average height of 65–90 ft. ',
    ],
    known_public_locations: [
      `Carkeek Park, near Piper's Orchard.`,
      'Washington Park Arboretum (UW).',
    ],
    fun_facts: [
      `This hickory is prized for both its strong durable wood and ripened nuts. The wood has been used in everything from baseball bats to firewood. The large nuts have three parts to them: the husk, the outer shell, and the inner nut meat. The nuts are greatly favored by humans and wildlife - so be prepared to see the ground covered with nuts if you find this tree in the fall or the winter. `,
    ],
  },
  {
    images: [
      require('../assets/suggested-trees/northern-white-cedar-1.jpg'),
      require('../assets/suggested-trees/northern-white-cedar-2.jpg'),
      require('../assets/suggested-trees/northern-white-cedar-3.jpg'),
      require('../assets/suggested-trees/northern-white-cedar-4.jpg'),
    ],
    name: 'Northern White Cedar',
    level: 'Medium',
    levelText:
      'Medium-level difficulty, common in Seattle region - however can be easily mistaken for its native cousin - the Western Red Cedar. Non-Native.',
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
    images: [
      require('../assets/suggested-trees/western-red-cedar-1.jpg'),
      require('../assets/suggested-trees/western-red-cedar-2.jpg'),
      require('../assets/suggested-trees/western-red-cedar-3.jpg'),
      require('../assets/suggested-trees/western-red-cedar-4.jpg'),
    ],
    name: 'Western Red Cedar',
    level: 'Medium',
    levelText: 'Medium, very common in Seattle region. Native.',
    identifiable_attributes: [
      `The evergreen leaves are flat foliage sprays. The sprays are tiny, pointed and scalelike. Occassionally you can see white marks on the underside of the sprays.`,
      'The leaf color is green to yellow-green.',
      'The tree is large and pyramid shapped, with dropping branches that sometimes create distinctive arches.',
      'Bark is a cinammon-red color with fibrous longitudinal fissures on the trunk.',
      `Foliage is fruity-smelling when crushed. Smells sort of like pineapple, and smells distinctively sweeter then its cousin, the Northern White Cedar.`,
      'Seed cones are very small (<.5 inches), and egg shaped.',
      `At its tallest height - this tree has been known to grow 213 - 230 ft tall, with 9.8 - 23 ft in trunk diameter. Within Seattle, most of the trees are under 200 feet though.`,
    ],
    known_public_locations: [`Denny and Seward park both have large specimens of ~175 ft tall.`],
    fun_facts: [
      `The name plicata comes from a Greek word meaning "folded in plaits," in reference to the arrangement of the leaves. This tree is notably long lived, some individuals can live well over a thousand years, and its highly valuable wood is so rot resistant that you can easily find ancient stumps that still have not began to decay.`,
    ],
  },

  {
    images: [
    ],
    name: 'Scotch Pine',
    level: '',
    levelText: '',
    identifiable_attributes: [
      'provide data',
      ],
    known_public_locations: [`N/A`],
    fun_facts: [
      `N/A`,
    ],
  },
  {
    images: [
    ],
    name: 'Douglas Fir',
    level: '',
    levelText: '',
    identifiable_attributes: [
      'provide data',
      ],
    known_public_locations: [`N/A`],
    fun_facts: [
      `N/A`,
    ],
  },
  {
    images: [
    ],
    name: 'Coast Redwood',
    level: '',
    levelText: '',
    identifiable_attributes: [
      'provide data',
      ],
    known_public_locations: [`N/A`],
    fun_facts: [
      `N/A`,
    ],
  },
  {
    images: [
    ],
    name: 'Big Leaf Maple',
    level: '',
    levelText: '',
    identifiable_attributes: [
      'provide data',
      ],
    known_public_locations: [`N/A`],
    fun_facts: [
      `N/A`,
    ],
  },
  {
    images: [
    ],
    name: 'Vine Maple',
    level: '',
    levelText: '',
    identifiable_attributes: [
      'provide data',
      ],
    known_public_locations: [`N/A`],
    fun_facts: [
      `N/A`,
    ],
  },

]
