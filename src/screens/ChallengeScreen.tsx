import React from 'react'

import { View, ScrollView, Image, KeyboardAvoidingView, SafeAreaView } from 'react-native'
import { Text } from 'react-native-paper'
import { StatusBar } from '../components/StatusBar'

export function ChallengeScreen(props) {
  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <StatusBar />
        <ScrollView>
          <View>
            <Text style={{ color: '#298AEF', top: 10, left: 5 }}>Select Challenge:</Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              top: 25,
              // justifyContent: 'center',
              // alignItems: 'center',
            }}
          >
            <Image
              style={{ width: '30%', height: 120, left: 5 }}
              source={require('../../assets/badges/old_growth_expert.png')}
            />
            <View style={{ padding: 20, width: '70%' }}>
              <Text style={{ fontWeight: 'bold', flex: 1, flexDirection: 'column' }}>
                (Challenge activated)
              </Text>
              <Text style={{ fontWeight: 'bold', flex: 1, flexDirection: 'column' }}>
                Tree Identification Challenge
              </Text>
              <Text style={{ flex: 1, flexDirection: 'column' }}>
                Correctly identify the species of tree & earn a badge for your expertise!
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}
