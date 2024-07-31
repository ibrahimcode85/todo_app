// This module will manage event listeners.

import { showInputDialog, clearDashboard } from "./ui";
import { createCard, getSummaryValue, getSummarizedDashboard } from "./task";
import { inputMissingValidation } from "./validation";

export function initializeEventListeners(cardDeck) {
  document
    .getElementById("showInput")
    .addEventListener("click", showInputDialog);

  document.getElementById("createTask").addEventListener("click", () => {
    cardDeck = createCard(cardDeck);
  });

  document.getElementById("clearDashboard").addEventListener("click", () => {
    cardDeck = clearDashboard(cardDeck);
  });

  document
    .getElementById("input-summary")
    .addEventListener("change", (e) => getSummaryValue(e, cardDeck));

  document.getElementById("updateDashboard").addEventListener("click", () => {
    const summaryElement = document.getElementById("input-summary").value;
    const summaryValue = document.getElementById("summary-value").value;
    getSummarizedDashboard(summaryElement, summaryValue, cardDeck);
  });

  // add validation handler when load dialog box
  // it will first focus on first field
  document.querySelector("#input-task").addEventListener("focus", () => {
    cardDeck = inputMissingValidation(cardDeck)["cardDeck"];
  });

  // add validation handler when inputting field
  const inputTypeArray = [
    "input-task",
    "input-project",
    "input-personInCharge",
    "input-dueDate",
  ];

  for (let typeIndex in inputTypeArray) {
    const input = document.querySelector(`#${inputTypeArray[typeIndex]}`);

    input.addEventListener("change", () => {
      cardDeck = inputMissingValidation(cardDeck)["cardDeck"];
    });
  }
}
