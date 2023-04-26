/* This code is defining an interface `FormValues` which describes the shape of an object that contains
various properties related to a tree survey form. The interface includes properties such as `photo`,
`coords`, `speciesType`, `dbh`, `notes`, and others. The `import` statements at the beginning of the
code are importing types from other modules that are used in the `FormValues` interface, such as
`SpeciesData` and `TreeTypes`. */
import { SpeciesData } from './SpeciesSelect'
import { TreeTypes } from '../../lib/treeData'

export interface FormValues {
  both: number
  photo: null | {
    width: number
    height: number
    uri: string
  }
  coords: null | { latitude: number; longitude: number }
  speciesType: null | string
  speciesData: null | SpeciesData
  treeType: TreeTypes
  dbh: string
  notes: string
  landUseCategory: string | null
  treeConditionCategory: string | null
  crownLightExposureCategory: string | null
  locationType: string | null
  estimate: boolean
  CameraMeasured: boolean
  needsValidation: boolean
  probability: number
}
