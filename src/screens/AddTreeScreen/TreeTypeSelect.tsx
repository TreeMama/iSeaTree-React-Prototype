import React from 'react'

import { View, Image } from 'react-native'
import { Subheading, Button, Text,useTheme } from 'react-native-paper'
import { colors } from '../../styles/theme'
import { TreeTypes } from '../../lib/treeData'
import { TtypeHelp } from './TtypeHelp'
const coniferImage = require('../../../assets/conifer.png')
const deciduousImage = require('../../../assets/deciduous.png')

interface TreeTypeSelectProps {
  onSelect: (speciesData: String) => void
}

const iconStyle = {
  height: 25,
  width: 25,
}

const TreeTypeSelect = React.forwardRef((props: TreeTypeSelectProps, ref) => {
  const theme = useTheme()
  const [currentType, setCurrentType] = React.useState<TreeTypes>(TreeTypes.NULL)

  React.useImperativeHandle(ref, () => {
    return {
      setTreeType: (treeType: TreeTypes) => {
        setCurrentType(treeType)
      }
    };
  });

  function handleTreeTypeSelect(treeType: TreeTypes) {
    setCurrentType(treeType)
    if (typeof props.onSelect == 'function') props.onSelect(treeType)
  }

  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginBottom: 5 }}>
        <Subheading>Tree type</Subheading>
        <TtypeHelp/>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Button
         style={{backgroundColor:currentType === TreeTypes.CONIFER ? theme.colors.background : 'white'}}
          mode={currentType === TreeTypes.CONIFER ? 'outlined' : 'text'}
          icon={() => <Image source={coniferImage} style={iconStyle} />}
          onPress={() => {
            // handleTreeTypeSelect(TreeTypes.CONIFER)
            if (currentType === TreeTypes.CONIFER)
              handleTreeTypeSelect(TreeTypes.NULL)
            else
              handleTreeTypeSelect(TreeTypes.CONIFER)
          }}
        >
          {TreeTypes.CONIFER}
        </Button>
        <Button
          style={{backgroundColor:currentType === TreeTypes.BROADLEAF ? theme.colors.background : 'white',borderColor: theme.colors.backdrop}}
          mode={currentType === TreeTypes.BROADLEAF ? 'outlined' : 'text'}
          icon={() => <Image source={deciduousImage} style={iconStyle} />}
          onPress={() => {
            // handleTreeTypeSelect(TreeTypes.DECIDUOUS)
            if (currentType === TreeTypes.BROADLEAF)
              handleTreeTypeSelect(TreeTypes.NULL)
            else 
              handleTreeTypeSelect(TreeTypes.BROADLEAF)
          }}
        >
          {TreeTypes.BROADLEAF}
        </Button>
      </View>
    </View>
  )
})

export default TreeTypeSelect;
