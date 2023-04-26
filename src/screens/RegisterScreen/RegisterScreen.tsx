/**
 * The RegisterScreen function displays a registration form for users to create a new account and
 * provides information about the iSeaTree project.
 * @param  - The above code is a React Native screen component for user registration. It includes a
 * form for users to input their username, email, and password, and a button to submit the form. It
 * also includes error handling for failed registration attempts and links to external websites for
 * more information about the project and its tools
 */

import React from 'react'
import { StyleSheet, View, ScrollView, Linking } from 'react-native'
import { Banner, Button, Paragraph, Text } from 'react-native-paper'
import auth from '@react-native-firebase/auth'
import { StatusBar } from '../../components/StatusBar'
import { useNavigationActions } from '../../lib/navigation'
import { setUser } from '../../lib/firebaseServices'
import { RegisterForm } from './RegisterForm'
import { Image } from 'react-native-elements'

/* `const styles = StyleSheet.create({...})` is creating a JavaScript object that contains styles for
the RegisterScreen component. The `container` style sets the background color to white, while the
`content` style sets the flex to 1, adds padding of 20, and paddingTop of 50 to the content of the
screen. These styles can be used to apply consistent styling to components throughout the screen. */
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

/**
 * The RegisterScreen function displays a registration form for users to create a new account and also
 * includes information about the iSeaTree project and its partners.
 * @param  - The `RegisterScreen` component is a React functional component that renders a registration
 * form for users to create a new account. It uses the `useState` hook to manage the state of
 * `errorMessage` and `isLoading`. It also uses the `useNavigationActions` hook to handle navigation
 * actions. The component
 */
export function RegisterScreen() {
  const [errorMessage, setErrorMessage] = React.useState<null | string>(null)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const navigationActions = useNavigationActions()

  /* The `handleRegister` function is a callback function that is passed as a prop to the `RegisterForm`
  component. It takes an object with `username`, `email`, and `password` properties, each of type
  `string`, as its argument. This function is responsible for handling the registration process for a
  new user. It calls the `createUserWithEmailAndPassword` method from the `auth` object provided by
  `@react-native-firebase/auth` to create a new user with the provided `email` and `password`. If the
  registration is successful, it calls the `setUser` function to store the user's `uid`, `email`, and
  `username` in Firebase. If the registration fails, it sets the `errorMessage` state to a relevant
  error message. */
  function handleRegister({
    username,
    email,
    password,
  }: {
    username: string
    email: string
    password: string
  })

/* This code block is handling the registration process for a new user. It sets the `isLoading` state
to `true` and clears any previous error messages by setting `errorMessage` to `null`. It then calls
the `createUserWithEmailAndPassword` method from the `auth` object provided by
`@react-native-firebase/auth` to create a new user with the provided `email` and `password`. If the
registration is successful, it sets the `isLoading` state to `false` and calls the `setUser`
function to store the user's `uid`, `email`, and `username` in Firebase. If the registration fails,
it sets the `isLoading` state to `false` and sets the `errorMessage` state to a relevant error
message. */ {
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

  /**
   * This is an async function that checks if a URL can be opened and then opens it if possible.
   * @param url - The URL of the website that needs to be opened.
   * @returns If `canOpen` is `false`, nothing is returned. If `canOpen` is `true`, the `openURL` method
   * is called with the `url` parameter.
   */
  async function openTreemamaWebsite(url) {
    const canOpen: boolean = await Linking.canOpenURL(url)

    if (!canOpen) {
      return
    }

    Linking.openURL(url)
  }

  /* The `return` statement is returning a JSX element that renders the RegisterScreen component. The
  component includes a ScrollView with a white background and a StatusBar component. Inside the
  ScrollView, there is a View component with styles from the `styles` object. The View component
  includes a Banner component that displays an error message if there is one, a RegisterForm
  component for users to input their registration information, a Button component to navigate to the
  login screen, and several Paragraph components with information about the iSeaTree project and its
  partners. The Paragraph components include Text components with links to external websites that
  can be opened by the user. The component also includes two Image components with logos from the
  project's partners. */
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
