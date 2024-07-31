// This module will handle user input validation.

function inputMissingValidation(cardDeck) {
  // initialize validity bool
  let inputNotMissing = true; // true = no missing input.

  // define input type
  const inputTypeArray = [
    "input-task",
    "input-project",
    "input-personInCharge",
    "input-dueDate",
  ];

  for (let typeIndex in inputTypeArray) {
    // select required element
    const input = document.querySelector(`#${inputTypeArray[typeIndex]}`);
    const errorMsg = input.nextElementSibling;

    // initialize error message element before checking validity
    errorMsg.setAttribute("id", inputTypeArray[typeIndex]);
    errorMsg.textContent = "";

    // check validity and update style if not valid
    if (input.validity.valueMissing) {
      errorMsg.setAttribute("id", `${inputTypeArray[typeIndex]}-error`);
      errorMsg.textContent = input.validationMessage;

      // update not-missing status
      inputNotMissing = inputNotMissing & false;
    }
  }

  return { notMissingBool: !!inputNotMissing, cardDeck: cardDeck };
}

export { inputMissingValidation };
