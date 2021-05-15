import React from 'react'

import RNPickerSelect, { Item } from 'react-native-picker-select'
import { useTheme } from 'react-native-paper'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import { colors } from '../../styles/theme'
import locationTypes from '../../../data/location_types.json'

const selectItems: Item[] = locationTypes.map((locationType) => ({
  label: locationType,
  value: locationType,
}))

type LocationType = string | null

interface LocationTypeSelectProps {
  locationType: LocationType

  onValueChange: (value: LocationType) => void
}

export function LocationTypeSelect(props: LocationTypeSelectProps) {
  const theme = useTheme()

  return (
    <RNPickerSelect
      value={props.locationType}
      items={selectItems}
      onValueChange={(value) => {
        if (!value) {
          props.onValueChange(null)
        } else {
          props.onValueChange(value)
        }
      }}
      placeholder={{
        label: 'Select location type...',
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
