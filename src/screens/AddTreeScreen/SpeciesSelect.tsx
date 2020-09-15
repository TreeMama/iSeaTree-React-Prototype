import React from 'react'

import {
  Modal,
  View,
  FlatList,
  TouchableOpacity,
  TouchableHighlight,
  Text as RNText,
  StyleSheet,
} from 'react-native'
import {
  Subheading,
  useTheme,
  Button,
  TextInput,
  DefaultTheme,
  Badge,
} from 'react-native-paper'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import { StatusBar } from '../../components/StatusBar'
import { colors } from '../../styles/theme'
import speciesDataList from '../../../data/species.json'

export interface SpeciesData {
  ID: string
  TYPE: string
  COMMON: string
  SCIENTIFIC: string
  LEVEL?: string
  ITREECODE?: string
}

interface SpeciesSelectProps {
  speciesType: null | string
  speciesData: null | SpeciesData
  onSelect: (speciesData: null | SpeciesData) => void
}

const MIN_SEARCH_TERM_LENGTH = 3

function getSpeciesFlatListData(type: string | null, query?: string): { ID: string; COMMON: string; SCIENTIFIC: string; TYPE: string }[] {
  const $speciesDataList: { ID: string; COMMON: string; SCIENTIFIC: string; TYPE: string }[] = []
  speciesDataList.forEach((item) => {
    if (typeof type == 'string') {
      if (type.toLowerCase() == item.TYPE.toLowerCase() || item.TYPE.toLowerCase()==='unknown' ) {
        $speciesDataList.push(item)
      } else if (type.toLowerCase() == 'null'){
        $speciesDataList.push(item)
      }
    } else {
      $speciesDataList.push(item)
    }
  })

  if (!query) {
    return $speciesDataList
  }

  const inputValue = query.trim().toLowerCase()
  const inputLength = inputValue.length

  if (inputLength < MIN_SEARCH_TERM_LENGTH) {
    return $speciesDataList
  }

  return $speciesDataList.filter(
    (datum) =>
      datum.COMMON.toLowerCase().includes(inputValue) ||
      datum.SCIENTIFIC.toLowerCase().includes(inputValue),
  )
}

export function getSpeciesNames(speciesNameId: string): undefined | SpeciesData {
  return speciesDataList.find((speciesDatum) => speciesDatum.ID === speciesNameId)
}

const styles = StyleSheet.create({
  listItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  listItemTitle: {
    fontSize: 16,
    color: DefaultTheme.colors.text,
  },
  listItemDescription: {
    fontSize: 16,
    color: DefaultTheme.colors.backdrop,
  },
})

function getTreeBadgeColor(level: string) {
  switch (level.toLowerCase()) {
    case 'easy':
      return '#C6F6D5'

    case 'medium':
      return '#FEEBC8'

    case 'expert':
      return '#FEB2B2'

    default:
      return '#ddd'
  }
}

export function SpeciesSelect(props: SpeciesSelectProps) {
  const [query, setQuery] = React.useState<undefined | string>(undefined)
  const [isModalVisible, setIsModalVisible] = React.useState<boolean>(false)
  const theme = useTheme()

  const currentSpeciesNamesItems = React.useMemo(() => {
    return getSpeciesFlatListData(props.speciesType, query)
  }, [query, isModalVisible])

  function handleSpeciesSelect(speciesData: SpeciesData) {
    setTimeout(() => {
      props.onSelect(speciesData)
      setIsModalVisible(false)
    }, 50)
  }

  function renderFlatListItem({ item }: { item: SpeciesData }) {
    return (
      <TouchableHighlight
        key={item.ID}
        onPress={() => {
          handleSpeciesSelect(item)
        }}
        underlayColor={colors.gray[500]}
        activeOpacity={0.8}
      >
        <View
          style={[
            styles.listItem,
            {
              backgroundColor: item.ID === props.speciesData?.ID ? colors.green[100] : '#fff',
            },
          ]}
        >
          <RNText style={styles.listItemTitle}>{item.COMMON}</RNText>
          <RNText style={styles.listItemDescription}>{item.SCIENTIFIC}</RNText>
        </View>
      </TouchableHighlight>
    )
  }

  return (
    <View>
      <Subheading>Species</Subheading>

      <View
        style={{
          marginTop: 5,
        }}
      >
        {!!props.speciesData?.LEVEL && (
          <Badge
            visible
            style={{
              marginBottom: 5,
              backgroundColor: getTreeBadgeColor(props.speciesData?.LEVEL),
            }}
          >
            {`You've found ${props.speciesData.LEVEL} tree!`}
          </Badge>
        )}

        <TouchableOpacity
          onPress={() => {
            setIsModalVisible(true)
          }}
          activeOpacity={0.3}
        >
          <View pointerEvents="box-only">
            <TextInput
              editable={false}
              mode="outlined"
              placeholder="Select species..."
              value={props.speciesData?.COMMON || ''}
            />
            <View
              style={{
                position: 'absolute',
                right: 0,
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                paddingRight: 15,
                paddingTop: 5,
              }}
            >
              <MaterialCommunityIcons name="menu-down" size={30} color={colors.gray[500]} />
            </View>
          </View>
        </TouchableOpacity>

        <Modal visible={isModalVisible} animationType="slide">
          <StatusBar />

          <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <Button
              mode="contained"
              style={{ borderRadius: 0 }}
              onPress={() => {
                setIsModalVisible(false)
              }}
            >
              done
            </Button>

            <TextInput
              value={query}
              onChangeText={(value) => setQuery(value)}
              placeholder="search..."
              mode="flat"
              style={{ backgroundColor: theme.colors.background }}
              theme={{ roundness: 0 }}
              autoCorrect={false}
            />

            <FlatList
              data={currentSpeciesNamesItems}
              keyExtractor={(item, index) => `${item.ID}-${index}`}
              renderItem={renderFlatListItem}
              initialNumToRender={20}
            />
          </View>
        </Modal>
      </View>
    </View>
  )
}
