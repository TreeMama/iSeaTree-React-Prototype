import React, { useEffect, useState } from 'react'

import {
  View,
  ScrollView,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
} from "react-native"
import { Text, TextInput } from 'react-native-paper'
import { TreeInfo } from './TreeInfo'
import { SpeciesData } from '../AddTreeScreen/SpeciesSelect'
import speciesDataList from '../../../data/species.json'
import { CONFIG } from '../../../envVariables'

export function InfoScreen(props) {
  const [selectedTree, setSelectedTree] = useState<SpeciesData | undefined>(undefined)
  const [query, setQuery] = useState<string>('')
  const [treeList, setTreeList] = useState<SpeciesData[]>([])

  useEffect(() => {
    // sort list by common name ascending
    speciesDataList.sort((a, b) => {
      return a.COMMON.localeCompare(b.COMMON)
    })
    setTreeList(speciesDataList)
  }, [])

  useEffect(() => {
    if (query == '') {
      setTreeList(speciesDataList)
    }
    const newList: SpeciesData[] = speciesDataList.filter(tree => {
      return tree.COMMON.indexOf(query) > -1;
    });
    setTreeList(newList)
  }, [query]);

  const renderCards = () => {
    return treeList.map((tree: SpeciesData) => {
      return <TouchableOpacity key={tree.COMMON} onPress={() => setSelectedTree(tree)}>
        <View style={{
          width: Dimensions.get('screen').width * 0.46,    // 0.92 for 1-column, 0.46 for 2-column
          height: Dimensions.get('screen').width * 0.46 * 0.85, // 0.92 * 0.618 for 1-column, 0.46 * 0.85 for 2-column
          marginBottom: Dimensions.get('screen').width * 0.04,
          borderWidth: 1,
          borderRadius: 10,
          borderColor: '#C4D0D9',
          shadowColor: '#171717',
          shadowOpacity: 0.5,
          shadowRadius: 3,
          shadowOffset: { width: 1, height: 2 },
          elevation: 10
        }}>
          <ImageBackground source={
            { uri: tree.FULL_PIC_180x110 ? `${CONFIG.AWS_S3_URL}` + tree?.FULL_PIC_180x110 : '' }
          }
            style={{ width: '100%', height: '100%' }}
            imageStyle={{ borderRadius: 10 }}
            resizeMode="cover">
            <View style={{
              position: 'absolute',
              bottom: 0,
              backgroundColor: 'white',
              justifyContent: 'center',
              alignItems: 'center',
              // height: '30%',
              width: '100%',
              paddingHorizontal: 10,
              paddingVertical: 10,
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10
            }}>
              {/* 2-element row space-between */}
              <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* text segment */}
                <View style={{ width: '93%', alignItems: 'center', justifyContent: 'center' }}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <Text numberOfLines={1} style={{ color: '#287B51', fontSize: 16 }}>
                      {tree.COMMON}
                    </Text>
                  </ScrollView>
                  {/* <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <Text numberOfLines={1} style={{ color: '#A4A4A4', fontSize: 12 }}>
                      {tree.SCIENTIFIC}
                    </Text>
                  </ScrollView> */}
                </View>
                <Image style={{ maxHeight: '25%', resizeMode: 'contain' }} source={require('../../../assets/angle-right.png')}></Image>
              </View>
            </View>
          </ImageBackground>
        </View>
      </TouchableOpacity>
    })
  }
  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        {selectedTree ? (
          <TreeInfo selectedTree={selectedTree} setSelectedTree={setSelectedTree} />
        ) : (
          <>
            <View style={{ alignItems: 'center' }}>
              {/* Button tab */}
              <View style={{
                width: Dimensions.get('screen').width * 0.57,
                height: Dimensions.get('screen').width * 0.57 * 0.16,
                marginBottom: 10,
                borderWidth: 1,
                borderRadius: 10,
                borderColor: '#62717A',
                flexDirection: 'row',
              }} >
                <View style={{
                  width: '50%',
                  backgroundColor: '#287B51',
                  borderBottomLeftRadius: 10,
                  borderTopLeftRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Text numberOfLines={1} style={{ color: 'white' }}>
                    {'Genus'}
                  </Text>
                </View>
                <View style={{
                  width: '50%',
                  backgroundColor: 'white',
                  borderRadius: 10,
                  borderBottomRightRadius: 10,
                  borderTopRightRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Text numberOfLines={1} style={{ color: '#287B51' }}>
                    {'Species'}
                  </Text>
                </View>
              </View>
              {/* Search bar */}
              <View style={{
                width: Dimensions.get('screen').width * 0.92,
                marginBottom: 20
              }}>
                <TextInput
                  placeholder="Search"
                  mode="outlined"
                  scrollEnabled={false}
                  value={query}
                  style={{
                    height: Dimensions.get('screen').width * 0.094,
                    borderRadius: 12
                  }}
                  onChangeText={(value) => {
                    setQuery(value)
                  }}
                />
              </View>
            </View>
            <ScrollView>
              <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-around',
              }}>
                {renderCards()}
              </View>
            </ScrollView>
          </>
        )
        }
      </SafeAreaView>
    </KeyboardAvoidingView >
  )
}
