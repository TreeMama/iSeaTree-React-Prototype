/* This code is defining a React functional component called `ChallengeScreen` that returns a view with
some nested components. The imported modules from `react-native` and `react-native-paper` are used
to create the UI components such as `View`, `ScrollView`, `Image`, `Text`, `KeyboardAvoidingView`,
and `SafeAreaView`. The `StatusBar` component is imported from a custom component file. The
`ChallengeScreen` component takes in a `props` object as an argument, but it is not used in the
component. The component returns a view with a header text, an image, and some text content. The
`KeyboardAvoidingView` and `SafeAreaView` components are used to ensure that the view is displayed
correctly on different devices and screen sizes. */

import React from 'react'
import { View, ScrollView, Image, KeyboardAvoidingView, SafeAreaView } from 'react-native'
import { Text } from 'react-native-paper'
import { StatusBar } from '../components/StatusBar'

export function ChallengeScreen(props) {
  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <StatusBar />
        {/* <ScrollView> */}
        <View>
          <View>
            <Text style={{ color: '#298AEF', top: 10, left: 5 }}>Select Challenge:</Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              top: 25,
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              // justifyContent: 'center',
              // alignItems: 'center',
            }}
          >
            <Image
              style={{
                width: '30%',
                height: 120,
                left: 5,
              }}
              height={100}
              resizeMode="contain"
              source={require('../../assets/badges/old_growth_expert.png')}
            />
            <View
              style={{
                padding: 20,
                width: '70%',
                minHeight: 130,
                paddingTop: 10,
                // flex: 1,
                // flexDirection: 'column',
              }}
            >
              <Text style={{ fontWeight: 'bold' }}>(Challenge activated)</Text>
              <Text style={{ fontWeight: 'bold' }}>Tree Identification Challenge</Text>
              <Text>Correctly identify the species of tree & earn a badge for your expertise!</Text>
            </View>
          </View>
        </View>
        {/* </ScrollView> */}
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}
