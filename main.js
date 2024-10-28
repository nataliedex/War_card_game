const gameButton = document.getElementById("game-button");

gameButton.addEventListener("click", getCards)
function getCards(){
    fetch("https://www.deckofcardsapi.com/api/deck/czvf9t0mv2jd/draw/?count=2")
    .then(res => res.json())
    .then(data => {
        console.log(data);
    })
    .catch(err => {
        console.log(`error: ${err}`);
    })
}