// Buttons
const gameButton = document.getElementById("game-button"); //New Game
const drawCardButton = document.getElementById("draw-card-button"); //Draw Card

// Variables
const buttonContainer = document.getElementById("button-container");
const cardOneImage = document.getElementById("card1");
const cardTwoImage = document.getElementById("card2");
const cardsRemaining = document.getElementById("cards-remaining");
const playerOneText = document.getElementById("player1Text");
const playerTwoText = document.getElementById("player2Text");

let url;
let warning;
let cardsRemainingValue = 52;
let playerOneCards = [];
let playerTwoCards = [];

const cardValues = {"ACE": 14, "KING": 13, "QUEEN": 12, "JACK": 11, "10": 10, "9": 9, "8": 8, "7": 7, "6": 6, "5": 5, "4": 4, "3": 3, "2": 2, "1": 1};

// Click listeners
gameButton.addEventListener("click", initializeGame);
drawCardButton.addEventListener("click", drawCards);

function initializeGame(){
    clearWarningsAndWarButton();
    fetch("https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
    .then(res => res.json())
    .then(data => setUpNewDeck(data))
}

function setUpNewDeck(data){
    url = `https://www.deckofcardsapi.com/api/deck/${data.deck_id}/draw/`;
    cardsRemainingValue = data.remaining;
    cardsRemaining.innerHTML = `New Deck, Cards Remaining: ${cardsRemainingValue}`;
    cardOneImage.src = "";
    cardTwoImage.src = "";
    playerOneCards = [];
    playerTwoCards = [];
}

function drawCards(){
    clearWarningsAndWarButton();
    if(!url){
        displayWarning("No deck selected");
        return;
    }
    fetch(`${url}?count=2`)
    .then(res => res.json())
    .then(data => handleCardDraw(data))
    .catch(err => console.log(`Draw Error: ${err}`));
}

function handleCardDraw(data) {
    if(!data.success){
        return endGame();
    }
    console.log(data);
    cardOneImage.src = data.cards[0].image;
    cardTwoImage.src = data.cards[1].image;
    cardsRemainingValue = data.remaining;
    cardsRemaining.innerHTML = `Cards Remaining: ${cardsRemainingValue} Cards Used: ${52-cardsRemainingValue}` ;

    playerOneCards.push(data.cards[0]);
    playerTwoCards.push(data.cards[1]);

    // determines whose card is larger
    const cardOneValue = cardValues[(data.cards[0].value).toString()];
    const cardTwoValue = cardValues[(data.cards[1].value).toString()];

    const pile = [
        playerOneCards.pop(),
        playerTwoCards.pop()
    ];

    if(cardOneValue > cardTwoValue){
        updatePlayerCards(playerOneCards, playerTwoCards, pile, `Player 1 wins. `);
    } else if(cardTwoValue > cardOneValue){
        updatePlayerCards(playerTwoCards, playerOneCards, pile, `Player 2 Wins. `);
    } else {
        if(cardsRemainingValue < 8){
            playerOneCards.push(data.cards[0]);
            playerTwoCards.push(data.cards[1]);
            displayTie();
        } else {
            handleWar();
        }
        
    }
    console.log(`Player 1 cards: ${JSON.stringify(playerOneCards, null, 2)}`);
    console.log(`Player 2 cards: ${JSON.stringify(playerTwoCards, null, 2)}`);
}

function handleWar() {
    const warButton = createWarButton();
    buttonContainer.appendChild(warButton);
    warButton.addEventListener("click", executeWar);
}

function executeWar() {
    if (cardsRemaining < 8){
        return console.log(("Not enough cards for war"));
    };
    fetch(`${url}?count=8`)
    .then(res => res.json())
    .then(data => {
        if (!data.success || data.cards.length < 8) {
            displayWarning("Not enough cards remaining for war.");
            endGame();
            return;
        }
        const [playerOneWarValue, playerTwoWarValue] = [
            cardValues[data.cards[3].value],
            cardValues[data.cards[7].value]
        ];
        cardOneImage.src = data.cards[3].image;
        cardTwoImage.src = data.cards[7].image;
    
        const warPile = [
            // playerOneCards.pop(),
            // playerTwoCards.pop(),
            ...data.cards
        ];

        if(playerOneWarValue > playerTwoWarValue) {
            updatePlayerCards(playerOneCards, playerTwoCards, warPile, `Player 1 wins War. `);
        } else if(playerTwoWarValue > playerOneWarValue) {
            updatePlayerCards(playerTwoCards, playerOneCards, warPile, `Player 2 Wins War. `);
        } else {
            playerOneText.textContent = "Another Tie in the War";
            playerTwoText.textContent = "War Continues...";
            clearWarningsAndWarButton();
            executeWar();
        }
    })
    .catch(err => {
        console.log(`War Draw Error: ${err}`);
    })
     
}

function updatePlayerCards(winnerCards, loserCards, pile, message){
    winnerCards.push(...pile);
    if(message.includes("1")){
        playerOneText.textContent = `${message} Total Cards in hand: ${playerOneCards.length}` ;
        playerTwoText.textContent = `Total Cards in hand: ${playerTwoCards.length}`;
    } else {
        playerOneText.textContent = `Total Cards in hand: ${playerOneCards.length}`;
        playerTwoText.textContent = `${message} Total Cards in hand: ${playerTwoCards.length}`;
    }
}

function endGame(){
    let message = playerOneCards.length > playerTwoCards.length ? "Player 1 Wins!" : playerOneCards.length < playerTwoCards.length ? "Player 2 Wins!" : "It's a TIE!";
    cardsRemaining.innerHTML = `Game Over - ${message}`; 
}


function displayWarning(msg){
    warning = document.createElement("p");
    warning.classList.add("warning");
    warning.textContent = msg;
    buttonContainer.appendChild(warning);
}

function clearWarningsAndWarButton(){
    const existingWarButton = document.getElementById("war-button");
    if (existingWarButton) {
        buttonContainer.removeChild(existingWarButton);
    }
    if(warning){
        buttonContainer.removeChild(warning);
        warning = null;
    } 
}

function displayTie() {
    playerOneText.textContent = `Tie! Total Cards in Hand: ${playerOneCards.length}`;
    playerTwoText.textContent = `Tie! Total Cards in Hand: ${playerTwoCards.length}`;
}

function createWarButton() {
    const warButton = document.createElement("button");
    warButton.textContent = "WAR!";
    warButton.classList.add("war-button");
    return warButton;
}

