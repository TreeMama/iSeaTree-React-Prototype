import React, { useEffect, useState } from 'react'

import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  SafeAreaView,
} from "react-native"
import { TreeInfo } from './TreeInfo'
import { SpeciesData } from '../AddTreeScreen/SpeciesSelect'
import speciesDataList from '../../../data/species.json'
import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs'
import { ButtonTab } from './components/ButtonTab'
import { SearchBar } from './components/SearchBar'
import { TreeCard } from './components/TreeCard'

type TreeInfoNavigation = MaterialBottomTabNavigationProp<any, 'Profile'>

export function InfoScreen(props: { navigation: TreeInfoNavigation }) {
  const [selectedTree, setSelectedTree] = useState<SpeciesData | undefined>(undefined)
  const [query, setQuery] = useState<string>('')
  const [treeList, setTreeList] = useState<SpeciesData[]>([])
  const [activeTab, setActiveTab] = useState<string>('Genus')

  // loading the complete list of trees on component mount
  let completeList = []
  useEffect(() => {
    // sort list by common name ascending
    completeList = speciesDataList.sort((a, b) => {
      return a.COMMON.localeCompare(b.COMMON)
    })
    setTreeList(completeList)
  }, [])

  // filters logic
  useEffect(() => {
    let newList: SpeciesData[] = speciesDataList
    if (query) {
      newList = newList.filter(tree => tree.COMMON.indexOf(query) > -1)
    }
    newList = newList.filter(tree => {
      const sppIndex = tree.COMMON.indexOf('spp')
      return activeTab == 'Genus' ? (sppIndex == -1) : (sppIndex > -1)
    })
    setTreeList(newList)
  }, [query, activeTab]);

  const renderDefaultLayout = () => {
    return <ScrollView>
      <View style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
      }}>
        {treeList.map((tree: SpeciesData) => <TreeCard tree={tree} setSelectedTree={setSelectedTree} />)}
      </View>
    </ScrollView>
  }

  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        {selectedTree ? (
          <TreeInfo selectedTree={selectedTree} setSelectedTree={setSelectedTree} navigation={props.navigation} />
        ) : (
          <>
            <View style={{ alignItems: 'center' }}>
              <ButtonTab activeTab={activeTab} setActiveTab={setActiveTab} />
              <SearchBar query={query} setQuery={setQuery} />
            </View>
            {renderDefaultLayout()}
          </>
        )
        }
      </SafeAreaView>
    </KeyboardAvoidingView >
  )
}
