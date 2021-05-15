import React from 'react'

import RNPickerSelect, { Item } from 'react-native-picker-select'
import { useTheme } from 'react-native-paper'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import { colors } from '../../styles/theme'
import crownLightExposureCategories from '../../../data/crown_light_exposures.json'

const selectItems: Item[] = crownLightExposureCategories.map((category) => ({
  label: category.label,
  value: category.value,
}))

type CrownLightExposureCategoryName = string | null

interface CrownLightExposureCategorySelectProps {
  crownLightExposureCategoryName: CrownLightExposureCategoryName
  onValueChange: (value: CrownLightExposureCategoryName) => void
}

export function CrownLightExposureSelect(props: CrownLightExposureCategorySelectProps) {
  const theme = useTheme()

  return (
    <RNPickerSelect
      value={props.crownLightExposureCategoryName}
      items={selectItems}
      onValueChange={(value) => {
        props.onValueChange(value)
      }}
      placeholder={{
        label: 'Select crown light exposure category...',
        value: null,
      }}
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
        borderWidth: 1,
        borderColor: theme.colors.backdrop,
        backgroundColor: theme.colors.background,
        paddingHorizontal: 15,
        fontSize: 15,
        borderRadius: theme.roundness,
      }}
      touchableWrapperProps={{ activeOpacity: 0.3 }}
      placeholderTextColor={theme.colors.backdrop}
      useNativeAndroidPickerStyle={false}
      Icon={() => <MaterialCommunityIcons name="menu-down" size={30} color={colors.gray[500]} />}
    />
  )
}
