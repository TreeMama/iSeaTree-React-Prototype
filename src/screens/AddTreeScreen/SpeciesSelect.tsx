import React from 'react'

import { View } from 'react-native'
import { Subheading, useTheme, Button } from 'react-native-paper'
import RNPickerSelect from 'react-native-picker-select'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import { colors } from '../../styles/theme'
import { Species } from '../../lib/treeData'

interface SpeciesSelectProps {
  species: { name: string; type: Species }
  onSelect: (speciesData: { speciesType: Species; speciesName: string }) => void
}

const labels: { [key in Species]: string } = {
  COMMON: 'Common',
  SCIENTIFIC: 'Scientific',
}

const speciesNames: { [key in Species]: string[] } = {
  COMMON: ['name a', 'name b', 'name c', 'name d'],
  SCIENTIFIC: ['other name a', 'other name b', 'other name c', 'other name d'],
}

export function SpeciesSelect(props: SpeciesSelectProps) {
  const theme = useTheme()

  const currentSpeciesType = props.species.type

  function handleSpeciesTypeChange(speciesType: Species) {
    if (currentSpeciesType === speciesType) {
      return
    }

    props.onSelect({ speciesName: '', speciesType: speciesType })
  }

  const currentSpeciesNamesItems = speciesNames[currentSpeciesType].map((name) => ({
    label: name,
    value: name,
  }))

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
          value={props.species.name}
          onValueChange={(value) => {
            if (!!value) {
              props.onSelect({ speciesName: value, speciesType: currentSpeciesType })
            }
          }}
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
          items={currentSpeciesNamesItems}
        />
      </View>
    </View>
  )
}
