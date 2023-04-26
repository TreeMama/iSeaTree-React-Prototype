/* This code is written in TypeScript and it is validating the structure of a JSON file containing
information about species. */

const testJson = require('../data/species.json');

/* The `interface Species` is defining the structure of an object that represents a species. It
includes optional properties such as `COMMON`, `TYPE`, `SCIENTIFIC`, `ID`, `ITREECODE`, `FULL_PIC`,
`GENUS`, and `DESCRIPTION`, each with a specific data type. This interface is used to ensure that
the JSON file containing information about species has the correct structure and properties. */

interface Species {
    "COMMON"?: string,
    "TYPE"?: string,
    "SCIENTIFIC"?: string,
    "ID"?: number,
    "ITREECODE"?: string,
    "FULL_PIC"?: string,
    "GENUS"?: string,
    "DESCRIPTION"?: string
}

/* This code is defining a test suite using the Jest testing framework to validate the structure of a
JSON file containing information about species. The `describe` function is used to group together
related tests, and the `test` function is used to define individual tests. */

describe("Validate Species JSON", () => {
    test('Existence of required attribute', () => {

        const speciesList: Species[] = testJson;

        let flag = true;
        for (let i = 0; i < speciesList.length; i++) {
            let str: string = "";
            // if (speciesList[i].COMMON !== undefined || speciesList[i].TYPE !== undefined || speciesList[i].SCIENTIFIC !== undefined || speciesList[i].ID !== undefined || speciesList[i].ITREECODE !== undefined || speciesList[i].LEVEL !== undefined) {
            //     console.log("The Common attribute and ID of the undefined species are " + speciesList[i].COMMON + " and " + speciesList[i].ID);
            //     flag = false;
            // }

            if (speciesList[i].TYPE === undefined || speciesList[i].TYPE === "Unknown" || speciesList[i].TYPE === "") {
                str = str + ("Type: ");
                flag = false;
            }
            if (speciesList[i].SCIENTIFIC === undefined || speciesList[i].SCIENTIFIC === "Unknown" || speciesList[i].SCIENTIFIC === "") {
                str = str + ("Scientific: ");
                flag = false;
            }

            if (speciesList[i].ITREECODE === undefined || speciesList[i].ITREECODE === "Unknown" || speciesList[i].ITREECODE === "") {
                str = str + ("ITreeCode: ");
                flag = false;
            }
            if (speciesList[i].FULL_PIC === undefined || speciesList[i].FULL_PIC === "Unknown" || speciesList[i].FULL_PIC === "") {
                str = str + ("Full Pic: ");
                flag = false;
            }
            if (speciesList[i].GENUS === undefined || speciesList[i].GENUS === "Unknown" || speciesList[i].GENUS === "") {
                str = str + ("Genus: ");
                flag = false;
            }
            if (speciesList[i].DESCRIPTION === undefined || speciesList[i].DESCRIPTION === "Unknown" || speciesList[i].DESCRIPTION === "") {
                str = str + ("Description: ");
                flag = false;
            }
            if (str.length > 0 || speciesList[i].ID === undefined || speciesList[i].COMMON === undefined) {
                str = "The ID and Common attribute of the tree are " + speciesList[i].COMMON + " and " + speciesList[i].ID + ". The unidentified/empty/unknown attributes of the tree are " + str;
                flag = false;
            }
        }
        if (flag === true) {
            console.log("Test Passed. All the species have the required attributes.")
        }
        console.log("Test Complete.");
    });
})