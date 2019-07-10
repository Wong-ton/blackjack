let deck = [];
const suits = ["spades", "hearts", "clubs", "diamonds"]
const cardValue = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]
let playerHand = [];
let dealerHand = [];
let playerSum = 0;
let dealerSum = 0;
let pNumOfWins = 0;
let dNumOfWins = 0;
let turnOver = false;



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
    dealerHand.push(dCard2);
    getScore(playerHand);
    getScore(dealerHand);
    // Update points & Check sum for winner (maybe 2 functions)
}


// Calculates the score of the player/dealer hands and adjusts ACE value depending on of it's over 21 or not.
function getScore(hand){
    let score = 0;
    let hasAce = false;
    for (let i = 0; i < hand.length; i++) {
      score += hand[i].Points
      if (hand[i].Points == 11) {
        hasAce = true;
      } if (hasAce && score > 21) {
        score -= 10;
        hasAce = false;
      }
    }
    return score; 
}


function updateScores() {
    dealerSum = getScore(dealerHand);
    playerSum = getScore(playerHand);
}

function checkWinner() {
    updateScores();
    if (turnOver) {
        while (dealerSum < 17 && dealerSum < playerSum) {
            hit(dealerHand);
            updateScores();
        }
    } // If player and bust
    if (playerSum > dealerSum && playerSum <= 21 || dealerSum > 21) {
        pNumOfWins += 1;
        console.log('You WIN!')
    } else if (playerSum < dealerSum && dealerSum <= 21 || playerSum > 21) {
    dNumOfWins += 1;
    console.log('You LOSE!')
    } else if (playerSum == dealerSum) {
        console.log('PUSH!')
    }
}

// Add next card to the player/dealer's hand, calculate score, and check if there's a winner.
function hit(hand) {
    let nextCard = deck.pop();
    hand.push(nextCard);
    getScore(hand);
    checkWinner();
    console.log(nextCard, 'Score : ', getScore(hand));
    // Update points & Check sum for winner (maybe 2 functions)
}

function stay() {
    turnOver = true;
    checkWinner();


    // Turn over, move onto next player
}

function reset() {
    let deck = [];
    let playerHand = [];
    let dealerHand = [];
    let playerSum = 0;
    let dealerSum = 0;
    turnOver = false;
}


$('#play-button').on('click', () => {
    reset();
    createDeck();
    shuffle(deck);
    deal();
    console.log('Game started');
    console.log('Player Hand', playerHand);
    console.log('Dealer Hand', dealerHand);
})

$('#hit-button').on('click', function() {
    hit(playerHand);
    checkWinner();
})

$('#stay-button').on('click', function() {
    stay();
})


createDeck();
shuffle(deck);
deal();
console.log(deck);
console.log('Player Hand', playerHand, getScore(playerHand));
console.log('Dealer Hand', dealerHand, getScore(dealerHand));