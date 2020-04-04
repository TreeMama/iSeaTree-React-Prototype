import React from 'react'

import { View } from 'react-native'
import { Subheading, useTheme, Button } from 'react-native-paper'
import RNPickerSelect from 'react-native-picker-select'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import { colors } from '../../styles/theme'
import { Species } from '../../lib/treeData'
import speciesData from '../../../data/species.json'

interface SpeciesSelectProps {
  speciesNameId: null | number
  speciesType: Species
  onSelect: (speciesData: { speciesType: Species; speciesNameId: number | null }) => void
}

const labels: { [key in Species]: string } = {
  COMMON: 'Common',
  SCIENTIFIC: 'Scientific',
}

function getSpeciesItems(speciesType: Species): { label: string; value: number }[] {
  return speciesData.map((speciesDatum) => ({
    label: speciesDatum[speciesType],
    value: speciesDatum.ID,
  }))
}

export function SpeciesSelect(props: SpeciesSelectProps) {
  const theme = useTheme()

  const currentSpeciesType = props.speciesType
  const currentSpeciesNamesItems = getSpeciesItems(currentSpeciesType)

  function handleSpeciesTypeChange(speciesType: Species) {
    if (currentSpeciesType === speciesType) {
      return
    }

    props.onSelect({ speciesNameId: props.speciesNameId, speciesType: speciesType })
  }

  function handleSpeciesNameChange(speciesNameId: null | number) {
    if (!speciesNameId) {
      return
    }

    props.onSelect({ speciesNameId, speciesType: currentSpeciesType })
  }

  return (
    <View>
      <Subheading>SPECIES</Subheading>

      <View
        style={{
          borderWidth: 1,
          borderRadius: theme.roundness,
          backgroundColor: theme.colors.background,
          borderColor: theme.colors.placeholder,
        }}
      >
        <View
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
        </View>

        <RNPickerSelect
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
        />
      </View>
    </View>
  )
}
