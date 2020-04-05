import React from 'react'

import RNPickerSelect, { Item } from 'react-native-picker-select'
import { useTheme } from 'react-native-paper'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import { colors } from '../../styles/theme'
import landUseCategories from '../../../data/land_use_categories.json'

const selectItems: Item[] = landUseCategories.map((categoryName) => ({
  label: categoryName,
  value: categoryName,
}))

type LandUseCategoryName = string | null

interface LandUseCategoriesSelectProps {
  landUseCategoryName: LandUseCategoryName

  onValueChange: (value: LandUseCategoryName) => void
}

export function LandUseCategoriesSelect(props: LandUseCategoriesSelectProps) {
  const theme = useTheme()

  return (
    <RNPickerSelect
      value={props.landUseCategoryName}
      items={selectItems}
      onValueChange={(value) => {
        if (!value) {
          props.onValueChange(null)
        } else {
          props.onValueChange(value)
        }
      }}
      placeholder={{
        label: 'Select land use category...',
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
        height: 50,
        borderWidth: 1,
        borderColor: theme.colors.backdrop,
        backgroundColor: theme.colors.background,
        paddingHorizontal: 15,
        fontSize: 15,
        borderRadius: theme.roundness,
        marginTop: 5,
      }}
      placeholderTextColor={theme.colors.backdrop}
      Icon={() => <MaterialCommunityIcons name="menu-down" size={30} color={colors.gray[500]} />}
    />
  )
}
