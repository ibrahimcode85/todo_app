import "./style.css";
import { initializeEventListeners } from "./events";
import { dashboardDisplay } from "./ui";
import { downloadFromStorage } from "./storage";

let cardDeck = [];

if (localStorage.length > 0) {
  cardDeck = downloadFromStorage();
}

dashboardDisplay(cardDeck);
initializeEventListeners(cardDeck);
