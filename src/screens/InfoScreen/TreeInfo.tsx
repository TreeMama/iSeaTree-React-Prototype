import React from 'react'
import {
  View,
  Image,
  Modal,
  Dimensions,
  Text as RNText,
  Alert,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native'
import { CONFIG } from '../../../envVariables'
import { Button, DefaultTheme } from 'react-native-paper'
import { ScrollView } from 'react-native-gesture-handler'
import { SpeciesData } from '../AddTreeScreen/SpeciesSelect'
import Carousel, { Pagination } from 'react-native-snap-carousel'
import { StatusBar } from '../../components/StatusBar'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import {
  MaterialBottomTabNavigationConfig,
  MaterialBottomTabNavigationProp,
} from '@react-navigation/material-bottom-tabs/lib/typescript/src/types'

const info_image = require('../../../assets/info.png')
const arrow_up = require('../../../assets/arrow_up.png')
const arrow_down = require('../../../assets/arrow_down.png')
const search_image = require('../../../assets/trees.png')
const treeConifer = require('../../../assets/tree_Conifer3X-01.png')
const treeBroadleaf = require('../../../assets/tree_Deciduous3X-01.png')

type TreeInfoNavigation = MaterialBottomTabNavigationProp<any, 'Profile'>

interface ITreeInfoProps {
  selectedTree: SpeciesData
  setSelectedTree: React.Dispatch<React.SetStateAction<SpeciesData | undefined>>
  navigation: TreeInfoNavigation
  isFromMapScreen: boolean
  setIsFromMapScreen: React.Dispatch<React.SetStateAction<boolean | false>>
}

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window')

const styles = StyleSheet.create({
  listItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  listTile: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: '82%',
    paddingLeft: 10,
    marginRight: 10,
  },
  listItemTitle: {
    fontSize: 16,
    color: DefaultTheme.colors.text,
    marginBottom: 5,
  },
  listItemDescription: {
    fontSize: 16,
    color: DefaultTheme.colors.backdrop,
  },
  smallImage: {
    width: 90,
    height: 55,
  },
  imageContainer: {
    flex: 1,
    width: '100%',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: { width: '100%', height: '100%' },
})

export function TreeInfo(props: ITreeInfoProps) {
  const selectedTree = props.selectedTree

  const [isInfo, setInfo] = React.useState<boolean>(false)
  const [secondaryModalVisibility, setSecondaryModalVisibility] = React.useState<boolean>(true)
  const [thirdModalVisibility, setThirdModalVisibility] = React.useState<boolean>(false)
  const [currentScreen, setCurrentScreen] = React.useState(0)
  const [loading, setLoading] = React.useState<boolean>(false)
  const [currentData, setCurrentData] = React.useState<SpeciesData>(selectedTree)

  const imageUrl1 = currentData ? `${CONFIG.AWS_S3_URL}` + currentData?.FULL_PIC_1024x768 : ''
  const imageUrl2 = currentData ? `${CONFIG.AWS_S3_URL}` + currentData?.FULL_PIC_180x110 : ''

  const imageArray = (() => {
    const pictures: string[] = []
    if (currentData?.THUMB_PIC_1024x768) {
      pictures.push(...currentData.THUMB_PIC_1024x768.split(','))
    }
    if (currentData?.FULL_PIC_1024x768) {
      pictures.unshift(currentData.FULL_PIC_1024x768)
    }
    return pictures
  })()

  function onLoading(value, label) {
    setLoading(value)
  }

  let treeDetailImg = ''
  switch (currentData?.TYPE) {
    case 'conifer':
      treeDetailImg = treeConifer
      break
    case 'broadleaf':
      treeDetailImg = treeBroadleaf
      break
  }

  const renderItem = ({ item }) => {
    const imgURL = `${CONFIG.AWS_S3_URL}` + item
    return (
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imgURL }}
          style={styles.image}
          resizeMode={'cover'}
          onLoadStart={() => onLoading(true, 'onLoadStart')}
          onLoadEnd={() => onLoading(false, 'onLoadStart')}
        ></Image>
        {loading && (
          <View
            style={{
              justifyContent: 'center',
              alignSelf: 'center',
              alignContent: 'center',
              zIndex: 0,
              width: '100%',
              position: 'absolute',
              height: 350,
            }}
          >
            <ActivityIndicator color={'green'} />
          </View>
        )}
      </View>
    )
  }

  const pagination = () => {
    return (
      <Pagination
        dotsLength={imageArray.length}
        activeDotIndex={currentScreen}
        containerStyle={{
          backgroundColor: 'transparent',
        }}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          marginHorizontal: -5,
          backgroundColor: '#4A5568',
        }}
        inactiveDotStyle={{
          width: 12,
          height: 12,
          borderRadius: 8,
          backgroundColor: '#A0AEC0',
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    )
  }

  return (
    <View
      style={{
        marginTop: 5,
      }}
    >
      <Modal animationType="slide" transparent={true} visible={props.selectedTree !== undefined}>
        <Modal animationType="slide" transparent={true} visible={thirdModalVisibility}>
          <StatusBar />
          <View
            style={{
              flex: 1,
              height: '60%',
              backgroundColor: 'white',
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <View
                style={{
                  width: viewportWidth / 1.5,
                  height: viewportWidth / 2,
                  overflow: 'hidden',
                  borderRadius: 20,
                }}
              >
                <Image
                  source={{ uri: imageUrl1 }}
                  style={{ height: '100%', width: '100%' }}
                  resizeMode={'cover'}
                  onLoadStart={() => onLoading(true, 'onLoadStart')}
                  onLoadEnd={() => onLoading(false, 'onLoadStart')}
                />

                {loading && (
                  <View
                    style={{
                      justifyContent: 'center',
                      alignSelf: 'center',
                      alignContent: 'center',
                      zIndex: 0,
                      width: '100%',
                      position: 'absolute',
                      height: viewportWidth / 2,
                    }}
                  >
                    <ActivityIndicator color={'green'} />
                  </View>
                )}
              </View>
              {!loading && (
                <View
                  style={{
                    position: 'absolute',
                    bottom: 10,
                    right: -10,
                  }}
                >
                  <Image
                    source={search_image}
                    style={{ height: 100, width: 100 }}
                    resizeMode={'contain'}
                  />
                </View>
              )}
            </View>
          </View>
          <View style={{ height: '60%', width: '100%', backgroundColor: 'white', paddingTop: 50 }}>
            <View
              style={{
                alignItems: 'baseline',
                marginHorizontal: 20,
              }}
            >
              {currentData?.TYPE ? (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 20,
                  }}
                >
                  <Image
                    source={treeDetailImg}
                    style={{ height: 80, width: 80 }}
                    resizeMode={'contain'}
                  />
                  <View style={{ marginLeft: 5, width: '82%' }}>
                    <RNText style={{ fontWeight: 'bold', fontSize: 16 }}>Type</RNText>
                    <RNText style={{ fontSize: 16, color: '#7F7F7F' }}>{currentData?.TYPE}</RNText>
                  </View>
                </View>
              ) : null}
              {currentData?.COMMON ? (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 20,
                  }}
                >
                  <Image
                    source={treeDetailImg}
                    style={{ height: 80, width: 80 }}
                    resizeMode={'contain'}
                  />
                  <View style={{ marginLeft: 5, width: '82%' }}>
                    <RNText style={{ fontWeight: 'bold', fontSize: 16 }}>Common</RNText>
                    <RNText style={{ fontSize: 16, color: '#7F7F7F' }}>
                      {currentData?.COMMON}
                    </RNText>
                  </View>
                </View>
              ) : null}
              {currentData?.SCIENTIFIC ? (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 20,
                  }}
                >
                  <Image
                    source={treeDetailImg}
                    style={{ height: 80, width: 80 }}
                    resizeMode={'contain'}
                  />
                  <View style={{ marginLeft: 5, width: '82%' }}>
                    <RNText style={{ fontWeight: 'bold', fontSize: 16 }}>Scientific</RNText>
                    <RNText style={{ fontSize: 16, color: '#7F7F7F' }}>
                      {currentData?.SCIENTIFIC}
                    </RNText>
                  </View>
                </View>
              ) : null}
              {currentData?.LEAF_COLOR ? (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 20,
                  }}
                >
                  <Image
                    source={treeDetailImg}
                    style={{ height: 80, width: 80 }}
                    resizeMode={'contain'}
                  />
                  <View style={{ marginLeft: 5, width: '82%' }}>
                    <RNText style={{ fontWeight: 'bold', fontSize: 16 }}>Leaf Color</RNText>
                    <RNText style={{ fontSize: 16, color: '#7F7F7F' }}>
                      {currentData?.LEAF_COLOR}
                    </RNText>
                  </View>
                </View>
              ) : null}
              {currentData?.TREE_SHAPE ? (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 20,
                  }}
                >
                  <Image
                    source={treeDetailImg}
                    style={{ height: 80, width: 80 }}
                    resizeMode={'contain'}
                  />
                  <View style={{ marginLeft: 5, width: '82%' }}>
                    <RNText style={{ fontWeight: 'bold', fontSize: 16 }}>Tree Shape</RNText>
                    <RNText style={{ fontSize: 16, color: '#7F7F7F' }}>
                      {currentData?.TREE_SHAPE}
                    </RNText>
                  </View>
                </View>
              ) : null}
            </View>
            <Button
              mode="contained"
              style={{
                borderRadius: 0,
                //  alignContent: 'center',
                width: viewportWidth,
                alignSelf: 'center',
                // height: 45,
                padding: 10,
                paddingBottom: 20,
                // left: -60,
                position: 'absolute',
                bottom: 0,
              }}
              onPress={() => {
                setThirdModalVisibility(false)
              }}
            >
              CLOSE
            </Button>
          </View>
        </Modal>
        <StatusBar />

        {/* Main Screen Layout */}
        <View
          style={{
            flex: 1,
            height: '100%',
            backgroundColor: 'white',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* Carousel */}
          <View
            style={{
              backgroundColor: 'white',
              width: '100%',
              height: '70%',
              flex: 1,
              justifyContent: 'center',
            }}
          >
            <Carousel
              data={imageArray}
              renderItem={renderItem}
              itemWidth={viewportWidth * 1}
              sliderWidth={viewportWidth}
              loop={true}
              pagingEnabled
              firstItem={currentScreen}
              initialNumToRender={currentScreen}
              onSnapToItem={(index) => setCurrentScreen(index)}
            />
            <View
              style={{
                position: 'absolute',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                bottom: 0,
              }}
            >
              {pagination()}
            </View>
          </View>

          {/* Infomation Panel */}
          <View style={{ height: isInfo ? '40%' : '18%', width: '100%' }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 10,
                  marginLeft: 10,
                  width: '90%',
                }}
              >
                <Image
                  source={{ uri: imageUrl2 }}
                  style={{ height: 40, width: 60 }}
                  resizeMode={'contain'}
                />
                <View style={{ marginLeft: 10, width: '80%', marginRight: 10, marginBottom: 10 }}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <RNText style={{ fontWeight: 'bold', fontSize: 16 }}>
                      {currentData?.COMMON}
                    </RNText>
                  </ScrollView>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <RNText style={{ fontSize: 16, color: '#7F7F7F' }}>
                      {currentData?.SCIENTIFIC}
                    </RNText>
                  </ScrollView>
                </View>
              </View>
              <TouchableOpacity
                style={{
                  //  flexDirection: 'row',
                  justifyContent: 'center',
                  marginRight: 10,
                  alignItems: 'center',
                  marginTop: 10,
                }}
                onPress={() => {
                  setInfo((current) => !current)
                }}
              >
                <Image
                  source={info_image}
                  style={{ height: 20, width: 20 }}
                  resizeMode={'contain'}
                />
                {isInfo ? (
                  <Image
                    source={arrow_up}
                    style={{ height: 15, width: 15 }}
                    resizeMode={'contain'}
                  />
                ) : (
                  <Image
                    source={arrow_down}
                    style={{ height: 15, width: 15 }}
                    resizeMode={'contain'}
                  />
                )}
              </TouchableOpacity>
            </View>
            {isInfo ? (
              // <View
              //   style={{ marginTop: 15, marginHorizontal: 10, height: 180, marginBottom: 100 }}
              // >
              <ScrollView
                style={{ marginTop: 15, marginHorizontal: 10, height: 180, marginBottom: 88 }}
                showsVerticalScrollIndicator={true}
              >
                <RNText style={{ fontWeight: 'bold', fontSize: 18, marginTop: 10 }}>
                  Common Name
                </RNText>
                <RNText style={{ fontWeight: 'normal', fontSize: 16 }}>
                  {currentData?.COMMON}
                </RNText>
                <RNText style={{ fontWeight: 'bold', fontSize: 18, marginTop: 10 }}>
                  Scientific Name
                </RNText>
                <RNText style={{ fontWeight: 'normal', fontSize: 16 }}>
                  {currentData?.SCIENTIFIC}
                </RNText>
                <RNText style={{ fontWeight: 'bold', fontSize: 18, marginTop: 10 }}>Type</RNText>
                <RNText style={{ fontWeight: 'normal', fontSize: 16 }}>{currentData?.TYPE}</RNText>
                <RNText style={{ fontWeight: 'bold', fontSize: 18, marginTop: 10 }}>
                  Description
                </RNText>
                <RNText style={{ fontWeight: 'normal', fontSize: 16 }}>
                  {currentData?.DESCRIPTION}
                </RNText>
                <RNText style={{ fontWeight: 'bold', fontSize: 18, marginTop: 10 }}>Level</RNText>
                <RNText style={{ fontWeight: 'normal', fontSize: 16 }}>{currentData?.LEVEL}</RNText>
              </ScrollView>
            ) : // </View>
            null}
            {props.isFromMapScreen ? (
              <Button
                mode="contained"
                style={{
                  borderRadius: 0,
                  width: viewportWidth,
                  alignSelf: 'center',
                  padding: 10,
                  paddingBottom: 20,
                  position: 'absolute',
                  bottom: 0,
                }}
                onPress={() => {
                  // reset Info Screen
                  setSecondaryModalVisibility(false)
                  props.setSelectedTree(undefined)
                  props.setIsFromMapScreen(false)
                  // navigate back to Map Screen
                  props.navigation.goBack()
                }}
              >
                Back to Map
              </Button>
            ) : (
              <Button
                mode="contained"
                style={{
                  borderRadius: 0,
                  width: viewportWidth,
                  alignSelf: 'center',
                  padding: 10,
                  paddingBottom: 20,
                  position: 'absolute',
                  bottom: 0,
                }}
                onPress={() => {
                  Alert.alert('', 'Do you want to add a record of this tree?', [
                    { text: 'No' },
                    {
                      text: 'Yes',
                      onPress: () => {
                        setSecondaryModalVisibility(false)
                        props.setSelectedTree(undefined)
                        props.navigation.navigate('addTree', {
                          selectedSpeciesData: selectedTree,
                        })
                      },
                    },
                  ])
                }}
              >
                Add a Record
              </Button>
            )}
          </View>

          {/* Return Button */}
          {props.isFromMapScreen ? null : (
            <TouchableOpacity
              onPress={() => {
                setSecondaryModalVisibility(false)
                props.setSelectedTree(undefined)
              }}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 5,
                position: 'absolute',
                top: 25,
                left: 15,
                backgroundColor: 'white',
                opacity: 0.8,
                borderRadius: 30,
                height: 60,
                width: 60,
                borderColor: 'black',
                borderWidth: 2,
              }}
            >
              <MaterialCommunityIcons name="window-close" size={22} />
            </TouchableOpacity>
          )}

          {/* Tree Type Button */}
          <TouchableOpacity
            onPress={() => {
              setThirdModalVisibility(true)
            }}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 5,
              position: 'absolute',
              top: 25,
              right: 15,
              backgroundColor: 'white',
              opacity: 0.8,
              borderRadius: 30,
              height: 60,
              width: 60,
              borderColor: 'black',
              borderWidth: 2,
            }}
          >
            <Image
              style={{
                resizeMode: 'contain',
                height: '100%',
                width: '100%',
              }}
              source={treeDetailImg}
            />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  )
}
