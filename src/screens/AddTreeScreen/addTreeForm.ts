import { SpeciesData } from './SpeciesSelect';
import { TreeTypes } from '../../lib/treeData'

export interface FormValues {
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
  locationType: string | null
  estimate: boolean
}
