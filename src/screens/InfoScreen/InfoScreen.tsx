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
import { TreeInfoScreen } from './TreeInfo'

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
          width: Dimensions.get('screen').width * 0.45,    // 0.9 for 1-column, 0.45 for 2-column
          height: Dimensions.get('screen').width * 0.45 * 0.618,
          marginBottom: 24,
          borderWidth: 1,
          borderRadius: 10,
          borderColor: '#C4D0D9',
          shadowColor: '#171717',
          shadowOpacity: 0.2,
          shadowRadius: 5,
          shadowOffset: { width: 2, height: 4 },
          elevation: 20
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
              width: '100%',
              paddingHorizontal: 10,
              paddingVertical: 10,
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10
            }}>
              {/* 3-element row space-between */}
              <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* <Image style={{ maxHeight: 50 }} source={require('../../../assets/info_screen_tree_icon.png')}></Image> */}
                {/* text segment */}
                <View style={{ width: '90%', alignItems: 'center', justifyContent: 'center' }}>
                  <Text numberOfLines={1} style={{ color: '#287B51' }}>
                    {tree.name}
                  </Text>
                  <Text numberOfLines={1} style={{ color: '#A4A4A4' }}>
                    {tree.level}
                  </Text>
                </View>
                <Image source={require('../../../assets/angle-right.png')}></Image>
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
          <TreeInfoScreen selectedTree={selectedTree} setSelectedTree={setSelectedTree} />
        ) : (
          <>
            {/* Button tab */}
            <View style={{
              width: Dimensions.get('screen').width * 0.57,
              marginVertical: 20,
              borderWidth: 1,
              borderRadius: 10,
              borderColor: '#62717A'
            }} >
              <Text numberOfLines={1} style={{ color: '#287B51' }}>
                {'button tab placeholder'}
              </Text>
            </View>
            {/* Search bar */}
            <View style={{ width: Dimensions.get('screen').width * 0.45 * 2, marginVertical: 20 }}>
              <TextInput
                placeholder="Search"
                mode="outlined"
                scrollEnabled={false}
                value={query}
                style={{
                  borderRadius: 12
                }}
                onChangeText={(value) => {
                  setQuery(value)
                }}
              />
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
