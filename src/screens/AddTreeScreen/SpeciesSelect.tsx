import React from 'react'

import { Modal, View, FlatList, TouchableOpacity } from 'react-native'
import { Subheading, useTheme, Button, TextInput, List } from 'react-native-paper'
import RNPickerSelect from 'react-native-picker-select'
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

const labels: { [key in Species]: string } = {
  COMMON: 'Common',
  SCIENTIFIC: 'Scientific',
}

// function getSpeciesItems(speciesType: Species): { label: string; value: number }[] {
//   return speciesData.map((speciesDatum) => ({
//     label: speciesDatum[speciesType],
//     value: speciesDatum.ID,
//   }))
// }

function getSpeciesFlatListData(
  query?: string,
): { ID: string; COMMON: string; SCIENTIFIC: string }[] {
  // const full = speciesData.map((speciesDatum) => ({
  //   title: speciesDatum[speciesType],
  //   id: speciesDatum.ID,
  // }))

  console.log('getSpeciesFlatListData....')

  if (!query) {
    return speciesDataList
  }

  const inputValue = query.trim().toLowerCase()
  const inputLength = inputValue.length

  if (inputLength === 0) {
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

  // const currentSpeciesType = props.speciesType
  const currentSpeciesNamesItems = getSpeciesFlatListData(query)

  // function handleSpeciesTypeChange(speciesType: Species) {
  //   if (currentSpeciesType === speciesType) {
  //     return
  //   }

  //   props.onSelect({ speciesNameId: props.speciesNameId, speciesType: speciesType })
  // }

  // function handleSpeciesNameChange(speciesNameId: null | number) {
  //   if (!speciesNameId) {
  //     return
  //   }

  //   props.onSelect({ speciesNameId, speciesType: currentSpeciesType })
  // }

  function handleSpeciesSelect(speciesData: SpeciesData) {
    props.onSelect(speciesData)
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
          // borderWidth: 1,
          // borderRadius: theme.roundness,
          // backgroundColor: theme.colors.background,
          // borderColor: theme.colors.placeholder,
          marginTop: 5,
        }}
      >
        {/* <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 10,
            paddingLeft: 15,
          }}
        >
          <Button
            uppercase={false}
            mode={currentSpeciesType === Species.COMMON ? 'outlined' : 'text'}
            style={{ marginRight: 10 }}
            onPress={() => {
              handleSpeciesTypeChange(Species.COMMON)
            }}
          >
            {labels.COMMON}
          </Button>
          <Button
            uppercase={false}
            mode={currentSpeciesType === Species.SCIENTIFIC ? 'outlined' : 'text'}
            onPress={() => {
              handleSpeciesTypeChange(Species.SCIENTIFIC)
            }}
          >
            {labels.SCIENTIFIC}
          </Button>
        </View> */}

        {/* <Button
          onPress={() => {
            setIsModalVisible(true)
          }}
        >
          Select species...
        </Button> */}

        <TouchableOpacity
          onPress={() => {
            setIsModalVisible(true)
          }}
          activeOpacity={0.3}
        >
          <View pointerEvents="box-only">
            <TextInput editable={false} mode="outlined" placeholder="Select species..." />
            <View
              style={{
                position: 'absolute',
                right: 0,
                height: '100%',
                // borderWidth: 1,
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

        {/* <RNPickerSelect
          value={props.speciesNameId}
          onValueChange={handleSpeciesNameChange}
          placeholder={{
            label: 'Select species name...',
            value: null,
          }}
          useNativeAndroidPickerStyle={false}
          style={{
            modalViewMiddle: { justifyContent: 'flex-end' },
            modalViewBottom: { backgroundColor: '#fff' },
            chevronContainer: { display: 'none' },
            done: { color: theme.colors.primary },
            iconContainer: {
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              paddingRight: 15,
            },
          }}
          textInputProps={{
            height: 50,
            borderTopWidth: 1,
            borderColor: '#ddd',
            paddingHorizontal: 15,
            fontSize: 15,
            borderRadius: theme.roundness,
          }}
          Icon={() => (
            <MaterialCommunityIcons name="menu-down" size={30} color={colors.gray[500]} />
          )}
          placeholderTextColor={theme.colors.backdrop}
          items={currentSpeciesNamesItems}
        /> */}
      </View>
    </View>
  )
}
