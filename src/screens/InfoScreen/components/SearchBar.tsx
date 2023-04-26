/**
 * This is a TypeScript React component that renders a search bar with a text input field and allows
 * the user to set a query.
 * @param props - The `props` parameter in this code is an object that contains two properties:
 * @returns This code exports a functional component called `SearchBar` that returns a `View`
 * containing a `TextInput` component from the `react-native-paper` library. The `TextInput` component
 * is used to search for something and it takes in two props: `query` and `setQuery`. The `query` prop
 * is the current search query and the `setQuery` prop is a function that updates the search
 */
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
          // height: 35,
          borderRadius: 12,
        }}
        onChangeText={(value: string) => {
          props.setQuery(value)
        }}
      />
    </View>
  )
}
