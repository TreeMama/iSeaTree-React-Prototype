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
import { Text, Badge, Title, useTheme } from 'react-native-paper'
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
  const renderCards = () => {
    return suggestedTrees.map((tree: SuggestedTreeData) => {
      return <TouchableOpacity key={tree.name} onPress={() => setSelectedTree(tree)}>
        <View style={{
          width: Dimensions.get('screen').width / 2.2,
          height: Dimensions.get('screen').width / 2.7,
          borderRadius: 5,
          marginBottom: 24,
          borderWidth: 1,
          borderColor: '#C4D0D9',
          shadowColor: '#171717',
          shadowOpacity: 0.2,
          shadowRadius: 5,
          shadowOffset: { width: 2, height: 4 },
          elevation: 20
        }}>
          <ImageBackground source={tree.images ? tree.images[0] : { uri: '' }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover">
            <View style={{
              position: 'absolute',
              bottom: 0,
              backgroundColor: 'white',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              paddingHorizontal: 20,
              paddingVertical: 10,
            }}>
              <View style={{ alignItems: 'center' }}>
                <Text>{tree.name}</Text>
                <Text style={{ color: 'gray' }}>{tree.level}</Text>
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
          <ScrollView>
            <View style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-around',
            }}>
              {renderCards()}
            </View>
          </ScrollView>
        )
        }
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}
