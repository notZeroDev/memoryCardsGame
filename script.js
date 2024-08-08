const cardsContainer = document.querySelector(".card-container");
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
];
let score = 0,
  gameRunning = true;
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
const init = function (number) {
  createCards(number);
  fillCards(number);
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
      if (score == 8) {
        // End of the game
        gameRunning = false;
        setTimeout(function () {
          window.location.reload();
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

// cardsContainer.style.gridTemplateColumns= 'repeat(9, 1fr)';
init(16);
