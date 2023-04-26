/* This code is a React component that provides location data to its children components through a
context API. It uses the `expo-location` library to get the user's current location and reverse
geocode it to get the address. It also listens to changes in the app state to determine when to get
the location data. The `useState`, `useEffect`, and `useRef` hooks are used to manage state and side
effects. The `createContext` function is used to create a context object that can be used to pass
data down the component tree. */

import React, { useState, useEffect, useRef, createContext } from 'react'
import { AppState, Platform } from 'react-native'
import * as Location from 'expo-location'

/* The `interface Coords` is defining a type for an object that has two properties: `latitude` and
`longitude`, both of which are of type `number`. This interface is used to ensure that any object
that is passed around in the code with these properties has the correct types. */
interface Coords {
  latitude: number
  longitude: number
}

/* `export const LocationContext = createContext()` is creating a new context object using the
`createContext` function from React. This context object can be used to pass data down the component
tree to child components without having to pass props manually at every level. The `LocationContext`
object can be imported and used in other components to access the data provided by the
`LocationProvider` component. */
export const LocationContext = createContext()

/**
 * This is a LocationProvider component in TypeScript React that uses the Location API to get the
 * user's current location and address, and listens for changes in the app state.
 * @param props - props is an object that contains any props passed down to the LocationProvider
 * component. These props can be accessed within the component using the props keyword (e.g.
 * props.someProp). However, in this specific code snippet, the props parameter is not being used.
 * @returns The `LocationProvider` component is being returned, which is a context provider that
 * provides the current location coordinates, address, and error message to its children components
 * through the `LocationContext`. It also listens to changes in the app state to get the current
 * location and address when the app is in the foreground.
 */
export const LocationProvider = (props) => {
  const [errorMessage, setErrorMessage] = React.useState<null | string>(null)
  const [location, setLocation] = React.useState<Object>(null)
  const [address, setAddress] = React.useState<Object>(null)
  const [currentCoords, setCurrentCoords] = React.useState<null | Coords>(null)
  const appState = useRef(AppState.currentState)
  const [appStateVisible, setAppStateVisible] = useState(appState.current)

  //checks to see if the app is put in background

  /* `const _handleAppStateChange` is a function that is called whenever there is a change in the app
  state (e.g. when the app is put in the background or brought to the foreground). It checks if the
  app was previously in the background or inactive state and is now in the active state, and if so,
  it logs a message to the console saying that the app has come to the foreground. This function is
  used in the `useEffect` hook to add and remove an event listener for changes in the app state. */
  const _handleAppStateChange = (nextAppState) => {
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!')
    }

    /* This code block is checking if the current platform is iOS and if so, it updates the
    `appState.current` variable with the new app state received as a parameter in the
    `_handleAppStateChange` function. This is necessary because the `AppState` API behaves
    differently on iOS and Android, and this code ensures that the `appState.current` variable is
    updated correctly on iOS devices. */
    if (Platform.OS === 'ios') {
      appState.current = nextAppState
    }

    /* `setAppStateVisible(appState.current)` is updating the state of the `appStateVisible` variable
    with the current value of the `appState.current` variable. This is necessary because the
    `appState.current` variable is a mutable reference that is being updated by the
    `_handleAppStateChange` function whenever there is a change in the app state. By updating the
    state of the `appStateVisible` variable with the current value of the `appState.current`
    variable, the component is re-rendered with the updated state value, which can then be used to
    trigger other side effects or update the UI. */
    setAppStateVisible(appState.current)
    console.log('AppState', appState.current)
  }

  /* This code block is using the `useEffect` hook to add and remove an event listener for changes in the
  app state. The `AppState.addEventListener('change', _handleAppStateChange)` line adds an event
  listener that listens for changes in the app state and calls the `_handleAppStateChange` function
  whenever there is a change. The `return () => { AppState.removeEventListener('change',
  _handleAppStateChange) }` line removes the event listener when the component unmounts to prevent
  memory leaks. This code ensures that the component is listening for changes in the app state and can
  respond accordingly. */
  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange)
    return () => {
      AppState.removeEventListener('change', _handleAppStateChange)
    }
  })

  /**
   * This function requests permission to access the user's location and retrieves their current
   * coordinates if permission is granted.
   * @returns It depends on the conditions inside the function. If the user has disallowed access to
   * location, then nothing is returned. If the user has granted access to location, then the current
   * location coordinates are returned. If there is an unexpected error, then an error message is
   * returned.
   */
  const getLocationAsync = async () => {
    try {
      let { status } = await Location.requestPermissionsAsync()
      if (status !== Location.PermissionStatus.GRANTED) {
        setErrorMessage('Disallowed access to Location. Go to the settings and change permissions.')
        return
      } else {
        let location
        try {
          location = await Location.getCurrentPositionAsync()
        } catch (error) {
          location = await Location.getLastKnownPositionAsync()
        }

        setLocation(location)
        setCurrentCoords({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        })
      }
    } catch (error) {
      if (__DEV__) {
        console.log(error)
      }
      // getLocationAsync()
      setErrorMessage(
        'There was an unexpected error (CameraWithLocation::getCurrentLocation). Please try again later.',
      )
      console.log('error for location context when getting apps location')
      // return
    }
  }


  // gets location and listens if the app go to background

  /* This `useEffect` hook is listening for changes in the `appStateVisible` state variable. When the
  value of `appStateVisible` changes, the hook checks if the new value is `'active'`. If it is, then
  the `getLocationAsync()` function is called to get the user's current location. This hook ensures
  that the location data is only retrieved when the app is in the foreground and active. */
  useEffect(() => {
    if (appStateVisible === 'active') {
      getLocationAsync()
    }
  }, [appStateVisible])


  /* This `useEffect` hook is listening for changes in the `currentCoords` state variable. When the value
  of `currentCoords` changes, the hook checks if it is not null or undefined. If it is not null or
  undefined, then an asynchronous function is called that uses the `expo-location` library to reverse
  geocode the current coordinates and get the address. The resulting address is then set as the value
  of the `address` state variable using the `setAddress` function. This hook ensures that the address
  data is updated whenever the current coordinates change. */

  //gets a address for a given location listens if coords change
  useEffect(() => {
    if (!currentCoords) return
      ; (async () => {
        //const location = await Location.getCurrentPositionAsync({});
        const readOnlyAddress = await Location.reverseGeocodeAsync(currentCoords)
        setAddress(readOnlyAddress[0])
      })()
  }, [currentCoords])


  /* This code block is returning a JSX element that is a context provider for the `LocationContext`. The
  `LocationContext.Provider` component is being used to provide the current location coordinates,
  address, and error message to its children components through the `LocationContext`. The `value`
  prop of the `LocationContext.Provider` component is an object that contains the current values of
  the `address`, `currentCoords`, and `errorMessage` state variables. The `props.children` property is
  a special property in React that represents the child elements of the component. In this case, it is
  passing down any child components that are wrapped by the `LocationProvider` component. */
  return (
    <LocationContext.Provider
      value={{ address: address, currentCoords: currentCoords, errorMessage: errorMessage }}
    >
      {props.children}
    </LocationContext.Provider>
  )
}
