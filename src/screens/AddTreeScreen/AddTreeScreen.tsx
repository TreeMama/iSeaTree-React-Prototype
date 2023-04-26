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
  Platform,
  requireNativeComponent,
  ActivityIndicator,
} from 'react-native'
import RNModal from 'react-native-modal'
import AsyncStorage from '@react-native-async-storage/async-storage'
// import RNModal from 'react-native-modal'
import { Button, TextInput, Text, Subheading, useTheme, Switch, Dialog } from 'react-native-paper'
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
import { TreeBotHelp } from './TreeBotHelp'
import { submitTreeData, removeBenefitVal } from './lib/submitTreeData'
import { FormValues } from './addTreeForm'
import { updateBadgesAfterAddingTree } from './lib/updateBadgesAfterAddingTree'
import { getUser, getCurrentAuthUser } from '../../lib/firebaseServices'
import { addTreeAIResult } from '../../lib/firebaseServices/addTree'
import { TreeConditionSelect } from './TreeConditionSelect'
import { CrownLightExposureSelect } from './CrownLightExposureSelect'

import { setUpdateIntervalForType, SensorTypes, accelerometer } from 'react-native-sensors'
import { RNCamera } from 'react-native-camera'
import { useCamera } from 'react-native-camera-hooks'
import Icon from 'react-native-vector-icons/Ionicons'
import Tooltip from 'rn-tooltip'
import { Tip } from 'react-native-tip'
import { identifyTreePicture } from '../../lib/iTreeAPIServices'
import { CONFIG } from '../../../envVariables'
const maple_tree = require('../../../assets/maple_tree.jpeg')
const invalid_pic = require('../../../assets/invalid_pic.png')
const not_found_pic = require('../../../assets/not_found_pic.png')

const win = Dimensions.get('window')

/* The code is defining a StyleSheet object with various styles for a React Native application.
The styles include container styles, modal styles, header styles, body styles, button styles, and
image styles. These styles are used to define the appearance and layout of various components in the
application. */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  dbhInputValue: {
    fontSize: 15,
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#00000099',
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
    backgroundColor: '#00000099',
  },
  modalContainer: {
    backgroundColor: '#f9fafb',
    width: '80%',
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
    flex: 1,
  },
  modalBodyContainer: {
    marginVertical: 8,
  },
  optionButtonContainer: {
    height: 50,
    width: '100%',
    borderRadius: 5,
    backgroundColor: colors.gray[300],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginVertical: 5,
  },
  modalTextInput: {
    height: 50,
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    fontSize: 15,
  },
  rowContainer: {
    flexDirection: 'row',
  },
  treeBotContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginRight: 10,
  },
  centeredModal: {
    // flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    padding: 20,
    // marginTop: '35%',
    // height: '30%',
  },
  closeIcon: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  modalButtons: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 10,
  },
  modalButton: { fontSize: 10, width: '48%', borderRadius: 10, paddingVertical: 4 },
  modalImage: {
    height: 200,
    width: '92%',
    // resizeMode: 'contain',
    margin: 10,
    borderRadius: 20,
  },
})

/**
 * This function validates a form's input values and returns any errors as an object.
 * @param {FormValues} values - an object containing the values of a form, with properties such as
 * photo, treeType, speciesData, dbh, landUseCategory, treeConditionCategory,
 * crownLightExposureCategory, and locationType.
 * @returns an object of type `FormikErrors<FormValues>`, which contains any validation errors that
 * were found in the `values` object passed as an argument.
 */
