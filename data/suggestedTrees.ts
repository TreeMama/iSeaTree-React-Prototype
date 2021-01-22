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
      require('../assets/suggested-trees/big-leaf-maple-1.jpg'),
      require('../assets/suggested-trees/big-leaf-maple-2.jpg'),
      require('../assets/suggested-trees/big-leaf-maple-3.jpg'),
      require('../assets/suggested-trees/big-leaf-maple-4.jpg'),
      require('../assets/suggested-trees/big-leaf-maple-5.jpg'),
    ],
    name: 'Big Leaf Maple',
    level: 'Easy',
    levelText: 'Native to western North America.',
    identifiable_attributes: [
      "Large 5-lobed leaves, that span from 6-inches to 12-inches across.",
      "At maturity, the tree can have a rounded crown appearance.",
      "Height ranges from 20 feet to 100 feet tall.",
      "Their root systems tend to be shallow (they make particularly poor street trees due to their impacts on sidewalks).",
      "Its deeply ridged bark creates an ideal habitat for epiphytes (i.e. plants that grow on trees without soil),like mosses and lichens. If you see a Maple tree covered with moss - it is fairly likely that it is a Big Leaf Maple."
    ],
    fun_facts: [
      "Native Americans found this tree useful. The bark was used for making rope, and the leaves could be fashioned into containers. Commercially, the wood can be used to make furniture pieces, paneling, or musical instruments. Also, the sap can be boiled to make maple syrup.",
      "They are moderately long-lived trees, some individuals may reach 300 years in age. The seeds are a particular favorite food of many small mammals and birds - squirrels, in particular."
    ],
  },
  {
    images: [
      require('../assets/suggested-trees/atlas-cedar-1.png'),
      require('../assets/suggested-trees/atlas-cedar-2.jpg'),
    ],
    name: 'Blue Atlas Cedar',
    level: 'Medium',
    levelText: 'Native to northern Africa.',
    identifiable_attributes: [
      'Grows in a large, pyramidal shape.',
      'Has silvery blue to bluish-green needles up to 1½" long that are somewhat stiff but not very sharp.',
      "Develops very large 'purple-tipped' female cones on the upper branches.",
      'Cones tend to easily break when they fall (depending on the time of year, you might be able to find broken cone shells dispersed over the ground).',
      'Grows to an average height of 40–60 ft. ',
    ],
    fun_facts: [
      'The Atlas cedar produces an aromatic oil that is a natural deterrent for insects. Wood from this cedar is commonly used in chests and furniture drawers.',
    ],
  },
  {
    images: [
      require('../assets/suggested-trees/coast-redwood-1.jpg'),
      require('../assets/suggested-trees/coast-redwood-2.jpg'),
      require('../assets/suggested-trees/coast-redwood-3.jpg'),
      require('../assets/suggested-trees/coast-redwood-4.jpg'),
      require('../assets/suggested-trees/coast-redwood-5.jpg'),
    ],
    name: 'Coast Redwood',
    level: 'Easy',
    levelText: 'Native to western North America.',
    identifiable_attributes: [
      "Coast redwoods thrive in the wet and shady areas.",
      "They grow in a pyramidal shape, and can be found around the region at heights ranging from 100-150 feet.",
      "Needles are flat, stiff, and are about 1/2 inch long with a sharp tip.",
      "Bark is thick, reddish brown, fibrous, and deeply furrowed.",
      "Cones are only about 1 inch long. They are elliptical shaped, with many flat, short-pointed scales."
      ],
    fun_facts: [
      "The Coast Redwoods are regarded as one of the tallest trees in the world. They also are long-lived - with reports of trees that have survived up to 4,000 years (and 2,000 years not being uncommon). ",
      "The Coast Redwood is the state tree of California."
    ],
  },
  {
    images: [
      require('../assets/suggested-trees/douglas-fir-1.jpg'),
      require('../assets/suggested-trees/douglas-fir-2.jpg'),
      require('../assets/suggested-trees/douglas-fir-3.jpg'),
      require('../assets/suggested-trees/douglas-fir-4.jpg'),
      require('../assets/suggested-trees/douglas-fir-5.jpg'),
    ],
    name: 'Douglas-Fir (Oregon Pine)',
    level: 'Easy',
    levelText: 'Native to western North America.',
    identifiable_attributes: [
      "Mature Douglas-Fir trees are medium-sized to extremely large trees. ",
      "In urban areas, mature heights range from 160-180 feet. However, trees as tall as 200 feet can be regularly found around the region.",
      "The evergreen needles are about 3/4 inches to 1 inch long with a blunt tip. The needles are thin, flat, and stick out in all directions - like bristles on a bottle brush.",
      "Bark can range from brown to grayish color. Coloring is largely due to environmental conditions, with the gray coloring caused by lichen growth.",
      "Mature bark is very thick and coarse, with deep vertical fissures.",
      "The female cones are pendulous and scaled, with pitchfork-shaped bracts."
      ],
    fun_facts: [
      "The Douglas-Fir is not a true fir, the hyphen in its common name signifies that it is NOT a 'true' fir (i.e. a member of the Abies genus). In 1867, it was given its own genus: Pseudotsuga - which means false (pseudo) hemlock. ",
      "Old Douglas-Firs are remarkably fire-resistant, largely due to the thick resin bark that it develops with age. This rugged bark can reach a remarkable thickness up to 20 inches. These durable trees are also very long-lived, and may live as long as 1,500-2,000 years.",
      "They are the second-tallest conifer in the world (after the Coast Redwood), and the state tree of Oregon."
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
    levelText: 'Native to North America.',
    identifiable_attributes: [
      'Mature trees have a rounded crown, consisting of stout branches.',
      'Has shallow, wavy lobed leaves that have bristle tips (*very different than the White Oak, which has no bristle tips).',
      'Upperside of the leaf is a dull green, and the underside is a dull light green.',
      'Acorns are medium to large in size (5-11 in.). A reddish brown scaly cup, which is slightly hairy at the margins of the cup.',
      'Bark is dark gray or black with shallow grooves.',
      'Grows to an average height of 65–100 ft. ',
    ],
    fun_facts: [
      'Native American tribes have used red oak bark as a medicine for bronchial and heart ailments. It has also been used as an astringent, disinfectant, and cleanser.',
    ],
  }, 
  {
    images: [
      require('../assets/suggested-trees/garry-oak-1.jpg'),
      require('../assets/suggested-trees/garry-oak-2.png'),
      require('../assets/suggested-trees/garry-oak-3.jpg'),
      require('../assets/suggested-trees/garry-oak-4.jpg'),
    ],
    name: 'Oregon Oak (White Oak or Garry Oak)',
    level: 'Easy',
    levelText:
      'Native to the Pacific Northwest.',
    identifiable_attributes: [
      'Mature trees have a wide spreading crown, and are capable of growing more than 130 feet wide.',
      'Has deeply lobed leaves that are richly green and glossy on the upperside, and paler on the underside.',
      'Acorns are small in size with a shallow scaly cup on one end.',
      'Bark is dark gray with deep grooves.',
      'Grows to an average height of 50–90 ft.',
    ],
    fun_facts: ["Whidbey Island's Oak Harbor (WA state) was named after this tree."],
  },
  {
    images: [
      require('../assets/suggested-trees/northern-white-cedar-1.jpg'),
      require('../assets/suggested-trees/northern-white-cedar-2.jpg'),
      require('../assets/suggested-trees/northern-white-cedar-3.jpg'),
      require('../assets/suggested-trees/northern-white-cedar-4.jpg'),
    ],
    name: 'Northern White Cedar (Arborvitae)',
    level: 'Medium',
    levelText:
      'Native to North America.',
    identifiable_attributes: [
      `Key difference between the Western Red Cedar and the Northern White Cedar is in its size. Western Red Cedar's tend to be much larger (particularly in the Pacific Northwest, where they can grow up to 200 ft tall).`,
      'Leaves are evergreen. The leaves have a pattern of flat and filigree sprays made up of many tiny, scaly leaves.',
      'Sprays are a bright green shade.',
      'Seed cones are slender, yellow-green / brown color. Usually under 1/2 an inch in length.',
      'Bark is red-brown, furrowed and peels in longitudinal strips.',
      'Grows to an average height of 30–60 ft, but in Seattle more commonly seen to be around 30-40 ft tall. ',
    ],
    fun_facts: [
      `This cedar is sometimes called "Arborvitae" (tree of life), and it was the first North American tree to be transplanted and cultivated in Europe. Jacques Cartier, a 16th century explorer, learned from Native Americans how to use the tree's Vitamin C-rich foliage to treat scurvy.`,
    ],
  },
  {
    images: [
      require('../assets/suggested-trees/scotch-pine-1.jpg'),
      require('../assets/suggested-trees/scotch-pine-2.jpg'),
      require('../assets/suggested-trees/scotch-pine-3.jpg'),
      require('../assets/suggested-trees/scotch-pine-4.jpg'),
      require('../assets/suggested-trees/scotch-pine-5.jpg'),
      require('../assets/suggested-trees/scotch-pine-6.jpg'),
    ],
    name: 'Scotch Pine',
    level: 'Medium',
    levelText: 'Native to Scotland, Scandinavia, and Mediterranean.',
    identifiable_attributes: [
      "Bark color is yellow-orange, similar to the Japanese Red Pine's. Bark is flaky, and has a peeling characteristic to it.",
      "Needle foliage color ranges from gray-green to bluish-green. 1-4 inches in length.",
      "A mature crown is often open, oval-shaped, and very irregular looking. Has roughly 25 to 35 foot spread.",
      "Seed cones have diamond-shaped scales. 1.5 to 2.5 inches long.",
      "Leaf fascicles: 2 needles per fascicle, usually twisted.",
      "A medium to large tree, it tends to grow in a very pyramidal shape when young and then becomes more open with age. Average height of 30–60 ft."
      ],
    fun_facts: [
      `This non-native pine is one of the first trees that was introduced to North America, approximately around 1600. It is a popular Christmas tree species, and a highly valued tree in the timber and millwork industries.`,
      "The ground-up inner bark is edible to humans, and porcupines (who have been known to cause extensive damage). Also known as 'Scots Pine' or 'Scottish Pine'."
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
    level: 'Easy',
    levelText: 'Native to North America.',
    identifiable_attributes: [
      'The compound leaves generally have 5 leaflets (and occasionally 3 or 7 leaflets) that are about 8-14" long (see picture).',
      'The leaf color is yellow-green, that turns a vivid golden yellow in the fall.',
      'In its mature size it has a broad, round crown with drooping and twisted branches.',
      'Husked nuts are very large and round. Squirrels are very fond of them, and will leave shreds of the emptied husk to be easily found.',
      `Bark is a deep gray color, that has a loose 'shredding' characteristic to it (hence the name).`,
      'Grows to an average height of 65–90 ft. ',
    ],
    fun_facts: [
      `This hickory is prized for both its strong durable wood and ripened nuts. The wood has been used in everything from baseball bats to firewood. The large nuts have three parts to them: the husk, the outer shell, and the inner nut meat. The nuts are greatly favored by humans and wildlife - so be prepared to see the ground covered with nuts if you find this tree in the fall or the winter. `,
    ],
  },
  {
    images: [
      require('../assets/suggested-trees/vine-maple-1.jpg'),
      require('../assets/suggested-trees/vine-maple-2.jpg'),
      require('../assets/suggested-trees/vine-maple-3.jpg'),
      require('../assets/suggested-trees/vine-maple-4.jpg'),
      require('../assets/suggested-trees/vine-maple-5.jpg'),
      require('../assets/suggested-trees/vine-maple-6.jpg'),
    ],
    name: 'Vine Maple',
    level: 'Easy',
    levelText: 'Native to western North America.',
    identifiable_attributes: [
      "A multi-stemmed tree, that usually has a 'shrub' like appearance to it.",
      "At times can reach heights of 60 feet (in urban areas, usually 20-40 feet). ",
      'Twisted wide-spreading limbs, an "octopus" like form. ',
      "1-7 inch wide palmately veined leaf. Leaves have a circular structure, with 7 to 11 symmetric lobes.",
      "Leaf underside is hairy.",
      "Leaf color is light green, with leaves turning red to yellow in the fall.",
      "Fruits 1.5 inches long, wings horizontally spread, deep red at maturity.",
      "Bark is a pale silvery-gray to green color."
      ],
    fun_facts: [
      "Canadian trappers called the tree 'bois du diable' (wood of the devil) for its habit of tripping travelers who were trying to portage around them. ",
      " Native Americans used the bark from the roots to make a tea to treat common cold symptoms."
    ],
  },
  {
    images: [
      require('../assets/suggested-trees/western-red-cedar-1.jpg'),
      require('../assets/suggested-trees/western-red-cedar-2.jpg'),
      require('../assets/suggested-trees/western-red-cedar-3.jpg'),
      require('../assets/suggested-trees/western-red-cedar-4.jpg'),
    ],
    name: 'Western Red Cedar (Giant Arborvitae)',
    level: 'Medium',
    levelText: 'Native to western North America.',
    identifiable_attributes: [
      `The evergreen leaves are flat foliage sprays. The sprays are tiny, pointed and scalelike. Occassionally you can see white marks on the underside of the sprays.`,
      'The leaf color is green to yellow-green.',
      'The tree is large and pyramid shaped, with dropping branches that sometimes create distinctive arches.',
      'Bark is a cinnamon-red color with fibrous longitudinal fissures on the trunk.',
      `Foliage is fruity-smelling when crushed. Smells sort of like pineapple, and smells distinctively sweeter then its cousin, the Northern White Cedar.`,
      'Seed cones are very small (<.5 inches), and egg shaped.',
      `At its tallest height - this tree has been known to grow 213 - 230 ft tall, with 9.8 - 23 ft in trunk diameter. Within urban areas, most of the trees are under 200 feet though.`,
    ],
    fun_facts: [
      `The name plicata comes from a Greek word meaning "folded in plaits," in reference to the arrangement of the leaves. This tree is notably long lived, some individuals can live well over a thousand years, and its highly valuable wood is so rot resistant that you can easily find ancient stumps that still have not began to decay.`,
    ],
  } 
]
