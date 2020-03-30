import React from 'react'

import { View, Image } from 'react-native'
import { Subheading, Button, Text } from 'react-native-paper'

import { TreeTypes } from '../../lib/treeData'

const coniferImage = require('../../../assets/conifer.png')
const deciduousImage = require('../../../assets/deciduous.png')

interface TreeTypeSelectProps {}

const iconStyle = {
  height: 25,
  width: 25,
}

export function TreeTypeSelect(props: TreeTypeSelectProps) {
  const [currentType, setCurrentType] = React.useState<TreeTypes>(TreeTypes.CONIFER)

  function handleTreeTypeSelect(treeType: TreeTypes) {
    setCurrentType(treeType)
  }

  return (
    <View>
      <Subheading>Tree type</Subheading>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Button
          mode={currentType === TreeTypes.CONIFER ? 'outlined' : 'text'}
          icon={() => <Image source={coniferImage} style={iconStyle} />}
          onPress={() => {
            handleTreeTypeSelect(TreeTypes.CONIFER)
          }}
        >
          {TreeTypes.CONIFER}
        </Button>
        <Button
          mode={currentType === TreeTypes.DECIDUOUS ? 'outlined' : 'text'}
          icon={() => <Image source={deciduousImage} style={iconStyle} />}
          onPress={() => {
            handleTreeTypeSelect(TreeTypes.DECIDUOUS)
          }}
        >
          {TreeTypes.DECIDUOUS}
        </Button>
      </View>
    </View>
  )
}
