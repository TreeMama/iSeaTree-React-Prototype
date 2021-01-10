/**
 * Interfaces for http://api.itreetools.org/v2/getSingleTreeBenefit/ API
 * when xml response is converted to js using xml-js.
 */
export interface Attributes {
    Period: string 
}
export interface UnitAttributes {
    Unit: string
}
export interface Value {
    _attributes: UnitAttributes
    _text: string
}
export interface HydroBenefit {
    RunoffAvoided: Value
    RunoffAvoidedValue: Value
    Interception: Value
    PotentialEvaporation: Value
    PotentialEvapotranspiration: Value
    Evaporation: Value
    Transpiration: Value
}
export interface AirQualityBenefit {
    CORemoved: Value
    CORemovedValue: Value
    NO2Removed: Value
    NO2RemovedValue: Value
    SO2Removed: Value
    SO2RemovedValue: Value
    O3Removed: Value
    O3RemovedValue: Value
    PM25Removed: Value
    PM25RemovedValue: Value
}

export interface CO2Benefits {
    CO2Sequestered: Value
    CO2SequesteredValue: Value
}
export interface Benefit {
    _attributes: Attributes
    HydroBenefit: HydroBenefit
    AirQualityBenefit: AirQualityBenefit
    CO2Benefits: CO2Benefits
}
export interface Carbon {
    CarbonStorage: Value
    CarbonDioxideStorage: Value
    CarbonDioxideStorageValue: Value
    DryWeight: Value
}
export interface OutputInformation {
    Benefit: Benefit
    Carbon: Carbon
}
export interface Location {
    NationFullName: Value
    StateAbbr: Value
    CountyName: Value
    CityName: Value
}
export interface Tree {
    CalculatedCrownHeightMeter: Value
    CalculatedCrownWidthMeter: Value
}
export interface InputInformation {
    Location: Location
    Tree: Tree
}
export interface Result {
    OutputInformation: OutputInformation
    InputInformation: InputInformation
}
export interface RootObject {
    Result: Result
}
