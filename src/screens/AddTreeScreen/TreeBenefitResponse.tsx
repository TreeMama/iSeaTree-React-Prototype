/* This is a TypeScript code defining a set of interfaces that represent the structure of the response
from the `http://api.itreetools.org/v2/getSingleTreeBenefit/` API when the XML response is converted
to JavaScript using the `xml-js` library. These interfaces define the shape of the data that will be
returned from the API and allow for type checking and validation of the data in the application
code. */

/**
 * Interfaces for http://api.itreetools.org/v2/getSingleTreeBenefit/ API
 * when xml response is converted to js using xml-js.
 */


/* Defining an interface named `Attributes` with a single property `Period` of type `string`. This
interface can be used to ensure that any object that implements it has a `Period` property of type
`string`. The `export` keyword makes this interface available for use in other modules. */
export interface Attributes {
    Period: string
}

/* The `export interface UnitAttributes` is defining an interface with a single property `Unit` of type
`string`. This interface can be used to ensure that any object that implements it has a `Unit`
property of type `string`. It is likely used in other interfaces such as `Value` to specify the unit
of measurement for a particular value. The `export` keyword makes this interface available for use
in other modules. */
export interface UnitAttributes {
    Unit: string
}

/* The `export interface Value` is defining an interface with two properties `_attributes` and `_text`.
`_attributes` is of type `UnitAttributes` interface and `_text` is of type `string`. This interface
is likely used to represent a value with a unit of measurement, where `_attributes` specifies the
unit and `_text` specifies the numerical value. The `export` keyword makes this interface available
for use in other modules. */
export interface Value {
    _attributes: UnitAttributes
    _text: string
}

/* The `export interface HydroBenefit` is defining an interface with seven properties, each of which is
of type `Value`. This interface is likely used to represent the hydrological benefits of a single
tree, where each property represents a different aspect of the tree's impact on water, such as the
amount of runoff avoided, the amount of water intercepted by the tree, and the amount of water lost
through evaporation and transpiration. The `export` keyword makes this interface available for use
in other modules. */
export interface HydroBenefit {
    RunoffAvoided: Value
    RunoffAvoidedValue: Value
    Interception: Value
    PotentialEvaporation: Value
    PotentialEvapotranspiration: Value
    Evaporation: Value
    Transpiration: Value
}

/* The `export interface AirQualityBenefit` is defining an interface with ten properties, each of which
is of type `Value`. This interface is likely used to represent the air quality benefits of a single
tree, where each property represents a different pollutant removed by the tree, such as carbon
monoxide, nitrogen dioxide, sulfur dioxide, ozone, and particulate matter. The `export` keyword
makes this interface available for use in other modules. */
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

/* Defining an interface named `CO2Benefits` with two properties `CO2Sequestered` and
`CO2SequesteredValue`, both of type `Value`. This interface is likely used to represent the carbon
dioxide benefits of a single tree, where `CO2Sequestered` represents the amount of carbon dioxide
sequestered by the tree and `CO2SequesteredValue` represents the numerical value of the amount of
carbon dioxide sequestered. The `export` keyword makes this interface available for use in other
modules. */
export interface CO2Benefits {
    CO2Sequestered: Value
    CO2SequesteredValue: Value
}

/* The `export interface Benefit` is defining an interface with four properties: `_attributes`,
`HydroBenefit`, `AirQualityBenefit`, and `CO2Benefits`. This interface is likely used to represent
the benefits of a single tree, where each property represents a different type of benefit, such as
hydrological benefits, air quality benefits, and carbon dioxide benefits. The `_attributes` property
is of type `Attributes` interface, which has a single property `Period` of type `string`. The other
three properties are of type `HydroBenefit`, `AirQualityBenefit`, and `CO2Benefits`, which are
interfaces with their own set of properties representing the specific benefits of each type. The
`export` keyword makes this interface available for use in other modules. */
export interface Benefit {
    _attributes: Attributes
    HydroBenefit: HydroBenefit
    AirQualityBenefit: AirQualityBenefit
    CO2Benefits: CO2Benefits
}

