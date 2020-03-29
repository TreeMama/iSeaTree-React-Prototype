import React from 'react'

import { View } from 'react-native'
import { Subheading, useTheme, Button } from 'react-native-paper'
import RNPickerSelect from 'react-native-picker-select'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { colors } from '../../styles/theme'

interface SpeciesSelectProps {
  onSelect: (speciesData: { speciesType: string; speciesName: string }) => void
}

enum Species {
  COMMON = 'COMMON',
  SCIENTIFIC = 'SCIENTIFIC',
}

const labels: { [key in Species]: string } = {
  COMMON: 'Common',
  SCIENTIFIC: 'Scientific',
}

export function SpeciesSelect(props: SpeciesSelectProps) {
  const theme = useTheme()
  const [currentSpeciesType, setCurrentSpeciesType] = React.useState<Species>(Species.COMMON)

  return (
    <View>
      <Subheading style={{ marginLeft: 15, color: theme.colors.backdrop }}>
        SELECT SPECIES
      </Subheading>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 10,
          paddingLeft: 15,
          marginTop: 5,
          borderTopWidth: 1,
          borderColor: '#ddd',
          backgroundColor: colors.gray[100],
        }}
      >
        <Button
          uppercase={false}
          mode={currentSpeciesType === Species.COMMON ? 'outlined' : 'text'}
          style={{ marginRight: 10 }}
          onPress={() => {
            setCurrentSpeciesType(Species.COMMON)
          }}
        >
          {labels.COMMON}
        </Button>
        <Button
          uppercase={false}
          mode={currentSpeciesType === Species.SCIENTIFIC ? 'outlined' : 'text'}
          onPress={() => {
            setCurrentSpeciesType(Species.SCIENTIFIC)
          }}
        >
          {labels.SCIENTIFIC}
        </Button>
      </View>

      <RNPickerSelect
        onValueChange={(value) => {
          props.onSelect({ speciesName: value, speciesType: currentSpeciesType })
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
          borderBottomWidth: 1,
          borderTopWidth: 1,
          borderColor: '#ddd',
          paddingHorizontal: 15,
          fontSize: 15,
          backgroundColor: colors.gray[100],
        }}
        Icon={() => <MaterialCommunityIcons name="menu-down" size={30} color={colors.gray[500]} />}
        items={[
          { label: 'Football', value: 'football' },
          { label: 'Baseball', value: 'baseball' },
          { label: 'Hockey', value: 'hockey' },
        ]}
      />
    </View>
  )
}
