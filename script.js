"use strict";
const landing = document.querySelector(".landing");
const menu = document.querySelector(".menu");
const container = document.querySelector(".container");
const cardsContainer = document.querySelector(".card-container");
const menuButton = document.querySelectorAll(".menu-button");
const modeDescrip = document.querySelector(".description");
const timerDisplay = document.querySelector(".timer");
const triesDisplay = document.querySelector(".tries span");

const message = document.querySelector(".message");
const messageHeader = message.querySelector("h1");
const messageDetail = message.querySelector("h2");
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
  mode = "easy",
  maxScore = 8,
  timer = 20,
  maxTimer = 20,
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
//^ DOM components
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
  message.classList.add("hidden");
  messageHeader.textContent = "";
  messageDetail.textContent = "";
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
      mode = "rapid";
      maxTimer = 150;
      startTimer(150);
    case 1: // easy
      if (!rapid) {
        mode = "easy";
        maxTimer = 40;
        startTimer(40);
      }
      number = 16;
      gridStyle(4, 4);
      changebg("#88d66c");
      changeHeaderColor(false);
      break;
    case 2: // medium mode
      if (!rapid) {
        mode = "medium";
        maxTimer = 60;
        startTimer(60);
      }
      number = 20;
      changebg("#ffaf00");
      gridStyle(5, 4);
      changeHeaderColor(false);
      break;
    case 3: // hard mode
      if (!rapid) {
        mode = "easy";
        maxTimer = 70;
        startTimer(70);
      }
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
  // show the end game message
  message.classList.remove("hidden");
  if (iswinning) {
    messageHeader.textContent = "great work";
    messageDetail.innerHTML = `
      you beat ${mode} mode in <br>
      ${maxTimer - timer - 1} seconds <br>
      ${tries} tries
      `;
  } else {
    messageHeader.textContent = "hard luck";
    messageDetail.textContent = "try again";
  }
};


//^ event handlers

// landing page
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

// game events
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
      if (score === maxScore) {
        // End of the game
        gameRunning = false;
        clearInterval(timerFunction);
        if (!rapid || difficulty === 3) { // game winnig
          endGame(true);
        } else {
          setTimeout(function () {
            init(++difficulty); // will increase difficulty by one
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
menuButton.forEach((button) =>
  button.addEventListener("click", (_) => {
    gameRunning = false;
    clearInterval(timerInterval);
    init(0);
  })
);
// staring game
init(0);
