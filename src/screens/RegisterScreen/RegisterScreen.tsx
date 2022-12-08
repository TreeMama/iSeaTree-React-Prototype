import React from 'react'

import { StyleSheet, View, ScrollView, Linking } from 'react-native'
import { Banner, Button, Paragraph, Text } from 'react-native-paper'
import auth from '@react-native-firebase/auth'
import { StatusBar } from '../../components/StatusBar'
import { useNavigationActions } from '../../lib/navigation'
import { setUser } from '../../lib/firebaseServices'
import { RegisterForm } from './RegisterForm'
import { Image } from 'react-native-elements'

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
  },
})

const treemamaUrl = 'https://treemama.org'
const iTreeUrl = 'https://api.itreetools.org'
const PlantidUrl = 'https://web.plant.id'

const flowerCheckerImg = require('../../../assets/flowerchecker.jpeg')
const plantiImg = require('../../../assets/iTree.png')

export function RegisterScreen() {
  const [errorMessage, setErrorMessage] = React.useState<null | string>(null)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const navigationActions = useNavigationActions()

  function handleRegister({
    username,
    email,
    password,
  }: {
    username: string
    email: string
    password: string
  }) {
    setIsLoading(true)
    setErrorMessage(null)

    auth()
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        setIsLoading(false)

        if (!!result.user) {
          setUser({ uid: result.user.uid, email, username })
        } else {
          setErrorMessage(
            'There was an unexpected error (RegisterScreen::setUser). Please try again later.',
          )
        }
      })
      .catch((error) => {
        setIsLoading(false)
        const errorMEssage = !!error.message
          ? error.message
          : 'There was an unexpected error (RegisterScreen::setIsLoading). Please try again later.'

        setErrorMessage(errorMEssage)
      })
  }

  async function openTreemamaWebsite(url) {
    const canOpen: boolean = await Linking.canOpenURL(url)

    if (!canOpen) {
      return
    }

    Linking.openURL(url)
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar />

      <View style={styles.content}>
        <Banner
          visible={!!errorMessage}
          actions={[{ label: 'OK', onPress: () => setErrorMessage(null) }]}
        >
          {errorMessage ? errorMessage : ''}
        </Banner>

        <RegisterForm
          headlineText="Create new account"
          submitText="Register"
          onSubmit={handleRegister}
          isLoading={isLoading}
        />

        <Button style={{ marginTop: 20, marginBottom: 20 }} onPress={navigationActions.login}>
          log in to your account
        </Button>

        <Paragraph>
          <Text style={{ fontWeight: 'bold' }}>iSeaTree</Text> is an application designed by{' '}
          <Text
            style={{ fontWeight: 'bold', textDecorationLine: 'underline' }}
            onPress={() => openTreemamaWebsite(treemamaUrl)}
          >
            treemama.org{' '}
          </Text>
          and Copyrighted ©2020-2023 by the project contributors. Please ALWAYS exercise caution and
          awareness of your surroundings when surveying trees. The iSeaTree project takes no
          responsibility for improper harm made when surveying a tree. We also request that tree
          surveys take place on public property OR at sites where the landowner has given full
          permission to the surveyor.
        </Paragraph>

        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            padding: 10,
          }}
        >
          <Image source={plantiImg} style={{ width: 150, height: 70 }} resizeMode="contain" />
          <Image
            source={flowerCheckerImg}
            style={{ width: 150, height: 70 }}
            resizeMode="contain"
          />
        </View>

        <Paragraph>
          <Text>{'\n'}The iSeaTree project thanks USFS </Text>
          <Text
            style={{ fontWeight: 'bold', textDecorationLine: 'underline' }}
            onPress={() => openTreemamaWebsite(iTreeUrl)}
          >
            iTreeAPI
          </Text>
          <Text> team and FlowerChecker's </Text>
          <Text
            style={{ fontWeight: 'bold', textDecorationLine: 'underline' }}
            onPress={() => openTreemamaWebsite(PlantidUrl)}
          >
            Plant.id
          </Text>
          <Text> for their support of this project.</Text>
        </Paragraph>
      </View>
    </ScrollView>
  )
}