/* The `export interface Carbon` is defining an interface with four properties: `CarbonStorage`,
`CarbonDioxideStorage`, `CarbonDioxideStorageValue`, and `DryWeight`. Each of these properties is of
type `Value`, which is another interface defined earlier in the code. This interface is likely used
to represent the carbon-related benefits of a single tree, where `CarbonStorage` represents the
amount of carbon stored in the tree, `CarbonDioxideStorage` represents the amount of carbon dioxide
stored in the tree, `CarbonDioxideStorageValue` represents the numerical value of the amount of
carbon dioxide stored, and `DryWeight` represents the dry weight of the tree. The `export` keyword
makes this interface available for use in other modules. */
export interface Carbon {
    CarbonStorage: Value
    CarbonDioxideStorage: Value
    CarbonDioxideStorageValue: Value
    DryWeight: Value
}

/* The `export interface OutputInformation` is defining an interface with two properties: `Benefit` and
`Carbon`. This interface is likely used to represent the output information of a single tree, where
`Benefit` represents the benefits of the tree (such as hydrological benefits, air quality benefits,
and carbon dioxide benefits) and `Carbon` represents the carbon-related benefits of the tree (such
as the amount of carbon stored in the tree and the dry weight of the tree). The `export` keyword
makes this interface available for use in other modules. */
export interface OutputInformation {
    Benefit: Benefit
    Carbon: Carbon
}

/* The `export interface Location` is defining an interface with four properties: `NationFullName`,
`StateAbbr`, `CountyName`, and `CityName`. This interface is likely used to represent the location
information of a single tree, where each property represents a different level of geographic
specificity, such as the nation, state, county, and city where the tree is located. The `Value` type
is used for each property, which is another interface defined earlier in the code. The `export`
keyword makes this interface available for use in other modules. */
export interface Location {
    NationFullName: Value
    StateAbbr: Value
    CountyName: Value
    CityName: Value
}

/* The `export interface Tree` is defining an interface with three properties: `CalculatedHeightMeter`,
`CalculatedCrownHeightMeter`, and `CalculatedCrownWidthMeter`. This interface is likely used to
represent the physical characteristics of a single tree, where `CalculatedHeightMeter` represents
the calculated height of the tree in meters, `CalculatedCrownHeightMeter` represents the calculated
height of the tree's crown in meters, and `CalculatedCrownWidthMeter` represents the calculated
width of the tree's crown in meters. The `export` keyword makes this interface available for use in
other modules. */
export interface Tree {
    CalculatedHeightMeter: Value
    CalculatedCrownHeightMeter: Value
    CalculatedCrownWidthMeter: Value
}

/* The `export interface InputInformation` is defining an interface with two properties: `Location` and
`Tree`. This interface is likely used to represent the input information for a single tree, where
`Location` represents the location information of the tree (such as the nation, state, county, and
city where the tree is located) and `Tree` represents the physical characteristics of the tree (such
as its height, crown height, and crown width). The `export` keyword makes this interface available
for use in other modules. */
export interface InputInformation {
    Location: Location
    Tree: Tree
}

/* The `export interface Result` is defining an interface with three properties: `Error`,
`OutputInformation`, and `InputInformation`. This interface is likely used to represent the result
of a single tree benefit calculation, where `Error` represents any error that occurred during the
calculation, `OutputInformation` represents the output information of the calculation (such as the
benefits and carbon-related benefits of the tree), and `InputInformation` represents the input
information for the calculation (such as the location and physical characteristics of the tree). The
`export` keyword makes this interface available for use in other modules. */
export interface Result {
    Error: any;
    OutputInformation: OutputInformation
    InputInformation: InputInformation
}

/* The `export interface RootObject` is defining an interface with a single property `Result` of type
`Result`. This interface is likely used to represent the root object of the response from the
`http://api.itreetools.org/v2/getSingleTreeBenefit/` API when the XML response is converted to
JavaScript using the `xml-js` library. The `Result` property represents the result of a single tree
benefit calculation, which includes any error that occurred during the calculation, the output
information of the calculation (such as the benefits and carbon-related benefits of the tree), and
the input information for the calculation (such as the location and physical characteristics of the
tree). The `export` keyword makes this interface available for use in other modules. */
export interface RootObject {
    Result: Result
}
