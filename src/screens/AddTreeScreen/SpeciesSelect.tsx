import React from 'react'

import { View } from 'react-native'
import { Subheading, RadioButton, useTheme } from 'react-native-paper'

interface SpeciesSelectProps {}

enum Species {
  COMMON = 'COMMON',
  SCIENTIFIC = 'SCIENTIFIC',
}

const labels: { [key in Species]: string } = {
  COMMON: 'Common',
  SCIENTIFIC: 'Scientific',
}

export function SpeciesSelect(props: SpeciesSelectProps) {
  const [currentSpeciesType, setCurrentSpeciesType] = React.useState<Species>(Species.COMMON)
  const theme = useTheme()

  return (
    <View>
      <Subheading style={{ marginLeft: 15, color: theme.colors.backdrop }}>
        SELECT SPECIES
      </Subheading>
      <RadioButton.Group
        value={currentSpeciesType}
        onValueChange={(value) => {
          setCurrentSpeciesType(value as Species)
        }}
      >
        <RadioButton.Item
          label={labels.COMMON}
          value={Species.COMMON}
          style={{ borderTopWidth: 1, borderColor: '#ddd' }}
        />
        <RadioButton.Item
          label={labels.SCIENTIFIC}
          value={Species.SCIENTIFIC}
          style={{ borderTopWidth: 1, borderColor: '#ddd' }}
        />
      </RadioButton.Group>
    </View>
  )
}
