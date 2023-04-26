/**
 * This is a React component that renders a dropdown menu for selecting a tree condition category,
 * using data from a JSON file.
 * @param {TreeConditionCategorySelectProps} props - The `props` parameter in this code refers to the
 * props passed down to the `TreeConditionSelect` component. These props include
 * `treeConditionCategoryName` and `onValueChange`.
 */

import React from 'react'

import RNPickerSelect, { Item } from 'react-native-picker-select'
import { useTheme } from 'react-native-paper'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import { colors } from '../../styles/theme'
import treeConditionCategories from '../../../data/tree_conditions.json'

const selectItems: Item[] = treeConditionCategories.map((categoryName) => ({
  label: categoryName,
  value: categoryName,
}))

type TreeConditionCategoryName = string | null

/* The `interface TreeConditionCategorySelectProps` is defining the props that can be passed down to
the `TreeConditionSelect` component. It has two properties: `treeConditionCategoryName` which is a
string or null representing the currently selected tree condition category, and `onValueChange`
which is a function that takes a string or null value and returns nothing. This function is called
when the user selects a new tree condition category from the dropdown menu. */
interface TreeConditionCategorySelectProps {
  treeConditionCategoryName: TreeConditionCategoryName
  onValueChange: (value: TreeConditionCategoryName) => void
}

/**
 * This is a TypeScript React component that renders a dropdown menu for selecting a tree condition
 * category.
 * @param {TreeConditionCategorySelectProps} props - The function `TreeConditionSelect` takes in a
 * single parameter `props`, which is of type `TreeConditionCategorySelectProps`. This parameter is an
 * object that contains various properties and methods that are used within the function to render a
 * dropdown select component.
 */
export function TreeConditionSelect(props: TreeConditionCategorySelectProps) {
  const theme = useTheme()

  return (
    <RNPickerSelect
      value={props.treeConditionCategoryName}
      items={selectItems}
      onValueChange={(value) => {
        if (!value) {
          props.onValueChange(null)
        } else {
          props.onValueChange(value)
        }
      }}
      placeholder={{
        label: 'Select tree condition category...',
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
