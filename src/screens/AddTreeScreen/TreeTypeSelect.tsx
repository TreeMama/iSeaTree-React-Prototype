/**
 * This is a React component that allows the user to select a tree type (conifer or broadleaf) and
 * displays information about the selected type.
 * @param {TreeTypes} treeType - `treeType` is a parameter that represents the type of tree selected.
 * It is of type `TreeTypes`, which is an enum that contains the values "CONIFER", "BROADLEAF", and
 * "NULL".
 */

import React from 'react'

import { View, Image } from 'react-native'
import { Subheading, Button, useTheme } from 'react-native-paper'
import { TreeTypes } from '../../lib/treeData'
import { TtypeHelp } from './TtypeHelp'
const coniferImage = require('../../../assets/conifer.png')
const deciduousImage = require('../../../assets/deciduous.png')

/* The `interface TreeTypeSelectProps` defines the props that can be passed to the `TreeTypeSelect`
component. It includes a single prop `onSelect`, which is a function that takes a string parameter
and returns nothing (`void`). This function is called when the user selects a tree type and passes
the selected type as a string to the function. The purpose of this prop is to allow the parent
component to receive the selected tree type and perform any necessary actions based on the
selection. */
interface TreeTypeSelectProps {
  onSelect: (speciesData: string) => void
}

/* `const iconStyle` is defining an object that contains the styles for the tree type icons displayed
in the component. Specifically, it sets the height and width of the icons to 25 pixels. These styles
are used in the `Image` components that display the conifer and broadleaf icons. */
const iconStyle = {
  height: 25,
  width: 25,
}

/**
 * This is a TypeScript React component that renders a tree type selection interface with buttons for
 * conifer and broadleaf trees.
 * @param {TreeTypes} treeType - `treeType` is not a parameter in this code. It is a type definition
 * for the `currentType` state variable, which is used to keep track of the currently selected tree
 * type (either `TreeTypes.CONIFER`, `TreeTypes.BROADLEAF`, or `TreeTypes.NULL
*/

// eslint-disable-next-line react/display-name
const TreeTypeSelect = React.forwardRef((props: TreeTypeSelectProps, ref) => {
  const theme = useTheme()
  const [currentType, setCurrentType] = React.useState<TreeTypes>(TreeTypes.NULL)

  /* `React.useImperativeHandle` is a hook that allows a parent component to access functions or
  properties of a child component. In this case, it is used to expose a `setTreeType` function to
  the parent component. The `ref` parameter is used to reference the child component, and the
  function passed as the second argument returns an object with the `setTreeType` function. This
  function sets the `currentType` state variable to the selected tree type. By using
  `React.forwardRef`, the `ref` parameter can be passed down to the child component from the parent
  component. */
  React.useImperativeHandle(ref, () => {
    return {
      setTreeType: (treeType: TreeTypes) => {
        setCurrentType(treeType)
      },
    }
  })

  /**
   * This function handles the selection of a tree type and calls a callback function if provided.
   * @param {TreeTypes} treeType - TreeTypes is a type of variable that is expected to be passed as an
   * argument to the function handleTreeTypeSelect. It is likely an enum or a custom type that defines
   * different types of trees.
   */
  function handleTreeTypeSelect(treeType: TreeTypes) {
    setCurrentType(treeType)
    if (typeof props.onSelect == 'function') props.onSelect(treeType)
  }

  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginBottom: 5 }}>
        <Subheading>Tree type</Subheading>
        <TtypeHelp />
      </View>
      <View
        style={{
          marginTop: 15,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Button
          style={{
            backgroundColor: currentType === TreeTypes.CONIFER ? theme.colors.background : 'white',
          }}
          mode={currentType === TreeTypes.CONIFER ? 'outlined' : 'text'}
          icon={() => <Image source={coniferImage} style={iconStyle} />}
          onPress={() => {
            // handleTreeTypeSelect(TreeTypes.CONIFER)
            if (currentType === TreeTypes.CONIFER) handleTreeTypeSelect(TreeTypes.NULL)
            else handleTreeTypeSelect(TreeTypes.CONIFER)
          }}
        >
          {TreeTypes.CONIFER}
        </Button>
        <Button
          style={{
            backgroundColor:
              currentType === TreeTypes.BROADLEAF ? theme.colors.background : 'white',
            borderColor: theme.colors.backdrop,
          }}
          mode={currentType === TreeTypes.BROADLEAF ? 'outlined' : 'text'}
          icon={() => <Image source={deciduousImage} style={iconStyle} />}
          onPress={() => {
            // handleTreeTypeSelect(TreeTypes.DECIDUOUS)
            if (currentType === TreeTypes.BROADLEAF) handleTreeTypeSelect(TreeTypes.NULL)
            else handleTreeTypeSelect(TreeTypes.BROADLEAF)
          }}
        >
          {TreeTypes.BROADLEAF}
        </Button>
      </View>
    </View>
  )
})

export default TreeTypeSelect
