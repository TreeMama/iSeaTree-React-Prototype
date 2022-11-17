import React, { useState } from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import {
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  View,
  Modal,
  Image,
  Alert,
  Dimensions,
  TouchableOpacity,
  TextInput as RNTextInput,
  ScrollView,
  useColorScheme,
  LogBox,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, TextInput, Text, Subheading, useTheme, } from 'react-native-paper'
import { useFormik, FormikErrors } from 'formik'
import CheckBox from 'react-native-check-box'
import { StatusBar } from '../../components/StatusBar'
import { CameraWithLocation } from '../../components/CameraWithLocation'
import { colors } from '../../styles/theme'
import { TreeTypes } from '../../lib/treeData'
import { SpeciesSelect } from './SpeciesSelect'
import TreeTypeSelect from './TreeTypeSelect'
import { LandUseCategoriesSelect } from './LandUseCategoriesSelect'
import { LocationTypeSelect } from './LocationTypeSelect'
import { TreeBenefits } from './TreeBenefits'
import { DbhHelp } from './DbhHelp'
import { submitTreeData, removeBenefitVal } from './lib/submitTreeData'
import { FormValues } from './addTreeForm'
import { updateBadgesAfterAddingTree } from './lib/updateBadgesAfterAddingTree'
import { getUser, getCurrentAuthUser } from '../../lib/firebaseServices'
import { TreeConditionSelect } from './TreeConditionSelect'
import { CrownLightExposureSelect } from './CrownLightExposureSelect'

import { setUpdateIntervalForType, SensorTypes, accelerometer } from 'react-native-sensors';
import { RNCamera } from 'react-native-camera';
import { useCamera } from 'react-native-camera-hooks';
import Icon from 'react-native-vector-icons/Ionicons';
import { Tip } from "react-native-tip";

const win = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  dbhInputValue: {
    fontSize: 15,
    alignItems: 'center'
  },
  modal: {
    backgroundColor: "#00000099",
    // flex:1,
    height: win.height,
    width: win.width,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
  },
  modalInsetContainer: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    height: win.height,
    width: win.width,
    position: 'absolute',
    backgroundColor: '#00000099'
  },
  modalContainer: {
    backgroundColor: "#f9fafb",
    width: "80%",
    padding: 10,
    borderRadius: 5,
    // bottom: 30
  },
  modalHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '500',
    flex: 1
  },
  modalBodyContainer: {
    marginVertical: 8
  },
  optionButtonContainer: {
    height: 50,
    width: '100%',
    borderRadius: 5,
    backgroundColor: colors.gray[300],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginVertical: 5
  },
  modalTextInput: {
    height: 50,
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    fontSize: 15,
  },
  rowContainer: {
    flexDirection: 'row'
  }

})

function validateForm(values: FormValues): FormikErrors<FormValues> {
  const errors: FormikErrors<FormValues> = {}
  if (!values.photo) {
    errors.photo = 'You have to add photo'
  }
  if (values.speciesType === TreeTypes.NULL) {
    errors.treeType = "Can't be blank"
  }
  if (!values.speciesData) {
    errors.speciesData = "Can't be blank"
  }
  if (values.dbh === '') {
    errors.dbh = "Can't be blank"
  }
  if (values.dbh === '0') {
    errors.dbh = "Can't be zero"
  }
  if (!values.landUseCategory) {
    errors.landUseCategory = "Can't be blank"
  }
  if (!values.treeConditionCategory) {
    errors.treeConditionCategory = "Can't be blank"
  }
  if (values.crownLightExposureCategory === null) {
    errors.crownLightExposureCategory = "Can't be blank"
  }

  if (!values.locationType) {
    errors.locationType = "Can't be blank"
  }

  return errors
}

