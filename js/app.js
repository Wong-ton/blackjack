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
let hasAce = false;



// Create a card deck from the 2 arrays; Sets the values of ace & face cards to 11 & 10 respectively.
function createDeck() {
    for (let i = 0; i < suits.length; i++) {
        for (let x = 0; x < cardValue.length; x++) {
            
            let points = parseInt(cardValue[x]);
            if (cardValue[x] === "J" || cardValue[x] === "Q" || cardValue[x] === "K")
                points = 10;
            if (cardValue[x] === "A")
                points = 11;
            
                deck.push({value: cardValue[x], suit: suits[i], points: points})
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

function renderHand() {
    $('#playerHand').empty();
    for (let i = 0; i < playerHand.length; i++) {
        const suit = playerHand[i].suit
        const value = isNaN(playerHand[i].value) ? playerHand[i].value : playerHand[i].value === "10" ? "r" + playerHand[i].value : "r0" + playerHand[i].value
        const $card = $('<div/>');
        $card.addClass(`card ${suit} ${value}`);
        $card.appendTo('#playerHand');
    }
    $('#dealerHand').empty();
    for (let i = 0; i < dealerHand.length; i++) {
        const suit = dealerHand[i].suit
        const value = isNaN(dealerHand[i].value) ? dealerHand[i].value : dealerHand[i].value === "10" ? "r" + dealerHand[i].value : "r0" + dealerHand[i].value
        const $card = $('<div/>');
        $card.addClass(`card ${suit} ${value}`);
        $card.appendTo('#dealerHand');
    }
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
    renderHand();
    getScore(playerHand);
    getScore(dealerHand);
    updateScores();
    check21();
    // Update points & Check sum for winner (maybe 2 functions)
}


// Calculates the score of the player/dealer hands and adjusts ACE value depending on of it's over 21 or not.
function getScore(hand){
    let score = 0;
    // let hasAce = false;
    for (let i = 0; i < hand.length; i++) {
        score += hand[i].points
        if (hand[i].points == 11) {
            hasAce = true;
        } if (hasAce && score > 21) {
            score -= hand.filter(e => e.points === 11).length === 2 && hand.length > 2 ? 20 : hand.filter(e => e.points === 11).length === 3 && hand.length > 2 ? 30 : 10
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
    if (turnOver) {
        while (dealerSum < 17) {
            hit(dealerHand);
            updateScores();
        }
    }
    if (playerSum === dealerSum) {
        return console.log('You and the dealer have the same score, so it\'s a PUSH.');
    }
    else if (playerSum > dealerSum && playerSum < 22) {
        pWin();
        return console.log('Your hand beats the dealer\'s. You WIN!');
    } else if (playerSum < dealerSum && dealerSum < 22) {
        dWin();
        return console.log('Dealer\'s hand beats yours. You LOSE!');
    }
}

function checkBust() {
     if (playerSum > 21) {
        dWin();
        $('#message').text('Busted! You LOSE!')
    } else if (dealerSum > 21) {
        pWin();
        $('#message').text('Dealer busted! You WIN!');
    } 
}

function check21() {
    if (playerSum === 21 && playerSum > dealerSum) {
        pWin();
        console.log('BLACKJACK! You WIN!');
    } else if (dealerSum === 21 && dealerSum > playerSum) {
        dWin();
        console.log('BLACKJACK! You LOSE!');
    } else if (playerSum && dealerSum === 21) {
        console.log('Wow, double blackjack. PUSH!');
    }
}

function pWin() {
    pNumOfWins += 1;
    $('#playerWins').text('Player Wins: ', pNumOfWins);
}

function dWin() {
    dNumOfWins += 1;
    $('#dealerWins').text('Dealer Wins :', dNumOfWins);
}

// Add next card to the player/dealer's hand, calculate score, and check if there's a winner.
function hit(hand) {
    let nextCard = deck.pop();
    hand.push(nextCard);
    getScore(hand);
    renderHand();
    updateScores();
    checkBust();
    console.log(nextCard, 'Score : ', getScore(hand));
    // Update points & Check sum for winner (maybe 2 functions)
}

function stand() {
    turnOver = true;
    checkBust();
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
    hasAce = false;
}


$('#deal-button').on('click', () => {
    reset();
    createDeck();
    shuffle(deck);
    deal();
    updateScores();
    console.log('Game started');
    console.log(deck);
    console.log('Player Hand', playerHand, 'Points : ', playerSum);
    console.log('Dealer Hand', dealerHand, 'Points : ', dealerSum);
    $('#title').css({'visibility':'hidden'});
    $('#deal-button').css({'visibility':'hidden'});
    $('#hit-button').css({'visibility':'visible'});
    $('#stand-button').css({'visibility':'visible'});
    $('#playerSum').text(`Player's points: ${playerSum}`)
    $('#dealerSum').text(`Dealer's points: ${dealerSum}`)
})

$('#hit-button').on('click', function() {
    hit(playerHand);
})

$('#stand-button').on('click', function() {
    stand();
})