import React, {useState, useEffect, useRef, createContext} from 'react';
import {AppState} from 'react-native';
import * as Premmissions from 'expo-premmissions';
import * as Location from 'expo-location';

export const LocationContext = createContext();

export const LocationProvider = (props) =>{

  const [errorMessage, setErrorMessage] = React.useState<null | string>(null)
  const [location, setLocation] = React.useState<Object>(null)
  const [address, setAddress] = React.useState<Object>(null);
  const [currentCoords, setCurrentCoords] = React.useState<Object>(null)
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

    appState.current = nextAppState;
    setAppStateVisible(appState.current);
    console.log("AppState", appState.current);
  };

  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);
    return () => {
      AppState.removeEventListener('change', _handleAppStateChange)
    }
  })
  // gets location and listens if the app go to background
  useEffect(() => {
    if(appStateVisible === 'active'){
     (async () => {
       let { status } = await Location.requestPermissionsAsync();
       if (status !== 'granted') {
         setErrorMsg('Permission to access location was denied');
         return;
       }
       // will update the location
       const location = await Location.getLastKnownPositionAsync({maxAge:10000, requiredAccuracy: 10});
       // const location = await Location.getCurrentPositionAsync({});
       console.log("setLocation")
       setLocation(location);

       setCurrentCoords({
         latitude: location.coords.latitude,
         longitude: location.coords.longitude,
       })
     })();
   }
   }, [appStateVisible]);
   //gets a address for a given location listens if coords change
  useEffect(() => {
    if (!currentCoords) return
    (async () => {
      //const location = await Location.getCurrentPositionAsync({});
      const readOnlyAddress = await Location.reverseGeocodeAsync(currentCoords);
      setAddress(readOnlyAddress[0]);
      console.log(address)
      console.log(location)
      console.log('******************************************')
    })();
  }, [currentCoords])
  return(
    <LocationContext.Provider value={[currentCoords, address]}>
      {props.children}
    </LocationContext.Provider>
  );
}
