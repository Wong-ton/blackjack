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
            if (cardValue[x] === "J" ||  cardValue[x] === "Q" || cardValue[x] === "K")
                points = 10;
            if (cardValue[x] === "A")
                points = 11;
            
            deck.push({value: cardValue[x], suit: suits[i], points: points})
        }
    }
 }

// Fisher-Yates shuffle function, which selects a random card from the front and places it in the back,
// the back unshuffled card is moved to the front, where it waits to be shuffled. The cycle repeats until
// all of the cards are shuffled. LINK TO SOURCE: https://bost.ocks.org/mike/shuffle/
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

// Render card images for respective hands, afterwards, hide a dealer card. 
// Div is created so that the card's suit & value can be added as a class so that cards can be rendered because default card value has "r" in front of 10 point cards.
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
    hideCard();
}

function deal() {
    playerHand.push(deck.pop());
    dealerHand.push(deck.pop());
    playerHand.push(deck.pop());
    dealerHand.push(deck.pop());
    renderHand();
    getScore(dealerHand);
    getScore(playerHand);
    updateScores(); 
}

// hideCard function gives card image an ID of card-back so it can override the face up card image since ID takes precedence over class
function hideCard() {
    $($('#dealerHand').children()[0]).attr('id', 'card-back')
}

function revealCard() {
    $($('#dealerHand').children()[0]).attr('id', '')
}

// Calculates the score of the player/dealer hands and adjusts Ace value depending on of it's over 21 or not.
function getScore(hand) {
    hasAce = false;
    let score = 0;
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
    $('#playerSum').text(`PLAYER'S points : ${playerSum}`);
    if (turnOver === false) {
        $('#dealerSum').text(`DEALER'S points : ${dealerHand[1].points}`);
    } else if (turnOver) {
        $('#dealerSum').text(`DEALER'S points : ${dealerSum}`);
    }
}

function checkWinner() {
    if (turnOver) {
        while (dealerSum < 17) {
            hit(dealerHand);
        }
    }
    if (dealerSum === 21 && dealerSum > playerSum) {
        dWin();
        return $('#message').text('BLACKJACK! You LOSE!');
    } else if (playerSum > dealerSum && playerSum < 22) {
        pWin();
        return $('#message').text(`Your hand (${playerSum}) beats the dealer\'s (${dealerSum}). You WIN!`);
    } else if (playerSum < dealerSum && dealerSum < 22) {
        dWin();
        return $('#message').text(`Dealer\'s hand (${dealerSum}) beats yours (${playerSum}). You LOSE!`);
    } else if (playerSum === dealerSum) {
        $('#message').css({'visibility':'visible'})
        $('#message').text(`It\'s a PUSH! You and dealer have the same score of (${playerSum})`);
        return tie();
    }
} 

function checkBust() {
    if (playerSum > 21) {
        dWin();
        return $('#message').text(`Busted with (${playerSum})! You LOSE!`)
    } else if (dealerSum > 21) {
        pWin();
        return $('#message').text(`Dealer busted with (${dealerSum})! You WIN!`);
    }
}

function check21() {
    if (playerSum === 21 && playerSum > dealerSum) {
        $('#message').text('BLACKJACK! You WIN!');
        return pWin();
    } else if (playerSum === 21 && dealerSum === 21) {
        $('#message').css({'visibility':'visible'});
        $('#message').text('Wow, double blackjack. PUSH!');
        return tie();
    }
}

function pWin() {
    pNumOfWins += 1;
    revealCard();
    $('#dealerSum').text(`DEALER'S points : ${dealerSum}`);
    $('#playerWins').text('Wins : ' + pNumOfWins);
    $('#deal-button').css({'visibility':'visible'});
    $('#hit-button').css({'visibility':'hidden'});
    $('#stand-button').css({'visibility':'hidden'});
    $('#message').css({'visibility':'visible'});
}

function dWin() {
    dNumOfWins += 1;
    revealCard();
    $('#dealerSum').text(`DEALER'S points : ${dealerSum}`);
    $('#dealerWins').text('Wins : ' + dNumOfWins);
    $('#deal-button').css({'visibility':'visible'});
    $('#hit-button').css({'visibility':'hidden'});
    $('#stand-button').css({'visibility':'hidden'});
    $('#message').css({'visibility':'visible'});
}

function tie() {
    revealCard();
    $('#dealerSum').text(`DEALER'S points : ${dealerSum}`);
    $('#deal-button').css({'visibility':'visible'});
    $('#hit-button').css({'visibility':'hidden'});
    $('#stand-button').css({'visibility':'hidden'});
    $('#message').css({'visibility':'visible'});
}

// Add next card to the player/dealer's hand, calculate score, and check if hand is over 21
function hit(hand) {
    hand.push(deck.pop());
    getScore(hand);
    updateScores();
    renderHand();
    checkBust();
}

// End player turn; call checkWinner function which adds cards dealer hand if it's less than 17
function stand() {
    turnOver = true;
    check21();
    checkWinner();
    checkBust();
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
    $('#playerSum').text(`PLAYER'S points : ${playerSum}`);
})

$('#stand-button').on('click', function() {
    stand();
    $('#message').css({'visibility':'visible'});
})