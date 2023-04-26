
/**
 * This is a React component that displays a badge image based on the variant prop passed to it.
 * @param {BadgeProps} props - The `props` parameter in the `Badge` function is an object that contains
 * the properties passed to the `Badge` component when it is used in another component. In this case,
 * it contains a `key` property (which is a string) and a `variant` property (which is one
 */
import React from 'react'

import { Image, View, ImageSourcePropType } from 'react-native'

type BadgeVariant = 'seedling' | 'sapling' | 'old_growth_expert' | 'first_tree' | 'fifth_tree' | 'tenth_tree' | 'twentieth_tree' | 'fiftieth_tree' | 'hundredth_tree' | 'two_hundredth_tree' | 'dbh'

/* The `interface BadgeProps` is defining the type of the `props` object that will be passed to the
`Badge` component. It specifies that the `props` object should have two properties: `key`, which is
a string, and `variant`, which is of type `BadgeVariant`. The `key` property is a reserved prop in
React that is used to uniquely identify components in a list, while the `variant` property is used
to determine which badge image to display. */
/* This code defines an object `badgeImages` that maps each `BadgeVariant` (a string literal type) to
an `ImageSourcePropType` (a type that represents the source of an image in React Native). Each
`BadgeVariant` is a key in the object, and its value is the corresponding image source required
using the `require` function. This allows the `Badge` component to easily access the correct image
based on the `variant` prop passed to it. */

interface BadgeProps {
  key: string
  variant: BadgeVariant
}

/* This code is defining an object `badgeImages` that maps each `BadgeVariant` (a string literal type)
to an `ImageSourcePropType` (a type that represents the source of an image in React Native). Each
`BadgeVariant` is a key in the object, and its value is the corresponding image source required
using the `require` function. This allows the `Badge` component to easily access the correct image
based on the `variant` prop passed to it. */

const badgeImages: { [key in BadgeVariant]: ImageSourcePropType } = {
  seedling: require('../../assets/badges/seedling.png'),
  sapling: require('../../assets/badges/sapling.png'),
  old_growth_expert: require('../../assets/badges/old_growth_expert.png'),
  first_tree: require('../../assets/badges/first_tree.png'),
  fifth_tree: require('../../assets/badges/fifth_tree.png'),
  tenth_tree: require('../../assets/badges/tenth_tree.png'),
  twentieth_tree: require('../../assets/badges/twentieth_tree.png'),
  fiftieth_tree: require('../../assets/badges/fiftieth_tree.png'),
  hundredth_tree: require('../../assets/badges/hundredth_tree.png'),
  two_hundredth_tree: require('../../assets/badges/two_hundredth_tree.png'),
  dbh: require('../../assets/badges/dbh.png')
}

const BADGE_HEIGHT = 120

/**
 * This is a TypeScript React function that renders a badge component with an image based on the
 * variant prop.
 * @param {BadgeProps} props - The `props` parameter is an object that contains the properties passed
 * to the `Badge` component. These properties can be accessed using dot notation, for example
 * `props.variant` would access the `variant` property of the `props` object.
 */
export function Badge(props: BadgeProps) {
  const badgeImage = badgeImages[props.variant]

  /* This code is returning a JSX element that renders a `View` component containing an `Image`
  component. The `Image` component displays the badge image corresponding to the `variant` prop passed
  to the `Badge` component. The `style` prop of the `Image` component sets the height, width, opacity,
  resizeMode, and margin of the badge image. The `View` component is used to wrap the `Image`
  component and apply any additional styling or layout to the badge component as a whole. */
  return (
    <View>
      <Image
        source={badgeImage}
        style={{
          height: BADGE_HEIGHT,
          width: BADGE_HEIGHT,
          opacity: 0.8,
          resizeMode: 'stretch',
          margin: 10
        }}
      />
    </View>
  )
}
