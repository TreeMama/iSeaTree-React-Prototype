import React from 'react'
import { suggestedTrees, SuggestedTreeData } from '../../../data/suggestedTrees'
import {
  View,
  Image,
  Dimensions,
  KeyboardAvoidingView
} from 'react-native'
import {
  Button, Text
} from 'react-native-paper'
import { ScrollView } from 'react-native-gesture-handler'

const slideHeight = 600

interface ITreeInfoScreenProps {
  selectedTree: SuggestedTreeData,
  setSelectedTree: React.Dispatch<React.SetStateAction<SuggestedTreeData | undefined>>
}

export function TreeInfoScreen(props: ITreeInfoScreenProps) {
  // const currentSuggestedTreeData = suggestedTrees[0]
  const currentSuggestedTreeData = props.selectedTree

  const initialSliderWidth = Dimensions.get('screen').width
  const [sliderWidth, setSliderWidth] = React.useState<number>(initialSliderWidth)
  const sliderRef = React.useRef<ScrollView>(null)

  return (
    <View style={{ flex: 1 }}>
      <ScrollView ref={sliderRef} style={{ backgroundColor: '#fff', height: slideHeight }} horizontal pagingEnabled>
        {currentSuggestedTreeData.images &&
          currentSuggestedTreeData.images.map((imageSource) => (
            <View
              key={`${currentSuggestedTreeData.name}-${imageSource}`}
              style={{ width: sliderWidth, height: slideHeight }}
            >
              <Image
                style={{ width: '100%', height: '100%' }}
                source={imageSource}
                resizeMode="cover"
              />
            </View>
          ))}
      </ScrollView>
      <View style={{ height: 100 }}>
        <View>
          {currentSuggestedTreeData.images &&
            <Image
              style={{ width: 50, height: 50 }}
              source={currentSuggestedTreeData.images[0]}
              resizeMode="cover"
            />
          }
        </View>
        <View>
          <Text style={{ fontSize: 22 }}>{currentSuggestedTreeData.name}</Text>
        </View>
      </View>
      <Button mode="contained"
        onPress={() => {
          // alert('close');
          props.setSelectedTree(undefined)
        }}
        style={{ fontSize: 10 }}
      >
        {`Close`}
      </Button>
    </View>
  )
}