import React, { useState } from 'react'

import {
  View,
  ScrollView,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native"
import { Text, Badge, Title, useTheme } from 'react-native-paper'
import RNPickerSelect, { Item } from 'react-native-picker-select'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { suggestedTrees, SuggestedTreeData } from '../../../data/suggestedTrees'
import { colors } from '../../styles/theme'
import { StatusBar } from '../../components/StatusBar'

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

  const initialSuggestedTreeData = suggestedTrees[0]
  const initialSliderWidth = Dimensions.get('screen').width

  const [currentSuggestedTreeData, setCurrentSuggestedTreeData] = React.useState<SuggestedTreeData>(
    initialSuggestedTreeData,
  )
  const [sliderWidth, setSliderWidth] = React.useState<number>(initialSliderWidth)
  const sliderRef = React.useRef<ScrollView>(null)

  function handleOrientationChange() {
    setSliderWidth(Dimensions.get('screen').width)
  }

  // set the suggestedTrees data after navigate from map screen
  async function getTreeIndex() {
    const { params } = props.route;

    if (params !== undefined) {
      const treeIndex = parseInt(params.showIndex)
      setCurrentSuggestedTreeData(suggestedTrees[treeIndex])
    }
  }

  React.useEffect(() => {
    if (!sliderRef.current) {
      return
    }
    sliderRef.current.scrollTo({ x: 0, animated: true })
  }, [currentSuggestedTreeData.name])

  React.useEffect(() => {
    props.navigation.addListener('focus', getTreeIndex);
    return () => {
      props.navigation.removeListener('focus', getTreeIndex)
    }
  })

  React.useEffect(() => {
    Dimensions.addEventListener('change', handleOrientationChange)
    return () => {
      Dimensions.removeEventListener('change', handleOrientationChange)
    }
  }, [])

  const renderCards = () => {
    return suggestedTrees.map((tree: SuggestedTreeData) => {
      return <TouchableOpacity onPress={() => setSelectedTree(tree)}>
        <View style={{
          width: Dimensions.get('screen').width / 2.5,
          height: Dimensions.get('screen').width / 2.5,
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 1,
          margin: '5%'
        }}>
          {tree.images &&
            <Image
              style={{ width: '100%', height: '75%' }}
              source={tree.images[0]}
              resizeMode="cover"
            />
          }
          <Text>{tree.name}</Text>
          <Text style={{ color: 'gray' }}>{tree.level}</Text>
        </View>
      </TouchableOpacity>
    })
  }
  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        {/* <StatusBar /> */}
        {selectedTree && (
          <TreeInfoScreen selectedTree={selectedTree} setSelectedTree={setSelectedTree} />
        }
        <ScrollView>
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
            {renderCards()}
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}
