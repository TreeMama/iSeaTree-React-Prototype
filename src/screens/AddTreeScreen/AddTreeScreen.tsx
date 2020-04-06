import React from 'react'

import { MaterialCommunityIcons } from '@expo/vector-icons'
import {
  KeyboardAvoidingView,
  StyleSheet,
  View,
  Modal,
  Image,
  Alert,
  ScrollView,
} from 'react-native'
import { Button, TextInput, Text, Subheading, useTheme } from 'react-native-paper'
import Constants from 'expo-constants'
import { useFormik, FormikErrors } from 'formik'

import { CameraWithLocation } from '../../components/CameraWithLocation'
import { colors } from '../../styles/theme'
import { Species, TreeTypes } from '../../lib/treeData'
import { SpeciesSelect } from './SpeciesSelect'
import { TreeTypeSelect } from './TreeTypeSelect'
import { LandUseCategoriesSelect } from './LandUseCategoriesSelect'
import { DbhHelp } from './DbhHelp'
import { submitTreeData } from './lib/submitTreeData'
import { FormValues } from './addTreeForm'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Constants.statusBarHeight,
  },
})

function validateForm(values: FormValues): FormikErrors<FormValues> {
  const errors: FormikErrors<FormValues> = {}

  if (!values.photo) {
    errors.photo = 'You have to add photo'
  }

  if (!values.dbh) {
    errors.dbh = "Can't be blank"
  }

  if (!values.speciesData) {
    errors.speciesData = "Can't be blank"
  }

  return errors
}
export function AddTreeScreen() {
  const theme = useTheme()

  const [isCameraVisible, setIsCameraVisible] = React.useState<boolean>(false)

  function handleClear() {
    Alert.alert('', 'Are you sure?', [
      { text: 'Cancel' },
      {
        text: 'Yes, clear all',
        onPress: () => {
          formik.resetForm()
        },
      },
    ])
  }

  function handleSubmitSuccess() {
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

  function handleSubmitError() {
    formik.setSubmitting(false)

    Alert.alert('Error', 'There was an unexpected error. Please try again later.', [
      {
        text: 'Ok',
      },
    ])
  }

  const formik = useFormik<FormValues>({
    initialValues: {
      photo: null,
      coords: null,
      speciesData: null,
      dbh: '',
      notes: '',
      treeType: TreeTypes.CONIFER,
      landUseCategory: null,
    },
    validate: validateForm,
    onSubmit: (values) => {
      submitTreeData(values).then(handleSubmitSuccess).catch(handleSubmitError)
    },
  })

  const formHasErrors = !formik.isValid && Object.keys(formik.touched).length > 0

  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
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

        <View style={{ marginTop: 20, paddingHorizontal: 15 }}>
          <SpeciesSelect
            speciesData={formik.values.speciesData}
            onSelect={(speciesData) => {
              formik.setFieldValue('speciesData', speciesData)
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

        <View style={{ marginTop: 20, paddingHorizontal: 15 }}>
          <TreeTypeSelect />
        </View>

        <View style={{ marginTop: 50, paddingHorizontal: 15 }}>
          {formHasErrors && (
            <Text style={{ color: theme.colors.error, marginBottom: 5 }}>
              Please take a look at the above error messages
            </Text>
          )}

          <Button mode="contained" onPress={formik.handleSubmit} loading={formik.isSubmitting}>
            Save
          </Button>
        </View>

        <Modal visible={isCameraVisible} animationType="slide">
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
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