function validateForm(values: FormValues): FormikErrors<FormValues> {
  const errors: FormikErrors<FormValues> = {}
  if (!values.photo) {
    errors.photo = 'You have to add photo'
  }
  if (values.treeType === TreeTypes.NULL) {
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

/**
 * This is a TypeScript React function that defines the AddTreeScreen component and its state
 * variables, form values, and form submission behavior.
 * @param props - props is an object containing the properties passed down to the AddTreeScreen
 * component from its parent component.
 */
export function AddTreeScreen(props) {
  const theme = useTheme()
  const refTreeTypeSelect = React.useRef(null)
  const [isDBHSelected, setDBHSelected] = React.useState<null | boolean>(false)
  const [isDBHSelected0, setDBHSelected0] = React.useState<null | boolean>(false)
  const [isDBHSelected1, setDBHSelected1] = React.useState<null | boolean>(false)
  const [isDBHSelected2, setDBHSelected2] = React.useState<null | boolean>(false)
  const [DBHSelected0Input, setDBHSelected0Input] = React.useState('')
  const [DBHFeetInput, setDBHFeetInput] = React.useState('')
  const [DBHInchInput, setDBHInchInput] = React.useState('')
  const [DBHCalculation, setDBHCalculation] = React.useState('')
  const [loadBenefitsCall, setLoadBenefitsCall] = React.useState(false)
  const [calculatedFormValues, setCalculatedFormValues] = React.useState(false)
  const [isEnabled, setIsEnabled] = useState(false)
  const [submittedModal, setSubmittedModal] = useState(false)
  const [genusModal, setGenusModal] = useState(false)
  const [notFoundModal, setNotFoundModal] = useState(false)
  const [invalidModal, setInvalidModal] = useState(false)
  const [loading, setLoading] = React.useState<boolean>(false)
  const [treeValidationLoading, setTreeValidationLoading] = React.useState<boolean>(false)
  const [state, setState] = useState({
    aiResult: 0,
    commonNames: '',
    scientificName: '',
    matchObj: '',
    matchObjUrl: '',
    genus: '',
  })
  var aiResult = 0

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
      CameraMeasured: false,
      needsValidation: false,
      probability: aiResult,
    },
    validate: validateForm,
    onSubmit: (values) => {
      // alert(JSON.stringify(values, null, 2));
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      // submitTreeData(values).then(handleAddTreeSuccess).catch(handleAddTreeError)
    },
  })

  /**
   * This function handles the success of adding a new tree and resets the form if necessary.
   * @param {FormValues} _formValues - The parameter `_formValues` is of type `FormValues`, which is
   * likely an interface or type defined elsewhere in the codebase. It contains data related to the
   * form values submitted by the user.
   */
  const handleAddTreeSuccess = (_formValues: FormValues) => {
    const { speciesData } = _formValues
    refTreeTypeSelect?.current?.setTreeType(TreeTypes.NULL)
    // formik.resetForm()
    setLoadBenefitsCall(false)
    setCalculatedFormValues(false)
    formik.setSubmitting(false)
    if (speciesData?.TYPE.toLowerCase() === 'unknown') {
      formik.resetForm()
    }
    if (!loadBenefitsCall && !calculatedFormValues) {
      Alert.alert('Success', 'You have added a new tree successfully.', [
        {
          text: 'Great',
          onPress: () => {
            // formik.resetForm()
            setLoadBenefitsCall(false)
            setCalculatedFormValues(false)
            if (speciesData?.TYPE.toLowerCase() === 'unknown') {
              onModalCloseClick()
            }
          },
        },
      ])
    }
  }

  /**
   * The function resets various form values and flags when a modal is closed.
   */
  const onModalCloseClick = () => {
    refTreeTypeSelect?.current?.setTreeType(TreeTypes.NULL)
    formik.resetForm()
    setLoadBenefitsCall(false)
    setCalculatedFormValues(false)
    formik.setSubmitting(false)
  }

  /* The two lines of code below are disabling console log warnings in a React Native application. The
  `LogBox.ignoreLogs` method is used to ignore specific warning messages, while
  `LogBox.ignoreAllLogs` is used to ignore all warning messages. This is useful for suppressing
  warnings that may not be relevant or useful during development. */
  LogBox.ignoreLogs(['Warning: ...'])
  LogBox.ignoreAllLogs()

  //---------------------------- measure with camera
  let both = 0
  const [{ cameraRef }, { takePicture }] = useCamera()
  // const [checked, setChecked] = useState(false);

  const [xaxis, setX] = useState(0)
  const [yaxis, setY] = useState(0)
  const [zaxis, setZ] = useState(0)
  //const [angle2, setangle2] = useState();

  const [fianl, setfinal] = useState('N/A')

  setUpdateIntervalForType(SensorTypes.accelerometer, 1000)

  /* The code below is subscribing to an accelerometer and updating the state variables `x`, `y`, and
  `z` with the corresponding values received from the accelerometer. The `setX`, `setY`, and `setZ`
  functions are likely part of a React component's state management system. */
  const subscription = accelerometer.subscribe(({ x, y, z, timestamp }) => {
    setX(x)
    setY(y)
    setZ(z)
  })

  // setTimeout(() => {
  //   console.log(`unsubscribe ===`);
  //   subscription.unsubscribe();
  // }, 100000);

  /**
   * The function converts an angle from degrees to radians.
   * @param {any} angle - The parameter "angle" is a number representing an angle in degrees that needs
   * to be converted to radians.
   * @returns The function `toRadians` takes an angle in degrees as input and returns the equivalent
   * angle in radians. The return statement in the function multiplies the input angle by the conversion
   * factor of `Math.PI / 180` to convert it to radians. Therefore, the function returns the angle in
   * radians.
   */
  const toRadians = (angle: any) => {
    return angle * (Math.PI / 180)
  }

  /**
   * The function converts an angle from radians to degrees.
   * @param {any} angle - The parameter "angle" is a number representing an angle in radians that we
   * want to convert to degrees.
   * @returns The function `toDegrees` takes an argument `angle` and returns the value of `angle`
   * converted from radians to degrees. The formula used for the conversion is `angle * (180 /
   * Math.PI)`. Therefore, the function returns the value of `angle` in degrees.
   */
  const toDegrees = (angle: any) => {
    return angle * (180 / Math.PI)
  }

  /**
   * The function calculates the diameter at breast height (DBH) of a tree based on certain input
   * parameters.
   */
  const calculateDBH = () => {
    let number = 0
    const angle = (180 * zaxis) / 20
    const angle2 = 90 - angle + 20
    const inCm = 1.37 * Math.tan(toRadians(angle2)) * Math.tan(toRadians((180 * 0.8) / 20)) * 2
    const toIn = inCm * 39.3701

    if (toIn >= 0) {
      formik.setFieldValue('both', formik.values.both + toIn)
    } else {
      formik.setFieldValue('both', formik.values.both + toIn * -1)
    }
    number = parseFloat(toIn.toString().substr(0, 4))
    setfinal(parseFloat(toIn.toString().substr(0, 4)))
    if (number <= 0) {
      number = parseFloat((toIn * -1).toString().substr(0, 4))
      formik.setFieldValue('number', number)
      // Alert.alert('', 'Calibration error! Please try again.');
    } else {
      formik.setFieldValue('number', number)
    }
  }

  /**
   * The function "done" sets a state variable, modifies a string, sets another state variable, and
   * updates a form field value.
   */
  const done = () => {
    setIsMeasureWithCamera(false)
    both = both.toString().substr(0, 4)
    setDone(true)
    formik.setFieldValue('both', formik.values.both.toString().substr(0, 4))
  }

  /**
   * The function sets a boolean value to false and sets a form field value to 0 using Formik.
   */
  const another = () => {
    setTest(false)
    formik.setFieldValue('number', 0)
  }

  /**
   * The function resets various values and fields.
   */
  const reset = () => {
    both = 0
    setTest(false)
    setDone(false)
    setTimeout(() => setIsMeasureWithCamera(true), Platform.OS === 'ios' ? 200 : 0)
    formik.setFieldValue('both', 0)
    formik.setFieldValue('number', 0)
  }

  /**
   * The function displays an alert message with instructions for calculating multiple trunks.
   */
  const showTip = () => {
    Alert.alert(
      'Multiple Trunks Calculate',
      'Multiple Trunks: For each individual trunk, fit the width of the trunk at breast height (4.5 ft) between the two lines. Select -Enter Another- to add the next trunk.',
      [
        {
          text: 'Ok',
        },
      ],
    )
  }

  /* The code below is a React useEffect hook that runs when the DBHFeetInput or DBHInchInput values
  change. It sets the "number" and "both" fields of a Formik form to 0, and then calculates the
  diameter at breast height (DBH) based on the selected option (isDBHSelected1 or isDBHSelected2) and
  the input values for feet and inches (DBHFeetInput and DBHInchInput). The calculated DBH value is
  then stored in the state variable "DBHCalculation". */
  React.useEffect(() => {
    formik.setFieldValue('number', 0)
    formik.setFieldValue('both', 0)

    if (isDBHSelected1 && DBHFeetInput !== '' && DBHInchInput !== '') {
      const result = (parseFloat(DBHFeetInput) * 12 + parseInt(DBHInchInput)) / 3.14
      const decimal = result
      const display = decimal.toFixed(2)
      setDBHCalculation(String(display))
    } else if (isDBHSelected2 && DBHFeetInput !== '' && DBHInchInput !== '') {
      const result = parseFloat(DBHFeetInput) * 12 + parseInt(DBHInchInput)
      setDBHCalculation(String(result))
    }
  }, [DBHFeetInput, DBHInchInput])

  /* The code below is using the `useEffect` hook in a React component to trigger a form submission
  when `calculatedFormValues` changes. It also checks if the `COMMON` value in the `speciesData`
  object is 'Unknown' and the `speciesType` is `TreeTypes.NULL`, and if so, it displays an alert
  message to prompt the user to select a tree type for the entry. */
  React.useEffect(() => {
    if (calculatedFormValues) {
      formik.handleSubmit()
      formik.values.speciesData?.COMMON === 'Unknown' &&
        formik.values.speciesType === TreeTypes.NULL &&
        Alert.alert('', 'You have missing data. You need to select a Tree type for this entry.', [
          {
            text: 'Ok',
            onPress: () => {
              console.log('ok')
            },
          },
        ])
    }
  }, [calculatedFormValues])

  /* The code below is using the `useEffect` hook in a React component to add and remove a listener for
  the 'focus' event on the navigation object passed in as a prop. When the component mounts, the
  `getSelectedSpecies` function is called when the 'focus' event is triggered. When the component
  unmounts, the listener is removed to prevent memory leaks. The `useEffect` hook is also dependent
  on the `props` object, so it will re-run the effect whenever the `props` object changes. */
  React.useEffect(() => {
    props.navigation.addListener('focus', getSelectedSpecies)
    return () => {
      props.navigation.removeListener('focus', getSelectedSpecies)
    }
  }, [props])

  /* The code below is defining a React component with four state variables: `isCameraVisible`,
  `isMeasureWithCamera`, `isDone`, and `test`. Each state variable is initialized with a boolean
  value. The component is not rendering anything yet, but it could be used to control the visibility
  of a camera, enable/disable measuring with the camera, and track whether a task is done or not.
  The `test` variable seems to be unused and may be for debugging purposes. */
  const [isCameraVisible, setIsCameraVisible] = React.useState<boolean>(false)
  const [isMeasureWithCamera, setIsMeasureWithCamera] = React.useState<boolean>(false)

  const [isDone, setDone] = React.useState<boolean>(false)

  const [test, setTest] = React.useState<boolean>(false)

  /**
   * The function handles a confirmation alert and clears various form values and states when the user
   * selects to clear all.
   */
  function handleClear() {
    Alert.alert('', 'Are you sure?', [
      { text: 'Cancel' },
      {
        text: 'Yes, clear all',
        onPress: () => {
          refTreeTypeSelect?.current?.setTreeType(TreeTypes.NULL)
          formik.resetForm()
          setLoadBenefitsCall(false)
          setCalculatedFormValues(false)
          removeBenefitVal()
        },
      },
    ])
  }


  /**
   * This function sets form field values based on selected species data.
  */

  // Auto-fill species data when jumped from TreeInfo Screen
  function getSelectedSpecies() {
    let { params } = props.route
    let speciesData = params?.selectedSpeciesData
    if (params && speciesData) {
      formik.setFieldValue('speciesData', speciesData)
      if (speciesData?.TYPE != 'unknown') {
        formik.setFieldValue('treeType', speciesData?.TYPE)
        formik.setFieldValue('speciesType', speciesData?.TYPE)
        refTreeTypeSelect.current.setTreeType(speciesData.TYPE)
      }
    }
  }

  /**
   * The function handles an error related to adding a tree and displays an alert message if the user
   * is not logged in.
   */
  function handleAddTreeError() {
    setLoadBenefitsCall(false)
    setCalculatedFormValues(false)
    formik.setSubmitting(false)

    Alert.alert(
      'Error',
      'Oops - looks like you are not logged in. Please go to the Profile screen and login or create an account.',
      [
        {
          text: 'Ok',
        },
      ],
    )
  }

  /**
   * The function handles the success message and resetting of a form after a user has added a new tree
   * and potentially earned badges.
   * @param {string[]} badgesAwarded - An array of strings representing the badges awarded to the user
   * after successfully adding a new tree.
   */
  function handleUpdateUserSuccess(badgesAwarded: string[]) {
    formik.resetForm()
    formik.setSubmitting(false)

    if (typeof badgesAwarded !== 'undefined' && badgesAwarded.length > 0) {
      Alert.alert(
        'Success',
        'You have added new tree successfully. Also, you have been awarded badges! Check them out in your profile!',
        [
          {
            text: 'Great',
            onPress: () => {
              formik.resetForm()
            },
          },
        ],
      )
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

  /**
   * The function handles an error when updating a user and displays an alert message.
   */
  function handleUpdateUserError() {
    formik.setSubmitting(false)

    Alert.alert('Error', 'Tree was added but there was an error awarding you badges. Sorry :(', [
      {
        text: 'Ok',
      },
    ])
  }

  /**
   * The function sets a selected option based on the index provided.
   * @param {any} index - The parameter "index" is a variable of type "any" that is used as an input to
   * the function "onOptionButton". It is likely used to determine which option button was clicked or
   * selected, and then perform some action based on that selection.
   */
  const onOptionButton = (index: any) => {
    setDBHSelected(false)
    switch (index) {
      case 0:
        setDBHSelected0(true)
        break
      case 1:
        setDBHSelected1(true)
        break
      case 2:
        setDBHSelected2(true)
        break
    }
  }

  /* The code below is defining two modal components, `DBHModal` and `DBHModal0`, which are used to
  display options and input fields related to calculating or entering a tree's diameter at breast
  height (DBH). The `onModalCancel` function is used to reset input values and close the modals when
  the user cancels or completes an action. */
  const DBHModal = (
    <View style={styles.modalContainer}>
      <View style={styles.modalHeaderContainer}>
        <Text style={styles.headerTitle}>What do you want to do?</Text>
        <TouchableOpacity onPress={() => setDBHSelected(false)}>
          <MaterialCommunityIcons name="window-close" size={22} />
        </TouchableOpacity>
      </View>

      <View style={styles.modalBodyContainer}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={[
            styles.optionButtonContainer,
            {
              borderColor: theme.colors.backdrop,
              backgroundColor: theme.colors.background,
              borderRadius: theme.roundness,
            },
          ]}
          onPress={() => onOptionButton(0)}
        >
          <Text>Enter the DBH in inches</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          style={[
            styles.optionButtonContainer,
            {
              borderColor: theme.colors.backdrop,
              backgroundColor: theme.colors.background,
              borderRadius: theme.roundness,
            },
          ]}
          onPress={() => onOptionButton(1)}
        >
          <Text>Calculate DBH from circumference</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          style={[
            styles.optionButtonContainer,
            {
              borderColor: theme.colors.backdrop,
              backgroundColor: theme.colors.background,
              borderRadius: theme.roundness,
            },
          ]}
          onPress={() => {
            console.log('setIsMeasureWithCamera start ===', isMeasureWithCamera)
            // setIsMeasureWithCamera(true);
            setDBHSelected(false)
            formik.setFieldValue('both', 0)
            formik.setFieldValue('number', 0)
            setTest(false)
            console.log('setIsMeasureWithCamera end ===', isMeasureWithCamera)
            setTimeout(() => setIsMeasureWithCamera(true), Platform.OS === 'ios' ? 200 : 0)
          }}
        >
          <View style={{ flexDirection: 'row' }}>
            <View
              style={{
                right: 15,
                backgroundColor: '#A9A9A9',
                padding: 2,
                paddingHorizontal: 5,
                borderRadius: 4,
              }}
            >
              <Text style={{ color: 'white', fontSize: 11, fontWeight: 'bold' }}>beta</Text>
            </View>
            <Text>Measure with camera</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          style={[
            styles.optionButtonContainer,
            {
              borderColor: theme.colors.backdrop,
              backgroundColor: theme.colors.background,
              borderRadius: theme.roundness,
              marginBottom: -5,
            },
          ]}
          onPress={() => onOptionButton(2)}
        >
          <Text>Convert feet & inches to inches</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  /* The code below is defining a React component called DBHModal0 which renders a modal with a header,
  a text input field for entering a DBH value in inches, and a button to submit the entered value.
  The entered value is then set as a field value in a Formik form and the modal is closed. */
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
          keyboardType="numeric"
          value={DBHSelected0Input}
          onChangeText={(value) => {
            setDBHSelected0Input(value)
          }}
        ></RNTextInput>

        <Button
          style={{
            alignSelf: 'flex-end',
            marginVertical: 5,
            marginLeft: 5,
            borderWidth: 1,
            borderColor: theme.colors.primary,
          }}
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

  /**
   * The function resets input values and toggles off a selected state based on the index parameter.
   * @param index - The index parameter is a number that is used to determine which modal is being
   * cancelled. It is used to conditionally set the state of the DBHSelected1 or DBHSelected2 variables
   * to false, depending on which modal is being cancelled.
   */
  const onModalCancel = (index) => {
    setDBHFeetInput('')
    setDBHInchInput('')
    setDBHCalculation('')

    if (index === 1) {
      setDBHSelected1(false)
    } else {
      setDBHSelected2(false)
    }
  }

  /* The code below is defining a React component called DBHModal1, which renders a modal with a
  header, two text input fields for feet and inches, and a calculation result field. The user can
  input values for feet and inches, and the component calculates the diameter at breast height (DBH)
  using the formula DBH = circumference / pi. The calculated DBH value is displayed in the result
  field and can be submitted by pressing the "Enter" button. The component also includes a cancel
  button in the header that closes the modal. */
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
          keyboardType="numeric"
          onChangeText={(value) => {
            setDBHFeetInput(value)
          }}
        ></RNTextInput>
        <Text style={{ fontSize: 20, marginHorizontal: 3 }}>Feet</Text>
        <RNTextInput
          placeholder="12"
          style={[styles.modalTextInput, { height: 40, paddingHorizontal: 3 }]}
          keyboardType="numeric"
          value={DBHInchInput}
          onChangeText={(value) => {
            setDBHInchInput(value)
          }}
        ></RNTextInput>
        <Text style={{ fontSize: 20, marginHorizontal: 3 }}>inches</Text>
      </View>

      <View style={[styles.rowContainer, { marginTop: 8 }]}>
        <View
          style={[styles.rowContainer, { flex: 1, alignItems: 'center', justifyContent: 'center' }]}
        >
          <MaterialCommunityIcons
            name="division"
            size={22}
            style={{ flex: 1, textAlign: 'center' }}
          />
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
            style={{
              alignSelf: 'flex-end',
              marginVertical: 5,
              marginLeft: 5,
              borderWidth: 1,
              borderColor: theme.colors.primary,
            }}
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


  /**
   * This function validates whether a given image is of a tree and prompts the user to enter the
   * species name or genus if a match is found, or to enter the species as "Unknown" if no match is
   * found.
   * @param result - The parameter `result` is an array that contains information about a tree that has
   * been identified through image recognition. The array contains the following elements:
   */
  const treeValidation = (result) => {
    try {
      formik.setFieldValue('needsValidation', false)
      console.log('tree check ===', result)
      let is_plant = result[0]
      let species_match = false
      let genus_match = false
      let structured_name = result[3]
      // genus = structured_name[0]
      // commonNames = result[1]
      setState({
        ...state,
        commonNames: result[1],
        scientificName: result[2],
        genus: structured_name[0],
      })
      // scientificName = result[2]

      console.log('is_plant ===', is_plant)
      if (is_plant) {
        /*Is a tree*/
        // let local_species_data = require('/Users/gaigai/Desktop/INI/Practicum/iSeaTree-React-Prototype/data/species.json');
        let local_species_data = require('./../../../data/species.json')
        let matchSpecieObj = ''
        let matchGenusObj = ''
        // Filter Plant From JSON

        /* In Future we have to match API response result[2] 90% result with species.json data */

        /* The code is filtering an array of objects called `local_species_data` based on a
        condition. The condition is that the `SCIENTIFIC` property of each object in the array
        should be equal to the third element of an array called `result`, after converting both to
        lowercase. The filtered array is then stored in a variable called `speciesFilter`. */
        const speciesFilter = local_species_data.filter((species) => {
          return species.SCIENTIFIC.toLowerCase() == result[2].toLowerCase()
        })

        /* We have to filter object that have schientif name has spp. */

        /* The code is filtering an array of objects called `local_species_data` based on two
        conditions. The first condition is that the `GENUS` property of each object in the array
        must match the `genus` property of another object called `structured_name`. The comparison
        is case-insensitive as both values are converted to lowercase using the `toLowerCase()`
        method. The second condition is that the `SCIENTIFIC` property of each object in the array
        must include the string 'spp.'. The filtered result is stored in a new array called
        `genusFilter`. */
        const genusFilter = local_species_data.filter((genus) => {
          return (
            genus.GENUS.toLowerCase() == structured_name.genus.toLowerCase() &&
            genus.SCIENTIFIC.includes('spp.')
          )
        })

        /* The code is checking if the `speciesFilter` array has at least one element and setting the
        `matchSpecieObj` variable to the first element of the array and updating the state with the
        `matchObj` property set to the same value. If `speciesFilter` is empty, it checks if the
        `genusFilter` array has at least one element and sets the `matchGenusObj` variable to the
        first element of the array and updates the state with the `matchObj` property set to the same
        value. */
        if (Array.isArray(speciesFilter) && speciesFilter.length >= 1) {
          species_match = true
          matchSpecieObj = speciesFilter[0]
          setState({ ...state, matchObj: speciesFilter[0] })
        } else if (Array.isArray(genusFilter) && genusFilter.length >= 1) {
          genus_match = true
          matchGenusObj = genusFilter[0]
          setState({ ...state, matchObj: genusFilter[0] })
        }

        if (species_match && matchSpecieObj) {
          {
            /* Outcome 2: Prompt user to enter the Species name */
          }
          // <Image
          //   style={{ width: 50, height: 50 }}
          //   source={{ uri: '/Users/gaigai/Desktop/INI/Practicum/iSeaTree-React-Prototype/src/screens/AddTreeScreen/img/maple_tree.jpeg' }}
          // />
          setTreeValidationLoading(false)
          Alert.alert(
            "It's a match!",
            "We've determined that this tree likely is a " +
            matchSpecieObj?.COMMON +
            ' (' +
            matchSpecieObj?.SCIENTIFIC +
            ').\n Do you agree?',
            [
              {
                text: 'Try again',
                onPress: () => {
                  setIsCameraVisible(true)
                },
              },
              {
                text: 'OK',
                onPress: () => {
                  console.log('start setFieldValue')
                  formik.setFieldValue('needsValidation', true)
                  formik.setFieldValue('speciesData', matchSpecieObj)
                  formik.setFieldValue('treeType', matchSpecieObj.TYPE)
                  refTreeTypeSelect.current.setTreeType(matchSpecieObj.TYPE)
                },
              },
            ],
          )
        } else if (genus_match && matchGenusObj) {
          {
            /* Outcome 1: Prompt user to enter the GENUS  */
          }
          setTreeValidationLoading(false)
          Alert.alert(
            "It's a match!",
            "We've determined that this tree likely belongs in the " +
            matchGenusObj?.GENUS +
            ' (' +
            matchGenusObj?.SCIENTIFIC +
            ') Genus.\n Do you agree?',
            [
              {
                text: 'Try again',
                onPress: () => {
                  setIsCameraVisible(true)
                },
              },
              {
                text: 'OK',
                onPress: () => {
                  formik.setFieldValue('needsValidation', true)
                  formik.setFieldValue('speciesData', matchGenusObj)
                  formik.setFieldValue('treeType', matchGenusObj.TYPE)
                  refTreeTypeSelect.current.setTreeType(matchGenusObj.TYPE)
                },
              },
            ],
          )
        } else {
          /* Outcome 3: Prompt user to enter Unknown */
          setTreeValidationLoading(false)
          Alert.alert(
            'Sorry! No matches found',
            "We cannot determine this species. Do you want to enter this species as 'Unknown'?",
            [
              {
                text: 'Try again',
                onPress: () => {
                  setIsCameraVisible(true)
                },
              },
              {
                text: 'OK',
                onPress: () => {
                  formik.setFieldValue('needsValidation', true)
                  formik.setFieldValue('speciesData', local_species_data[0])
                  formik.setFieldValue('treeType', TreeTypes.NULL)
                  refTreeTypeSelect.current.setTreeType(TreeTypes.NULL)
                },
              },
            ],
          )
        }
      } else {
        setTreeValidationLoading(false)
        /* Is not a tree */
        Alert.alert(
          'Hmmm...',
          "This doesn't look like a tree to us.\n Can you take another picture?",
          [
            {
              text: 'Cancel',
              onPress: () => { },
            },
            {
              text: 'OK',
              onPress: () => {
                setIsCameraVisible(true)
              },
            },
          ],
        )
      }
    } catch (error) {
      setTreeValidationLoading(false)
      setLoading(false)
    }
  }

  /* The code is rendering a modal component in a React Native app that allows the user to
  convert a measurement in feet and inches to inches. The modal contains input fields for feet and
  inches, and a calculation is performed to convert the input to inches, which is displayed in
  another input field. The user can then choose to enter the calculated value into a form field by
  pressing the "Enter" button. */
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
          keyboardType="numeric"
          onChangeText={(value) => {
            setDBHFeetInput(value.replace(/[^0-9]/g, ''))
          }}
        ></RNTextInput>
        <Text style={{ fontSize: 20, marginHorizontal: 3 }}>Feet</Text>
        <RNTextInput
          placeholder="12"
          style={[styles.modalTextInput, { height: 40, paddingHorizontal: 3 }]}
          value={DBHInchInput}
          keyboardType="numeric"
          onChangeText={(value) => {
            setDBHInchInput(value.replace(/[^0-9]/g, ''))
          }}
        ></RNTextInput>
        <Text style={{ fontSize: 20, marginHorizontal: 3 }}>inches</Text>
      </View>

      <View style={{ height: 50, alignItems: 'center', justifyContent: 'center', marginTop: 8 }}>
        <MaterialCommunityIcons
          name="equal"
          size={28}
          style={{ alignSelf: 'center', textAlign: 'center' }}
        />
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
            style={{
              alignSelf: 'flex-end',
              marginVertical: 5,
              marginLeft: 5,
              borderWidth: 1,
              borderColor: theme.colors.primary,
            }}
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

  /* The code is checking if a form has errors by checking if there are any errors for specific
  form fields and if those fields have been touched (i.e. interacted with by the user). If any of
  these conditions are true, the `formHasErrors` variable will be set to `true`. */
  const formHasErrors =
    (formik.errors.photo && formik.touched.photo) ||
    (formik.errors.treeType && formik.touched.treeType) ||
    (formik.errors.speciesData && formik.touched.speciesData) ||
    (formik.errors.dbh && formik.touched.dbh) ||
    (formik.errors.landUseCategory && formik.touched.landUseCategory) ||
    (formik.errors.treeConditionCategory && formik.touched.treeConditionCategory) ||
    (formik.errors.crownLightExposureCategory && formik.touched.crownLightExposureCategory) ||
    (formik.errors.locationType && formik.touched.locationType)

  /**
   * The function toggles a switch and sets a form field value based on the current state of the switch
   * and a condition.
   */
  const toggleSwitch = () => {
    if (formik.values.speciesData?.TYPE != 'unknown' && !isEnabled) {
      formik.setFieldValue('needsValidation', true)
    } else {
      formik.setFieldValue('needsValidation', false)
    }
    setIsEnabled((previousState) => !previousState)
  }

  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        {/* <StatusBar /> */}

        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 70 }}>
          {/* <Button
            style={{ alignSelf: 'flex-end', marginVertical: 5 }}
            icon="close"
            onPress={handleClear}
          >
            Clear
          </Button> */}
          <View style={[styles.rowContainer, styles.treeBotContainer]}>
            {/* <DbhHelp /> */}
            <View>
              <Tooltip
                height={180}
                width={300}
                containerStyle={{
                  left: 60,
                }}
                backgroundColor={theme.colors.primary}
                popover={
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      paddingHorizontal: 40,
                    }}
                  >
                    <Image
                      style={{ height: 70, width: 70, resizeMode: 'contain' }}
                      source={require('../../../assets/tree-help/help-robot.png')}
                    />
                    <Text
                      style={{ fontSize: 14, color: 'white', lineHeight: 20, marginLeft: 15 }}
                    >{`TreeBot is our AI assistant for helping you correctly identify a tree species (or genus). Toggle the switch & take a picture if you need help!`}</Text>
                  </View>
                }
              >
                <MaterialCommunityIcons
                  name="help-circle-outline"
                  size={16}
                  color={colors.gray[700]}
                />
              </Tooltip>
            </View>
            <Text
              style={{ color: theme.colors.text, marginLeft: 2, fontSize: 17, fontWeight: 'bold' }}
            >
              TreeBot
            </Text>
            <Switch
              style={{}}
              trackColor={{ true: 'green' }}
              onValueChange={() => toggleSwitch()}
              value={isEnabled}
              style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
            ></Switch>
          </View>

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
              <TreeTypeSelect
                ref={refTreeTypeSelect}
                onSelect={(treeType: string) => {
                  if (formik.values.speciesData && treeType != null) {
                    if (
                      formik.values.speciesData.TYPE != treeType &&
                      formik.values.speciesData.TYPE != 'unknown'
                    ) {
                      Alert.alert(
                        '',
                        'This species is actually a ' + formik.values.speciesData.TYPE,
                        [
                          {
                            text: 'Ok',
                            onPress: () => {
                              console.log('ok')
                            },
                          },
                        ],
                      )
                      formik.setFieldValue('treeType', formik.values.speciesType)
                      refTreeTypeSelect.current.setTreeType(formik.values.speciesType)
                    } else {
                      formik.setFieldValue('speciesType', treeType)
                      formik.setFieldValue('treeType', treeType)
                    }
                  } else {
                    formik.setFieldValue('treeType', treeType)
                    formik.setFieldValue('speciesType', treeType)
                  }
                }}
              />
            </View>
            <View style={{ position: 'absolute', top: 0, right: 30 }}>
              <Button
                mode="outlined"
                uppercase={true}
                style={{ backgroundColor: 'white', height: 40, width: 120 }}
                labelStyle={{ color: 'green' }}
                onPress={() => {
                  console.log('clear')
                  formik.resetForm()
                  refTreeTypeSelect.current.setTreeType(TreeTypes.NULL)
                }}
              >
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
              treeType={formik.values.treeType}
              isEnabled={isEnabled}
              onSelect={(speciesData) => {
                formik.setFieldValue('speciesData', speciesData)
                if (speciesData?.TYPE != 'unknown') {
                  console.log('known selected ===' + formik.values.speciesType)
                  if (isEnabled) {
                    formik.setFieldValue('needsValidation', true)
                  } else {
                    formik.setFieldValue('needsValidation', false)
                  }
                  if (
                    formik.values.speciesType === TreeTypes.NULL ||
                    formik.values.speciesType == null
                  ) {
                    formik.setFieldValue('speciesData', speciesData)
                    formik.setFieldValue('treeType', speciesData?.TYPE)
                    formik.setFieldValue('speciesType', speciesData?.TYPE)

                    setTimeout(() => {
                      Alert.alert(
                        '',
                        "Oops! Looks like you didn't say what type of tree this is. This species is a " +
                        speciesData?.TYPE +
                        '. I am going to correct this for you!',
                        [
                          {
                            text: 'Ok',
                            onPress: () => {
                              console.log('ok')
                            },
                          },
                        ],
                      )
                    }, 1000)
                    refTreeTypeSelect.current.setTreeType(speciesData.TYPE)
                  }
                } else {
                  formik.setFieldValue('needsValidation', false)
                }
              }}
            />

            {!!formik.errors.speciesData && !!formik.touched.speciesData && (
              <Text style={{ color: theme.colors.error, marginTop: 5 }}>
                {formik.errors.speciesData}
              </Text>
            )}
          </View>

          <Modal
            visible={isDBHSelected}
            transparent={true}
            onRequestClose={() => setDBHSelected(false)}
          >
            <View style={styles.modalInsetContainer}>{DBHModal}</View>
          </Modal>

          <Modal
            visible={isDBHSelected0}
            transparent={true}
            onRequestClose={() => setDBHSelected0(false)}
          >
            <View style={styles.modalInsetContainer}>{DBHModal0}</View>
          </Modal>

          <Modal
            visible={isDBHSelected1}
            transparent={true}
            onRequestClose={() => setDBHSelected1(false)}
          >
            <View style={styles.modalInsetContainer}>{DBHModal1}</View>
          </Modal>

          <Modal
            visible={isDBHSelected2}
            transparent={true}
            onRequestClose={() => setDBHSelected2(false)}
          >
            <View style={styles.modalInsetContainer}>{DBHModal2}</View>
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
                      formik.setFieldValue('estimate', false)
                    } else {
                      formik.setFieldValue('estimate', true)
                      Alert.alert(
                        '',
                        'The DBH data entered should be your best visual guess of what the total diameter is of all the main stem branches at an adult breast height (i.e. 4.5 Ft). ',
                        [
                          {
                            text: 'Ok',
                            onPress: () => {
                              console.log('ok')
                            },
                          },
                        ],
                      )
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
            <TouchableOpacity
              style={{
                height: 58,
                borderWidth: 1,
                borderColor: theme.colors.backdrop,
                backgroundColor: theme.colors.background,
                paddingHorizontal: 15,
                fontSize: 15,
                marginTop: 5,
                borderRadius: theme.roundness,
                justifyContent: 'center',
              }}
              onPress={() => {
                setDBHSelected(true)
                formik.setFieldValue('CameraMeasured', false)
              }}
            >
              <Text
                style={[
                  styles.dbhInputValue,
                  { color: formik.values.dbh === '' ? theme.colors.backdrop : '#000' },
                ]}
              >
                {formik.values.dbh === '' ? `Diameter at breast height` : formik.values.dbh}
              </Text>
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

            {!!formik.errors.crownLightExposureCategory &&
              !!formik.touched.crownLightExposureCategory && (
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

          <View style={{ marginTop: 25, paddingHorizontal: 15 }}>
            {formHasErrors && (
              <Text style={{ color: theme.colors.error, marginBottom: 5 }}>
                Please take a look at the above error messages
              </Text>
            )}

            <View style={{ marginBottom: 25 }}>
              <TreeBenefits
                values={formik.values}
                loadBenefitsCall={loadBenefitsCall}
                setCalculatedFormValues={setCalculatedFormValues}
                onModalClose={onModalCloseClick}
              />
            </View>

            <Button
              mode="contained"
              onPress={() => {
                formik.handleSubmit()
                const {
                  crownLightExposureCategory,
                  treeType,
                  dbh,
                  speciesData,
                  treeConditionCategory,
                } = formik.values
                const { locationType } = formik.errors
                if (locationType != "Can't be blank" && formik.values.locationType) {
                  const canCalculateBenefits = !!(
                    speciesData &&
                    crownLightExposureCategory !== null &&
                    dbh &&
                    parseInt(dbh) !== 0 &&
                    treeConditionCategory &&
                    treeType !== TreeTypes.NULL
                  )
                  if (canCalculateBenefits) {
                    setLoadBenefitsCall(true)

                    setTimeout(() => {
                      submitTreeData(formik.values, isEnabled)
                        .then(handleAddTreeSuccess)
                        .catch(handleAddTreeError)
                    }, 3000)
                  }
                }
              }}
              style={{ fontSize: 10, bottom: 23 }}
              icon="calculator"
              loading={formik.isSubmitting}
              disabled={formHasErrors}
            >
              {`Calculate Tree Benefits & Save`}
            </Button>
          </View>
          <View>
            <RNModal visible={submittedModal} animationType="slide" backdropOpacity={0.5}>
              <View style={styles.centeredModal}>
                <TouchableOpacity style={styles.closeIcon} onPress={() => setSubmittedModal(false)}>
                  <MaterialCommunityIcons name="close-circle-outline" size={16} color="#62717A" />
                </TouchableOpacity>
                <Image
                  source={{
                    uri: CONFIG.AWS_S3_URL + state.matchObjUrl,
                  }}
                  style={styles.modalImage}
                />
                <Text
                  style={{
                    color: theme.colors.text,
                    fontSize: 17,
                    fontWeight: 'bold',
                    paddingTop: 5,
                    paddingBottom: 10,
                  }}
                >{`It’s a match!`}</Text>
                <Text>{`We've determined that this tree likely is a`}</Text>
                <Text style={{ fontWeight: 'bold' }}>
                  {state.commonNames + '(' + state.scientificName + ')'}.
                </Text>
                <Text>Do you agree?</Text>
                <View style={styles.modalButtons}>
                  <Button
                    mode="contained"
                    onPress={() => {
                      setLoadBenefitsCall(true)
                      setSubmittedModal(false)
                    }}
                    style={styles.modalButton}
                    color="white"
                    loading={formik.isSubmitting}
                  >
                    Try again
                  </Button>
                  <Button
                    mode="contained"
                    onPress={() => {
                      setLoadBenefitsCall(true)
                      formik.setFieldValue('speciesData', state.matchObj)
                      formik.setFieldValue('treeType', state.matchObj.TYPE)
                      refTreeTypeSelect.current.setTreeType(state.matchObj.TYPE)
                      setSubmittedModal(false)
                    }}
                    style={styles.modalButton}
                    loading={formik.isSubmitting}
                  >
                    Ok
                  </Button>
                </View>
              </View>
            </RNModal>
          </View>

          <View>
            <RNModal visible={genusModal} animationType="slide" backdropOpacity={0.5}>
              <View style={styles.centeredModal}>
                <TouchableOpacity style={styles.closeIcon} onPress={() => setSubmittedModal(false)}>
                  <MaterialCommunityIcons name="close-circle-outline" size={16} color="#62717A" />
                </TouchableOpacity>
                <Image
                  source={{
                    uri: CONFIG.AWS_S3_URL + state.matchObjUrl,
                  }}
                  style={styles.modalImage}
                />
                <Text
                  style={{
                    color: theme.colors.text,
                    fontSize: 17,
                    fontWeight: 'bold',
                    paddingTop: 5,
                    paddingBottom: 10,
                  }}
                >{`It’s a match!`}</Text>
                <Text>{`We've determined that this tree likely is a`}</Text>
                <Text style={{ fontWeight: 'bold' }}>
                  {state.genus + '(' + state.scientificName + ')'}.
                </Text>
                <Text>Do you agree?</Text>
                <View style={styles.modalButtons}>
                  <Button
                    mode="contained"
                    onPress={() => {
                      setLoadBenefitsCall(true)
                      setGenusModal(false)
                    }}
                    style={styles.modalButton}
                    color="white"
                    loading={formik.isSubmitting}
                  >
                    Try again
                  </Button>
                  <Button
                    mode="contained"
                    onPress={() => {
                      setLoadBenefitsCall(true)
                      formik.setFieldValue('speciesData', state.matchObj)
                      formik.setFieldValue('treeType', state.matchObj.TYPE)
                      refTreeTypeSelect.current.setTreeType(state.matchObj.TYPE)
                      setGenusModal(false)
                    }}
                    style={styles.modalButton}
                    loading={formik.isSubmitting}
                  >
                    Ok
                  </Button>
                </View>
              </View>
            </RNModal>
          </View>

          <View>
            <RNModal visible={notFoundModal} animationType="slide" backdropOpacity={0.5}>
              <View style={styles.centeredModal}>
                <TouchableOpacity style={styles.closeIcon} onPress={() => setSubmittedModal(false)}>
                  <MaterialCommunityIcons name="close-circle-outline" size={16} color="#62717A" />
                </TouchableOpacity>
                <Image source={not_found_pic} style={styles.modalImage} />
                <Text
                  style={{
                    color: theme.colors.text,
                    fontSize: 17,
                    fontWeight: 'bold',
                    paddingTop: 5,
                    paddingBottom: 10,
                  }}
                >{`Sorry! No matches found`}</Text>
                <Text>{`We cannot determine this species. Do you want to enter this species as 'Unknown'?`}</Text>
                <Text>Do you agree?</Text>
                <View style={styles.modalButtons}>
                  <Button
                    mode="contained"
                    onPress={() => {
                      setLoadBenefitsCall(true)
                      setNotFoundModal(false)
                    }}
                    style={styles.modalButton}
                    color="white"
                    loading={formik.isSubmitting}
                  >
                    Try again
                  </Button>
                  <Button
                    mode="contained"
                    onPress={() => {
                      setLoadBenefitsCall(true)
                      formik.setFieldValue('speciesData', local_species_data[0])
                      formik.setFieldValue('treeType', local_species_data[0].TYPE)
                      refTreeTypeSelect.current.setTreeType(local_species_data[0].TYPE)
                      setNotFoundModal(false)
                    }}
                    style={styles.modalButton}
                    loading={formik.isSubmitting}
                  >
                    Ok
                  </Button>
                </View>
              </View>
            </RNModal>
          </View>

          <View>
            <RNModal visible={invalidModal} animationType="slide" backdropOpacity={0.5}>
              <View style={styles.centeredModal}>
                <TouchableOpacity style={styles.closeIcon} onPress={() => setSubmittedModal(false)}>
                  <MaterialCommunityIcons name="close-circle-outline" size={16} color="#62717A" />
                </TouchableOpacity>
                <Image source={invalid_pic} style={styles.modalImage} />
                <Text
                  style={{
                    color: theme.colors.text,
                    fontSize: 17,
                    fontWeight: 'bold',
                    paddingTop: 5,
                    paddingBottom: 10,
                  }}
                >{`Hmmm...`}</Text>
                <Text>{`This doesn't look like a tree to us.\n Can you take another picture?`}</Text>
                <Text>Do you agree?</Text>
                <View style={styles.modalButtons}>
                  <Button
                    mode="contained"
                    onPress={() => {
                      setLoadBenefitsCall(true)
                      setInvalidModal(false)
                    }}
                    style={styles.modalButton}
                    color="white"
                    loading={formik.isSubmitting}
                  >
                    Try again
                  </Button>
                  <Button
                    mode="contained"
                    onPress={() => {
                      setLoadBenefitsCall(true)
                      setInvalidModal(false)
                    }}
                    style={styles.modalButton}
                    loading={formik.isSubmitting}
                  >
                    Ok
                  </Button>
                </View>
              </View>
            </RNModal>
          </View>

          <Dialog
            visible={loading}
            dismissable={false}
            style={{
              top: '15%',
              height: 200,
              position: 'absolute',
              width: '100%',
              marginLeft: 0,
              backgroundColor: 'transparent',
            }}
          >
            {loading && (
              <Dialog.Content style={{ backgroundColor: 'white', margin: 20, paddingBottom: 40 }}>
                <View style={{ alignItems: 'center', padding: 10 }}>
                  <ActivityIndicator animating={true} size="large" color={colors.gray[700]} />
                  <Text style={{ color: colors.gray[700], marginTop: 15 }}>
                    Identifying species/genus...
                  </Text>
                </View>
              </Dialog.Content>

              // <View
              //   style={{
              //     justifyContent: 'center',
              //     alignSelf: 'center',
              //     alignContent: 'center',
              //     flex: 1,
              //     backgroundColor: 'rgba(0,0,0,0.5)',
              //     zIndex: 0,
              //     width: '100%',
              //     position: 'absolute',
              //     height: '100%',
              //   }}
              // >
              //   <ActivityIndicator color={'green'} />
              // </View>
            )}
          </Dialog>

          <Modal visible={isCameraVisible} animationType="slide">
            <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
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

                  if (isEnabled) {
                    setLoading(true)
                    try {
                      identifyTreePicture(photo.uri, coords).then((result) => {
                        console.log('identifyTreePicture result ===' + result)
                        // const aiResult: AIResult = {
                        //   tree_name: result[0],
                        //   probability: result[4]
                        // }
                        aiResult = 1
                        setTreeValidationLoading(true)
                        treeValidation(result)
                        setLoading(false)
                      })
                    } catch (error) {
                      setLoading(false)
                    }
                  }
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
              }}
            >
              <View
                style={{
                  position: 'absolute',
                  bottom: 85,
                  left: 10,
                }}
              >
                <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
                  Accelerometer:{' '}
                </Text>
                <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
                  (in Gs where 1 G = 9.81 m s^-2)
                </Text>
                <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>x: {xaxis}</Text>
                <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>y: {yaxis}</Text>
                <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>z: {zaxis}</Text>
              </View>

              <View
                style={{
                  position: 'absolute',
                  bottom: 27,
                  right: 10,
                }}
              >
                <View style={{ padding: 10 }}>
                  {Platform.OS === 'ios' ? (
                    <MaterialCommunityIcons
                      onPress={() => showTip()}
                      name="help-circle"
                      color="white"
                      size={30}
                    />
                  ) : (
                    <Tip
                      id="multiTrunksHelp"
                      title="Multiple Trunks Calculate"
                      body="Multiple Trunks: For each individual trunk, fit the width of the trunk at breast height (4.5 ft) between the two lines. Select -Enter Another- to add the next trunk."
                    >
                      <MaterialCommunityIcons name="help-circle" color="white" size={30} />
                    </Tip>
                  )}
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
                    }}
                  >
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>
                      Center the line at the bottom of the tree,{' '}
                    </Text>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>
                      then touch the camera icon
                    </Text>
                  </View>
                ) : (
                  <View
                    style={{
                      position: 'absolute',
                      top: 135,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>
                      Fit the tree trunk at breast height (4.5 ft){' '}
                    </Text>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>
                      between the two lines, then hit the check icon.
                    </Text>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>
                      For multiple trunks, select the question mark{' '}
                    </Text>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>
                      at bottom of the screen.
                    </Text>
                  </View>
                )}
              </View>

              <View
                style={{
                  position: 'absolute',
                  left: 30,
                  top: 15,
                }}
              >
                <TouchableOpacity
                  style={{ flexDirection: 'row', top: 35 }}
                  onPress={() => setIsMeasureWithCamera(false)}
                >
                  <Icon name="chevron-back" type="Ionicons" color="white" size={23} />
                  <Text
                    style={{
                      fontSize: 20,
                      textDecorationLine: 'underline',
                      color: 'white',
                      paddingLeft: 5,
                    }}
                  >
                    Back
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 120,
                  height: 90,
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  position: 'absolute',
                  top: 40,
                  borderRadius: 20,
                }}
              >
                <Text style={{ fontWeight: 'bold', fontSize: 25, color: 'white' }}>
                  {formik.values.number} in
                </Text>
              </View>
              {test ? (
                <View
                  style={{
                    position: 'absolute',
                    top: 100,
                    flexDirection: 'row',
                  }}
                >
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
                <View
                  style={{
                    position: 'absolute',
                    top: 100,
                    flexDirection: 'row',
                  }}
                >
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
                      alignSelf: 'flex-end',
                      backgroundColor: theme.colors.backdrop,
                      marginVertical: 5,
                      marginLeft: 5,
                      borderWidth: 1,
                      borderColor: theme.colors.primary,
                      width: 100,
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
                      backgroundColor: theme.colors.backdrop,
                      marginVertical: 5,
                      marginLeft: 5,
                      borderWidth: 1,
                      borderColor: theme.colors.primary,
                      width: 140,
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
                  onPress={() => calculateDBH()}
                >
                  <Icon name="camera" type="Feather" color="white" size={70} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    bottom: 70,
                  }}
                  onPress={() => setTest(true)}
                >
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
                }}
              >
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
                }}
              >
                <View style={{ padding: 20 }}>
                  <Button
                    style={{
                      alignSelf: 'flex-end',
                      marginVertical: 5,
                      marginLeft: 5,
                      borderWidth: 1,
                      borderColor: theme.colors.primary,
                    }}
                    onPress={() => {
                      reset()
                    }}
                  >
                    Try measuring again...
                  </Button>
                </View>
                <View style={{ padding: 20 }}>
                  <Button
                    style={{
                      alignSelf: 'flex-end',
                      marginVertical: 5,
                      marginLeft: 5,
                      borderWidth: 1,
                      borderColor: theme.colors.primary,
                    }}
                    onPress={() => {
                      ; setDone(false) &
                        setIsMeasureWithCamera(false) &
                        setDBHSelected(false) &
                        formik.setFieldValue('dbh', parseFloat(formik.values.both)) &
                        setTest(false) &
                        formik.setFieldValue('estimate', true) &
                        formik.setFieldValue('CameraMeasured', true)
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
    </KeyboardAvoidingView>
  )
}
