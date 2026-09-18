(async () => {

  // ============================================================
  // CONFIGURATION
  // ============================================================

const MATERIALS = [
  "CO_MA02-C009_16_025X1490_3000",
  "CO_MA02CU_16.01_030X1490_3000",
  "CO_MA02CUFN-M_16_025X1100_3000",
  "CO_MA02FN-M_16_025X1100_3000",
  "CO_MA02-M_16_025X1000_1299",
  "CO_MA02-M_16_025X1300_3000",
  "CO_MA02M-B_16_025X1100_3000",
  "CO_MA02M-LSI3_16_025X1300_3500",
  "CO_MA02M-LSI4_16_025X1100_3000",
  "CO_MA02-MW_16_025X1100_3000",
  "CO_MA02NB-M_16_025X1490_3000",
  "CO_MA02S_16_025X1490_3000",
  "CO_MA02V-M_16_025X1490_3000",
  "CO_MA03_10_025X1490_3000",
  "CO_MA03_4.75_010X1490_3000",
  "CO_MA03CU_10_025X1490_3000",
  "CO_MA03CU_4.75_010X1490_3000",
  "CO_MA03CU-L_10_025X1300_3000",
  "CO_MA03CU-L_4.75_010X1300_3000",
  "CO_MA03FN-L_10_016X1100_3000",
  "CO_MA03FN-L_4.75_010X1100_3000",
  "CO_MA03FN-M_16_025X1100_3000",
  "CO_MA03-L_10_016X1100_1489",
  "CO_MA03-L_10_025X1490_3000",
  "CO_MA03-L_4.75_010X1100_1489",
  "CO_MA03-L_4.75_010X1490_3000",
  "CO_MA03L-B_10_016X1100_3000",
  "CO_MA03L-B_4.75_010X1100_3000",
  "CO_MA03-M_16_025X1490_3000",
  "CO_MA03M-B_16_025X1100_3000",
  "CO_MA04_10_025X1490_3000",
  "CO_MA04_4.75_010X1490_3000",
  "CO_MA04CU_10.01_025X1490_3000",
  "CO_MA04CU_4.75_010X1490_3000",
  "CO_MA04CU-L_10_025X1250_3000",
  "CO_MA04CU-L_4.75_010X1250_3000",
  "CO_MA04-L_10_025X1250_3000",
  "CO_MA04-L_10_025X1490_3000",
  "CO_MA04-L_4.75_010X1250_3000",
  "CO_MA04-L_4.75_010X1490_3000",
  "CO_MA04L-B_10_016X1100_3000",
  "CO_MA04L-B_4.75_010X1100_3000",
  "CO_MA04-LSI4_10_016X1100_3000",
  "CO_MA04-LSI4_4.75_010X1100_3000",
  "CO_MA04-M_16_025X1490_3000",
  "CO_MA04M-B_16_025X1100_3000",
  "CO_MA04M-LSI4_16_025X1100_3000",
  "CO_MA05_10_025X1490_3000",
  "CO_MA05_4.75_010X1490_3000",
  "CO_MA06_4.75_010X1490_3000",
  "CO_MA07-L_10_016X1490_3000",
  "CO_MA07-L_4.75_010X1490_3000",
  "CO_MA07-M_16_025X1490_3000",
  "CO_MA08-L_10_016X1100_1489",
  "CO_MA08-L_10_016X1490_3000",
  "CO_MA08-L_4.75_010X1100_1489"
];
  const PRODUCT_CATEGORY = "PRODUCT";

  const LOCATION_SEARCH = "1307";
  const LOCATION_NAME = "1307 – Plate Mill";

  const GRADE_STATUS = "APPROVED";


  // ============================================================
  // HELPERS
  // ============================================================

  const sleep = ms =>
    new Promise(resolve => setTimeout(resolve, ms));


  function normalizeText(text) {
    return (text || "")
      .replace(/\s+/g, " ")
      .trim();
  }


  function isVisible(el) {

    if (!el) return false;

    const style = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();

    return (
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      style.opacity !== "0" &&
      rect.width > 0 &&
      rect.height > 0
    );
  }


  function visible(selector) {
    return [...document.querySelectorAll(selector)]
      .filter(isVisible);
  }


  async function waitFor(
    condition,
    timeout = 15000,
    interval = 250
  ) {

    const start = Date.now();

    while (Date.now() - start < timeout) {

      try {

        const result = condition();

        if (result) {
          return result;
        }

      } catch (e) {}

      await sleep(interval);
    }

    return null;
  }


  // ============================================================
  // INPUT VALUE SETTER
  // ============================================================

  function setInputValue(input, value) {

    if (!input) {
      throw new Error("Input not found");
    }

    const setter =
      Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value"
      )?.set;

    if (setter) {
      setter.call(input, value);
    } else {
      input.value = value;
    }

    input.dispatchEvent(
      new Event("input", {
        bubbles: true
      })
    );

    input.dispatchEvent(
      new Event("change", {
        bubbles: true
      })
    );

    input.dispatchEvent(
      new Event("blur", {
        bubbles: true
      })
    );
  }


  // ============================================================
  // NORMAL CLICK
  // ============================================================

  async function clickElement(
    element,
    description
  ) {

    if (!element) {
      throw new Error(
        `${description} not found`
      );
    }

    if (!isVisible(element)) {
      throw new Error(
        `${description} is not visible`
      );
    }

    element.scrollIntoView({
      behavior: "instant",
      block: "center"
    });

    await sleep(300);

    element.focus();

    await sleep(100);

    element.click();

    console.log(
      `🖱️ CLICKED: ${description}`
    );

    await sleep(600);
  }


  // ============================================================
  // MOUSE CLICK
  // ============================================================

  async function mouseClick(
    element,
    description
  ) {

    if (!element) {
      throw new Error(
        `${description} not found`
      );
    }

    if (!isVisible(element)) {
      throw new Error(
        `${description} is not visible`
      );
    }

    element.scrollIntoView({
      behavior: "instant",
      block: "center"
    });

    await sleep(300);

    const rect =
      element.getBoundingClientRect();

    const x =
      rect.left + rect.width / 2;

    const y =
      rect.top + rect.height / 2;


    console.log(
      `🖱️ Clicking ${description} at ${x}, ${y}`
    );


    const events = [
      "pointerdown",
      "mousedown",
      "pointerup",
      "mouseup",
      "click"
    ];


    for (const eventName of events) {

      const EventClass =
        eventName.startsWith("pointer")
          ? PointerEvent
          : MouseEvent;

      element.dispatchEvent(
        new EventClass(
          eventName,
          {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: x,
            clientY: y,
            button: 0
          }
        )
      );

      await sleep(80);
    }


    console.log(
      `✅ CLICK EVENTS SENT: ${description}`
    );

    await sleep(800);
  }


  // ============================================================
  // EXACT BUTTON
  // ============================================================

  function findButton(text) {

    return [...document.querySelectorAll("button")]
      .filter(isVisible)
      .find(button =>
        normalizeText(button.textContent) === text &&
        !button.disabled
      );
  }


  // ============================================================
  // ADD MATERIAL BUTTON
  // ============================================================

  function findAddMaterialButton() {
    return findButton("Add Material");
  }


  // ============================================================
  // NEXT BUTTON
  //
  // There can be more than one Next button.
  // We intentionally select the LAST visible enabled Next.
  // ============================================================

  function findNextButton() {

    const nextButtons =
      [...document.querySelectorAll("button")]
        .filter(button => {

          if (!isVisible(button)) return false;

          if (button.disabled) return false;

          const span =
            button.querySelector("span");

          if (!span) return false;

          const spanText =
            normalizeText(span.textContent);

          const buttonText =
            normalizeText(button.textContent);

          return (
            spanText === "Next" &&
            buttonText === "Next"
          );
        });


    console.log(
      "🔎 NEXT BUTTONS FOUND:",
      nextButtons.length
    );


    nextButtons.forEach(
      (button, index) => {

        console.log(
          `NEXT ${index + 1}:`,
          button.outerHTML
        );

      }
    );


    /*
     * The user confirmed that the required button
     * is the lower/second Next button.
     */
    return (
      nextButtons[nextButtons.length - 1] ||
      null
    );
  }


  // ============================================================
  // CATEGORY BUTTON
  // ============================================================

  function findCategoryButton() {

    const buttons =
      [...document.querySelectorAll("button")]
        .filter(isVisible);


    // Main selector based on visible placeholder
    const selectCategories =
      buttons.find(button =>
        normalizeText(button.textContent)
          .includes("Select categories")
      );


    if (selectCategories) {
      return selectCategories;
    }


    // Fallback
    const ariaButton =
      buttons.find(button =>
        button.getAttribute("aria-label") ===
        "Categories"
      );


    return ariaButton || null;
  }


  // ============================================================
  // SELECT PRODUCT
  //
  // We only search for PRODUCT in the area below
  // the Categories field.
  // ============================================================

  async function selectProductCategory() {

    console.log(
      "🔎 LOCATING PRODUCT IN CATEGORY DROPDOWN..."
    );


    const categoryButton =
      findCategoryButton();


    if (!categoryButton) {
      throw new Error(
        "Categories button not found"
      );
    }


    const categoryRect =
      categoryButton.getBoundingClientRect();


    console.log(
      "CATEGORY BUTTON:",
      categoryButton.outerHTML
    );


    console.log(
      "CATEGORY RECT:",
      categoryRect
    );


    // Find exact PRODUCT elements
    const candidates =
      [...document.querySelectorAll("*")]
        .filter(isVisible)
        .filter(el =>
          normalizeText(el.textContent) ===
          PRODUCT_CATEGORY
        );


    console.log(
      "EXACT PRODUCT CANDIDATES:",
      candidates.length
    );


    /*
     * Restrict candidates to the dropdown directly
     * underneath the Categories field.
     */
    const categoryCandidates =
      candidates.filter(el => {

        const rect =
          el.getBoundingClientRect();

        return (
          rect.top >=
            categoryRect.bottom - 5 &&

          rect.left >=
            categoryRect.left - 20 &&

          rect.right <=
            categoryRect.right + 20
        );

      });


    console.log(
      "PRODUCT CANDIDATES IN CATEGORY DROPDOWN:",
      categoryCandidates.length
    );


    categoryCandidates.forEach(
      (el, index) => {

        console.log(
          `PRODUCT CANDIDATE ${index + 1}:`,
          el.outerHTML
        );

      }
    );


    if (!categoryCandidates.length) {

      throw new Error(
        "PRODUCT was not found inside the Categories dropdown"
      );

    }


    /*
     * Select the smallest exact PRODUCT element.
     */
    const productElement =
      categoryCandidates.sort(
        (a, b) => {

          const ra =
            a.getBoundingClientRect();

          const rb =
            b.getBoundingClientRect();

          return (
            ra.width * ra.height -
            rb.width * rb.height
          );

        }
      )[0];


    console.log(
      "🎯 PRODUCT ELEMENT:",
      productElement.outerHTML
    );


    await mouseClick(
      productElement,
      "PRODUCT category"
    );


    await sleep(1000);


    // ========================================================
    // VERIFY PRODUCT
    // ========================================================

    console.log(
      "🔍 VERIFYING PRODUCT SELECTION..."
    );


    const verified =
      await waitFor(
        () => {

          const button =
            findCategoryButton();

          if (!button) {
            return false;
          }


          const text =
            normalizeText(
              button.textContent
            );


          console.log(
            "CATEGORY FIELD NOW:",
            text
          );


          return (
            text.includes("PRODUCT") &&
            !text.includes(
              "Select categories"
            )
          );

        },
        5000,
        250
      );


    if (!verified) {

      console.error(
        "❌ PRODUCT WAS NOT SELECTED"
      );

      throw new Error(
        "PRODUCT selection failed. Automation stopped."
      );
    }


    console.log(
      "✅ PRODUCT SUCCESSFULLY SELECTED"
    );


    await sleep(800);
  }


  // ============================================================
  // LOCATION BUTTON
  // ============================================================

  function findLocationButton() {

    const buttons =
      [...document.querySelectorAll("button")]
        .filter(isVisible);


    const selectLocations =
      buttons.find(button =>
        normalizeText(button.textContent)
          .includes("Select locations")
      );


    if (selectLocations) {
      return selectLocations;
    }


    const ariaButton =
      buttons.find(button =>
        button.getAttribute("aria-label") ===
        "Associated locations"
      );


    return ariaButton || null;
  }


  // ============================================================
  // SELECT LOCATION
  // ============================================================

  async function selectLocation() {

    console.log(
      `🔎 SEARCHING LOCATION: ${LOCATION_SEARCH}`
    );


    const locationSearch =
      await waitFor(
        () =>
          [...document.querySelectorAll(
            'input[placeholder="Search locations..."]'
          )]
            .filter(isVisible)[0],
        15000,
        250
      );


    if (!locationSearch) {

      throw new Error(
        "Location search input not found"
      );

    }


    setInputValue(
      locationSearch,
      LOCATION_SEARCH
    );


    await sleep(1000);


    console.log(
      `🔎 FINDING: ${LOCATION_NAME}`
    );


    const searchRect =
      locationSearch.getBoundingClientRect();


    const candidates =
      [...document.querySelectorAll("*")]
        .filter(isVisible)
        .filter(el =>
          normalizeText(el.textContent) ===
          LOCATION_NAME
        );


    const locationCandidates =
      candidates.filter(el => {

        const rect =
          el.getBoundingClientRect();

        return (
          rect.top >=
            searchRect.bottom - 10 &&

          rect.left >=
            searchRect.left - 20 &&

          rect.right <=
            searchRect.right + 20
        );

      });


    console.log(
      "LOCATION CANDIDATES:",
      locationCandidates.length
    );


    if (!locationCandidates.length) {

      throw new Error(
        `${LOCATION_NAME} not found`
      );

    }


    const locationElement =
      locationCandidates.sort(
        (a, b) => {

          const ra =
            a.getBoundingClientRect();

          const rb =
            b.getBoundingClientRect();

          return (
            ra.width * ra.height -
            rb.width * rb.height
          );

        }
      )[0];


    console.log(
      "🎯 LOCATION ELEMENT:",
      locationElement.outerHTML
    );


    await mouseClick(
      locationElement,
      LOCATION_NAME
    );


    await sleep(1000);


    console.log(
      "✅ LOCATION SELECTED"
    );
  }


  // ============================================================
  // EXPAND MATERIAL
  // ============================================================

  function findExpandButton(materialName) {

    const elements =
      [...document.querySelectorAll(
        "span, div, td, p"
      )]
        .filter(isVisible);


    const materialElement =
      elements.find(el =>
        normalizeText(el.textContent) ===
        materialName
      );


    if (!materialElement) {
      return null;
    }


    let current =
      materialElement;


    /*
     * Walk up through the material row/card
     * until we find its Expand button.
     */
    for (
      let i = 0;
      i < 10 && current;
      i++
    ) {

      const expand =
        current.querySelector(
          'button[aria-label="Expand"]'
        );


      if (
        expand &&
        isVisible(expand)
      ) {

        return expand;

      }


      current =
        current.parentElement;
    }


    return null;
  }


  // ============================================================
  // ADD GRADE BUTTON
  // ============================================================

  function findAddGradeButton() {

    return [...document.querySelectorAll("button")]
      .filter(isVisible)
      .find(button =>
        normalizeText(button.textContent) ===
        "Add Grade" &&
        !button.disabled
      );
  }


  // ============================================================
  // APPROVAL STATUS DROPDOWN
  // ============================================================

  function findApprovalStatusButton() {

    return [...document.querySelectorAll(
      'button[aria-haspopup="listbox"]'
    )]
      .filter(isVisible)
      .find(button =>
        normalizeText(button.textContent) ===
        "DRAFT"
      );
  }


  // ============================================================
  // APPROVED OPTION
  // ============================================================

  function findApprovedOption() {

    return [...document.querySelectorAll(
      '[role="option"]'
    )]
      .filter(isVisible)
      .find(option =>
        normalizeText(option.textContent) ===
        GRADE_STATUS
      );
  }


  // ============================================================
  // SAVE AND CONTINUE
  // ============================================================

  function findSaveButton() {

    return [...document.querySelectorAll(
      'button[type="submit"]'
    )]
      .filter(isVisible)
      .find(button =>
        normalizeText(button.textContent) ===
        "Save and continue" &&
        !button.disabled
      );
  }


  // ============================================================
  // DONE
  // ============================================================

  function findDoneButton() {
    return findButton("Done");
  }


  // ============================================================
  // START
  // ============================================================

  console.clear();

  console.log(
    "========================================"
  );

  console.log(
    " MATERIAL + GRADE AUTOMATION"
  );

  console.log(
    "========================================"
  );


  const SUCCESS = [];
  const FAILED = [];


  // ============================================================
  // MATERIAL LOOP
  // ============================================================

  for (
    let i = 0;
    i < MATERIALS.length;
    i++
  ) {

    const MATERIAL =
      MATERIALS[i];


    console.log("");
    console.log(
      "========================================"
    );

    console.log(
      `📦 ${i + 1}/${MATERIALS.length}: ${MATERIAL}`
    );

    console.log(
      "========================================"
    );


    try {

      // ========================================================
      // 1. ADD MATERIAL
      // ========================================================

      console.log(
        "1️⃣ ADD MATERIAL"
      );


      const addMaterial =
        await waitFor(
          () => findAddMaterialButton(),
          15000,
          300
        );


      if (!addMaterial) {
        throw new Error(
          "Add Material button not found"
        );
      }


      await clickElement(
        addMaterial,
        "Add Material"
      );


      await sleep(700);


      // ========================================================
      // 2. MATERIAL CODE
      // ========================================================

      console.log(
        "2️⃣ MATERIAL CODE"
      );


      const codeInput =
        await waitFor(
          () =>
            [...document.querySelectorAll(
              'input[name="code"]'
            )]
              .filter(isVisible)[0],
          15000,
          300
        );


      if (!codeInput) {
        throw new Error(
          "Material Code input not found"
        );
      }


      setInputValue(
        codeInput,
        MATERIAL
      );


      // ========================================================
      // 3. MATERIAL NAME
      // ========================================================

      console.log(
        "3️⃣ MATERIAL NAME"
      );


      const nameInput =
        await waitFor(
          () =>
            [...document.querySelectorAll(
              'input[name="name"]'
            )]
              .filter(isVisible)[0],
          15000,
          300
        );


      if (!nameInput) {
        throw new Error(
          "Material Name input not found"
        );
      }


      setInputValue(
        nameInput,
        MATERIAL
      );


      await sleep(700);


      // ========================================================
      // 4. LOWER NEXT
      // ========================================================

      console.log(
        "4️⃣ CLICKING LOWER NEXT"
      );


      const nextButton =
        await waitFor(
          () => findNextButton(),
          15000,
          300
        );


      if (!nextButton) {
        throw new Error(
          "Lower Next button not found"
        );
      }


      await clickElement(
        nextButton,
        "LOWER Next"
      );


      await sleep(800);


      // ========================================================
      // 5. CATEGORIES
      // ========================================================

      console.log(
        "5️⃣ OPENING CATEGORIES"
      );


      const categoryButton =
        await waitFor(
          () => findCategoryButton(),
          15000,
          300
        );


      if (!categoryButton) {
        throw new Error(
          "Categories button not found"
        );
      }


      await clickElement(
        categoryButton,
        "Categories"
      );


      await sleep(600);


      // ========================================================
      // 6. PRODUCT
      // ========================================================

      console.log(
        "6️⃣ SELECTING PRODUCT"
      );


      await selectProductCategory();


      // ========================================================
      // 7. ASSOCIATED LOCATIONS
      // ========================================================

      console.log(
        "7️⃣ OPENING ASSOCIATED LOCATIONS"
      );


      const locationButton =
        await waitFor(
          () => findLocationButton(),
          15000,
          300
        );


      if (!locationButton) {
        throw new Error(
          "Associated locations button not found"
        );
      }


      await clickElement(
        locationButton,
        "Associated locations"
      );


      await sleep(600);


      // ========================================================
      // 8. SELECT LOCATION
      // ========================================================

      console.log(
        "8️⃣ SELECTING LOCATION"
      );


      await selectLocation();


      // ========================================================
      // 9. CREATE
      // ========================================================

      console.log(
        "9️⃣ CREATE MATERIAL"
      );


      const createButton =
        await waitFor(
          () => findButton("Create"),
          15000,
          300
        );


      if (!createButton) {
        throw new Error(
          "Create button not found"
        );
      }


      await clickElement(
        createButton,
        "Create"
      );


      console.log(
        `✅ MATERIAL CREATED: ${MATERIAL}`
      );


      // ========================================================
      // WAIT 2 SECONDS
      // ========================================================

      console.log(
        "⏳ WAITING 2 SECONDS..."
      );


      await sleep(2000);


      // ========================================================
      // 10. SEARCH MATERIAL
      // ========================================================

      console.log(
        `🔟 SEARCHING MATERIAL: ${MATERIAL}`
      );


      const materialSearch =
        await waitFor(
          () =>
            [...document.querySelectorAll(
              'input[placeholder="Code, name, or category..."]'
            )]
              .filter(isVisible)[0],
          15000,
          300
        );


      if (!materialSearch) {
        throw new Error(
          "Material search box not found"
        );
      }


      setInputValue(
        materialSearch,
        MATERIAL
      );


      await sleep(1200);


      // ========================================================
      // 11. EXPAND MATERIAL
      // ========================================================

      console.log(
        "1️⃣1️⃣ EXPANDING MATERIAL"
      );


      const expandButton =
        await waitFor(
          () =>
            findExpandButton(MATERIAL),
          15000,
          300
        );


      if (!expandButton) {
        throw new Error(
          `Expand button for ${MATERIAL} not found`
        );
      }


      await clickElement(
        expandButton,
        `Expand ${MATERIAL}`
      );


      await sleep(800);


      // ========================================================
      // 12. ADD GRADE
      // ========================================================

      console.log(
        "1️⃣2️⃣ ADDING GRADE"
      );


      const addGrade =
        await waitFor(
          () => findAddGradeButton(),
          15000,
          300
        );


      if (!addGrade) {
        throw new Error(
          "Add Grade button not found"
        );
      }


      await clickElement(
        addGrade,
        "Add Grade"
      );


      await sleep(800);


      // ========================================================
      // 13. GRADE CODE
      // ========================================================

      console.log(
        "1️⃣3️⃣ GRADE CODE"
      );


      const gradeCode =
        await waitFor(
          () =>
            [...document.querySelectorAll(
              'input[name="code"]'
            )]
              .filter(isVisible)[0],
          15000,
          300
        );


      if (!gradeCode) {
        throw new Error(
          "Grade Code input not found"
        );
      }


      setInputValue(
        gradeCode,
        MATERIAL
      );


      // ========================================================
      // 14. GRADE NAME
      // ========================================================

      console.log(
        "1️⃣4️⃣ GRADE NAME"
      );


      const gradeName =
        await waitFor(
          () =>
            [...document.querySelectorAll(
              'input[name="name"]'
            )]
              .filter(isVisible)[0],
          15000,
          300
        );


      if (!gradeName) {
        throw new Error(
          "Grade Name input not found"
        );
      }


      setInputValue(
        gradeName,
        MATERIAL
      );


      await sleep(500);


      // ========================================================
      // 15. OPEN APPROVAL STATUS
      // ========================================================

      console.log(
        "1️⃣5️⃣ OPENING APPROVAL STATUS"
      );


      const statusSelect =
        await waitFor(
          () =>
            findApprovalStatusButton(),
          15000,
          300
        );


      if (!statusSelect) {
        throw new Error(
          "Approval Status dropdown not found"
        );
      }


      console.log(
        "APPROVAL STATUS BUTTON:",
        statusSelect.outerHTML
      );


      await clickElement(
        statusSelect,
        "Approval Status"
      );


      await sleep(700);


      // ========================================================
      // 16. SEARCH APPROVED
      // ========================================================

      console.log(
        "1️⃣6️⃣ SEARCHING APPROVED"
      );


      const optionSearch =
        await waitFor(
          () =>
            [...document.querySelectorAll(
              'input[placeholder="Search options..."]'
            )]
              .filter(isVisible)[0],
          10000,
          250
        );


      if (!optionSearch) {
        throw new Error(
          "Search options input not found"
        );
      }


      setInputValue(
        optionSearch,
        GRADE_STATUS
      );


      await sleep(800);


      // ========================================================
      // 17. SELECT APPROVED
      // ========================================================

      console.log(
        "1️⃣7️⃣ SELECTING APPROVED"
      );


      const approvedOption =
        await waitFor(
          () =>
            findApprovedOption(),
          10000,
          250
        );


      if (!approvedOption) {
        throw new Error(
          "APPROVED option not found"
        );
      }


      console.log(
        "🎯 APPROVED OPTION:",
        approvedOption.outerHTML
      );


      await mouseClick(
        approvedOption,
        "APPROVED"
      );


      await sleep(1000);


      // ========================================================
      // 18. VERIFY APPROVED
      // ========================================================

      console.log(
        "1️⃣8️⃣ VERIFYING APPROVED"
      );


      const approvedVerified =
        await waitFor(
          () => {

            const buttons =
              [...document.querySelectorAll(
                'button[aria-haspopup="listbox"]'
              )]
                .filter(isVisible);


            const approvedButton =
              buttons.find(button =>
                normalizeText(
                  button.textContent
                ) === "APPROVED"
              );


            if (approvedButton) {

              console.log(
                "✅ APPROVAL STATUS = APPROVED"
              );

              return true;
            }


            return false;

          },
          5000,
          250
        );


      if (!approvedVerified) {

        console.error(
          "❌ APPROVED WAS NOT SELECTED"
        );

        throw new Error(
          "Approval Status did not change to APPROVED. Automation stopped."
        );
      }


      console.log(
        "✅ APPROVED VERIFIED"
      );


      await sleep(500);


      // ========================================================
      // 19. SAVE AND CONTINUE
      // ========================================================

      console.log(
        "1️⃣9️⃣ SAVE AND CONTINUE"
      );


      const saveButton =
        await waitFor(
          () => findSaveButton(),
          15000,
          300
        );


      if (!saveButton) {
        throw new Error(
          "Save and continue button not found"
        );
      }


      await clickElement(
        saveButton,
        "Save and continue"
      );


      await sleep(1200);


      // ========================================================
      // 20. DONE
      // ========================================================

      console.log(
        "2️⃣0️⃣ DONE"
      );


      const doneButton =
        await waitFor(
          () => findDoneButton(),
          15000,
          300
        );


      if (!doneButton) {
        throw new Error(
          "Done button not found"
        );
      }


      await clickElement(
        doneButton,
        "Done"
      );


      await sleep(1000);


      // ========================================================
      // SUCCESS
      // ========================================================

      console.log(
        `🎉 COMPLETED: ${MATERIAL}`
      );


      SUCCESS.push(MATERIAL);


      await sleep(500);

    }


    catch (error) {

      console.error("");
      console.error(
        "❌ FAILED:",
        MATERIAL
      );

      console.error(
        "❌ ERROR:",
        error.message
      );

      FAILED.push({
        material: MATERIAL,
        error: error.message
      });


      console.log(
        "⛔ AUTOMATION STOPPED"
      );

      break;
    }
  }


  // ============================================================
  // FINAL RESULT
  // ============================================================

  console.log("");
  console.log(
    "========================================"
  );

  console.log(
    "       AUTOMATION FINISHED"
  );

  console.log(
    "========================================"
  );

  console.log(
    "✅ SUCCESS:",
    SUCCESS
  );

  console.log(
    "❌ FAILED:",
    FAILED
  );

  console.log(
    "TOTAL:",
    MATERIALS.length
  );

  console.log(
    "COMPLETED:",
    SUCCESS.length
  );

  console.log(
    "FAILED:",
    FAILED.length
  );

})();
