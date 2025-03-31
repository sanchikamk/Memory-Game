document.addEventListener("DOMContentLoaded", () => {
  const gameBoard = document.querySelector(".game-board");
  const movesDisplay = document.querySelector("#moves");
  const matchedDisplay = document.querySelector("#matched");
  const restartButton = document.querySelector("#restart");

  let cards = [];
  let flippedCards = [];
  let moves = 0;
  let matchedCards = 0;
  let canFlip = true;

  // Function to initialize the game
  function initGame() {
    moves = 0;
    matchedCards = 0;
    movesDisplay.textContent = moves;
    matchedDisplay.textContent = matchedCards;
    canFlip = true;
    flippedCards = [];
    gameBoard.innerHTML = "";
    fetchCards();
  }

  // Fetching data from the JSON file

  function fetchCards() {
    fetch("./data/cards.json")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        cards = [...data, ...data];
        shuffleCards(cards);
        renderCards(cards);
      });
  }
  // Function to shuffle the cards

  function shuffleCards(cards) {
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards;
  }

  // Function to create cards

  function renderCards(cards) {
    gameBoard.innerHTML = "";

    cards.forEach((card, index) => {
      const cardElement = document.createElement("div");
      cardElement.classList.add("card");
      cardElement.dataset.id = index;
      cardElement.dataset.name = card.name;
      cardElement.innerHTML = `
        <div class="card-face card-front">
        <img class="front-image" src="${card.image}" alt="${card.name}" />
        </div>
        <div class="card-face card-back"></div>
        `;

      cardElement.addEventListener("click", flipCard);
      gameBoard.appendChild(cardElement);
    });
  }

  // Function to flip the card
  function flipCard() {
    if (
      !canFlip ||
      this.classList.contains("flipped") ||
      flippedCards.length >= 2
    ) {
      return;
    }

    this.classList.add("flipped");
    flippedCards.push(this);
    console.log(flippedCards);

    // Checking for match

    if (flippedCards.length === 2) {
      moves++;
      if (movesDisplay) movesDisplay.textContent = moves;
      checkForMatch();
    }
  }

  function checkForMatch() {
    const [card1, card2] = flippedCards;

    // Disable flipping cards
    canFlip = false;

    if (card1.dataset.name === card2.dataset.name) {
      matchedCards++;
      if (matchedDisplay) matchedDisplay.textContent = matchedCards;
      card1.removeEventListener("click", flipCard);
      card2.removeEventListener("click", flipCard);
      flippedCards = [];

      canFlip = true;

      if (matchedCards === cards.length / 2) {
        setTimeout(
          () => alert(`Congratulations!, You won the Game in ${moves} moves!`),
          500
        );
      }
    } else {
      setTimeout(() => {
        card1.classList.remove("flipped");
        card2.classList.remove("flipped");
        resetGame();
      }, 1000);
    }
  }

  //Reset Game
  function resetGame() {
    flippedCards = [];
    canFlip = true;
  }
  // Restart Game

  restartButton.addEventListener("click", initGame);

  initGame();
});
