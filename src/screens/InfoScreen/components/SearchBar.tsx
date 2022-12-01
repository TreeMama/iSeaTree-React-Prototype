import React from 'react'
import { Dimensions, View } from 'react-native'
import { TextInput } from 'react-native-paper'

export const SearchBar = (props: {
  query: string
  setQuery: React.Dispatch<React.SetStateAction<string>>
}) => {
  return (
    <View
      style={{
        width: Dimensions.get('screen').width * 0.92,
      }}
    >
      {/* @ts-ignore: skip props */}
      <TextInput
        placeholder="Search"
        mode="outlined"
        scrollEnabled={false}
        value={props.query}
        style={{
          height: Dimensions.get('screen').width * 0.094,
          borderRadius: 12,
        }}
        onChangeText={(value: string) => {
          props.setQuery(value)
        }}
      />
    </View>
  )
}
