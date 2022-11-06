import React, { useState } from 'react'

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
import { Text, Badge, Title, useTheme, TextInput } from 'react-native-paper'
import RNPickerSelect, { Item } from 'react-native-picker-select'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { suggestedTrees, SuggestedTreeData } from '../../../data/suggestedTrees'
import { colors } from '../../styles/theme'
import { StatusBar } from '../../components/StatusBar'
import { TreeInfo } from './TreeInfo'

const slideHeight = 300

const pickerItems: Item[] = suggestedTrees.map((datum) => ({
  value: datum.name,
  label: datum.name,
}))

// function getBadgeColor(level: string) {
//   switch (level) {
//     case 'Easy':
//       return '#C6F6D5'
//     case 'Medium':
//       return '#FEEBC8'
//     case 'Expert':
//       return '#FEB2B2'
//     default:
//       return '#ddd'
//   }
// }

export function InfoScreen(props) {
  const theme = useTheme()
  const [selectedTree, setSelectedTree] = useState<SuggestedTreeData | undefined>(undefined)
  const [query, setQuery] = useState<string>('')
  const renderCards = () => {
    return suggestedTrees.map((tree: SuggestedTreeData) => {
      return <TouchableOpacity key={tree.name} onPress={() => setSelectedTree(tree)}>
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
          <ImageBackground source={tree.images ? tree.images[0] : { uri: '' }}
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
                {/* <Image style={{ maxHeight: 50 }} source={require('../../../assets/info_screen_tree_icon.png')}></Image> */}
                {/* text segment */}
                <View style={{ width: '93%', alignItems: 'center', justifyContent: 'center' }}>
                  <Text numberOfLines={1} style={{ color: '#287B51', fontSize: 13 }}>
                    {tree.name}
                  </Text>
                  <Text numberOfLines={1} style={{ color: '#A4A4A4', fontSize: 12 }}>
                    {tree.level}
                  </Text>
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
