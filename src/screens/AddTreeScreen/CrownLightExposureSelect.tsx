/**
 * This is a React component that renders a dropdown select menu for crown light exposure categories
 * using the RNPickerSelect library.
 * @param {CrownLightExposureCategorySelectProps} props - The `props` parameter in this code refers to
 * the props passed down to the `CrownLightExposureSelect` component. These props include
 * `crownLightExposureCategoryName` and `onValueChange`.
 */

import React from 'react'

import RNPickerSelect, { Item } from 'react-native-picker-select'
import { useTheme } from 'react-native-paper'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import { colors } from '../../styles/theme'
import crownLightExposureCategories from '../../../data/crown_light_exposures.json'

/* `const selectItems: Item[] = crownLightExposureCategories.map((category) => ({ label:
category.label, value: category.value }))` is creating an array of `Item` objects that will be used
as options in the dropdown select menu. It is mapping through the `crownLightExposureCategories`
array and creating a new object for each category with a `label` property and a `value` property.
The `label` property is set to the `label` property of the category object, and the `value` property
is set to the `value` property of the category object. The resulting array of `Item` objects is then
assigned to the `selectItems` constant. */
const selectItems: Item[] = crownLightExposureCategories.map((category) => ({
  label: category.label,
  value: category.value,
}))

type CrownLightExposureCategoryName = string | null

/* The `interface CrownLightExposureCategorySelectProps` is defining the props that can be passed down
to the `CrownLightExposureSelect` component. It has two properties: `crownLightExposureCategoryName`
and `onValueChange`. */
interface CrownLightExposureCategorySelectProps {
  crownLightExposureCategoryName: CrownLightExposureCategoryName
  onValueChange: (value: CrownLightExposureCategoryName) => void
}

/**
 * This is a TypeScript React component that renders a dropdown menu for selecting a crown light
 * exposure category.
 * @param {CrownLightExposureCategorySelectProps} props - The function `CrownLightExposureSelect` takes
 * in a single parameter `props`, which is of type `CrownLightExposureCategorySelectProps`. This
 * parameter is an object that contains various properties and methods that are used within the
 * function.
 */
export function CrownLightExposureSelect(props: CrownLightExposureCategorySelectProps) {
  const theme = useTheme()

  /* The `return` statement is returning a `RNPickerSelect` component with various props passed to it.
  These props include `value`, `items`, `onValueChange`, `placeholder`, `style`, `textInputProps`,
  `touchableWrapperProps`, `placeholderTextColor`, `useNativeAndroidPickerStyle`, and `Icon`. The
  `value` prop is set to `props.crownLightExposureCategoryName`, which is the currently selected
  category. The `items` prop is set to the `selectItems` array, which contains the options for the
  dropdown menu. The `onValueChange` prop is a function that is called when the user selects an option
  from the dropdown menu. The `placeholder` prop is an object that contains a label and a value for
  the default placeholder option. The `style` prop is an object that contains various styles for the
  dropdown menu. The `textInputProps` prop is an object that contains various styles for the text
  input field. The `touchableWrapperProps` prop is an object that contains various props for the
  touchable wrapper around the dropdown menu. The `placeholderTextColor` prop is the color of the
  placeholder text. The `useNativeAndroid */

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
