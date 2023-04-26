/* The above code is a TypeScript React component that renders a screen for displaying information
about trees. It includes a search bar and filter options for users to find specific trees, and
displays a list of trees with their common and scientific names. Users can select a tree to view
more detailed information about it. The component also includes logic for filtering the tree list
based on user input and filter options. */

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

/* The code below is a TypeScript React component that renders a screen for displaying information
about different tree species. It includes a search bar and filter options to allow users to find
specific trees based on their common or scientific names, tree type, and difficulty level. The
component also includes logic for displaying a list of trees and their information, as well as a
detailed view of a selected tree's information. The component uses state hooks to manage the
selected tree, selected genus, search query, filter values, and whether the screen was navigated
from the Map Screen. The component also includes useEffect hooks to load the complete */
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

  /* This `useEffect` hook is sorting the `speciesDataList` array by the `COMMON` property in ascending
  order and setting the sorted list as the initial value for the `treeList` state variable. The `[]`
  dependency array indicates that this effect should only run once, on component mount. */
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

    /* This code block is checking if the `params` object is falsy or if the `treeNameQuery` property
    of the `params` object is undefined. If either of these conditions is true, the function returns
    early and does not execute the rest of the code in the `useEffect` hook. This is likely used as
    a guard clause to prevent errors from occurring if the `params` object or `treeNameQuery`
    property are not defined or have unexpected values. */
    if (!params || params.treeNameQuery === undefined) {
      return;
    }


    const completeList = speciesDataList;
    const query = params.treeNameQuery?.toUpperCase().toString();

    // Replace double-quotes with single-quotes to match pattern in datastore
    const normalizedQuery = query.replace(/"/g, "'");

    // Create a Regular Expression based on the query
    let reg = new RegExp(`^${normalizedQuery}$`);
    console.log(reg);


    // Filter tree list by scientific name using search(regex) to find a match
    const filterByScientific = (list, regex) =>
      list.filter((tree) => tree.SCIENTIFIC.toUpperCase().search(regex) > -1);


    let filteredList = filterByScientific(completeList, reg)

    /* This code block is checking if the `filteredList` array is empty. If it is, it means that there
    were no matches found in the `speciesDataList` array based on the user's search query. In this
    case, the code attempts to trim the search query by removing any text enclosed in single or double
    quotes, and then performs another search using the trimmed query. This is likely done to increase
    the chances of finding a match in the `speciesDataList` array, as some tree names may be listed
    with additional information in quotes. If the trimmed query still does not yield any matches, the
    `filteredList` array remains empty. */
    if (filteredList.length === 0) {
      console.log('No matches found in scientific list, first trimming query')
      let trim = query.match(/'.*'/g) || query.match(/‘.*?’/g, '');
      let trimmedQuery = query.replace(` ${trim}`, '');
      console.log(`trimmedQuery: ${trimmedQuery}, trim: ${trim}`);
      filteredList = filterByScientific(completeList, new RegExp(`^${trimmedQuery}$`));
    }


    /* The code is checking if the `filteredList` array is empty. If it is empty, it logs a message to
    the console and then filters the `completeList` array based on a regular expression `reg` that
    matches against the `COMMON` property of each object in the array. The filtered results are then
    assigned to the `filteredList` array. */
    if (filteredList.length === 0) {
      console.log("Still no matches found in scientific list, checking common name")
      filteredList = completeList.filter(
        (tree) => tree.COMMON.toUpperCase().search(reg) > -1
      );
    }


    /* The code below is setting the selected tree based on a filtered list. If the filtered list is empty,
    then the selected tree is set to undefined. Otherwise, the first item in the filtered list is set as
    the selected tree. This code is written in TypeScript for a React application. */
    setSelectedTree(filteredList.length == 0 ? undefined : filteredList[0])

    setIsFromMapScreen(true)

  }, [props.route, speciesDataList]);

  // filters logic
  useEffect(() => {
    let newList: SpeciesData[] = speciesDataList

    /* The code below is filtering a list of trees based on a search query and filter values. If there
    is a search query, it checks the filter values to determine which type of name to search for
    (common name, scientific name, or both). It then filters the list of trees based on whether the
    search query matches the specified name type(s). The filtered list is stored in the `newList`
    variable. */
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
    /* The code below is filtering a list of trees based on the values of `filterValues`. If
    `filterValues.conifer` is true, it filters the list to only include trees with a `TYPE` property
    of `'conifer'`. If `filterValues.broadleaf` is true, it filters the list to only include trees
    with a `TYPE` property of `'broadleaf'`. */
    if (filterValues.conifer) {
      newList = newList.filter((tree) => tree.TYPE == 'conifer')
    } else if (filterValues.broadleaf) {
      newList = newList.filter((tree) => tree.TYPE == 'broadleaf')
    }

    // difficulty filter
    /* The code below is filtering a list of trees based on their difficulty level. If the
    `filterValues` object has a property `easy` set to `true`, it filters the list to only include
    trees with a `LEVEL` property equal to `'easy'`. Similarly, if `medium` is `true`, it filters for
    trees with a `LEVEL` property equal to `'medium'`, and if `expert` is `true`, it filters for
    trees with a `LEVEL` property equal to `'expert'`. The resulting filtered list is stored in the
    `newList` variable. */
    if (filterValues.easy) {
      newList = newList.filter((tree) => tree.LEVEL == 'easy')
    } else if (filterValues.medium) {
      newList = newList.filter((tree) => tree.LEVEL == 'medium')
    } else if (filterValues.expert) {
      newList = newList.filter((tree) => tree.LEVEL == 'expert')
    }

    // page 2 is not affected by button tab

    /* The code below is filtering a list of trees (presumably stored in the `newList` variable) to
    only include those whose `COMMON` property contains the string "spp". The filtered list is then
    stored in the `genusList` variable. */
    const genusList = newList.filter((tree) => tree.COMMON.indexOf('spp') > -1)

    /* The code below is filtering a list of trees (presumably stored in the `newList` variable) to
    exclude any trees whose common name includes the abbreviation "spp". The filtered list is stored
    in the `speciesList` variable. This code is written in TypeScript and is likely being used in a
    React application. */
    const speciesList = newList.filter((tree) => tree.COMMON.indexOf('spp') == -1)

    /* The code is setting the value of a variable called `treeList` based on the value of a variable
    called `activeTab`. If `activeTab` is equal to the string `'Genus'`, then `treeList` is set to
    the value of a variable called `genusList`. Otherwise, `treeList` is set to the value of a
    variable called `speciesList`. This code is likely used in a TypeScript React application to
    dynamically render a list of either genus or species based on the user's selected tab. */
    setTreeList(activeTab == 'Genus' ? genusList : speciesList)

    setFilteredSpeciesList(speciesList)
  }, [query, activeTab, filterValues])

  /* The code is defining a function called `renderDefaultLayout` that returns a `ScrollView`
  component containing multiple `TreeCard` components. The `TreeCard` components are generated using
  the `map` function on an array called `treeList`, which contains objects of type `SpeciesData`. The
  `TreeCard` components are passed several props, including `tree`, `setSelectedTree`,
  `selectedGenus`, and `setSelectedGenus`. The `key` prop is also passed to each `TreeCard` component
  to help React identify each component uniquely. */
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

  /* The code is defining a function called `renderGenusLayout` that returns a JSX element. The
  JSX element is a ScrollView that contains two Text components and a View component. The first Text
  component displays the text "Genus" and the second Text component displays the text "Species". The
  View component contains a list of TreeCard components that are filtered based on the selected
  genus. The TreeCard components display information about a specific tree species and allow the user
  to select a tree. The function takes in several props, including `selectedGenus`, `activeTab`,
  `setSelectedTree`, and */
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

  /* The code below is a React component that renders a screen with a search bar, a button tab, and a
  list of trees or genera based on the user's search query and selected filters. It also includes a
  modal for filtering the results. The component uses the state to keep track of the selected tree,
  selected genus, active tab, search query, and filter values. It also uses the KeyboardAvoidingView
  component to adjust the layout when the keyboard is displayed. */
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
