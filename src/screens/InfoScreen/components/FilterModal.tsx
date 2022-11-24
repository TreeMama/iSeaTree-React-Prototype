import React, { useState } from "react"
import { Modal, View } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { Text } from 'react-native-paper'
import { styles } from "../styles"
import { IFilterValues } from "../types"

/**
 * The Button Tab at the top of Info screen containing Genus | Species.
 * @param props 
 */
export const FilterModal = (props: {
  showFilters: boolean,
  setShowFilters: React.Dispatch<React.SetStateAction<boolean>>,
  filterValues: IFilterValues,
  setFilterValues: React.Dispatch<React.SetStateAction<IFilterValues>>
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
      <Text >{'Name Type'}</Text>
      <FilterButton
        isActive={props.filterValues.allNameTypes}
        buttonText="All"
        toggleOnHandler={() => {
          props.setFilterValues({ ...props.filterValues, allNameTypes: true, commonName: false, scientificName: false })
        }}
        toggleOffHandler={() => 1}
      />
      <FilterButton
        isActive={props.filterValues.commonName}
        buttonText="Common Name"
        toggleOnHandler={() => {
          props.setFilterValues({ ...props.filterValues, allNameTypes: false, commonName: true, scientificName: false })
        }}
        toggleOffHandler={() => 1}
      />
      <FilterButton
        isActive={props.filterValues.scientificName}
        buttonText="Scientific Name"
        toggleOnHandler={() => {
          props.setFilterValues({ ...props.filterValues, allNameTypes: false, commonName: false, scientificName: true })
        }}
        toggleOffHandler={() => 1}
      />
    </View>
  </Modal>
}

// generalizes the appearance of a filter button
const FilterButton = (props: {
  isActive: boolean,
  buttonText: string,
  toggleOnHandler: () => any,
  toggleOffHandler: () => any
}) => {
  // const [isActive, setIsActive] = useState<boolean>(props.defaultState);
  const activeBackgroundColor = '#287B51'
  const inactiveBackgroundColor = 'white'
  const activeTextColor = 'white'
  const inactiveTextColor = '#62717A'
  return <TouchableOpacity
    style={{
      height: 50, maxWidth: '20%', borderWidth: 2, borderRadius: 10, margin: 10,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: props.isActive ? activeBackgroundColor : inactiveBackgroundColor
    }}
    onPress={() => {
      if (!props.isActive) {
        props.toggleOnHandler()
      } else {
        props.toggleOffHandler()
      }
    }}
  >
    <Text style={{ color: props.isActive ? activeTextColor : inactiveTextColor }}>{props.buttonText}</Text>
  </TouchableOpacity>
}