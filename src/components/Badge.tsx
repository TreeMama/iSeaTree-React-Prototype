import React from 'react'

import { Image, View, ImageSourcePropType } from 'react-native'

type BadgeVariant = 'seedling' | 'sapling' | 'old_growth_expert'

interface BadgeProps {
  variant: BadgeVariant
}

const badgeImages: { [key in BadgeVariant]: ImageSourcePropType } = {
  seedling: require('../../assets/badges/seedling.png'),
  sapling: require('../../assets/badges/sapling.png'),
  old_growth_expert: require('../../assets/badges/old_growth_expert.png'),
}

const BADGE_HEIGHT = 120

export function Badge(props: BadgeProps) {
  const badgeImage = badgeImages[props.variant]

  return (
    <View>
      <Image
        source={badgeImage}
        style={{ height: BADGE_HEIGHT, width: BADGE_HEIGHT, opacity: 0.8 }}
      />
    </View>
  )
}
