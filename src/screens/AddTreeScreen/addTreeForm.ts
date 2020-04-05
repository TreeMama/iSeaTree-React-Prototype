import { Species, TreeTypes } from '../../lib/treeData'

export interface FormValues {
  photo: null | {
    width: number
    height: number
    uri: string
  }
  coords: null | { latitude: number; longitude: number }
  speciesType: Species
  speciesNameId: null | number
  treeType: TreeTypes
  dbh: string
  notes: string
  landUseCategory: string | null
}
