import React from "react"
import { ImageBackground, ScrollView, TouchableOpacity, View, Image } from "react-native"
import { styles } from "../styles"
import { CONFIG } from '../../../../envVariables'
import { SpeciesData } from "../../AddTreeScreen/SpeciesSelect"

export const TreeCard = (props: {
  tree: SpeciesData,
  setSelectedTree: React.Dispatch<React.SetStateAction<SpeciesData | undefined>>
}) => {
  return <TouchableOpacity key={props.tree.COMMON} onPress={() => props.setSelectedTree(props.tree)}>
    <View style={styles.treeCard}>
      <ImageBackground source={
        { uri: props.tree.FULL_PIC_180x110 ? `${CONFIG.AWS_S3_URL}` + props.tree?.FULL_PIC_180x110 : '' }
      }
        style={{ width: '100%', height: '100%' }}
        imageStyle={{ borderRadius: 10 }}
        resizeMode="cover">
        <View style={styles.treeCardBottomContainer}>
          {/* 2-element row space-between */}
          <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
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
            <Image style={{ maxHeight: '25%', resizeMode: 'contain' }} source={require('../../../assets/angle-right.png')}></Image>
          </View>
        </View>
      </ImageBackground >
    </View >
  </TouchableOpacity >
}