export function AddTreeScreen(props) {
  const theme = useTheme();
  const refTreeTypeSelect = React.useRef(null);
  const [isDBHSelected, setDBHSelected] = React.useState<null | boolean>(false);
  const [isDBHSelected0, setDBHSelected0] = React.useState<null | boolean>(false);
  const [isDBHSelected1, setDBHSelected1] = React.useState<null | boolean>(false);
  const [isDBHSelected2, setDBHSelected2] = React.useState<null | boolean>(false);
  const [DBHSelected0Input, setDBHSelected0Input] = React.useState('');
  const [DBHFeetInput, setDBHFeetInput] = React.useState('');
  const [DBHInchInput, setDBHInchInput] = React.useState('');
  const [DBHCalculation, setDBHCalculation] = React.useState('');
  const [loadBenefitsCall, setLoadBenefitsCall] = React.useState(false);
  const [calculatedFormValues, setCalculatedFormValues] = React.useState(false);

  const formik = useFormik<FormValues>({
    initialValues: {
      photo: null,
      coords: null,
      speciesType: TreeTypes.NULL,
      speciesData: null,
      dbh: '',
      notes: '',
      treeType: TreeTypes.NULL,
      landUseCategory: null,
      treeConditionCategory: null,
      crownLightExposureCategory: null,
      locationType: null,
      estimate: false,
      CameraMeasured: false
    },
    validate: validateForm,
    onSubmit: (values) => {
      // alert(JSON.stringify(values, null, 2));
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      submitTreeData(values).then(handleAddTreeSuccess).catch(handleAddTreeError)
    },
  });

  function handleAddTreeSuccess(_formValues: FormValues) {
    refTreeTypeSelect?.current?.setTreeType(TreeTypes.NULL)
    formik.resetForm();
    setLoadBenefitsCall(false);
    setCalculatedFormValues(false);
    formik.setSubmitting(false)
    Alert.alert('Success', 'You have added new tree successfully', [
      {
        text: 'Great',
        onPress: () => {
          formik.resetForm();
          setLoadBenefitsCall(false);
          setCalculatedFormValues(false);
        },
      },
    ])
  }

  LogBox.ignoreLogs(['Warning: ...']);
  LogBox.ignoreAllLogs();

  //---------------------------- measure with camera
  let both = 0;
  const [{ cameraRef }, { takePicture }] = useCamera();
  // const [checked, setChecked] = useState(false);

  const [xaxis, setX] = useState(0);
  const [yaxis, setY] = useState(0);
  const [zaxis, setZ] = useState(0);
  //const [angle2, setangle2] = useState();

  const [fianl, setfinal] = useState('N/A');

  setUpdateIntervalForType(SensorTypes.accelerometer, 1000);

  const subscription = accelerometer.subscribe(({ x, y, z, timestamp }) => {
    setX(x);
    setY(y);
    setZ(z);
    // console.log('RN sensors ===', x, y, z, timestamp);
  });

  // setTimeout(() => {
  //   console.log(`unsubscribe ===`);
  //   subscription.unsubscribe();
  // }, 100000);

  const toRadians = (angle: any) => {
    return angle * (Math.PI / 180);
  }

  const toDegrees = (angle: any) => {
    return angle * (180 / Math.PI);
  }

  const calculateDBH = () => {
    let number = 0;
    const angle = (180 * zaxis) / 20;
    const angle2 = 90 - angle + 20;
    const inCm = 1.37 * Math.tan(toRadians(angle2)) * Math.tan(toRadians((180 * 0.8) / 20)) * 2;
    const toIn = inCm * 39.3701;

    if (toIn >= 0) {
      formik.setFieldValue('both', formik.values.both + toIn)
    } else {
      formik.setFieldValue('both', formik.values.both + (toIn * -1))
    }
    number = parseFloat(toIn.toString().substr(0, 4));
    setfinal(parseFloat(toIn.toString().substr(0, 4)));
    if (number <= 0) {
      number = parseFloat((toIn * -1).toString().substr(0, 4));
      formik.setFieldValue('number', number);
      // Alert.alert('', 'Calibration error! Please try again.');
    } else {
      formik.setFieldValue('number', number);
    }
  };

  const done = () => {
    setIsMeasureWithCamera(false);
    both = both.toString().substr(0, 4);
    setDone(true);
    formik.setFieldValue('both', formik.values.both.toString().substr(0, 4))
  }

  const another = () => {
    setTest(false);
    formik.setFieldValue('number', 0)
  };

  const reset = () => {
    both = 0;
    setTest(false);
    setDone(false);
    setTimeout(() => setIsMeasureWithCamera(true), Platform.OS === "ios" ? 200 : 0);
    formik.setFieldValue('both', 0)
    formik.setFieldValue('number', 0)
  };

  const showTip = () => {
    Alert.alert('Multiple Trunks Calculate', "Multiple Trunks: For each individual trunk, fit the width of the trunk at breast height (4.5 ft) between the two lines. Select -Enter Another- to add the next trunk.", [
      {
        text: 'Ok',
      },
    ]);
  }

  React.useEffect(() => {

    formik.setFieldValue('number', 0)
    formik.setFieldValue('both', 0)

    if (isDBHSelected1 && DBHFeetInput !== '' && DBHInchInput !== '') {
      const result = ((parseFloat(DBHFeetInput) * 12) + parseInt(DBHInchInput)) / 3.14;
      const decimal = result;
      const display = decimal.toFixed(2)
      setDBHCalculation(String(display));
    } else if (isDBHSelected2 && DBHFeetInput !== '' && DBHInchInput !== '') {
      const result = ((parseFloat(DBHFeetInput) * 12) + parseInt(DBHInchInput));
      setDBHCalculation(String(result));
    }
  }, [DBHFeetInput, DBHInchInput]);

  React.useEffect(() => {
    if (calculatedFormValues) {
      formik.handleSubmit();
      formik.values.speciesData?.COMMON === 'Unknown' && formik.values.speciesType === TreeTypes.NULL && (
        Alert.alert('', 'This entry could not be saved.You have missing data. You need to select a Tree type for this entry.', [
          {
            text: 'Ok',
            onPress: () => {
              console.log('ok')
            },
          },
        ])
      )
    }
  }, [calculatedFormValues]);

  React.useEffect(() => {
    props.navigation.addListener('focus', getSelectedSpecies);
    return () => {
      props.navigation.removeListener('focus', getSelectedSpecies)
    }
  }, [])

  const [isCameraVisible, setIsCameraVisible] = React.useState<boolean>(false)
  const [isMeasureWithCamera, setIsMeasureWithCamera] = React.useState<boolean>(false)

  const [isDone, setDone] = React.useState<boolean>(false)

  const [test, setTest] = React.useState<boolean>(false);

  //console.log("Loading AddTree screen")
  function handleClear() {
    Alert.alert('', 'Are you sure?', [
      { text: 'Cancel' },
      {
        text: 'Yes, clear all',
        onPress: () => {
          refTreeTypeSelect?.current?.setTreeType(TreeTypes.NULL);
          formik.resetForm();
          setLoadBenefitsCall(false);
          setCalculatedFormValues(false);
          removeBenefitVal();
        },
      },
    ])
  }

  // Auto-fill species data when jumped from TreeInfo Screen
  function getSelectedSpecies() {
    const { params } = props.route;
    console.log(params);
    if (params && params.selectedSpeciesData) {
      formik.setFieldValue('speciesData', params.selectedSpeciesData)
    }
  }

  function handleAddTreeError() {
    setLoadBenefitsCall(false);
    setCalculatedFormValues(false);
    formik.setSubmitting(false)

    Alert.alert('Error', "Oops - looks like you are not logged in. Please go to the Profile screen and login or create an account.", [
      {
        text: 'Ok',
      },
    ])
  }

  function handleUpdateUserSuccess(badgesAwarded: string[]) {
    formik.resetForm()
    formik.setSubmitting(false)

    if (typeof badgesAwarded !== 'undefined' && badgesAwarded.length > 0) {
      Alert.alert('Success', 'You have added new tree successfully. Also, you have been awarded badges! Check them out in your profile!', [
        {
          text: 'Great',
          onPress: () => {
            formik.resetForm()
          },
        },
      ])
    } else {
      Alert.alert('Success', 'You have added new tree successfully', [
        {
          text: 'Great',
          onPress: () => {
            formik.resetForm()
          },
        },
      ])
    }
  }

  function handleUpdateUserError() {
    formik.setSubmitting(false)

    Alert.alert('Error', 'Tree was added but there was an error awarding you badges. Sorry :(', [
      {
        text: 'Ok',
      },
    ])
  }

  const onOptionButton = (index: any) => {
    setDBHSelected(false);
    switch (index) {
      case 0: setDBHSelected0(true);
        break;
      case 1: setDBHSelected1(true);
        break;
      case 2: setDBHSelected2(true);
        break;
    }
  }


  const DBHModal = (
    <View style={styles.modalContainer}>
      <View style={styles.modalHeaderContainer}>
        <Text style={styles.headerTitle}>What do you want to do?</Text>
        <TouchableOpacity onPress={() => setDBHSelected(false)}>
          <MaterialCommunityIcons name="window-close" size={22} />
        </TouchableOpacity>
      </View>

      <View style={styles.modalBodyContainer}>
        <TouchableOpacity activeOpacity={0.7} style={[styles.optionButtonContainer, {
          borderColor: theme.colors.backdrop,
          backgroundColor: theme.colors.background,
          borderRadius: theme.roundness,
        }]} onPress={() => onOptionButton(0)}>
          <Text>Enter the DBH in inches</Text>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.7} style={[styles.optionButtonContainer, {
          borderColor: theme.colors.backdrop,
          backgroundColor: theme.colors.background,
          borderRadius: theme.roundness,
        }]} onPress={() => onOptionButton(1)}>
          <Text>Calculate DBH from circumference</Text>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.7} style={[styles.optionButtonContainer, {
          borderColor: theme.colors.backdrop,
          backgroundColor: theme.colors.background,
          borderRadius: theme.roundness,
        }]} onPress={() => {
          console.log('setIsMeasureWithCamera start ===', isMeasureWithCamera);
          // setIsMeasureWithCamera(true);
          setDBHSelected(false);
          formik.setFieldValue('both', 0);
          formik.setFieldValue('number', 0);
          setTest(false);
          console.log('setIsMeasureWithCamera end ===', isMeasureWithCamera);
          setTimeout(() => setIsMeasureWithCamera(true), Platform.OS === "ios" ? 200 : 0);
        }}>
          <View style={{ flexDirection: "row" }}><View style={{ right: 15, backgroundColor: '#A9A9A9', padding: 2, paddingHorizontal: 5, borderRadius: 4, }} ><Text style={{ color: 'white', fontSize: 11, fontWeight: "bold" }}>beta</Text></View>
            <Text>Measure with camera</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.7} style={[styles.optionButtonContainer, {
          borderColor: theme.colors.backdrop,
          backgroundColor: theme.colors.background,
          borderRadius: theme.roundness,
          marginBottom: -5
        }]} onPress={() => onOptionButton(2)}>
          <Text>Convert feet & inches to inches</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  const DBHModal0 = (
    <View style={styles.modalContainer}>
      <View style={styles.modalHeaderContainer}>
        <Text style={styles.headerTitle}>DBH (inches)</Text>
        <TouchableOpacity onPress={() => setDBHSelected0(false)}>
          <MaterialCommunityIcons name="window-close" size={22} />
        </TouchableOpacity>
      </View>

      <View style={styles.rowContainer}>
        <RNTextInput
          placeholder="DBH in inches"
          style={styles.modalTextInput}
          keyboardType='numeric'
          value={DBHSelected0Input}
          onChangeText={(value) => {
            setDBHSelected0Input(value)
          }}
        ></RNTextInput>

        <Button
          style={{ alignSelf: 'flex-end', marginVertical: 5, marginLeft: 5, borderWidth: 1, borderColor: theme.colors.primary }}
          onPress={() => {
            formik.setFieldValue('dbh', DBHSelected0Input)
            setDBHSelected0(false)
          }}
        >
          Enter
        </Button>
      </View>
    </View>
  )

  const onModalCancel = (index) => {
    setDBHFeetInput('');
    setDBHInchInput('');
    setDBHCalculation('');

    if (index === 1) {
      setDBHSelected1(false)
    } else {
      setDBHSelected2(false)
    }
  }

  const DBHModal1 = (
    <View style={styles.modalContainer}>
      <View style={styles.modalHeaderContainer}>
        <Text style={styles.headerTitle}>Calculate DBH from circumference</Text>
        <TouchableOpacity onPress={() => onModalCancel(1)}>
          <MaterialCommunityIcons name="window-close" size={22} />
        </TouchableOpacity>
      </View>

      <View style={[styles.rowContainer, { alignItems: 'flex-end' }]}>
        <RNTextInput
          placeholder="1.0"
          style={[styles.modalTextInput, { height: 40, paddingHorizontal: 3 }]}
          value={DBHFeetInput}
          keyboardType='numeric'
          onChangeText={(value) => {
            setDBHFeetInput(value)
          }}
        ></RNTextInput>
        <Text style={{ fontSize: 20, marginHorizontal: 3 }}>Feet</Text>
        <RNTextInput
          placeholder="12"
          style={[styles.modalTextInput, { height: 40, paddingHorizontal: 3 }]}
          keyboardType='numeric'
          value={DBHInchInput}
          onChangeText={(value) => {
            setDBHInchInput(value)
          }}
        ></RNTextInput>
        <Text style={{ fontSize: 20, marginHorizontal: 3 }}>inches</Text>

      </View>

      <View style={[styles.rowContainer, { marginTop: 8 }]}>
        <View style={[styles.rowContainer, { flex: 1, alignItems: 'center', justifyContent: 'center' }]}>
          <MaterialCommunityIcons name="division" size={22} style={{ flex: 1, textAlign: 'center' }} />
          <MaterialCommunityIcons name="pi" size={22} style={{ flex: 1, textAlign: 'center' }} />
          <MaterialCommunityIcons name="equal" size={22} style={{ flex: 1, textAlign: 'center' }} />
        </View>
        <View style={[styles.rowContainer, { flex: 1 }]}>
          <RNTextInput
            placeholder="7.64"
            style={[styles.modalTextInput, { height: 40, paddingHorizontal: 3 }]}
            value={DBHCalculation}
            editable={false}
          ></RNTextInput>
          <Button
            style={{ alignSelf: 'flex-end', marginVertical: 5, marginLeft: 5, borderWidth: 1, borderColor: theme.colors.primary }}
            onPress={() => {
              formik.setFieldValue('dbh', DBHCalculation)
              onModalCancel(1)
            }}
          >
            Enter
          </Button>
        </View>
      </View>

    </View>
  )

  const DBHModal2 = (
    <View style={styles.modalContainer}>
      <View style={styles.modalHeaderContainer}>
        <Text style={styles.headerTitle}>Convert feet & inches to inches</Text>
        <TouchableOpacity onPress={() => onModalCancel(2)}>
          <MaterialCommunityIcons name="window-close" size={22} />
        </TouchableOpacity>
      </View>

      <View style={[styles.rowContainer, { alignItems: 'flex-end' }]}>
        <RNTextInput
          placeholder="1.0"
          style={[styles.modalTextInput, { height: 40, paddingHorizontal: 3 }]}
          value={DBHFeetInput}
          keyboardType='numeric'
          onChangeText={(value) => {
            setDBHFeetInput(value.replace(/[^0-9]/g, ''))
          }}
        ></RNTextInput>
        <Text style={{ fontSize: 20, marginHorizontal: 3 }}>Feet</Text>
        <RNTextInput
          placeholder="12"
          style={[styles.modalTextInput, { height: 40, paddingHorizontal: 3 }]}
          value={DBHInchInput}
          keyboardType='numeric'
          onChangeText={(value) => {
            setDBHInchInput(value.replace(/[^0-9]/g, ''))
          }}
        ></RNTextInput>
        <Text style={{ fontSize: 20, marginHorizontal: 3 }}>inches</Text>

      </View>

      <View style={{ height: 50, alignItems: 'center', justifyContent: 'center', marginTop: 8 }}>
        <MaterialCommunityIcons name="equal" size={28} style={{ alignSelf: 'center', textAlign: 'center' }} />
      </View>

      <View style={[styles.rowContainer, { marginTop: -10 }]}>
        <View style={[styles.rowContainer, { flex: 1 }]}>
          <RNTextInput
            placeholder="24"
            editable={false}
            style={[styles.modalTextInput, { height: 40, paddingHorizontal: 3 }]}
            value={DBHCalculation}
            onChangeText={(value) => {
              formik.setFieldValue('dbh', value)
            }}
          ></RNTextInput>
          <Text style={{ fontSize: 20, marginHorizontal: 3 }}>inches</Text>
        </View>
      </View>

      <View style={[styles.rowContainer, { marginTop: 8 }]}>
        <View style={[styles.rowContainer, { flex: 1 }]}>
          <View style={{ flex: 1 }}></View>
          <Button
            style={{ alignSelf: 'flex-end', marginVertical: 5, marginLeft: 5, borderWidth: 1, borderColor: theme.colors.primary }}
            onPress={() => {
              formik.setFieldValue('dbh', DBHCalculation)
              onModalCancel(2)
            }}
          >
            Enter
          </Button>
        </View>
      </View>

    </View>
  )

  const formHasErrors = !formik.isValid && Object.keys(formik.touched).length > 0

  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <StatusBar />

        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 70 }}>
          <Button
            style={{ alignSelf: 'flex-end', marginVertical: 5 }}
            icon="close"
            onPress={handleClear}
          >
            Clear
          </Button>

          <View>
            <View
              style={{
                backgroundColor: colors.gray[200],
                height: 220,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {!!formik.values.photo && (
                <Image
                  style={{ height: '100%', width: '100%', resizeMode: 'contain' }}
                  source={{ uri: formik.values.photo.uri }}
                />
              )}

              {!formik.values.photo && (
                <MaterialCommunityIcons name="image" size={60} color={colors.gray[400]} />
              )}
            </View>

            <Button
              onPress={() => {
                setIsCameraVisible(true)
              }}
              icon="camera"
              mode="outlined"
              style={{ borderRadius: 0 }}
            >
              Add photo
            </Button>
          </View>

          {!!formik.errors.photo && !!formik.touched.photo && (
            <Text style={{ color: theme.colors.error, marginLeft: 15, marginTop: 5 }}>
              {formik.errors.photo}
            </Text>
          )}

          <View style={{ marginTop: 15, paddingHorizontal: 15 }}>
            <View>
              <TreeTypeSelect ref={refTreeTypeSelect} onSelect={(treeType: string) => {
                if (formik.values.speciesData && treeType != null) {
                  console.log('first if' + treeType)
                  if (formik.values.speciesData.TYPE != treeType && formik.values.speciesData.TYPE != 'unknown') {
                    console.log('second if' + treeType)
                    Alert.alert('', "This species is actually a " + formik.values.speciesData.TYPE, [
                      {
                        text: 'Ok',
                        onPress: () => {
                          console.log('ok')
                        },
                      },
                    ])
                    formik.setFieldValue('treeType', formik.values.speciesType)
                    refTreeTypeSelect.current.setTreeType(formik.values.speciesType)
                  } else {
                    console.log('second else' + treeType)
                    formik.setFieldValue('speciesType', treeType)
                    formik.setFieldValue('treeType', treeType)
                  }
                }
                else {
                  console.log('first else' + treeType)
                  formik.setFieldValue('treeType', treeType)
                  formik.setFieldValue('speciesType', treeType)
                }

              }} />
            </View>
            <View style={{ position: 'absolute', top: 5, right: 30 }}>

              <Button mode="outlined" uppercase={true} style={{ backgroundColor: 'white', height: 40, width: 120 }} labelStyle={{ color: 'green' }}
                onPress={() => {
                  // todo fix clear
                  console.log('clear')
                  formik.setFieldValue('speciesType', TreeTypes.NULL)
                  formik.setFieldValue('treeType', TreeTypes.NULL)
                  refTreeTypeSelect.current.setTreeType(TreeTypes.NULL)
                  formik.setFieldValue('speciesType', TreeTypes.NULL)
                  formik.setFieldValue('speciesData', null)
                }}>
                Clear
              </Button>
            </View>
            {!!formik.errors.treeType && !!formik.touched.treeType && (
              <Text style={{ color: theme.colors.error, marginTop: 5 }}>
                {formik.errors.treeType}
              </Text>
            )}
          </View>

          <View style={{ marginTop: 20, paddingHorizontal: 15 }}>
            <SpeciesSelect
              speciesType={formik.values.speciesType}
              speciesData={formik.values.speciesData}
              onSelect={(speciesData) => {
                formik.setFieldValue('speciesData', speciesData)
                if (speciesData?.TYPE != 'unknown') {
                  console.log('known selected' + formik.values.speciesType)
                  if ((formik.values.speciesType === TreeTypes.NULL || formik.values.speciesType == null)) {
                    formik.setFieldValue('speciesData', speciesData)
                    formik.setFieldValue('treeType', speciesData?.TYPE)
                    formik.setFieldValue('speciesType', speciesData?.TYPE)

                    setTimeout(() => {
                      Alert.alert('', "Oops! Looks like you didn't say what type of tree this is. This species is a " + speciesData?.TYPE + ". I am going to correct this for you!", [
                        {
                          text: 'Ok',
                          onPress: () => {
                            console.log('ok')
                          },
                        },
                      ])
                    }, 1000)
                    refTreeTypeSelect.current.setTreeType(speciesData.TYPE)
                  }
                }
              }}
            />

            {!!formik.errors.speciesData && !!formik.touched.speciesData && (
              <Text style={{ color: theme.colors.error, marginTop: 5 }}>
                {formik.errors.speciesData}
              </Text>
            )}

          </View>

          <Modal visible={isDBHSelected} transparent={true} onRequestClose={() => setDBHSelected(false)}>
            <View style={styles.modalInsetContainer}>
              {DBHModal}
            </View>
          </Modal>

          <Modal visible={isDBHSelected0} transparent={true} onRequestClose={() => setDBHSelected0(false)}>
            <View style={styles.modalInsetContainer}>
              {DBHModal0}
            </View>
          </Modal>

          <Modal visible={isDBHSelected1} transparent={true} onRequestClose={() => setDBHSelected1(false)}>
            <View style={styles.modalInsetContainer}>
              {DBHModal1}
            </View>
          </Modal>

          <Modal visible={isDBHSelected2} transparent={true} onRequestClose={() => setDBHSelected2(false)}>
            <View style={styles.modalInsetContainer}>
              {DBHModal2}
            </View>
          </Modal>

          <View style={{ marginTop: 15, paddingHorizontal: 15 }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
              <Subheading>DBH (in)</Subheading>
              <DbhHelp />
              <View style={{ flexDirection: 'row', position: 'absolute', right: 0, bottom: -7 }}>
                <CheckBox
                  style={{ flex: 1, padding: 10 }}
                  onClick={() => {
                    if (formik.values.estimate === true) {
                      console.log('if call')
                      formik.setFieldValue('estimate', false)
                    }
                    else {
                      formik.setFieldValue('estimate', true)
                      console.log('else call')
                      Alert.alert('', 'The DBH data entered should be your best visual guess of what the total diameter is of all the main stem branches at an adult breast height (i.e. 4.5 Ft). ', [
                        {
                          text: 'Ok',
                          onPress: () => {
                            console.log('ok')
                          },
                        },
                      ])
                    }
                  }}
                  isChecked={formik.values.estimate}
                  rightText={'Estimate'}
                />
              </View>
            </View>

            {/* <TextInput
              placeholder="Diameter at breast height"
              mode="outlined"
              keyboardType="numeric"
              value={formik.values.dbh}
              // onFocus={() => setDBHSelected(true)}
              onChangeText={(value) => {
                formik.setFieldValue('dbh', value)
              }}
              returnKeyType="next"
            /> */}
            <TouchableOpacity style={{
              height: 58,
              borderWidth: 1,
              borderColor: theme.colors.backdrop,
              backgroundColor: theme.colors.background,
              paddingHorizontal: 15,
              fontSize: 15,
              marginTop: 5,
              borderRadius: theme.roundness,
              justifyContent: 'center'
            }} onPress={() => { setDBHSelected(true); formik.setFieldValue('CameraMeasured', false); }}>
              <Text style={[styles.dbhInputValue, { color: formik.values.dbh === '' ? theme.colors.backdrop : '#000' }]}>{formik.values.dbh === '' ? `Diameter at breast height` : formik.values.dbh}</Text>
            </TouchableOpacity>

            {!!formik.errors.dbh && !!formik.touched.dbh && (
              <Text style={{ color: theme.colors.error, marginTop: 5 }}>{formik.errors.dbh}</Text>
            )}
          </View>

          <View style={{ marginTop: 20, paddingHorizontal: 15 }}>
            <Subheading style={{ marginBottom: 5 }}>Dominant Surrounding Land Use</Subheading>
            <LandUseCategoriesSelect
              landUseCategoryName={formik.values.landUseCategory}
              onValueChange={(value) => {
                formik.setFieldValue('landUseCategory', value)
              }}
            />

            {!!formik.errors.landUseCategory && !!formik.touched.landUseCategory && (
              <Text style={{ color: theme.colors.error, marginTop: 5 }}>
                {formik.errors.landUseCategory}
              </Text>
            )}
          </View>

          <View style={{ marginTop: 20, paddingHorizontal: 15 }}>
            <Subheading style={{ marginBottom: 5 }}>Tree Condition</Subheading>
            <TreeConditionSelect
              treeConditionCategoryName={formik.values.treeConditionCategory}
              onValueChange={(value) => {
                formik.setFieldValue('treeConditionCategory', value)
              }}
            />

            {!!formik.errors.treeConditionCategory && !!formik.touched.treeConditionCategory && (
              <Text style={{ color: theme.colors.error, marginTop: 5 }}>
                {formik.errors.treeConditionCategory}
              </Text>
            )}
          </View>

          <View style={{ marginTop: 20, paddingHorizontal: 15 }}>
            <Subheading style={{ marginBottom: 5 }}>Crown Light Exposure (CLE)</Subheading>
            <CrownLightExposureSelect
              crownLightExposureCategoryName={formik.values.crownLightExposureCategory}
              onValueChange={(value) => {
                formik.setFieldValue('crownLightExposureCategory', value)
              }}
            />

            {!!formik.errors.crownLightExposureCategory && !!formik.touched.crownLightExposureCategory && (
              <Text style={{ color: theme.colors.error, marginTop: 5 }}>
                {formik.errors.crownLightExposureCategory}
              </Text>
            )}
          </View>

          <View style={{ marginTop: 20, paddingHorizontal: 15 }}>
            <Subheading style={{ marginBottom: 5 }}>Location type</Subheading>
            <LocationTypeSelect
              locationType={formik.values.locationType}
              onValueChange={(value) => {
                formik.setFieldValue('locationType', value)
              }}
            />

            {!!formik.errors.locationType && !!formik.touched.locationType && (
              <Text style={{ color: theme.colors.error, marginTop: 5 }}>
                {formik.errors.locationType}
              </Text>
            )}
          </View>

          <View style={{ marginTop: 20, paddingHorizontal: 15 }}>
            <Subheading>Notes</Subheading>
            <TextInput
              placeholder="Your notes..."
              mode="outlined"
              multiline
              numberOfLines={2}
              textAlignVertical="top"
              scrollEnabled={false}
              value={formik.values.notes}
              onChangeText={(value) => {
                formik.setFieldValue('notes', value)
              }}
            />
          </View>

          <View style={{ marginTop: 50, paddingHorizontal: 15 }}>
            {formHasErrors && (
              <Text style={{ color: theme.colors.error, marginBottom: 5 }}>
                Please take a look at the above error messages
              </Text>
            )}

            <View style={{ marginBottom: 25 }}>
              <TreeBenefits values={formik.values} loadBenefitsCall={loadBenefitsCall} setCalculatedFormValues={setCalculatedFormValues} />
            </View>

            <Button mode="contained"
              onPress={() => {
                setLoadBenefitsCall(true);
              }}
              style={{ fontSize: 10 }}
              icon="calculator"
              loading={formik.isSubmitting}
            >
              {`Calculate Tree Benefits & Save`}
            </Button>
          </View>

          <Modal visible={isCameraVisible} animationType="slide">
            <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
              <CameraWithLocation
                onClose={() => {
                  setIsCameraVisible(false)
                }}
                onTakePictureFinish={({ capturedPicture, coords }) => {
                  const photo: FormValues['photo'] = {
                    width: capturedPicture.width,
                    height: capturedPicture.height,
                    uri: capturedPicture.uri,
                  }

                  formik.setValues({ ...formik.values, coords, photo })
                  setIsCameraVisible(false)
                }}
              />
            </SafeAreaView>
          </Modal>
          <Modal visible={isMeasureWithCamera} animationType="slide">
            <RNCamera
              ref={cameraRef}
              defaultTouchToFocus
              mirrorImage={false}
              captureAudio={false}
              style={{
                flex: 1,
                alignItems: 'center',
              }}>
              <View
                style={{
                  position: 'absolute',
                  bottom: 85,
                  left: 10,
                }}>
                <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>Accelerometer: </Text>
                <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>(in Gs where 1 G = 9.81 m s^-2)</Text>
                <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>x: {xaxis}</Text>
                <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>y: {yaxis}</Text>
                <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>z: {zaxis}</Text>
              </View>

              <View
                style={{
                  position: 'absolute',
                  bottom: 27,
                  right: 10,
                }}>
                <View style={{ padding: 10 }}>
                  {Platform.OS === "ios" ?
                    (<MaterialCommunityIcons onPress={() => showTip()} name="help-circle" color="white" size={30} />)
                    :
                    (<Tip
                      id="multiTrunksHelp"
                      title="Multiple Trunks Calculate"
                      body="Multiple Trunks: For each individual trunk, fit the width of the trunk at breast height (4.5 ft) between the two lines. Select -Enter Another- to add the next trunk."
                    >
                      <MaterialCommunityIcons name="help-circle" color="white" size={30} />
                    </Tip>)}
                </View>
              </View>

              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {test ? (
                  <View
                    style={{
                      position: 'absolute',
                      top: 200,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Center the line at the bottom of the tree, </Text>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>then touch the camera icon</Text>
                  </View>
                ) : (
                  <View
                    style={{
                      position: 'absolute',
                      top: 135,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>Fit the tree trunk at breast height (4.5 ft) </Text>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>between the two lines, then hit the check icon.</Text>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>For multiple trunks, select the question mark </Text>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>at bottom of the screen.</Text>
                  </View>
                )}
              </View>

              <View
                style={{
                  position: 'absolute',
                  left: 30,
                  top: 15,

                }}>
                <TouchableOpacity style={{ flexDirection: 'row', top: 35 }}
                  onPress={() => setIsMeasureWithCamera(false)}>
                  <Icon name="chevron-back" type="Ionicons" color="white" size={23} />
                  <Text
                    style={{
                      fontSize: 20,
                      textDecorationLine: 'underline',
                      color: 'white',
                      paddingLeft: 5,
                    }}>
                    Back
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: 120,
                height: 90,
                backgroundColor: 'rgba(0,0,0,0.3)',
                position: 'absolute',
                top: 40,
                borderRadius: 20,
              }}>
                <Text style={{ fontWeight: 'bold', fontSize: 25, color: 'white' }}>{formik.values.number} in</Text>
              </View>
              {test ? (
                <View style={{
                  position: 'absolute',
                  top: 100,
                  flexDirection: 'row',
                }}>
                  <View
                    style={{
                      height: 300,
                      width: 3,
                      backgroundColor: '#d2544c',
                      margin: 100,
                      transform: [{ rotate: '90deg' }],
                    }}
                  />
                </View>
              ) : (
                <View style={{
                  position: 'absolute',
                  top: 100,
                  flexDirection: 'row',
                }}>
                  <View
                    style={{
                      height: 400,
                      width: 3,
                      backgroundColor: '#d2544c',
                      margin: 100,
                    }}
                  />
                  <View
                    style={{
                      height: 400,
                      width: 3,
                      backgroundColor: '#d2544c',
                      margin: 100,
                    }}
                  />
                </View>
              )}
              <View style={{ position: 'absolute', right: 70, bottom: 20 }}>
                <View style={{ padding: 10 }}>
                  <Button
                    style={{
                      alignSelf: 'flex-end', backgroundColor: theme.colors.backdrop, marginVertical: 5, marginLeft: 5, borderWidth: 1, borderColor: theme.colors.primary,
                      width: 100
                    }}
                    onPress={() => {
                      done()
                    }}
                  >
                    <Text style={{ color: 'white', fontSize: 11 }}>Done!</Text>
                  </Button>
                </View>
              </View>

              <View style={{ position: 'absolute', left: 10, bottom: 20 }}>
                <View style={{ padding: 10 }}>
                  <Button
                    style={{
                      backgroundColor: theme.colors.backdrop, marginVertical: 5, marginLeft: 5, borderWidth: 1, borderColor: theme.colors.primary,
                      width: 140
                    }}
                    onPress={() => {
                      another()
                    }}
                  >
                    <Text style={{ color: 'white', fontSize: 11 }}>Enter</Text>
                    <Text style={{ color: 'white', fontSize: 11 }}> Another</Text>
                  </Button>
                </View>
              </View>

              {test ? (
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    bottom: 70,
                  }}
                  onPress={() => calculateDBH()}>
                  <Icon name="camera" type="Feather" color="white" size={70} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    bottom: 70,
                  }}
                  onPress={() => setTest(true)
                  }>
                  <Icon name="checkmark" type="Ionicons" color="white" size={70} />
                </TouchableOpacity>
              )}
            </RNCamera>
          </Modal>
          <Modal visible={isDone} animationType="slide">
            <View style={{ flex: 1, backgroundColor: '#3B3B3B', alignItems: 'center' }}>
              <View
                style={{
                  position: 'absolute',
                  top: 80,
                  alignItems: 'center',
                }}>
                <MaterialCommunityIcons
                  style={{ padding: 8 }}
                  name="pine-tree"
                  color="white"
                  size={80}
                />
                <Text style={{ padding: 8, fontSize: 20, color: 'white' }}>Your measurement :</Text>
                <Text style={{ padding: 8, fontSize: 30, fontWeight: 'bold', color: 'white' }}>
                  {parseFloat(formik.values.both)} in
                </Text>
              </View>
              <View
                style={{
                  position: 'absolute',
                  bottom: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <View style={{ padding: 20 }}>
                  <Button
                    style={{ alignSelf: 'flex-end', marginVertical: 5, marginLeft: 5, borderWidth: 1, borderColor: theme.colors.primary }}
                    onPress={() => {
                      reset()
                    }}
                  >
                    Try measuring again...
                  </Button>
                </View>
                <View style={{ padding: 20 }}>
                  <Button
                    style={{ alignSelf: 'flex-end', marginVertical: 5, marginLeft: 5, borderWidth: 1, borderColor: theme.colors.primary }}
                    onPress={() => {
                      setDone(false) & setIsMeasureWithCamera(false) & setDBHSelected(false) &
                        formik.setFieldValue('dbh', parseFloat(formik.values.both)) & setTest(false) & formik.setFieldValue('estimate', true)
                        & formik.setFieldValue('CameraMeasured', true)
                    }}
                  >
                    Confirm
                  </Button>
                </View>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView >
  )
}
