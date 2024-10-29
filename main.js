// Buttons
const gameButton = document.getElementById("game-button"); //New Game
const drawCardButtong = doucment.getElementById("draw-card-button"); //Draw Card

// Variables
const cardOneImage = document.getElementById("card1");
const cardTwoImage = document.getElementById("card2");
const cardOneValue = document.getElementById("card1-value");
const cardTwoValue = document.getElementById("card2-value");

// Click for a new card
gameButton.addEventListener("click", getCards)
function getCards(){
    fetch("https://www.deckofcardsapi.com/api/deck/czvf9t0mv2jd/draw/?count=2")
    .then(res => res.json())
    .then(data => {
        console.log(data);
        cardOneImage.src = data.cards[0].image;
        cardOneValue.textContent = data.cards[0].value;

        cardTwoImage.src = data.cards[1].image;
        cardTwoValue.textContent = data.cards[1].value;
    })
    .catch(err => {
        console.log(`error: ${err}`);
    })
}

