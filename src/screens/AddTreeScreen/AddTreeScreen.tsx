import React from 'react'

import { MaterialCommunityIcons } from '@expo/vector-icons'
import {
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  View,
  Modal,
  Image,
  Alert,
  ScrollView,
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
import { submitTreeData, removeBenefitVal} from './lib/submitTreeData'
import { FormValues } from './addTreeForm'
import { updateBadgesAfterAddingTree } from './lib/updateBadgesAfterAddingTree'
import { getUser, getCurrentAuthUser } from '../../lib/firebaseServices'
import { TreeConditionSelect } from './TreeConditionSelect'
import { CrownLightExposureSelect } from './CrownLightExposureSelect'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
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

export function AddTreeScreen() {
  const theme = useTheme()
  const refTreeTypeSelect = React.useRef(null);

  const [isCameraVisible, setIsCameraVisible] = React.useState<boolean>(false)
  console.log("Loading AddTree screen")
  function handleClear() {
    Alert.alert('', 'Are you sure?', [
      { text: 'Cancel' },
      {
        text: 'Yes, clear all',
        onPress: () => {
          refTreeTypeSelect.current.setTreeType(TreeTypes.NULL)
          formik.resetForm()
          removeBenefitVal()//.then().catch()
        },
      },
    ])
  }

  function handleAddTreeSuccess(formValues: FormValues) {
    refTreeTypeSelect.current.setTreeType(TreeTypes.NULL)
    formik.resetForm()
    formik.setSubmitting(false)

    Alert.alert('Success', 'You have added new tree successfully', [
      {
        text: 'Great',
        onPress: () => {
          formik.resetForm()
        },
      },
    ])
  }
  // function handleAddTreeSuccess(formValues: FormValues) {
  //   const authUser = getCurrentAuthUser()
  //   if (!authUser) {
  //     handleUpdateUserError()
  //     return
  //   }
  //   getUser(authUser.uid).then((user) => {
  //     if (!user) {
  //       return
  //     }
  //     const {badgesAwarded, promise} = updateBadgesAfterAddingTree(formValues, user, authUser.uid)
  //     promise.then(() => handleUpdateUserSuccess(badgesAwarded)).catch(handleUpdateUserError)
  //   })
  // }

  function handleAddTreeError() {
    formik.setSubmitting(false)

    Alert.alert('Error', 'There was an unexpected error (AddTreeScreen::handleAddTree). Please try again later.', [
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
      estimate: false
    },
    validate: validateForm,
    onSubmit: (values) => {
      // alert(JSON.stringify(values, null, 2));
      submitTreeData(values).then(handleAddTreeSuccess).catch(handleAddTreeError)
    },
  })

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
            <View style={{ position: 'absolute',top:5, right: 30 }}>

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

            <TextInput
              placeholder="Diameter at breast height"
              mode="outlined"
              keyboardType="numeric"
              value={formik.values.dbh}
              onChangeText={(value) => {
                formik.setFieldValue('dbh', value)
              }}
              returnKeyType="next"
            />

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
              <TreeBenefits values={formik.values} />
            </View>

            <Button mode="contained"
              onPress={() => {
                formik.handleSubmit()
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
              }
              loading={formik.isSubmitting}>
              Save
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
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView >
  )
}
