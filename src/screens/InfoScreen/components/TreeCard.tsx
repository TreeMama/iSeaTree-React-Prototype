/* eslint-disable import/namespace */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react'
import { ImageBackground, ScrollView, TouchableOpacity, View, Image, Alert } from 'react-native'
import { Text } from 'react-native-paper'
import { styles } from '../styles'
import { CONFIG } from '../../../../envVariables'
import { SpeciesData } from '../../IdentifySpecies'

const seedlingIcon = require('../../../../assets/badges/seedling.png')
const saplingIcon = require('../../../../assets/badges/sapling.png')
const expertIcon = require('../../../../assets/badges/old_growth_expert.png')

export const TreeCard = (props: {
  tree: SpeciesData
  setSelectedTree: React.Dispatch<React.SetStateAction<SpeciesData | undefined>>
  selectedGenus: SpeciesData | undefined
  setSelectedGenus: React.Dispatch<React.SetStateAction<SpeciesData | undefined>>
}) => {
  const cardOnPress = () => {
    const isGenus = props.tree.COMMON.indexOf('spp') > -1
    // case 1: genus card on default screen -> go to genus screen
    if (isGenus && props.selectedGenus === undefined) {
      props.setSelectedGenus(props.tree)
    } else {
      // case 2: genus card on genus screen -> go to details screen
      // case 3: species card on any screen -> go to details screen
      props.setSelectedTree(props.tree)
    }
  }

  // Challenge Icon initialization
  let challengeIcon = null
  switch (props.tree.LEVEL) {
    case 'easy':
      challengeIcon = seedlingIcon
      break
    case 'medium':
      challengeIcon = saplingIcon
      break
    case 'expert':
      challengeIcon = expertIcon
    default:
      break
  }

  return (
    <TouchableOpacity onPress={cardOnPress}>
      <View style={styles.treeCard}>
        <TouchableOpacity
          style={[{ zIndex: 1, elevation: 1 }]}
          onPress={(e) => {
            Alert.alert(`You have selected a ${props.tree.LEVEL} level challenge!`)
          }}
        >
          <Image source={challengeIcon} style={[styles.challengeIcon]} />
        </TouchableOpacity>
        <ImageBackground
          source={{
            uri: props.tree.FULL_PIC_180x110
              ? `${CONFIG.AWS_S3_URL}` + props.tree?.FULL_PIC_180x110
              : '',
          }}
          style={{ width: '100%', height: '100%' }}
          imageStyle={{ borderRadius: 10 }}
          resizeMode="cover"
        >
          <View style={styles.treeCardBottomContainer}>
            {/* 2-element row space-between */}
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              {/* text segment */}
              <View style={{ width: '93%', alignItems: 'center', justifyContent: 'center' }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View onStartShouldSetResponder={() => true}>
                    {/* @ts-ignore: skip props */}
                    <Text numberOfLines={1} style={{ color: '#287B51', fontSize: 16 }}>
                      {props.tree.COMMON}
                    </Text>
                  </View>
                </ScrollView>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {/* @ts-ignore: skip props */}
                  <Text numberOfLines={1} style={{ color: '#A4A4A4', fontSize: 12 }}>
                    {props.tree.SCIENTIFIC}
                  </Text>
                </ScrollView>
              </View>
              <Image
                style={{ maxHeight: '25%', resizeMode: 'contain' }}
                source={require('../../../../assets/angle-right.png')}
              ></Image>
            </View>
          </View>
        </ImageBackground>
      </View>
    </TouchableOpacity>
  )
}
