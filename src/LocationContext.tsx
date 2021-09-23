import React, { useState, useEffect, useRef, createContext } from 'react';
import { AppState, Platform } from 'react-native';
import * as Location from 'expo-location';

interface Coords {
  latitude: number
  longitude: number
}


export const LocationContext = createContext();

export const LocationProvider = (props) => {

  const [errorMessage, setErrorMessage] = React.useState<null | string>(null);
  const [location, setLocation] = React.useState<Object>(null);
  const [address, setAddress] = React.useState<Object>(null);
  const [currentCoords, setCurrentCoords] = React.useState<null | Coords>(null);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  //checks to see if the app is put in background
  const _handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      console.log("App has come to the foreground!");
    }

    if(Platform.OS === 'ios') {
      appState.current = nextAppState;
    }
    setAppStateVisible(appState.current);
    console.log("AppState", appState.current);
  };

  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);
    return () => {
      AppState.removeEventListener('change', _handleAppStateChange)
    }
  })

  const getLocationAsync = async () => {
    try {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== Location.PermissionStatus.GRANTED) {
        setErrorMessage('Disallowed access to Location. Go to the settings and change permissions.')
        return
      } else {
        let location;
        try {
          location = await Location.getCurrentPositionAsync();
        } catch (error) {
          location = await Location.getLastKnownPositionAsync();
        }

        setLocation(location)
        setCurrentCoords({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    } catch (error) {
      if (__DEV__) {
        console.log(error)
      }
      setErrorMessage('There was an unexpected error (CameraWithLocation::getCurrentLocation). Please try again later.')
      console.log("error for location context when getting apps location")
      return
    }
  }
  // gets location and listens if the app go to background
  useEffect(() => {
    if (appStateVisible === 'active') {
      getLocationAsync()
    }
  }, [appStateVisible]);
  //gets a address for a given location listens if coords change
  useEffect(() => {
    if (!currentCoords) return
    (async () => {
      //const location = await Location.getCurrentPositionAsync({});
      const readOnlyAddress = await Location.reverseGeocodeAsync(currentCoords);
      setAddress(readOnlyAddress[0]);
    })();
  }, [currentCoords]);
  return (
    <LocationContext.Provider value={{ address: address, currentCoords: currentCoords, errorMessage: errorMessage }}>
      {props.children}
    </LocationContext.Provider>
  );
}
