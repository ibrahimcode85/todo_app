// edit using prettier

function uploadToStorage(cardDeck) {
  // Clear only items that start with 'card'
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    if (key.startsWith("card")) {
      localStorage.removeItem(key);
    }
  }

  for (let cardIndex in cardDeck) {
    const cardNum = parseInt(cardIndex) + 1;
    const keyStorage = `card${cardNum}`;
    const jsonValue = JSON.stringify(cardDeck[cardIndex]);

    localStorage.setItem(keyStorage, jsonValue);
  }
}

function downloadFromStorage() {
  let cardDeck = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith("card")) {
      const cardObject = JSON.parse(localStorage.getItem(key));
      cardDeck.push(cardObject);
    }
  }

  return cardDeck;
}

export { uploadToStorage, downloadFromStorage };
