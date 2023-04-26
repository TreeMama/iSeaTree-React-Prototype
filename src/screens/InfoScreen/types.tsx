/* This code is defining an interface named `IFilterValues` which describes the structure of an object
that contains boolean values for various filters related to trees. The interface has 10 properties,
each of which is a boolean value representing a filter option. The properties are named
`allNameTypes`, `commonName`, `scientificName`, `allTreeTypes`, `conifer`, `broadleaf`,
`allDifficulties`, `easy`, `medium`, and `expert`. This interface can be used to define the type of
an object that contains these filter values. */

export interface IFilterValues {
  allNameTypes: boolean,
  commonName: boolean,
  scientificName: boolean,
  allTreeTypes: boolean,
  conifer: boolean,
  broadleaf: boolean,
  allDifficulties: boolean,
  easy: boolean,
  medium: boolean,
  expert: boolean
}