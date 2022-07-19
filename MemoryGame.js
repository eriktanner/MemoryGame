import * as Card from '/Card.js';
const gameBoard = document.getElementById("game");
const tries = document.getElementById("tries");
const bestScore = document.getElementById("lowestScore");
const startButton = document.getElementById("start");
const restartButton = document.getElementById("restart");
const hiddenOnStartElements = document.querySelectorAll(".hidden");

const ROWS = 2;

const cardDiv_to_Card = new Map();
const CARD_COLORS = new Set(["red","blue","green","orange","purple"]);
const CARD_IMGS = new Set(["dog1.jpg","dog2.jpg","dog3.jpg","dog4.jpg","dog5.jpg"]);

let id = 0;
let numTries = 0;
let firstCardFlippedForCompare = null;
let secondCardFlippedForCompare = null;


restartButton.addEventListener("click", function () {
  window.location.reload();
});

startButton.addEventListener("click", startGameFunc);

function startGameFunc() {
  //hide the start button
  startButton.classList.add("hidden");

  createCards();

  // display prompt sentences
  for (let el of hiddenOnStartElements) {
    el.classList.remove("hidden");
  }

  // display tries
  tries.innerText = 0;

  // display the lowest score
  if (!localStorage.lowestScore) {
    bestScore.innerText = "You haven't played the game!";
  } else {
    bestScore.innerText = localStorage.lowestScore + " tries";
  }
}

function createCards() {

  let scaledCards = [];

  function scaleAndShuffle() {
    for (let i = 0; i < ROWS/2; i++) {
      let randomPairs = createRandomPairs(5);
      scaledCards.push(...randomPairs);
    }
    shuffle(scaledCards);
  }
  
  function createRandomPairs(pairs) {

    const cardsToChoseFrom = [...CARD_COLORS,...CARD_IMGS];
    shuffle(cardsToChoseFrom);
    const randomCards = cardsToChoseFrom.slice(0, pairs);
    
    const randomPairs = [];
    for (let i = 0; i < randomCards.length; i ++) {
      randomPairs.push(createCard(randomCards[i]));
      randomPairs.push(createCard(randomCards[i]));
    }

    return randomPairs;
  }

  function createCard(s) {
    if (CARD_COLORS.has(s)) {
      return new Card.ColorCard(s);
    } else {
      return new Card.ImageCard(s);
    }
  }

  function shuffle(arr) {
    for (let i = 0; i < arr.length; i++) {
      const rand = Math.floor(Math.random() * arr.length);
      const temp = arr[i];
      arr[i] = arr[rand];
      arr[rand] = temp;
    }
    return arr;
  }

  // create elements on DOM
  function displayCards() {
    for (let card of scaledCards) {
      const cardDiv = card.getCardDiv();
      cardDiv.addEventListener("click", clickCardHandler);
      cardDiv_to_Card.set(cardDiv,card);
      gameBoard.append(cardDiv);
    }
  }

  scaleAndShuffle();
  displayCards();
}

function isValidClickCardHandler(card) {
  if (card.isFaceUp() || (firstCardFlippedForCompare != null & secondCardFlippedForCompare != null)) {
    return false;
  }
  return true;
}

// create click event handler
function clickCardHandler(e) {
  const card = cardDiv_to_Card.get(e.target)

  if (!isValidClickCardHandler(card)) {
    return;
  }

  if (firstCardFlippedForCompare == null) {
    firstCardClickedHandler(card);
  } else {
    secondCardClickedHandler(card);
  }
  numTries++;
  tries.innerText = numTries;
  checkEnd();
}

function firstCardClickedHandler(firstCard) {
  firstCard.setFaceUp();
  firstCardFlippedForCompare = firstCard;
  id = setTimeout(function () {
    firstCardFlippedForCompare.setFaceDown()
    firstCardFlippedForCompare = null;
  }, 1000);
}

function secondCardClickedHandler(secondCard) {
  clearTimeout(id);
  secondCard.setFaceUp();
  secondCardFlippedForCompare = secondCard;

  if (secondCardFlippedForCompare.matches(firstCardFlippedForCompare)) {
    firstCardFlippedForCompare = null;
    secondCardFlippedForCompare = null;
  } else {
      setTimeout(function () {
        firstCardFlippedForCompare.setFaceDown();
        secondCardFlippedForCompare.setFaceDown();
        firstCardFlippedForCompare = null;
        secondCardFlippedForCompare = null;
      }, 1000);
  }
}

function checkEnd() {
  for (const card of cardDiv_to_Card.values()) {
    if (!card.isFaceUp()) {
      return;
    }
  }
  setTimeout(() => {
    // tell users they did a good job!
    alert(`You finished the game with ${numTries} tries!`);

    // check the score and save it to the local storage when lowest
    if (!localStorage.lowestScore) {
      localStorage.setItem("lowestScore", numTries);
    } else {
      if (numTries < localStorage.lowestScore) {
        localStorage.setItem("lowestScore", numTries);
      }
    }

    // reset the game - force it refresh
    window.location.reload();
  }, 500);
}
