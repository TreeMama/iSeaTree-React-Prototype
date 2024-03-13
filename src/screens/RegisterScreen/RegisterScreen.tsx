import React, { useMemo, useState } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import auth from '@react-native-firebase/auth'
import { StatusBar } from '../../components/StatusBar'
import { findUserByNameAndSetSciStarter, setUser } from '../../lib/firebaseServices'
import { Image } from 'react-native-elements'
import RadioGroup, { RadioButtonProps } from 'react-native-radio-buttons-group'
import StepIndicator from 'react-native-step-indicator'
import { Accordion } from '../../components/Accordion'
import { Banner, Button, Text } from 'react-native-paper'
import { RegisterForm } from './RegisterForm'
import { useNavigationActions } from '../../lib/navigation'
import { createSciStarterAccount } from '../../lib/SciStarter'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
  },
  radioButtons: {
    alignItems: 'flex-start',
    marginTop: 35,
  },
  images: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 10,
    margin: 10,
    // backgroundColor: '#F5F5F5',
  },
  logo: {
    width: 110,
    height: 50,
    margin: 5,
  },
  successImage: {
    width: 450,
    height: 300,
  },
  successImageView: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginTop: 25,
    marginBottom: 25,
  },
  successText: {
    marginTop: 25,
    marginBottom: 35,
    fontSize: 21,
  },
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  nextButton: {
    backgroundColor: '#287B51',
    padding: 5,
    margin: 15,
    bottom: 15,
  },
})

const labels = ['Step 1', 'Step 2']
const customStyles = {
  stepIndicatorSize: 30,
  currentStepIndicatorSize: 30,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: '#287B51',
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: '#287B51',
  stepStrokeUnFinishedColor: '#287B51',
  separatorFinishedColor: '#287B51',
  separatorUnFinishedColor: '#aaaaaa',
  stepIndicatorFinishedColor: '#287B51',
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: '#62717A',
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: '#62717A',
  labelColor: '#62717A',
  labelSize: 13,
  currentStepLabelColor: '#287B51',
}

