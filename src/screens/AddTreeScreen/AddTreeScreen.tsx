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
import { Button, TextInput, Subheading } from 'react-native-paper'
import Constants from 'expo-constants'
import { useFormik, FormikErrors } from 'formik'

import { CameraWithLocation } from '../../components/CameraWithLocation'
import { colors } from '../../styles/theme'
import { SpeciesSelect } from './SpeciesSelect'
import { TreeTypeSelect } from './TreeTypeSelect'
import { Species, TreeTypes } from '../../lib/treeData'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Constants.statusBarHeight,
  },
})

interface FormValues {
  photo: null | {
    width: number
    height: number
    uri: string
  }
  coords: null | { latitude: number; longitude: number }
  species: null | { type: Species; name: string }
  treeType: TreeTypes

  dbh?: string
  notes?: string
}

function validateForm(values: FormValues): FormikErrors<FormValues> {
  const errors: FormikErrors<FormValues> = {}

  if (!values.photo) {
    errors.photo = 'You have to add photo'
  }

  if (!values.dbh) {
    errors.dbh = "Can't be blank"
  }

  return errors
}

export function AddTreeScreen() {
  const [isCameraVisible, setIsCameraVisible] = React.useState<boolean>(false)

  // const [selectedPictureUri, setSelectedPictureUri] = React.useState<string | null>(null)
  // const [coords, setCoords] = React.useState<null | { latitude: number; longitude: number }>(null)

  function clearAll() {
    // setSelectedPictureUri(null)
    // setCoords(null)
  }

  function handleClear() {
    Alert.alert('', 'Are you sure?', [
      { text: 'Cancel' },
      {
        text: 'Yes, clear all',
        onPress: () => {
          clearAll()
        },
      },
    ])
  }

  const formik = useFormik<FormValues>({
    initialValues: {
      photo: null,
      coords: null,
      species: null,
      treeType: TreeTypes.CONIFER,
    },
    validate: validateForm,
    onSubmit: (values) => {
      setTimeout(() => {
        console.log('values:', values)
        formik.setSubmitting(false)
      }, 2000)
    },
  })

  // const canClear: boolean = !!formik.values.photo || !!formik.values.dbh

  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 70 }}>
        {/* TODO(handle clear) */}
        {/* <Button
          style={{ alignSelf: 'flex-end', marginVertical: 5 }}
          icon="close"
          onPress={handleClear}
          disabled={!canClear}
        >
          Clear
        </Button> */}

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

        <View style={{ marginTop: 20 }}>
          <SpeciesSelect
            onSelect={(data) => {
              if (data) {
                formik.setFieldValue('species', { name: data.speciesName, type: data.speciesType })
              } else {
                formik.setFieldValue('species', null)
              }
            }}
          />
        </View>

        <View style={{ marginTop: 20, paddingHorizontal: 15 }}>
          <Subheading>DBH (cm)</Subheading>
          <TextInput
            placeholder="Diameter at breast height"
            mode="outlined"
            keyboardType="numeric"
            value={formik.values.dbh}
            onChangeText={(value) => {
              formik.setFieldValue('dbh', value)
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
          <Button mode="contained" onPress={formik.handleSubmit} loading={formik.isSubmitting}>
            Save
          </Button>
        </View>

        <Modal visible={isCameraVisible} animationType="slide">
          <CameraWithLocation
            onClose={() => {
              setIsCameraVisible(false)
            }}
            onTakePictureFinish={({ capturedPicture, location }) => {
              formik.setFieldValue('photo', {
                width: capturedPicture.width,
                height: capturedPicture.height,
                uri: capturedPicture.uri,
              })

              formik.setFieldValue('coords', {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              })

              setIsCameraVisible(false)
            }}
          />
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
