// This module will handle task creation, deletion, ranking, and summary operations.
// Formatted using prettier.

import { differenceInCalendarDays } from "date-fns";
import {
  dashboardDisplay,
  clearDashboard,
  summaryValueDisplay,
  closeInputDialog,
} from "./ui";
import { uploadToStorage } from "./storage.js";
import { inputMissingValidation } from "./validation.js";

function getInput() {
  const task = document.querySelector("#input-task").value;
  const project = document.querySelector("#input-project").value;
  const personInCharge = document.querySelector("#input-personInCharge").value;
  const dueDate = document.querySelector("#input-dueDate").value;
  const status = document.querySelector("#input-status").value;

  return { task, project, personInCharge, dueDate, status };
}

function clearInput(card) {
  for (let key in card) {
    let cardID = `#input-${key}`;
    document.querySelector(cardID).value = "";
  }
}

function daysRemaining(date) {
  const nowDate = new Date();
  return differenceInCalendarDays(date, nowDate);
}

function createCard(cardDeck) {
  // run validation routine
  const noMissinigValue = inputMissingValidation(cardDeck)["notMissingBool"];
  cardDeck = inputMissingValidation(cardDeck)["cardDeck"];

  if (noMissinigValue == false) {
    return cardDeck;
  }

  const card = getInput();
  const daysRemain = daysRemaining(card.dueDate);
  clearInput(card);
  document.getElementById("input-summary").value = "all";
  document.getElementById("summary-value").value = "";
  cardDeck.push(card);

  clearDashboard();
  dashboardDisplay(cardDeck);
  uploadToStorage(cardDeck);
  closeInputDialog();

  return cardDeck;
}

function deleteCard(e, cardDeck) {
  const card = e.target.parentNode;
  let deleteID = getCardID(card);
  cardDeck = deleteCardFromDeck(cardDeck, deleteID);

  clearDashboard();
  dashboardDisplay(cardDeck);
  uploadToStorage(cardDeck);

  return cardDeck;
}

function deleteCardFromDeck(cardDeck, deleteID) {
  const cardIndex = findDeckIndex(cardDeck, deleteID);
  cardDeck.splice(cardIndex, 1);

  return cardDeck;
}

function findDeckIndex(cardDeck, id) {
  for (let cardIndex in cardDeck) {
    let card = cardDeck[cardIndex];
    const cardID = getCardID(card);
    if (cardID === id) {
      return cardIndex;
    }
  }
}

function upRank(e, cardDeck) {
  const currentNode = e.target.parentNode;
  const prevNode = currentNode.previousElementSibling;

  if (prevNode.className === "dashboard-title") {
    return;
  }

  const prevCardID = getCardID(prevNode);
  const prevCardDeckIndex = findDeckIndex(cardDeck, prevCardID);

  const currentCardID = getCardID(currentNode);
  const currentCardDeckIndex = findDeckIndex(cardDeck, currentCardID);

  // get the current object from deck
  const currentCard = cardDeck[currentCardDeckIndex];

  // delete the current object from deck
  cardDeck = deleteCardFromDeck(cardDeck, currentCardID);

  // add the current card object based on the location of the previous card index
  cardDeck.splice(prevCardDeckIndex, 0, currentCard);

  // regenerate the dashboard based on the updated deck
  clearDashboard();
  dashboardDisplay(cardDeck);
  uploadToStorage(cardDeck);

  return cardDeck;
}

function downRank(e, cardDeck) {
  const currentNode = e.target.parentNode;
  const nextNode = currentNode.nextElementSibling;

  if (nextNode === null) {
    return;
  }

  const nextCardID = getCardID(nextNode);
  const nextCardDeckIndex = findDeckIndex(cardDeck, nextCardID);

  const currentCardID = getCardID(currentNode);
  const currentCardDeckIndex = findDeckIndex(cardDeck, currentCardID);

  // get the current object from deck
  const currentCard = cardDeck[currentCardDeckIndex];

  // delete the current object from deck
  cardDeck = deleteCardFromDeck(cardDeck, currentCardID);

  // add the current card object based on the location of the previous card index
  cardDeck.splice(nextCardDeckIndex, 0, currentCard);

  // regenerate the dashboard based on the updated deck
  clearDashboard();
  dashboardDisplay(cardDeck);
  uploadToStorage(cardDeck);

  return cardDeck;
}

function changeStatus(e, cardDeck) {
  const statusChangeMap = {
    planned: "inProgress",
    inProgress: "completed",
    completed: "planned",
  };
  const currentNode = e.target.parentNode;
  const cardID = getCardID(currentNode);
  const deckIndex = findDeckIndex(cardDeck, cardID);
  const card = cardDeck[deckIndex];

  // change status
  card.status = statusChangeMap[card.status];

  // delete and then reupdate deck
  cardDeck = deleteCardFromDeck(cardDeck, cardID);
  cardDeck.push(card);

  // regenerate the dashboard based on the updated deck
  clearDashboard();
  dashboardDisplay(cardDeck);
  uploadToStorage(cardDeck);
}

function getSummaryValue(e, cardDeck) {
  const summaryValue = e.target.value;
  let valueList = [];

  for (let cardIndex in cardDeck) {
    const currentValue = cardDeck[cardIndex][summaryValue];
    let valueExists = valueList.includes(currentValue);

    if (valueExists === false) {
      valueList.push(currentValue);
    }
  }

  // display the selection for user to choose
  summaryValueDisplay(valueList);
}

function getSummarizedDashboard(summaryElement, summaryValue, cardDeck) {
  let summarizedDeck = cardDeck;

  // update summarizedDeck if applicable
  if (summaryElement !== "all") {
    // clear the deck first before updating
    summarizedDeck = [];

    for (let cardIndex in cardDeck) {
      let card = cardDeck[cardIndex];

      if (card[summaryElement] === summaryValue) {
        summarizedDeck.push(card);
      }
    }
  }

  // display dashboard
  clearDashboard();
  dashboardDisplay(summarizedDeck);
}

function getCardID(card) {
  const cardItem = ["task", "project", "personInCharge", "dueDate"];
  let cardObject = card;
  let cardID = "";

  // parameter is either a node or an array.
  // if its not array, convert node info to array first.
  let checkNode = card.nodeType; // return undefined if it is an array

  if (checkNode !== undefined) {
    cardObject = {};

    for (let itemIndex in cardItem) {
      const input = card.querySelector(
        `.card-${cardItem[itemIndex]}`
      ).textContent;
      cardObject[cardItem[itemIndex]] = input;
    }
  }

  for (let itemIndex in cardItem) {
    let input = cardObject[cardItem[itemIndex]];
    cardID = cardID + "_" + input;
  }

  return cardID;
}

export {
  getInput,
  clearInput,
  daysRemaining,
  createCard,
  deleteCard,
  deleteCardFromDeck,
  findDeckIndex,
  upRank,
  downRank,
  getSummaryValue,
  changeStatus,
  getSummarizedDashboard,
};
