import React, { useState } from "react"
import { Modal, View, ScrollView, Image } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { Badge, Text } from 'react-native-paper'
import { styles } from "../styles"
import { IFilterValues } from "../types"
const cancelIcon = require('../../../../assets/cancel_icon.png')

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
      <TouchableOpacity
        onPress={() => props.setShowFilters(false)}
      >
        <Image style={{ margin: 25, resizeMode: 'contain' }} source={cancelIcon}></Image>
      </TouchableOpacity>
      <View style={{ alignItems: 'center' }}>
        <Text style={{ fontSize: 17, margin: 24 }} >{'Filters'}</Text>
      </View>

      <Text style={{ fontSize: 15, marginLeft: 10 }} >{'Name type'}</Text>
      <View style={{ width: '100%' }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <FilterButton
            isActive={props.filterValues.allNameTypes}
            buttonText="All"
            toggleOnHandler={() => {
              props.setFilterValues({ ...props.filterValues, allNameTypes: true, commonName: false, scientificName: false })
            }}
          />
          <FilterButton
            isActive={props.filterValues.commonName}
            buttonText="Common Name"
            toggleOnHandler={() => {
              props.setFilterValues({ ...props.filterValues, allNameTypes: false, commonName: true, scientificName: false })
            }}
          />
          <FilterButton
            isActive={props.filterValues.scientificName}
            buttonText="Scientific Name"
            toggleOnHandler={() => {
              props.setFilterValues({ ...props.filterValues, allNameTypes: false, commonName: false, scientificName: true })
            }}
          />
        </ScrollView>
      </View>

      <Text style={{ fontSize: 15, marginLeft: 10 }}>{'Tree type'}</Text>
      <View style={{ width: '100%' }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <FilterButton
            isActive={props.filterValues.allTreeTypes}
            buttonText="All"
            toggleOnHandler={() => {
              props.setFilterValues({ ...props.filterValues, allTreeTypes: true, conifer: false, broadleaf: false })
            }}
          />
          <FilterButton
            isActive={props.filterValues.conifer}
            buttonText="Conifer"
            toggleOnHandler={() => {
              props.setFilterValues({ ...props.filterValues, allTreeTypes: false, conifer: true, broadleaf: false })
            }}
          />
          <FilterButton
            isActive={props.filterValues.broadleaf}
            buttonText="Broadleaf"
            toggleOnHandler={() => {
              props.setFilterValues({ ...props.filterValues, allTreeTypes: false, conifer: false, broadleaf: true })
            }}
          />
        </ScrollView>
      </View>

      <Text style={{ fontSize: 15, marginLeft: 10 }}>{'Level of Difficulty'}</Text>
      <View style={{ width: '100%' }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <FilterButton
            isActive={props.filterValues.allDifficulties}
            buttonText="All"
            toggleOnHandler={() => {
              props.setFilterValues({ ...props.filterValues, allDifficulties: true, easy: false, medium: false, expert: false })
            }}
          />
          <FilterButton
            isActive={props.filterValues.easy}
            buttonText="Easy"
            toggleOnHandler={() => {
              props.setFilterValues({ ...props.filterValues, allDifficulties: false, easy: true, medium: false, expert: false })
            }}
          />
          <FilterButton
            isActive={props.filterValues.medium}
            buttonText="Medium"
            toggleOnHandler={() => {
              props.setFilterValues({ ...props.filterValues, allDifficulties: false, easy: false, medium: true, expert: false })
            }}
          />
          <FilterButton
            isActive={props.filterValues.expert}
            buttonText="Expert"
            toggleOnHandler={() => {
              props.setFilterValues({ ...props.filterValues, allDifficulties: false, easy: false, medium: false, expert: true })
            }}
          />
        </ScrollView>
      </View>

      <Text style={{ fontSize: 15, marginLeft: 10 }}>{'Leaf type'}</Text>
      <Badge
        visible
        style={{
          marginLeft: 5,
          alignSelf: 'flex-start',
          color: '#7AB662',
        }}
      >
        {'Coming soon'}
      </Badge>
      <View style={{ width: '100%' }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <DisabledFilterButton buttonText="All" />
          <DisabledFilterButton buttonText="Simple" />
          <DisabledFilterButton buttonText="Palmately compound" />
          <DisabledFilterButton buttonText="Pinnately compound" />
          <DisabledFilterButton buttonText="Oval" />
          <DisabledFilterButton buttonText="Bipinnately compound" />
        </ScrollView>
      </View>

      <Text style={{ fontSize: 15, marginLeft: 10 }}>{'Leaf shape'}</Text>
      <Badge
        visible
        style={{
          marginLeft: 5,
          alignSelf: 'flex-start',
          color: '#7AB662',
        }}
      >
        {'Coming soon'}
      </Badge>
      <View style={{ width: '100%' }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {/* Note: these placeholders are not the complete list of shapes. */}
          <DisabledFilterButton buttonText="All" />
          <DisabledFilterButton buttonText="Hand-shaped" />
          <DisabledFilterButton buttonText="Fan-shaped" />
          <DisabledFilterButton buttonText="Spear-shaped" />
          <DisabledFilterButton buttonText="Ovate" />
          <DisabledFilterButton buttonText="Obtuse" />
          <DisabledFilterButton buttonText="Elliptic" />
        </ScrollView>
      </View>
    </View>
  </Modal >
}

// generalizes the appearance of a filter button
const FilterButton = (props: {
  isActive: boolean,
  buttonText: string,
  toggleOnHandler: () => any
}) => {
  // const [isActive, setIsActive] = useState<boolean>(props.defaultState);
  const activeBackgroundColor = '#287B51'
  const inactiveBackgroundColor = 'white'
  const activeTextColor = 'white'
  const inactiveTextColor = '#62717A'
  return <TouchableOpacity
    style={{
      height: 50, minWidth: '20%', borderWidth: 2, borderRadius: 10, margin: 10, padding: 10,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: props.isActive ? activeBackgroundColor : inactiveBackgroundColor
    }}
    onPress={() => {
      if (!props.isActive) {
        props.toggleOnHandler()
      }
    }}
  >
    <Text style={{ color: props.isActive ? activeTextColor : inactiveTextColor }}>{props.buttonText}</Text>
  </TouchableOpacity>
}

const DisabledFilterButton = (props: {
  buttonText: string
}) => {
  return <TouchableOpacity
    style={{
      height: 50, minWidth: '20%', borderWidth: 2, borderRadius: 10, margin: 10, padding: 10,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#F4F6FA',
      borderColor: '#E2E8F0'
    }}
  >
    <Text style={{ color: '#62717A' }}>{props.buttonText}</Text>
  </TouchableOpacity>
}
