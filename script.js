/*
  !things to implement
  - message to descripe each difficulty on hover
  - timer
  - message to show winning or losing status
*/
const landing = document.querySelector(".landing");
const menu = document.querySelector(".menu");
const container = document.querySelector(".container");
const cardsContainer = document.querySelector(".card-container");
const menuButton = document.querySelector(".menu-button");
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
  difficulty = 1,
  maxScore = 8,
  timer = 20;
rapid = false;
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
};
//^ style functions
const gridStyle = function (x, y) {
  cardsContainer.style.gridTemplateRows = `repeat(${y}, 1fr)`;
  cardsContainer.style.gridTemplateColumns = `repeat(${x}, 1fr)`;
};
const changebg = function (color) {
  document.documentElement.style.setProperty("--main-color", color);
};
changeHeaderColor = function (iswhite) {
  document.documentElement.style.setProperty(
    "--header-color",
    `${iswhite ? "#fff" : "#1E201E"}`
  );
};
const init = function (difficulty) {
  let number;
  // reset values
  resetGame();
  container.classList.remove("hidden");
  landing.classList.add("hidden");
  // switching mode
  switch (difficulty) {
    case 0: // main screen
      container.classList.add("hidden");
      landing.classList.remove("hidden");
      changebg("#1c1c1c");
      changeHeaderColor(true);
      break;
    case 1: // easy
      number = 16;
      gridStyle(4, 4);
      changebg("#88d66c");
      changeHeaderColor(false);
      break;
    case 2: // medium
      number = 20;
      changebg("#ffaf00");
      gridStyle(5, 4);
      changeHeaderColor(false);
      break;
    case 3: // hard
      number = 30;
      changebg("#bd3131");
      gridStyle(6, 5);
      changeHeaderColor(false);
      break;
    case 4: // rapid finished
      init(0); //! will be replaced
      break;
  }
  maxScore = number / 2;
  createCards(number);
  fillCards(number);
  gameRunning = true;
};
menu.addEventListener("click", function (e) {
  const button = e.target.closest(".button");
  if (!button) return;
  if (button.classList.contains("rapid")) rapid = true;
  else rapid = false;
  console.log(rapid);
  init(Number(button.dataset.stage));
  console.log(button.dataset.stage);
});
cardsContainer.addEventListener("click", function (e) {
  const card = e.target.closest(".card");
  // clasuer guard
  if (!card || card.classList.contains("active")) return;
  // game is not running is we checked two cards and want to stop the holding two cards
  if (!gameRunning) {
    clearTimeout(checking);
    clearCards();
    gameRunning = true;
  }
  if (!firstCard) {
    // selecting the first card
    firstCard = card;
    firstCard.classList.add("active");
  } else {
    // selecting two cards
    secondCard = card;
    secondCard.classList.add("active");
    gameRunning = false; // stop the game until we checks
    if (firstCard.dataset.value === secondCard.dataset.value) {
      score++;
      if (score === maxScore) {
        // End of the game
        gameRunning = false;
        setTimeout(function () {
          //*end round
          // resetGame();
          if (rapid) init(++difficulty); // will increase difficulty by one
          else init(0); // return to main menu
          // window.location.reload();
        }, 1000);
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
menuButton.addEventListener("click", (_) => init(0));
// staring game
init(2);
