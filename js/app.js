let deck = [];
const suits = ["spades", "hearts", "clubs", "diamonds"]
const cardValue = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]
const playerHand = [];
const dealerHand = [];
let playerSum = 0;
let dealerSum = 0;
let pNumOfWins = 0;
let dNumOfWins = 0;



// Create a card deck from the 2 arrays; Sets the values of ace & face cards to 11 & 10 respectively.
function createDeck() {
    for (let i = 0; i < suits.length; i++) {
        for (let x = 0; x < cardValue.length; x++) {
            
            let points = parseInt(cardValue[x]);
            if (cardValue[x] === "J" || cardValue[x] === "Q" || cardValue[x] === "K")
                points = 10;
            if (cardValue[x] === "A")
                points = 11;            // MAY HAVE TO ADJUST WEIGHT HERE TO 1 WHEN SUM IS > 21
            
                deck.push({Value: cardValue[x], Suit: suits[i], Points: points})
        }
    }
    return deck;
 }

// Fisher-Yates shuffle function, which selects a random card from the front and places it in the back,
// the back unshuffled card is moved to the front, where it waits to be shuffled. The cycle repeats until
// all of the cards are shuffled. LINK TO EXPLANATION: https://bost.ocks.org/mike/shuffle/
function shuffle(deck) {
    let m = deck.length;
    let t;
    let i;
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
    let pCard1 = deck.pop();
    playerHand.push(pCard1);
    let dCard1 = deck.pop();
    dealerHand.push(dCard1);
    let pCard2 = deck.pop();
    playerHand.push(pCard2);
    let dCard2 = deck.pop();
    dealerHand.push(dCard2)
    // Update points & Check sum for winner (maybe 2 functions)
}


// Calculates the score of the player/dealer hands and adjusts ACE value depending on of it's over 21 or not.
function getScore(hand){
    let score = 0;
    let hasAce = false;
    for (let i = 0; i < hand.length; i++) {
    //   let card = hand[i];
      score += hand[i].Points
      if (hand[i].Points == 11) {
        hasAce = true;
      } if (hasAce && score > 21) {
        return score - 10;
      }
    }
     return score; 
  }


function hit(hand) {
    let card1 = deck.pop();
    hand.push(card1); 
    // Update points & Check sum for winner (maybe 2 functions)
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
deal();
console.log(deck);
console.log(playerHand);
console.log(dealerHand);
  

$('#play-button').on('click', () => {
    console.log('Game started');
})

$('#hit-button').on('click', function hit() {
    console.log('Hit me baby one more time');
})

$('#stay-button').on('click', function stay() {
    console.log('Dont hit me anymore');
})