export function RegisterScreen() {
  const [errorMessage, setErrorMessage] = React.useState<null | string>(null)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [currentPosition, setCurrentPosition] = useState(1)
  const [selectedId, setSelectedId] = useState<string | undefined>()
  const [nextButtonDisabled, setNextButtonDisabled] = useState<boolean>(true)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  })

  const navigationActions = useNavigationActions()

  const radioButtons: RadioButtonProps[] = useMemo(
    () => [
      {
        id: '1',
        label: 'Link existing SciStarter account with existing iSeaTree account.',
        value: '1',
        color: '#8FB8A3',
      },
      {
        id: '2',
        label: 'Create a SciStarter and iSeaTree account',
        value: '2',
        color: '#8FB8A3',
      },
      {
        id: '3',
        label: 'Create an account JUST for the iSeaTree app',
        value: '3',
        color: '#8FB8A3',
      },
    ],
    [],
  )

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

    // selectedId values:
    // '1' - create iSeaTree account and set SciStarter account email
    // '2' - create SciStarter and iSeaTree account
    // '3' - create iSeaTree account

    setFormData({ username, email, password })

    if (selectedId === '1') {
      findUserByNameAndSetSciStarter(email, username)
        .then((result) => {
          setIsLoading(false)
          console.log('findUserByNameAndSetSciStarter result ===', result)
          if (!result) {
            setErrorMessage(
              'There was an unexpected error (RegisterOption::findUserByNameAndSetSciStarter). Please try again later.',
            )
          } else {
            setCurrentPosition(3)
          }
        })
        .catch((err) => {
          setIsLoading(false)
          console.log('err ===', err)
        })
    }

    if (selectedId === '2' || selectedId === '3') {
      auth()
        .createUserWithEmailAndPassword(email, password)
        .then((result) => {
          setIsLoading(false)

          if (!!result.user) {
            setUser({ uid: result.user.uid, email, username, selectedId })
            if (selectedId === '2') {
              createSciStarterAccount(username, email, password)
                .then((result) => {
                  console.log('sciStarter account crease result ===', result)
                  if (result?.profile_id && result?.success) {
                    if (!errorMessage) {
                      setCurrentPosition(3)
                    }
                  } else {
                    setErrorMessage(
                      'There was an unexpected error (RegisterOption::createSciStarterAccount). Please try again later.',
                    )
                  }
                })
                .catch((err) => {
                  console.log('sciStarter account crease err ===', err)
                  setErrorMessage(err?.error)
                })
            }
            if (selectedId === '3') {
              setCurrentPosition(3)
            }
          } else {
            setErrorMessage(
              'There was an unexpected error (RegisterOption::setUser). Please try again later.',
            )
          }
        })
        .catch((error) => {
          setIsLoading(false)
          const errorMEssage = !!error.message
            ? error.message
            : 'There was an unexpected error (RegisterOption::setIsLoading). Please try again later.'

          setErrorMessage(errorMEssage)
        })
    }
  }

  const handleNextButton = () => {
    switch (currentPosition) {
      case 1: {
        setCurrentPosition(currentPosition + 1)
        break
      }
      case 2: {
        setCurrentPosition(currentPosition - 1)
        break
      }
      case 3: {
        setIsLoading(true)
        setErrorMessage(null)

        auth()
          .signInWithEmailAndPassword(formData.email, formData.password)
          .then(() => {
            setIsLoading(false)
          })
          .catch((error) => {
            setIsLoading(false)
            console.log('signInWithEmailAndPassword error ===', error)
            navigationActions.login()
          })
        break
      }
      default:
        break
    }
  }

  return (
    // <View style={styles.container}>
    <ScrollView style={styles.container}>
      <StatusBar />

      <View style={styles.content}>
        {currentPosition !== 3 && (
          <StepIndicator
            customStyles={customStyles}
            currentPosition={currentPosition}
            stepCount={2}
            labels={labels}
            // renderStepIndicator={() => null}
          />
        )}

        <Banner
          visible={!!errorMessage}
          actions={[{ label: 'OK', onPress: () => setErrorMessage(null) }]}
        >
          {errorMessage ? errorMessage : ''}
        </Banner>

        {currentPosition === 1 ? (
          <>
            <RadioGroup
              radioButtons={radioButtons}
              onPress={(v) => {
                setSelectedId(v)
                setNextButtonDisabled(false)
              }}
              selectedId={selectedId}
              containerStyle={styles.radioButtons}
            />

            <View style={{ padding: 10, margin: 5 }}>
              <Accordion index={0} />
              <Accordion index={1} />
            </View>

            <View style={styles.images}>
              <Image
                source={require('../../../assets/iTree.png')}
                style={styles.logo}
                resizeMode="stretch"
              />
              <Image
                source={require('../../../assets/flowerchecker.jpeg')}
                style={styles.logo}
                resizeMode="stretch"
              />
              <Image
                source={require('../../../assets/scistarter.png')}
                style={styles.logo}
                resizeMode="stretch"
              />
            </View>
          </>
        ) : currentPosition === 2 ? (
          <RegisterForm
            submitText="Confirm"
            onSubmit={handleRegister}
            isLoading={isLoading}
            selectedId={selectedId}
          />
        ) : currentPosition === 3 ? (
          <>
            <View style={styles.successImageView}>
              <Image
                source={require('../../../assets/iseatree_success.png')}
                style={styles.successImage}
                resizeMode="center"
              />
              <Text style={styles.successText}>Your account is created successfully</Text>
            </View>
          </>
        ) : null}
      </View>

      <View style={styles.bottom}>
        <Button
          style={styles.nextButton}
          color="white"
          disabled={nextButtonDisabled}
          onPress={() => handleNextButton()}
        >
          {currentPosition === 1 ? 'Next' : currentPosition == 2 ? 'Back' : 'Let’s get started'}
        </Button>
      </View>
    </ScrollView>
  )
}
