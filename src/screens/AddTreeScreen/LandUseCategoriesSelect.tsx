/**
 * This is a React component that renders a dropdown menu for selecting land use categories, using data
 * from a JSON file and various styling options.
 * @param {LandUseCategoriesSelectProps} props - The `props` parameter in this code refers to the
 * properties passed to the `LandUseCategoriesSelect` component. These properties include
 * `landUseCategoryName` and `onValueChange`, which are used to set the initial value and handle
 * changes to the selected land use category.
 */

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

/* The `interface LandUseCategoriesSelectProps` is defining the type of the `props` object that will be
passed to the `LandUseCategoriesSelect` component. It has two properties: `landUseCategoryName` and
`onValueChange`. */
interface LandUseCategoriesSelectProps {
  landUseCategoryName: LandUseCategoryName

  onValueChange: (value: LandUseCategoryName) => void
}

/* This code exports a React functional component called `LandUseCategoriesSelect` that renders a
dropdown menu for selecting land use categories. It takes in a `props` object of type
`LandUseCategoriesSelectProps`, which includes the currently selected land use category name and a
function to handle changes to the selected value. */
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
        inputAndroid: { color: 'black' },
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
