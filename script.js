/*
  !things to implement
  - message to show winning or losing status
*/
"use strict";
const landing = document.querySelector(".landing");
const menu = document.querySelector(".menu");
const container = document.querySelector(".container");
const cardsContainer = document.querySelector(".card-container");
const menuButton = document.querySelector(".menu-button");
const modeDescrip = document.querySelector(".description");
const timerDisplay = document.querySelector(".timer");
const triesDisplay = document.querySelector(".tries span");
const icons = [
  "airplane",
  "bell",
  "chemical",
  "diamond",
  "dna",
  "fingerprint",
  "flag",
  "gift",
  "headphones",
  "jeep",
  "person",
  "smiley",
  "umbrella",
  "google-photos",
  "laptop",
];
let score = 0,
  tries = 0,
  difficulty = 1,
  maxScore = 8,
  timer = 20,
  timerInterval,
  rapid = false,
  gameRunning = true;
//^ game logic
// create an array with num length and duplicate each element
const generateRanodmNumber = function (min, max) {
  return Math.floor(Math.sqrt(Math.random() * Math.random()) * max + min);
};
const createIconsArray = function (num) {
  const iconsCopy = [...icons];
  const iconsArray = new Array(num);
  const indexPick = Array.from(
    { length: num / 2 },
    () => iconsCopy.splice(generateRanodmNumber(0, iconsCopy.length), 1)[0]
  );
  for (let i = 0; i < num; i += 2) {
    iconsArray[i] = iconsArray[i + 1] = indexPick.pop();
  }
  return iconsArray;
};

const createCards = function (number) {
  const element = `<div class="card">
  <div class="face"></div>
  <div class="back"></div>
  </div>`;
  for (let i = 0; i < number; i++) {
    cardsContainer.insertAdjacentHTML("beforeend", element);
  }
};
const fillCards = function (number) {
  const iconsArray = createIconsArray(number);
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    const icon = iconsArray.splice(
      Math.floor(Math.random() * iconsArray.length),
      1
    );
    card.querySelector(
      ".back"
    ).style.backgroundImage = `url('icons/${icon}.png')`;
    card.dataset.value = icon;
  });
};
const resetCards = function () {
  firstCard = secondCard = undefined;
};
const clearCards = function () {
  firstCard.classList.remove("active");
  secondCard.classList.remove("active");
  resetCards();
};
let firstCard, secondCard, checking;
const resetGame = function () {
  cardsContainer.innerHTML = "";
  resetCards();
  score = 0;
  // if (!rapid) tries = 0;
};
//^ style functions
const gridStyle = function (x, y) {
  cardsContainer.style.gridTemplateRows = `repeat(${y}, 1fr)`;
  cardsContainer.style.gridTemplateColumns = `repeat(${x}, 1fr)`;
};
const changebg = function (color) {
  document.documentElement.style.setProperty("--main-color", color);
};
const changeHeaderColor = function (iswhite) {
  document.documentElement.style.setProperty(
    "--header-color",
    `${iswhite ? "#fff" : "#1E201E"}`
  );
};
//^ DOM
const timerFunction = function () {
  if (timer === 0) {
    endGame();
  }
  timerDisplay.textContent = timer--;
};
const startTimer = function (timeSecconds) {
  timer = timeSecconds;
  timerFunction();
  timerInterval = setInterval(timerFunction, 1000);
};
const init = function (difficulty) {
  let number;
  // reset values
  resetGame();
  container.classList.remove("hidden");
  landing.classList.add("hidden");
  modeDescrip.textContent = "";
  triesDisplay.textContent = tries;
  // switching mode
  switch (difficulty) {
    case 0: // main screen
      timer = 0;
      tries = 0;
      container.classList.add("hidden");
      landing.classList.remove("hidden");
      changebg("#1c1c1c");
      changeHeaderColor(true);
      break;
    case -1: //rapid
      startTimer(200);
    case 1: // easy
      // timerDisplay.textContent = timer;
      // timerInterval = setInterval(function () {
      //   timerDisplay.textContent = --timer;
      // }, 1000);
      if (!rapid) startTimer(40);
      number = 16;
      gridStyle(4, 4);
      changebg("#88d66c");
      changeHeaderColor(false);
      break;
    case 2: // medium
      if (!rapid) startTimer(60);
      number = 20;
      changebg("#ffaf00");
      gridStyle(5, 4);
      changeHeaderColor(false);
      break;
    case 3: // hard
      if (!rapid) startTimer(70);
      number = 30;
      changebg("#bd3131");
      gridStyle(6, 5);
      changeHeaderColor(false);
      break;
  }
  maxScore = number / 2;
  createCards(number);
  fillCards(number);
  gameRunning = true;
};
const endGame = function (iswinning = false) {
  gameRunning = false;
  clearInterval(timerInterval);
  //^ add checking display winning or losing
  if (iswinning) {
    console.log("you have won");
  } else {
    console.log("lost");
  }
};
menu.addEventListener("click", function (e) {
  const button = e.target.closest(".button");
  if (!button) return;
  if (Number(button.dataset.stage) === -1) rapid = true;
  else rapid = false;
  init(Number(button.dataset.stage));
});
menu.addEventListener("mousemove", function (e) {
  const button = e.target.closest(".button");
  if (!button) {
    //! DRY
    modeDescrip.textContent = "";
    return;
  }
  const stage = Number(button.dataset.stage);
  let pairs, time;
  switch (stage) {
    case -1:
      modeDescrip.textContent = "finish all modes under 150 seconds";
      return;
    case 1:
      pairs = 8;
      time = 40;
      break;
    case 2:
      pairs = 10;
      time = 60;
      break;
    case 3:
      pairs = 15;
      time = 70;
      break;
    default:
      break;
  }
  modeDescrip.textContent = `match ${pairs} pairs under ${time} seconds`;
});
menu.addEventListener("mouseleave", (_) => {
  modeDescrip.textContent = "";
});
cardsContainer.addEventListener("click", function (e) {
  if (timer === -1 || score === maxScore) return;
  // clear both cards
  if (!gameRunning) {
    clearTimeout(checking);
    clearCards();
    gameRunning = true;
  }
  const card = e.target.closest(".card");
  // clasuer guard
  if (!card || card.classList.contains("active")) return;
  // game is not running is we checked two cards and want to stop the holding two cards
  if (!firstCard) {
    // selecting the first card
    firstCard = card;
    firstCard.classList.add("active");
  } else {
    // selecting two cards
    triesDisplay.textContent = ++tries;
    secondCard = card;
    secondCard.classList.add("active");
    gameRunning = false; // stop the game until we checks
    if (firstCard.dataset.value === secondCard.dataset.value) {
      score++;
      //! return it
      if (score === maxScore) {
        // End of the game
        gameRunning = false;
        // if (!rapid || difficulty === 3) {
        clearInterval(timerFunction);
        // console.log(timer);
        // }
        // if (!rapid || difficulty === 3) {
        //   endGame();
        // }
        if (!rapid || difficulty === 3) {
          endGame(true);
        } else {
          setTimeout(function () {
            //*end round
            // resetGame();
            init(++difficulty); // will increase difficulty by one
            // else endGame(); // return to main menu
            // window.location.reload();
          }, 500);
        }
      }
      gameRunning = true;
      resetCards();
    } else {
      checking = setTimeout(function () {
        clearCards();
        gameRunning = true;
      }, 1000);
    }
  }
});
menuButton.addEventListener("click", (_) => {
  gameRunning = false;
  clearInterval(timerInterval);
  init(0);
});
// staring game
init(0);
