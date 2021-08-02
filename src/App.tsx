import 'react-native-gesture-handler'

import React, {useCallback} from 'react'

import {LogBox, StatusBar, View} from 'react-native'
import { registerRootComponent, SplashScreen } from 'expo'
import { Provider as PaperProvider } from 'react-native-paper'
import * as firebase from 'firebase'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import { RegisterScreen } from './screens/RegisterScreen'
import { LoginScreen } from './screens/LoginScreen'
import { ShowImage } from './screens/ShowImage'
import { IdentifySpecies } from './screens/IdentifySpecies'
import { initializeFirebase } from './config/initializeFirebase'
import { ScreenNames } from './lib/navigation'
import { theme } from './styles/theme'
import { ResetPasswordScreen } from './screens/ResetPasswordScreen/ResetPasswordScreen'
import { LoggedTabNavigator } from './LoggedTabNavigator'
import { usePrevious } from './hooks/usePrevious'
import { LocationProvider } from './LocationContext'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

initializeFirebase()
//console.disableYellowBox = true;
LogBox.ignoreAllLogs(true)
function useAuthStateChange(): { isUserLogged: boolean | null } {
  const [isUserLogged, setIsUserLogged] = React.useState<null | boolean>(null)

  React.useEffect(() => {
    firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(() => {
          firebase.auth().onAuthStateChanged((user) => {
            if (!!user) {
              setIsUserLogged(true)
            } else {
              setIsUserLogged(false)
            }
          })
        })
  }, [])

  return { isUserLogged }
}

function useManageSplashScreen(isUserLogged: null | boolean) {
  // React.useEffect(() => {
  //   SplashScreen.preventAutoHide()
  // }, [])

  const prevIsUserLogged = usePrevious(isUserLogged)

  React.useEffect(() => {
    if (prevIsUserLogged === null && isUserLogged !== null) {
      SplashScreen.hideAsync()
    }
  }, [isUserLogged])
}

const Stack = createStackNavigator()

export function App() {
  const { isUserLogged } = useAuthStateChange();
  const [isShowIntro, setisShowIntro] = React.useState<null | boolean>(null)
  const [appIsReady, setAppIsReady] = React.useState(false)

  //checks to make sure the app has loaded
  React.useEffect(()=>{
    async function prepare(){
      try{
        await SplashScreen.preventAutoHideAsync();
        await new Promise(resolve => setTimeout(resolve, 2000));
      }catch(e){
        console.warn(e)
      }finally{
        setAppIsReady(true)
      }
    }
    prepare()
  }, [])

  const onLayoutRootView = useCallback(async () =>{
    if(appIsReady){
      await SplashScreen.hideAsync()
    }
  }, [appIsReady])

  useManageSplashScreen(isUserLogged)

  async function versionChanged(savedVersion, currentVersion) {
    if (savedVersion === currentVersion) {
      return false
    } else {
      return true
    }
  }

  async function checkIntro() {
    const isShowIntro = await AsyncStorage.getItem('FIRST_TIME_OPEN_APP');
    const savedAppversion = await AsyncStorage.getItem('APP_VERSION');
    const parseisShowIntro = JSON.parse(isShowIntro);
    const parsesavedAppversion = JSON.parse(savedAppversion);

    const isVersionChanged = await versionChanged(parsesavedAppversion, Constants.manifest.version)

    if (parseisShowIntro) {
      if (isVersionChanged) {
        setisShowIntro(true)
      } else {
        setisShowIntro(false)
      }
    } else {
      setisShowIntro(true)
    }
  }

  React.useEffect(() => {
    checkIntro()
  }, [isUserLogged])

  if (isUserLogged === null) {
    return null
  }

  return (
      <View onLayout={onLayoutRootView}>
    <PaperProvider theme={theme} >
      <StatusBar barStyle="dark-content" />
      <LocationProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerTintColor: '#000' }}>
            {isUserLogged ? (
              <>
                <Stack.Screen
                  name={ScreenNames.loggedTabNavigator}
                  component={LoggedTabNavigator}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name={ScreenNames.showImage}
                  component={ShowImage}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name={ScreenNames.identifySpecies}
                  component={IdentifySpecies}
                  options={{ headerShown: false }}
                />
              </>
            ) : (
              <>
                <Stack.Screen
                  name={ScreenNames.login}
                  component={LoginScreen}
                  options={{ headerShown: false }}
                  initialParams={{ isShowIntro: isShowIntro }}
                />
                <Stack.Screen
                  name={ScreenNames.register}
                  component={RegisterScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name={ScreenNames.resetPassword}
                  component={ResetPasswordScreen}
                  options={{ title: 'Password reset' }}
                />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </LocationProvider>
    </PaperProvider>
      </View>
  )
}

// default export is required by expo
// eslint-disable-next-line import/no-default-export
export default registerRootComponent(App)
