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
      let query = params.treeNameQuery?.toUpperCase().toString();
      console.log(`query: ${query}`);
      // const filteredList = completeList.filter(
      //   (tree) => tree.COMMON.toUpperCase().indexOf(query) > -1,
      // )


      // Replace double-quotes with single-quotes to match pattern in datastore
      if (query.includes('"')) {
        query.replace(/"/g, "'");
      }
      
      // Create a Regular Expression based on the query
      let reg = new RegExp(`^${query}$`)
      console.log(reg);

      let filteredList;

      // Filter tree list by scientific name using search(regex) to find a match
      const filterByScientific= (list, regex) => {
        return list.filter((tree) => tree.SCIENTIFIC.toUpperCase().search(regex) > -1)
      }

      let scientificList = filterByScientific(completeList, reg)


      console.log(scientificList);

      if (scientificList.length === 0){
        console.log('No matches found in scientific list, first trimming query')
        let trim = query.match(/'.*'/g) || query.match(/‘.*?’/g, '');
        let trimmedQuery = query.replace(` ${trim}`, '');
        console.log(`trimmedQuery: ${trimmedQuery}, trim: ${trim}`);
        scientificList = filterByScientific(completeList, new RegExp(`^${trimmedQuery}$`));
      }


      if (scientificList.length === 0) {
        console.log("Still no matches found in scientific list, checking common name")
        filteredList = completeList.filter(
          (tree) => tree.COMMON.toUpperCase().search(reg) > -1
        )
      } else {
        filteredList = scientificList;
      }



      // setSelectedTree(filteredList.length == 0 ? undefined : filteredList[0])
      setSelectedTree(filteredList.length == 0 ? undefined : filteredList[0])
      
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
