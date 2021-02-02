import React from 'react'

import { Image, View, ImageSourcePropType } from 'react-native'

type BadgeVariant = 'seedling' | 'sapling' | 'old_growth_expert' | 'first_tree' | 'fifth_tree' | 'tenth_tree' | 'twentieth_tree' | 'fiftieth_tree' | 'hundredth_tree' | 'two_hundredth_tree' | 'dbh'

interface BadgeProps {
  key: string
  variant: BadgeVariant
}

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

export function Badge(props: BadgeProps) {
  const badgeImage = badgeImages[props.variant]

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
