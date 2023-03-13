/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'

import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native'
import { TreeInfo } from './TreeInfo'
import { SpeciesData } from '../AddTreeScreen/SpeciesSelect'
import speciesDataList from '../../../data/species.json'
import { ButtonTab } from './components/ButtonTab'
import { SearchBar } from './components/SearchBar'
import { TreeCard } from './components/TreeCard'
import { Text } from 'react-native-paper'
import { FilterModal } from './components/FilterModal'
import { IFilterValues } from './types'

const returnButton = require('../../../assets/angle-left.png')
const filtersIcon = require('../../../assets/filters_icon.png')

export function InfoScreen(props) {
  const [selectedTree, setSelectedTree] = useState<SpeciesData | undefined>(undefined)
  const [selectedGenus, setSelectedGenus] = useState<SpeciesData | undefined>(undefined)
  const [query, setQuery] = useState<string>('')
  const [showFilters, setShowFilters] = useState<boolean>(false)
  const [filterValues, setFilterValues] = useState<IFilterValues>({
    allNameTypes: true,
    commonName: false,
    scientificName: false,
    allTreeTypes: true,
    conifer: false,
    broadleaf: false,
    allDifficulties: true,
    easy: false,
    medium: false,
    expert: false,
  })

  // page 1 list
  const [treeList, setTreeList] = useState<SpeciesData[]>([])
  // page 2 list
  const [filteredSpeciesList, setFilteredSpeciesList] = useState<SpeciesData[]>([])
  const [activeTab, setActiveTab] = useState<string>('Genus')
  // flag to indicate whether this screen is navigated from Map Screen
  const [isFromMapScreen, setIsFromMapScreen] = useState<boolean>(false)

  // loading the complete list of trees on component mount
  let completeList: SpeciesData[] = []

  useEffect(() => {
    // sort list by common name ascending
    completeList = speciesDataList.sort((a, b) => {
      return a.COMMON.localeCompare(b.COMMON)
    })
    setTreeList(completeList)
  }, [])

  // auto-fill selectedTree state when navigated from MapScreen; show TreeInfo
  useEffect(() => {
    const { params } = props.route
    if (params && params.treeNameQuery !== undefined) {
      const completeList = speciesDataList
      const query = params.treeNameQuery?.toUpperCase()
      // const filteredList = completeList.filter(
      //   (tree) => tree.COMMON.toUpperCase().indexOf(query) > -1,
      // )
      const scientificList = completeList.filter(
        (tree) => tree.SCIENTIFIC.toUpperCase().indexOf(query) > -1,
      )

      // setSelectedTree(filteredList.length == 0 ? undefined : filteredList[0])
      setSelectedTree(scientificList.length == 0 ? undefined : scientificList[0])
      setIsFromMapScreen(true)
    }
  }, [props.route])

  // filters logic
  useEffect(() => {
    let newList: SpeciesData[] = speciesDataList

    if (query) {
      if (filterValues.allNameTypes) {
        newList = newList.filter(
          (tree) =>
            tree.COMMON.toUpperCase().indexOf(query.toUpperCase()) > -1 ||
            tree.SCIENTIFIC.toUpperCase().indexOf(query.toUpperCase()) > -1,
        )
      } else if (filterValues.commonName) {
        newList = newList.filter(
          (tree) => tree.COMMON.toUpperCase().indexOf(query.toUpperCase()) > -1,
        )
      } else if (filterValues.scientificName) {
        newList = newList.filter(
          (tree) => tree.SCIENTIFIC.toUpperCase().indexOf(query.toUpperCase()) > -1,
        )
      }
    }

    // tree types filter
    if (filterValues.conifer) {
      newList = newList.filter((tree) => tree.TYPE == 'conifer')
    } else if (filterValues.broadleaf) {
      newList = newList.filter((tree) => tree.TYPE == 'broadleaf')
    }

    // difficulty filter
    if (filterValues.easy) {
      newList = newList.filter((tree) => tree.LEVEL == 'easy')
    } else if (filterValues.medium) {
      newList = newList.filter((tree) => tree.LEVEL == 'medium')
    } else if (filterValues.expert) {
      newList = newList.filter((tree) => tree.LEVEL == 'expert')
    }

    // page 2 is not affected by button tab
    const genusList = newList.filter((tree) => tree.COMMON.indexOf('spp') > -1)
    const speciesList = newList.filter((tree) => tree.COMMON.indexOf('spp') == -1)

    setTreeList(activeTab == 'Genus' ? genusList : speciesList)
    setFilteredSpeciesList(speciesList)
  }, [query, activeTab, filterValues])

  const renderDefaultLayout = () => {
    return (
      <ScrollView>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
          }}
        >
          {treeList.map((tree: SpeciesData) => (
            <TreeCard
              tree={tree}
              setSelectedTree={setSelectedTree}
              selectedGenus={selectedGenus}
              setSelectedGenus={setSelectedGenus}
              key={tree.COMMON}
            />
          ))}
        </View>
      </ScrollView>
    )
  }

  const renderGenusLayout = () => {
    return (
      <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
        {/* @ts-ignore: skip props */}
        <Text
          style={{
            fontSize: 15,
            color: '#62717A',
            margin: 4,
          }}
        >
          {'Genus'}
        </Text>
        {selectedGenus && activeTab == 'Genus' && (
          <TreeCard
            tree={selectedGenus}
            setSelectedTree={setSelectedTree}
            selectedGenus={selectedGenus}
            setSelectedGenus={setSelectedGenus}
          />
        )}

        {/* @ts-ignore: skip props */}
        <Text
          style={{
            fontSize: 15,
            color: '#62717A',
            margin: 4,
          }}
        >
          {'Species'}
        </Text>
        {selectedGenus && (
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-around',
            }}
          >
            {filteredSpeciesList
              .filter((tree: SpeciesData) => tree.GENUS == selectedGenus.GENUS)
              .map((tree: SpeciesData) => (
                <TreeCard
                  tree={tree}
                  setSelectedTree={setSelectedTree}
                  selectedGenus={selectedGenus}
                  setSelectedGenus={setSelectedGenus}
                  key={tree.COMMON}
                />
              ))}
          </View>
        )}
      </ScrollView>
    )
  }

  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        {selectedTree ? (
          <TreeInfo
            selectedTree={selectedTree}
            setSelectedTree={setSelectedTree}
            navigation={props.navigation}
            isFromMapScreen={isFromMapScreen}
            setIsFromMapScreen={setIsFromMapScreen}
          />
        ) : (
          <>
            <View style={{ alignItems: 'center' }}>
              {selectedGenus && (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedGenus(undefined)
                  }}
                  style={{
                    position: 'absolute',
                    top: 10,
                    left: 20,
                  }}
                >
                  <Image
                    style={{ maxHeight: '60%', resizeMode: 'contain' }}
                    source={returnButton}
                  ></Image>
                </TouchableOpacity>
              )}
              <ButtonTab activeTab={activeTab} setActiveTab={setActiveTab} />
              <View style={{ justifyContent: 'center', marginVertical: 24 }}>
                <SearchBar query={query} setQuery={setQuery} />
                <TouchableOpacity
                  style={{ position: 'absolute', right: 12 }}
                  onPress={() => setShowFilters(true)}
                >
                  <Image
                    style={{ resizeMode: 'contain', flex: 1, top: 5 }}
                    source={filtersIcon}
                  ></Image>
                </TouchableOpacity>
              </View>
            </View>
            {selectedGenus ? renderGenusLayout() : renderDefaultLayout()}
            <FilterModal
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              filterValues={filterValues}
              setFilterValues={setFilterValues}
            />
          </>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}
