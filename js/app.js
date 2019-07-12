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
        // const $hiddenCard = $($('#dealerHand').children()[0])
        // $hiddenCard.toggleClass('card back-blue');
        // $hiddenCard.toggleClass('card back-blue');
        $card.appendTo('#dealerHand');
    }
    hideCard();
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
    hideCard();
    getScore(playerHand);
    getScore(dealerHand);
    updateScores();
    $('#playerSum').text(`Player's points: ${playerSum}`);
    $('#dealerSum').text(`Dealer's points:`);
    check21();
}

function hideCard() {
    $($('#dealerHand').children()[0]).attr('id', 'card-back')
}

function revealCard() {
    $($('#dealerHand').children()[0]).attr('id', '')
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
    if (dealerSum === 21 && dealerSum > playerSum) {
        $('#message').text('BLACKJACK! You LOSE!');
        return dWin();
    } else if (playerSum === dealerSum) {
        $('#message').text(`You and the dealer have the same score ${playerSum}, it\'s a PUSH.`);
        return reset();
    } else if (playerSum > dealerSum && playerSum < 22) {
        pWin();
        return $('#message').text(`Your hand (${playerSum}) beats the dealer\'s (${dealerSum}). You WIN!`);
    } else if (playerSum < dealerSum && dealerSum < 22) {
        dWin();
        return $('#message').text(`Dealer\'s hand (${dealerSum}) beats yours (${playerSum}). You LOSE!`);
    }
} 

function checkBust() {
    if (playerSum > 21) {
        dWin();
        return $('#message').text(`Busted with ${playerSum}! You LOSE!`)
    } else if (dealerSum > 21) {
        pWin();
        return $('#message').text(`Dealer busted with ${dealerSum}! You WIN!`);
    }
}

function check21() {
    if (playerSum === 21 && playerSum > dealerSum) {
        $('#message').text('BLACKJACK! You WIN!');
        return pWin();
    // } else if (dealerSum === 21 && dealerSum > playerSum) {
    //     $('#message').text('BLACKJACK! You LOSE!');
    //     dWin();
    } else if (playerSum === 21 && dealerSum === 21) {
        $('#message').text('Wow, double blackjack. PUSH!');
        return reset();
    }
}

function pWin() {
    pNumOfWins += 1;
    revealCard();
    $('#playerWins').text('Player Wins : ' + pNumOfWins);
    $('#deal-button').css({'visibility':'visible'});
    $('#hit-button').css({'visibility':'hidden'});
    $('#stand-button').css({'visibility':'hidden'});
}

function dWin() {
    dNumOfWins += 1;
    revealCard();
    $('#dealerSum').text(`Dealer's points: ${dealerSum}`);
    $('#dealerWins').text('Dealer Wins : ' + dNumOfWins);
    $('#deal-button').css({'visibility':'visible'});
    $('#hit-button').css({'visibility':'hidden'});
    $('#stand-button').css({'visibility':'hidden'});
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
    $('#message').text('');
    deck = [];
    playerHand = [];
    dealerHand = [];
    playerSum = 0;
    dealerSum = 0;
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
    $('#title').hide();
    $('#deal-button').css({'visibility':'hidden'});
    $('#message').css({'visibility':'hidden'});
    $('#hit-button').css({'visibility':'visible'});
    $('#stand-button').css({'visibility':'visible'});
    $('.player').css({'visibility':'visible'});
    $('.dealer').css({'visibility':'visible'});
})

$('#hit-button').on('click', function() {
    hit(playerHand);
    $('#playerSum').text(`Player's points: ${playerSum}`);
    $('#message').css({'visibility':'visible'});
})

$('#stand-button').on('click', function() {
    stand();
    $('#message').css({'visibility':'visible'});
    // $('#dealerSum').text(`Dealer's points: ${dealerSum}`);
})