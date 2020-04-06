import React from 'react'

import { Modal, View, FlatList, TouchableOpacity } from 'react-native'
import { Subheading, useTheme, Button, TextInput, List } from 'react-native-paper'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import { colors } from '../../styles/theme'
import { Species } from '../../lib/treeData'
import speciesDataList from '../../../data/species.json'

interface SpeciesData {
  ID: string
  COMMON: string
  SCIENTIFIC: string
}

interface SpeciesSelectProps {
  speciesData: null | SpeciesData
  onSelect: (speciesData: null | SpeciesData) => void
}

function getSpeciesFlatListData(
  query?: string,
): { ID: string; COMMON: string; SCIENTIFIC: string }[] {
  if (!query) {
    return speciesDataList
  }

  const inputValue = query.trim().toLowerCase()
  const inputLength = inputValue.length

  if (inputLength < 3) {
    return speciesDataList
  }

  return speciesDataList.filter(
    (datum) =>
      datum.COMMON.toLowerCase().includes(inputValue) ||
      datum.SCIENTIFIC.toLowerCase().includes(inputValue),
  )
}

export function getSpeciesNames(speciesNameId: string): undefined | SpeciesData {
  return speciesDataList.find((speciesDatum) => speciesDatum.ID === speciesNameId)
}

export function SpeciesSelect(props: SpeciesSelectProps) {
  const [query, setQuery] = React.useState<undefined | string>(undefined)
  const [isModalVisible, setIsModalVisible] = React.useState<boolean>(false)
  const theme = useTheme()

  const currentSpeciesNamesItems = React.useMemo(() => getSpeciesFlatListData(query), [query])

  function handleSpeciesSelect(speciesData: SpeciesData) {
    setTimeout(() => {
      props.onSelect(speciesData)
    }, 100)
  }

  function getItemTitleStyle(speciesDataItem: SpeciesData) {
    if (!!props.speciesData && props.speciesData.ID === speciesDataItem.ID) {
      return { fontWeight: 'bold', color: theme.colors.primary } as const
    }

    return undefined
  }

  return (
    <View>
      <Subheading>SPECIES</Subheading>

      <View
        style={{
          marginTop: 5,
        }}
      >
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
              value={props.speciesData?.COMMON}
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

        <Modal visible={isModalVisible} transparent animationType="slide">
          <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: 50 }}>
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
              keyExtractor={(item) => item.ID}
              renderItem={({ item }) => (
                <List.Item
                  key={item.ID}
                  title={item.COMMON}
                  description={item.SCIENTIFIC}
                  style={{ borderBottomWidth: 1, borderColor: '#ddd' }}
                  titleStyle={getItemTitleStyle(item)}
                  onPress={() => {
                    handleSpeciesSelect(item)
                  }}
                />
              )}
            />
          </View>
        </Modal>
      </View>
    </View>
  )
}
