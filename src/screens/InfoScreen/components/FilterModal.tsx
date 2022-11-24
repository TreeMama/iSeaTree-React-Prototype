import React, { useState } from "react"
import { Modal, View } from "react-native"
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
  return <Modal
    animationType="slide"
    transparent={true}
    visible={props.showFilters}>
    <View style={{ backgroundColor: 'rgba(0,0,0,0.5)', height: '30%' }}>
    </View>
    <View style={{ backgroundColor: 'white', height: '70%' }}>
      <TouchableOpacity onPress={() => props.setShowFilters(false)}>
        <Text>{'return button'}</Text>
      </TouchableOpacity>
      <View style={{ alignItems: 'center' }}>
        <Text >{'Filters'}</Text>
      </View>
      <FilterButton defaultState={false} buttonText="All" />
    </View>
  </Modal>
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
      height: 50, maxWidth: '20%', borderWidth: 2, borderRadius: 10, margin: 10,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isActive ? activeBackgroundColor : inactiveBackgroundColor
    }}
    onPress={() => { setIsActive(!isActive) }}
  >
    <Text style={{ color: isActive ? activeTextColor : inactiveTextColor }}>{props.buttonText}</Text>
  </TouchableOpacity>
}