 (async () => {
 
  // ============================================================

  // CONFIGURATION

  // ============================================================
 
  const SOURCE_FORM =

    "WPB_E250JR_700X204.5_6-10";
 
  const DESTINATION_NAMES = [

    "CR_55C11_CR100_10-13",

    "CR_55C11_CR80_10-13",

    "HEA_E350BR_700X204.5_10-13",

    "HEA_S275JR_600X177.8_10-13",

    "HEA_S275JR_700X204.5_10-13"

  ];
 
 
  console.clear();
 
  console.log("==============================================");

  console.log("FORM AUTOMATION STARTED");

  console.log("==============================================");
 
 
  // ============================================================

  // HELPERS

  // ============================================================
 
  const sleep = ms =>

    new Promise(resolve => setTimeout(resolve, ms));
 
 
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
 
 
  function clickElement(element, description) {
 
    if (!element) {
 
      throw new Error(

        description + " not found."

      );
 
    }
 
 
    if (!isVisible(element)) {
 
      throw new Error(

        description + " is not visible."

      );
 
    }
 
 
    console.log(

      "CLICK:",

      description

    );
 
 
    element.scrollIntoView({

      behavior: "instant",

      block: "center"

    });
 
 
    element.click();

  }
 
 
  function setInputValue(input, value) {
 
    const descriptor =

      Object.getOwnPropertyDescriptor(

        HTMLInputElement.prototype,

        "value"

      );
 
 
    if (

      descriptor &&

      descriptor.set

    ) {
 
      descriptor.set.call(

        input,

        value

      );
 
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

  }
 
 
  // ============================================================

  // FIND FORM CONTAINER

  // ============================================================
 
  function findFormContainer(name) {
 
    const elements = visible("*");
 
 
    const matches =

      elements.filter(el => {
 
        const text =

          (el.textContent || "")

            .replace(/\s+/g, " ")

            .trim();
 
 
        return text === name;
 
      });
 
 
    if (!matches.length) {

      return null;

    }
 
 
    matches.sort((a, b) => {
 
      const ar =

        a.getBoundingClientRect();
 
      const br =

        b.getBoundingClientRect();
 
 
      return (

        ar.width * ar.height -

        br.width * br.height

      );
 
    });
 
 
    let current = matches[0];
 
 
    for (

      let i = 0;

      i < 10 && current;

      i++

    ) {
 
      if (

        current.querySelector("button")

      ) {
 
        return current;
 
      }
 
 
      current =

        current.parentElement;

    }
 
 
    return matches[0].parentElement;

  }
 
 
  // ============================================================

  // FIND COPY BUTTON

  // ============================================================
 
  function findCopyButton(container) {
 
    if (!container) {

      return null;

    }
 
 
    const paths =

      container.querySelectorAll(

        "svg path"

      );
 
 
    for (const path of paths) {
 
      const d =

        path.getAttribute("d") || "";
 
 
      if (

        d.includes(

          "M15.75 17.25"

        )

      ) {
 
        const button =

          path.closest("button");
 
 
        if (button) {

          return button;

        }
 
      }
 
    }
 
 
    return null;

  }
 
 
  // ============================================================

  // FIND EDIT BUTTON

  // ============================================================
 
  function findEditButton(container) {
 
    if (!container) {

      return null;

    }
 
 
    const paths =

      container.querySelectorAll(

        "svg path"

      );
 
 
    for (const path of paths) {
 
      const d =

        path.getAttribute("d") || "";
 
 
      if (

        d.includes(

          "m16.862 4.487"

        )

      ) {
 
        const button =

          path.closest("button");
 
 
        if (button) {

          return button;

        }
 
      }
 
    }
 
 
    return null;

  }
 
 
  // ============================================================

  // FIND BACK BUTTON

  // ============================================================
 
  function findBackButton() {
 
    /*

      Your Back SVG:
 
      M10.5 19.5 3 12

      m0 0 7.5-7.5

      M3 12h18

    */
 
    const paths =

      visible("svg path");
 
 
    for (const path of paths) {
 
      const d =

        path.getAttribute("d") || "";
 
 
      if (

        d.includes("M10.5 19.5") &&

        d.includes("M3 12h18")

      ) {
 
        const button =

          path.closest("button");
 
 
        if (button) {

          return button;

        }
 
      }
 
    }
 
 
    return null;

  }
 
 
  // ============================================================

  // PROCESS EACH DESTINATION

  // ============================================================
 
  for (

    let index = 0;

    index < DESTINATION_NAMES.length;

    index++

  ) {
 
    const NEW_NAME =

      DESTINATION_NAMES[index];
 
 
    const COPIED_NAME =

      SOURCE_FORM + " (Copy)";
 
 
    console.log("");

    console.log("");

    console.log(

      "##################################################"

    );
 
 
    console.log(

      "PROCESSING:",

      NEW_NAME

    );
 
 
    console.log(

      "ITEM:",

      index + 1,

      "OF",

      DESTINATION_NAMES.length

    );
 
 
    console.log(

      "##################################################"

    );
 
 
    try {
 
      // ========================================================

      // STEP 1 - SEARCH SOURCE FORM

      // ========================================================
 
      console.log(

        "STEP 1 - SEARCH SOURCE FORM"

      );
 
 
      const formSearch =

        document.querySelector(

          'input[placeholder="Name or description..."]'

        );
 
 
      if (!formSearch) {
 
        throw new Error(

          "Form search box not found."

        );
 
      }
 
 
      setInputValue(

        formSearch,

        SOURCE_FORM

      );
 
 
      await sleep(1000);
 
 
      const sourceForm =

        await waitFor(

          () =>

            findFormContainer(

              SOURCE_FORM

            ),

          10000

        );
 
 
      if (!sourceForm) {
 
        throw new Error(

          'Source form "' +

          SOURCE_FORM +

          '" not found.'

        );
 
      }
 
 
      console.log(

        "Source form found."

      );
 
 
      // ========================================================

      // STEP 2 - COPY

      // ========================================================
 
      console.log(

        "STEP 2 - COPY SOURCE FORM"

      );
 
 
      const copyButton =

        findCopyButton(

          sourceForm

        );
 
 
      if (!copyButton) {
 
        throw new Error(

          "Copy button not found."

        );
 
      }
 
 
      clickElement(

        copyButton,

        "Copy source form"

      );
 
 
      // ========================================================

      // STEP 3 - DETECT COPY

      // ========================================================
 
      console.log(

        "STEP 3 - DETECT COPIED FORM"

      );
 
 
      const copiedForm =

        await waitFor(

          () =>

            findFormContainer(

              COPIED_NAME

            ),

          15000

        );
 
 
      if (!copiedForm) {
 
        throw new Error(

          'Copied form "' +

          COPIED_NAME +

          '" not detected.'

        );
 
      }
 
 
      console.log(

        "Copied form detected."

      );
 
 
      // ========================================================

      // STEP 4 - EDIT

      // ========================================================
 
      console.log(

        "STEP 4 - EDIT COPIED FORM"

      );
 
 
      const editButton =

        findEditButton(

          copiedForm

        );
 
 
      if (!editButton) {
 
        throw new Error(

          "Edit button not found."

        );
 
      }
 
 
      clickElement(

        editButton,

        "Edit copied form"

      );
 
 
      // ========================================================

      // WAIT FOR EDIT PAGE

      // ========================================================
 
      const formNameInput =

        await waitFor(

          () =>

            document.querySelector(

              'input[placeholder="e.g., Chemical Analysis Form"]'

            ),

          10000

        );
 
 
      if (!formNameInput) {
 
        throw new Error(

          "Form name input not found."

        );
 
      }
 
 
      console.log(

        "Edit page opened."

      );
 
 
      // ========================================================

      // STEP 5 - RENAME

      // ========================================================
 
      console.log(

        "STEP 5 - RENAME FORM"

      );
 
 
      setInputValue(

        formNameInput,

        NEW_NAME

      );
 
 
      await sleep(500);
 
 
      if (

        formNameInput.value !== NEW_NAME

      ) {
 
        throw new Error(

          "Form rename failed."

        );
 
      }
 
 
      console.log(

        "Renamed to:",

        NEW_NAME

      );
 
 
      // ========================================================

      // STEP 6 - FIND MATERIALS

      // ========================================================
 
      console.log(

        "STEP 6 - FIND MATERIALS"

      );
 
 
      let materialsButton =

        await waitFor(

          () =>

            document.querySelector(

              'button[aria-label="Materials"]'

            ),

          5000

        );
 
 
      if (!materialsButton) {
 
        throw new Error(

          "Materials control not found."

        );
 
      }
 
 
      // ========================================================

      // STEP 7 - REMOVE OLD MATERIAL

      // ========================================================
 
      console.log(

        "STEP 7 - REMOVE OLD MATERIAL"

      );
 
 
      const removeControls =

        visible(

          'span[role="button"][aria-label^="Remove "]'

        );
 
 
      const removeOld =

        removeControls.find(el => {
 
          const label =

            el.getAttribute(

              "aria-label"

            ) || "";
 
 
          return label.includes(

            SOURCE_FORM

          );
 
        });
 
 
      if (!removeOld) {
 
        throw new Error(

          'Remove control for "' +

          SOURCE_FORM +

          '" not found.'

        );
 
      }
 
 
      clickElement(

        removeOld,

        "Remove old material"

      );
 
 
      await sleep(700);
 
 
      // ========================================================

      // STEP 8 - VERIFY OLD MATERIAL REMOVED

      // ========================================================
 
      console.log(

        "STEP 8 - VERIFY OLD MATERIAL REMOVED"

      );
 
 
      const oldStillPresent =

        visible(

          'span[role="button"][aria-label^="Remove "]'

        )

        .some(el => {
 
          const label =

            el.getAttribute(

              "aria-label"

            ) || "";
 
 
          return label.includes(

            SOURCE_FORM

          );
 
        });
 
 
      if (oldStillPresent) {
 
        throw new Error(

          "Old material still exists. SAVE CANCELLED."

        );
 
      }
 
 
      console.log(

        "Old material removed."

      );
 
 
      // ========================================================

      // STEP 9 - OPEN MATERIALS

      // ========================================================
 
      console.log(

        "STEP 9 - OPEN MATERIALS DROPDOWN"

      );
 
 
      materialsButton =

        document.querySelector(

          'button[aria-label="Materials"]'

        );
 
 
      clickElement(

        materialsButton,

        "Materials dropdown"

      );
 
 
      await sleep(500);
 
 
      // ========================================================

      // STEP 10 - MATERIAL SEARCH

      // ========================================================
 
      console.log(

        "STEP 10 - FIND MATERIAL SEARCH"

      );
 
 
      const materialSearch =

        await waitFor(

          () => {
 
            return visible("input")

              .find(input => {
 
                const placeholder =

                  input.getAttribute(

                    "placeholder"

                  ) || "";
 
 
                return placeholder.startsWith(

                  "Search materials by code or name"

                );
 
              });
 
          },

          5000

        );
 
 
      if (!materialSearch) {
 
        throw new Error(

          "Material search box not found."

        );
 
      }
 
 
      // ========================================================

      // STEP 11 - SEARCH MATERIAL

      // ========================================================
 
      console.log(

        "STEP 11 - SEARCH MATERIAL:",

        NEW_NAME

      );
 
 
      setInputValue(

        materialSearch,

        NEW_NAME

      );
 
 
      await sleep(1500);
 
 
      // ========================================================

      // STEP 12 - FIND RESULT

      // ========================================================
 
      console.log(

        "STEP 12 - FIND MATERIAL RESULT"

      );
 
 
      const materialResultButton =

        await waitFor(

          () => {
 
            const buttons =

              visible("button");
 
 
            return buttons.find(

              button => {
 
                const span =

                  button.querySelector(

                    "span"

                  );
 
 
                if (!span) {

                  return false;

                }
 
 
                const text =

                  (span.textContent || "")

                    .replace(/\s+/g, " ")

                    .trim();
 
 
                const expected =

                  NEW_NAME +

                  " - " +

                  NEW_NAME;
 
 
                return text === expected;
 
              }

            );
 
          },

          10000

        );
 
 
      if (!materialResultButton) {
 
        console.log(

          "Matching results:"

        );
 
 
        console.log(

          visible("button")

            .map(button =>

              (button.textContent || "")

                .replace(/\s+/g, " ")

                .trim()

            )

            .filter(text =>

              text.includes(NEW_NAME)

            )

        );
 
 
        throw new Error(

          'Material result "' +

          NEW_NAME +

          '" not found.'

        );
 
      }
 
 
      console.log(

        "Material result found."

      );
 
 
      // ========================================================

      // STEP 13 - CLICK RESULT

      // ========================================================
 
      console.log(

        "STEP 13 - CLICK MATERIAL RESULT"

      );
 
 
      materialResultButton.scrollIntoView({

        behavior: "instant",

        block: "center"

      });
 
 
      materialResultButton.click();
 
 
      await sleep(1000);
 
 
      console.log(

        "Material result clicked."

      );
 
 
      // ========================================================

      // STEP 14 - VERIFY NEW MATERIAL

      // ========================================================
 
      console.log(

        "STEP 14 - VERIFY NEW MATERIAL"

      );
 
 
      const newMaterialSelected =

        await waitFor(

          () => {
 
            const button =

              document.querySelector(

                'button[aria-label="Materials"]'

              );
 
 
            if (!button) {

              return false;

            }
 
 
            const text =

              (button.textContent || "")

                .replace(/\s+/g, " ")

                .trim();
 
 
            return text.includes(

              NEW_NAME

            );
 
          },

          5000

        );
 
 
      if (!newMaterialSelected) {
 
        throw new Error(

          'New material "' +

          NEW_NAME +

          '" was not selected. SAVE CANCELLED.'

        );
 
      }
 
 
      console.log(

        "New material selected."

      );
 
 
      // ========================================================

      // STEP 15 - FINAL SAFETY CHECK

      // ========================================================
 
      console.log(

        "STEP 15 - FINAL SAFETY CHECK"

      );
 
 
      materialsButton =

        document.querySelector(

          'button[aria-label="Materials"]'

        );
 
 
      const finalMaterials =

        (materialsButton.textContent || "")

          .replace(/\s+/g, " ")

          .trim();
 
 
      const oldPresent =

        finalMaterials.includes(

          SOURCE_FORM

        );
 
 
      const newPresent =

        finalMaterials.includes(

          NEW_NAME

        );
 
 
      console.log(

        "Final materials:",

        finalMaterials

      );
 
 
      if (oldPresent) {
 
        throw new Error(

          "Old material still present. SAVE CANCELLED."

        );
 
      }
 
 
      if (!newPresent) {
 
        throw new Error(

          "New material not selected. SAVE CANCELLED."

        );
 
      }
 
 
      // ========================================================

      // STEP 16 - SAVE

      // ========================================================
 
      console.log(

        "STEP 16 - SAVE FORM"

      );
 
 
      const saveButton =

        visible("button")

          .find(button => {
 
            const text =

              (button.textContent || "")

                .replace(/\s+/g, " ")

                .trim();
 
 
            return text === "Save Form";
 
          });
 
 
      if (!saveButton) {
 
        throw new Error(

          "Save Form button not found."

        );
 
      }
 
 
      if (saveButton.disabled) {
 
        throw new Error(

          "Save Form is disabled. SAVE CANCELLED."

        );
 
      }
 
 
      clickElement(

        saveButton,

        "Save Form"

      );
 
 
      // ========================================================

      // STEP 17 - WAIT AFTER SAVE

      // ========================================================
 
      console.log(

        "STEP 17 - WAITING FOR SAVE"

      );
 
 
      await sleep(1500);
 
 
      // ========================================================

      // STEP 18 - GO BACK

      // ========================================================
 
      console.log(

        "STEP 18 - GO BACK TO FORM LIST"

      );
 
 
      const backButton =

        await waitFor(

          () =>

            findBackButton(),

          10000

        );
 
 
      if (!backButton) {
 
        throw new Error(

          "Back button not found after saving."

        );
 
      }
 
 
      clickElement(

        backButton,

        "Back button"

      );
 
 
      // ========================================================

      // STEP 19 - WAIT FOR FORM LIST

      // ========================================================
 
      console.log(

        "STEP 19 - WAITING FOR FORM LIST"

      );
 
 
      const formListSearch =

        await waitFor(

          () =>

            document.querySelector(

              'input[placeholder="Name or description..."]'

            ),

          10000

        );
 
 
      if (!formListSearch) {
 
        throw new Error(

          "Form list did not load after going back."

        );
 
      }
 
 
      console.log(

        "Back on form list."

      );
 
 
      await sleep(1000);
 
 
      console.log(

        "COMPLETED:",

        NEW_NAME

      );
 
 
    } catch (error) {
 
      console.error("");

      console.error(

        "=============================================="

      );
 
      console.error(

        "AUTOMATION STOPPED"

      );
 
      console.error(

        "FAILED:",

        NEW_NAME

      );
 
      console.error(

        "ERROR:",

        error.message

      );
 
      console.error(

        "=============================================="

      );
 
 
      return;

    }
 
 
    // Small delay before next form

    await sleep(1000);
 
  }
 
 
  // ============================================================

  // COMPLETE

  // ============================================================
 
  console.log("");

  console.log(

    "=============================================="

  );
 
  console.log(

    "ALL FORMS COMPLETED SUCCESSFULLY"

  );
 
  console.log(

    "SOURCE:",

    SOURCE_FORM

  );
 
  console.log(

    "TOTAL:",

    DESTINATION_NAMES.length

  );
 
  console.log(

    "=============================================="

  );
 
})(); 
 
