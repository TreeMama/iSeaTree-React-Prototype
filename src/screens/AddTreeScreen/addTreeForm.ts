import { TreeTypes } from '../../lib/treeData'

export interface FormValues {
  photo: null | {
    width: number
    height: number
    uri: string
  }
  coords: null | { latitude: number; longitude: number }
  speciesData: null | { ID: string; COMMON: string; SCIENTIFIC: string }
  treeType: TreeTypes
  dbh: string
  notes: string
  landUseCategory: string | null
  locationType: string | null
}
