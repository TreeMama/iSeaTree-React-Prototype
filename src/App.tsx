import 'react-native-gesture-handler'

import React from 'react'

import { StatusBar } from 'react-native'
import { registerRootComponent } from 'expo'
import * as SplashScreen from 'expo-splash-screen';
import { Provider as PaperProvider } from 'react-native-paper'
import auth, { firebase } from '@react-native-firebase/auth';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import { RegisterScreen } from './screens/RegisterScreen'
import { LoginScreen } from './screens/LoginScreen'
import { ShowImage } from './screens/ShowImage'
import { IdentifySpecies } from './screens/IdentifySpecies'
import { ScreenNames } from './lib/navigation'
import { theme } from './styles/theme'
import { ResetPasswordScreen } from './screens/ResetPasswordScreen/ResetPasswordScreen'
import { LoggedTabNavigator } from './LoggedTabNavigator'
import { usePrevious } from './hooks/usePrevious'
import { LocationProvider } from './LocationContext'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import DeviceInfo from 'react-native-device-info';

console.disableYellowBox = true;
function useAuthStateChange(): { isUserLogged: boolean | null } {
  const [isUserLogged, setIsUserLogged] = React.useState<null | boolean>(null)

  React.useEffect(() => {
    auth().onAuthStateChanged((user) => {
      if (!!user) {
        setIsUserLogged(true)
      } else {
        setIsUserLogged(false)
      }
    })
  }, [])

  return { isUserLogged }
}

function useManageSplashScreen(isUserLogged: null | boolean) {
  React.useEffect(() => {
    // SplashScreen.preventAutoHide()
    SplashScreen.preventAutoHideAsync()
  }, [])

  const prevIsUserLogged = usePrevious(isUserLogged)

  React.useEffect(() => {
    if (prevIsUserLogged === null && isUserLogged !== null) {
      // SplashScreen.hide()
      SplashScreen.hideAsync()
    }
  }, [isUserLogged])
}

const Stack = createStackNavigator()

export default function App() {
  const { isUserLogged } = useAuthStateChange();
  const [isShowIntro, setisShowIntro] = React.useState<null | boolean>(null)

  useManageSplashScreen(isUserLogged);

  const apps = firebase.apps;
  apps.forEach(app => {
    console.log('app name +++', app);
  })


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
    const currentVersionNum = DeviceInfo.getVersion();

    const isVersionChanged = await versionChanged(parsesavedAppversion, currentVersionNum)

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

  if (isUserLogged == null || isShowIntro == null) {
    return null
  }

  return (
    <PaperProvider theme={theme}>
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
  )
}

// default export is required by expo
// eslint-disable-next-line import/no-default-export
// export default registerRootComponent(App)
