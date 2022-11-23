import React, { useState } from "react"
import { View } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { Text } from 'react-native-paper'
import { styles } from "../styles"

/**
 * The Button Tab at the top of Info screen containing Genus | Species.
 * @param props 
 */
export const FilterModal = (props: {
  showFilters: boolean,
  setShowFilters: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  return <View style={{ width: '100%', height: '70%', position: 'absolute', bottom: 0 }} >
    <TouchableOpacity onPress={() => props.setShowFilters(false)}>
      <Text>{'return button'}</Text>
    </TouchableOpacity>
    <Text>{'Filters'}</Text>
    <FilterButton defaultState={false} buttonText="test filter button" />
  </View>
}

// generalizes the appearance of a filter button
const FilterButton = (props: { defaultState: boolean, buttonText: string }) => {
  const [isActive, setIsActive] = useState<boolean>(props.defaultState);
  const activeBackgroundColor = '#287B51'
  const inactiveBackgroundColor = 'white'
  const activeTextColor = 'white'
  const inactiveTextColor = '#62717A'
  return <TouchableOpacity
    style={{
      height: 24, borderWidth: 2, borderRadius: 1,
      backgroundColor: isActive ? activeBackgroundColor : inactiveBackgroundColor
    }}
    onPress={() => { setIsActive(!isActive) }}
  >
    <Text>{props.buttonText}</Text>
  </TouchableOpacity>
}