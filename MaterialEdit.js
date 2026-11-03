
// =====================================================
// 1. INPUT ARRAYS - UPDATE THESE THREE ARRAYS
// =====================================================

const materials = [
    "MATERIAL_1",
    "MATERIAL_2"
];

const paramCodes = [
    "FE",
    "SI",
    "AL"
];

const paramNames = [
    "Iron",
    "Silicon",
    "Aluminium"
];


// =====================================================
// 2. FIXED PARAMETER VALUES
// =====================================================

const MIN_VALUE = 0;
const MAX_VALUE = 10;
const TARGET_VALUE = 5;
const UNIT = "%";


// =====================================================
// 3. RESULT ARRAYS
// =====================================================

const completedMaterials = [];
const notFoundMaterials = [];
const failedMaterials = [];


// =====================================================
// 4. CONFIGURATION
// =====================================================

const sleep = ms =>
    new Promise(resolve => setTimeout(resolve, ms));


// =====================================================
// 5. HELPER FUNCTIONS
// =====================================================

function getVisibleInput(placeholder) {

    return [...document.querySelectorAll("input")]
        .find(input =>
            input.placeholder === placeholder &&
            input.offsetParent !== null
        );
}


function getVisibleButton(text) {

    return [...document.querySelectorAll("button")]
        .find(button =>
            button.innerText.trim() === text &&
            button.offsetParent !== null
        );
}


function setValue(input, value) {

    const setter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value"
    ).set;

    setter.call(input, String(value));

    input.dispatchEvent(
        new Event("input", { bubbles: true })
    );

    input.dispatchEvent(
        new Event("change", { bubbles: true })
    );
}


async function waitForElement(callback, timeout = 10000) {

    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {

        const element = callback();

        if (element) {
            return element;
        }

        await sleep(300);
    }

    throw new Error("Element not found. Timeout reached.");
}


// =====================================================
// 6. FIND SVG BUTTONS
// =====================================================

function findSvgButton(pathStart) {

    const svg = [...document.querySelectorAll("svg")]
        .find(svg =>
            [...svg.querySelectorAll("path")]
                .some(path =>
                    path.getAttribute("d")
                        ?.startsWith(pathStart)
                )
        );

    return svg?.closest("button") || null;
}


// =====================================================
// 7. ADD PARAMETERS
// =====================================================

async function addParameters() {

    for (let i = 0; i < paramCodes.length; i++) {

        console.log(
            `Adding parameter ${i + 1}/${paramCodes.length}:`,
            paramCodes[i]
        );


        // Open Add Parameter form

        const addParameterButton = await waitForElement(() =>
            getVisibleButton("Add Parameter")
        );

        addParameterButton.click();

        await sleep(500);


        // Fill parameter code

        const codeInput = await waitForElement(() =>
            getVisibleInput("e.g., FE")
        );

        setValue(codeInput, paramCodes[i]);


        // Fill parameter name

        const nameInput = await waitForElement(() =>
            getVisibleInput("e.g., Iron")
        );

        setValue(nameInput, paramNames[i]);


        // Fill fixed parameter values

        const fields = [
            ["e.g., 0.5", MIN_VALUE],
            ["e.g., 2.0", MAX_VALUE],
            ["e.g., 1.25", TARGET_VALUE],
            ["e.g., %", UNIT]
        ];

        for (const [placeholder, value] of fields) {

            const input = await waitForElement(() =>
                getVisibleInput(placeholder)
            );

            setValue(input, value);
        }


        await sleep(300);


        // Submit parameter

        const submitButton = await waitForElement(() =>
            [...document.querySelectorAll(
                'button[type="submit"]'
            )].find(button =>
                button.innerText.trim() === "Add Parameter" &&
                button.offsetParent !== null
            )
        );

        submitButton.click();

        await sleep(800);

        console.log(
            "Parameter added:",
            paramCodes[i],
            paramNames[i]
        );
    }
}


// =====================================================
// 8. PROCESS EACH MATERIAL
// =====================================================

async function processMaterial(material) {

    console.log("\n================================");
    console.log("Processing material:", material);
    console.log("================================");


    // STEP 1: Search material

    const searchInput = await waitForElement(() =>
        getVisibleInput("Code, name, or category...")
    );

    setValue(searchInput, "");

    await sleep(300);

    setValue(searchInput, material);

    await sleep(1500);


    // STEP 2: Check search result

    const materialArrow = findSvgButton(
        "m8.25 4.5"
    );

    if (!materialArrow || materialArrow.offsetParent === null) {

        console.warn(
            "Material not found. Skipping:",
            material
        );

        notFoundMaterials.push(material);

        return;
    }


    // STEP 3: Open material

    materialArrow.click();

    await sleep(1000);


    // STEP 4: Open parameter form

    const eyeButton = await waitForElement(() =>
        findSvgButton("M2.036 12.322")
    );

    eyeButton.click();

    await sleep(1000);


    // STEP 5: Delete existing parameters

    console.log("Deleting existing parameters...");

    const deleteIcons = [
        ...document.querySelectorAll("svg")
    ].filter(svg =>
        [...svg.querySelectorAll("path")].some(path =>
            path.getAttribute("d")
                ?.startsWith("m14.74 9")
        )
    );

    for (const svg of deleteIcons) {

        const deleteButton = svg.closest("button");

        if (
            deleteButton &&
            deleteButton.offsetParent !== null
        ) {

            deleteButton.click();

            await sleep(400);
        }
    }

    await sleep(700);


    // STEP 6: Add new parameters

    await addParameters();


    // STEP 7: Click Done

    const doneButton = await waitForElement(() =>
        getVisibleButton("Done")
    );

    doneButton.click();

    await sleep(1500);


    // STEP 8: Mark material completed

    completedMaterials.push(material);

    console.log(
        "Material successfully completed:",
        material
    );
}


// =====================================================
// 9. MAIN AUTOMATION
// =====================================================

async function runAutomation() {

    // Validate input arrays

    if (paramCodes.length !== paramNames.length) {

        console.error(
            "ERROR: Parameter codes and parameter names must have equal lengths."
        );

        return;
    }

    if (materials.length === 0) {

        console.error("No materials provided.");

        return;
    }


    console.log("Starting material automation...");
    console.log("Total materials:", materials.length);
    console.log("Total parameters per material:", paramCodes.length);


    // Process materials one by one

    for (const material of materials) {

        try {

            await processMaterial(material);

        } catch (error) {

            console.error(
                "Error processing material:",
                material,
                error
            );

            failedMaterials.push({
                material: material,
                error: error.message
            });

        }
    }


    // =================================================
    // 10. FINAL SUMMARY
    // =================================================

    console.log("\n");
    console.log("==========================================");
    console.log("         AUTOMATION SUMMARY");
    console.log("==========================================");

    console.log(
        "Total Materials:",
        materials.length
    );

    console.log(
        "Completed Materials:",
        completedMaterials.length,
        completedMaterials
    );

    console.log(
        "Materials Not Found:",
        notFoundMaterials.length,
        notFoundMaterials
    );

    console.log(
        "Failed Materials:",
        failedMaterials.length,
        failedMaterials
    );

    console.log("==========================================");

    // Easy-to-copy missing material list

    console.log(
        "MISSING MATERIALS ARRAY:",
        JSON.stringify(notFoundMaterials, null, 2)
    );
}


// =====================================================
// 11. START AUTOMATION
// =====================================================

runAutomation();
