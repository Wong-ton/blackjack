let deck = [];
const suits = ["spades", "hearts", "clubs", "diamonds"]
const cardValue = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]
const playerHand = [];
const dealerHand = [];



// Create a card deck from the 2 arrays; Sets the values of ace & face cards to 11 & 10 respectively.
function createDeck() {
    for (let i = 0; i < suits.length; i++) {
        for (let x = 0; x < cardValue.length; x++) {
            
            let weight = parseInt(cardValue[x]);
            if (cardValue[x] === "J" || cardValue[x] === "Q" || cardValue[x] === "K")
                weight = 10;
            if (cardValue[x] === "A")
                weight = 11;            // MAY HAVE TO ADJUST WEIGHT HERE TO 1 WHEN SUM IS > 21
            
                deck.push({Value: cardValue[x], Suit: suits[i], Weight: weight})
        }
    }
    return deck;
 }

// Fisher-Yates shuffle function, which selects a random card from the front and places it in the back,
// the back unshuffled card is moved to the front, where it waits to be shuffled. The cycle repeats until
// all of the cards are shuffled. LINK TO EXPLANATION: https://bost.ocks.org/mike/shuffle/
function shuffle(deck) {
    let m = deck.length, t, i;
  
    // While there remain elements to shuffle…
    while (m) {
  
      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);
  
      // And swap it with the current element.
      t = deck[m];
      deck[m] = deck[i];
      deck[i] = t;
    }
    return deck;
  }


function deal() {
    return deck.pop();
    // Update points & Check sum for winner (maybe 2 functions)
    // Maybe separate function for "HIT ME"?? Otherwise will need to POP twice for 2 cards.
}

function stay() {
    // Turn over, move onto next player
}

function reset() {
    let deck = [];
    // & Set other game variables back to original state
}


createDeck();
shuffle(deck);
console.log(deck);
  

$('#play-button').on('click', () => {
    console.log('Game started');
})

$('#hit-button').on('click', function deal() {
    console.log('Hit me baby one more time');
})

$('#stay-button').on('click', function stay() {
    console.log('Dont hit me anymore');
})