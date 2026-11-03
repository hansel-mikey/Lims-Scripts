
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

const sleep = (ms) =>
    new Promise(resolve => setTimeout(resolve, ms));

function getButton(text) {
    return [...document.querySelectorAll("button")]
        .find(btn =>
            btn.innerText.trim() === text &&
            btn.offsetParent !== null
        );
}

function getInput(placeholder) {
    return [...document.querySelectorAll("input")]
        .find(input =>
            input.placeholder === placeholder &&
            input.offsetParent !== null
        );
}

function setValue(input, value) {
    const setter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value"
    ).set;

    setter.call(input, String(value));

    input.dispatchEvent(new Event("input", {
        bubbles: true
    }));

    input.dispatchEvent(new Event("change", {
        bubbles: true
    }));
}

async function waitForElement(callback, timeout = 10000) {
    const start = Date.now();

    while (Date.now() - start < timeout) {
        const element = callback();

        if (element) return element;

        await sleep(300);
    }

    throw new Error("Element not found or page timed out");
}

async function addParameters() {
    if (paramCodes.length !== paramNames.length) {
        throw new Error("Parameter codes and names must have equal lengths");
    }

    for (let i = 0; i < paramCodes.length; i++) {

        // Open Add Parameter form
        const addBtn = await waitForElement(() =>
            getButton("Add Parameter")
        );

        addBtn.click();
        await sleep(500);

        // Fill parameter code
        const codeInput = await waitForElement(() =>
            getInput("e.g., FE")
        );

        setValue(codeInput, paramCodes[i]);

        // Fill parameter name
        const nameInput = await waitForElement(() =>
            getInput("e.g., Iron")
        );

        setValue(nameInput, paramNames[i]);

        // Fill min, max, target and unit
        const inputs = [
            ["e.g., 0.5", 0],
            ["e.g., 2.0", 10],
            ["e.g., 1.25", 5],
            ["e.g., %", "%"]
        ];

        for (const [placeholder, value] of inputs) {
            const input = await waitForElement(() =>
                getInput(placeholder)
            );

            setValue(input, value);
        }

        await sleep(300);

        // Submit parameter form
        const submitBtn = [...document.querySelectorAll(
            'button[type="submit"]'
        )].find(btn =>
            btn.innerText.trim() === "Add Parameter" &&
            btn.offsetParent !== null
        );

        if (!submitBtn) {
            throw new Error("Parameter submit button not found");
        }

        submitBtn.click();

        await sleep(800);

        console.log(
            `Added: ${paramCodes[i]} - ${paramNames[i]}`
        );
    }
}

async function runAutomation() {

    for (const material of materials) {

        console.log("Processing material:", material);

        // STEP 1: Search material
        const searchInput = await waitForElement(() =>
            getInput("Code, name, or category...")
        );

        setValue(searchInput, material);

        await sleep(1500);

        // STEP 2: Open material using arrow
        const arrow = await waitForElement(() =>
            [...document.querySelectorAll("svg")]
                .find(svg =>
                    svg.getAttribute("viewBox") === "0 0 24 24" &&
                    svg.querySelector(
                        'path[d^="m8.25 4.5"]'
                    ) &&
                    svg.closest("button")
                )?.closest("button")
        );

        arrow.click();
        await sleep(1000);

        // STEP 3: Open parameter form using eye icon
        const eyeButton = await waitForElement(() =>
            [...document.querySelectorAll("svg")]
                .find(svg =>
                    svg.querySelector(
                        'path[d^="M2.036 12.322"]'
                    ) &&
                    svg.closest("button")
                )?.closest("button")
        );

        eyeButton.click();
        await sleep(1000);

        // STEP 4: Delete existing parameters
        // NOTE: This section requires the delete button's
        // parent structure to identify each parameter row.

        const deleteIcons = [
            ...document.querySelectorAll("svg")
        ].filter(svg =>
            [...svg.querySelectorAll("path")].some(path =>
                path.getAttribute("d")?.startsWith("m14.74 9")
            )
        );

        for (const svg of deleteIcons) {
            const button = svg.closest("button");

            if (button && button.offsetParent !== null) {
                button.click();
                await sleep(400);
            }
        }

        await sleep(700);

        // STEP 5-12: Add new parameters
        await addParameters();

        // STEP 13: Done
        const doneBtn = await waitForElement(() =>
            getButton("Done")
        );

        doneBtn.click();

        await sleep(1500);

        console.log("Completed material:", material);
    }

    console.log("ALL MATERIALS PROCESSED");
}

runAutomation().catch(error => {
    console.error("Automation stopped:", error);
});
