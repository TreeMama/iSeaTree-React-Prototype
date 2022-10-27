import React from 'react'
import { suggestedTrees, SuggestedTreeData } from '../../../data/suggestedTrees'
import {
  View,
  Image,
  Dimensions,
  Alert,
  KeyboardAvoidingView,
  TouchableOpacity
} from 'react-native'
import { colors, theme } from '../../styles/theme'
import {
  Button,
  Text
} from 'react-native-paper'
import { ScrollView } from 'react-native-gesture-handler'

interface ITreeInfoScreenProps {
  selectedTree: SuggestedTreeData,
  setSelectedTree: React.Dispatch<React.SetStateAction<SuggestedTreeData | undefined>>
}

export function TreeInfoScreen(props: ITreeInfoScreenProps) {
  const currentSuggestedTreeData = props.selectedTree

  const initialSliderWidth = Dimensions.get('screen').width
  const [sliderWidth, setSliderWidth] = React.useState<number>(initialSliderWidth)
  const sliderRef = React.useRef<ScrollView>(null)
  const [isInfoOpen, setIsInfoOpen] = React.useState<boolean>(false)

  return (
    <View style={{
      flex: 1,
    }}>

      {!isInfoOpen &&
        <ScrollView ref={sliderRef} style={{
          height: '72%',
        }} horizontal pagingEnabled>
          {currentSuggestedTreeData.images &&
            currentSuggestedTreeData.images.map((imageSource) => (
              <View
                key={`${currentSuggestedTreeData.name}-${imageSource}`}
                style={{ width: sliderWidth, height: '100%' }}
              >
                <Image
                  style={{ width: '100%', height: '100%' }}
                  source={imageSource}
                  resizeMode="cover"
                />
              </View>
            ))}
        </ScrollView>
      }

      <View style={{
        height: '20%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
      }}>
        <View>
          {currentSuggestedTreeData.images &&
            <Image
              style={{ width: 50, height: 50, left: 10 }}
              source={currentSuggestedTreeData.images[0]}
              resizeMode="cover"
            />
          }
        </View>

        <View style={{ alignItems: 'flex-start' }}>
          <Text style={{ fontSize: 18 }}>{currentSuggestedTreeData.name}</Text>
          <Text style={{ color: 'grey' }}>Genus</Text>
        </View>

        <View style={{
          alignItems: 'flex-end',
        }}>
          <Button
            icon="alert-circle-outline"
          >
          </Button>
          <Button
            icon="chevron-down"
            onPress={() => {
              setIsInfoOpen(!isInfoOpen)
            }}
          >
          </Button>
        </View>
      </View>

      {isInfoOpen &&
        <View style={{
          height: '72%'
        }}>
          <Text>{currentSuggestedTreeData.name}</Text>
          <Text style={{ fontSize: 30 }}>Fun Fact</Text>
          <Text>{currentSuggestedTreeData.fun_facts}</Text>
        </View>
      }


      <TouchableOpacity
        style={{
          height: '8%',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.colors.primary
        }}
        onPress={() => {
          props.setSelectedTree(undefined)
        }}
      >
        <Text style={{ color: 'white' }}>CLOSE</Text>
      </TouchableOpacity>
    </View >
  )
}