class Card {

    constructor(faceValue, suit) {
        // Card values cannot leave the range of 2-14 (inclusive).
        if (faceValue < 2 || faceValue > 14) throw new IllegalArgumentException("Invalid face value.");
        // Card suits must be one of the following: Hearts, Diamonds, Clubs, Spades
        if (!suits.includes(suit)) throw new Error('Invalid suit.');

        this.suit = suit;
        this.faceValue = faceValue;
    }

    getSuit() { // Return the suit of the card.
        return this.suit; // Suit will be pulled from the suits array at runtime.
    }

    getFaceValue() { // Return the face value of the card.
        return this.faceValue; // Face Value will be used to determine rank at runtime.
    }

    getRank() { // Return the rank of the card.
        return standardCardValues.get(this.faceValue); // Rank will be pulled from the standardCardValues map at runtime.
    }

    describe() { // Return the rank and suit of the card.
        let rank = this.getRank();
        return `${rank} of ${this.suit}`; // [Rank] of [Suit], e.g. "Two of Hearts"
    }
}

class Deck {
    constructor() {
        console.log('Creating a new deck.');
        this.deck = [];
        for (let i = 0; i < suits.length; i++) { // For each suit i
            for (let j = 2; j <= (standardCardValues.size + 1); j++) { // For each face value j
                this.deck.push(new Card(j, suits[i])); // Add a new card to the deck: [Face Value] of [Suit]
            }
        }
    }

    describe() {
        let cardList = '';
        this.deck.forEach(element => {
            cardList += element.describe() + '\n'; // Add each card to the card list
        });
        return cardList; // Return the card list
    }

    getDeck() {
        return this.deck; // Return the deck
    }

    // I found this cool shuffle function on stackoverflow
    // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array 
    shuffle() {
        let deck = this.deck; // Get the deck
        let currentIndex = deck.length; // Get the length of the deck

        // While there remain elements to shuffle...
        while (currentIndex != 0) {
            // Pick a remaining element...
            let randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [deck[currentIndex], deck[randomIndex]] = [deck[randomIndex], deck[currentIndex]];
        }
    }

    draw() {
        // Remove the top card from the deck and return it
        return this.deck.shift();
    }
}

class Player {
    constructor(name) {
        this.name = name;
        this.score = 0;
        this.hand = [];
    }

    getName() { // Return the player's name
        return this.name;
    }

    getScore() { // Return the player's score
        return this.score;
    }

    getHand() { // Return the player's hand
        return this.hand;
    }

    describe() { 
        let hand = '';

        this.hand.forEach(element => {
            hand += element.describe() + '\n'; // Add each card to the hand
        });

        return `${this.name} has ${this.score} points and the following cards:\n${hand}`; // Return the player's name, score, and hand
        // [Player Name] has [Player Score] points and the following cards: [Card 1], [Card 2], ... [Card n]
    }

    incrementScore() {
        this.score++; // Increment the player's score
    }

    flipCard() {
        return this.hand.shift(); // Remove the top card from the player's hand and return it
    }

    drawCard(deck) {
        this.hand.push(deck.draw()); // Add a card to the player's hand, removing it from deck
    }
}

class Game {
    constructor() {
        this.players = [];
        this.deck = new Deck();
    }

    addPlayer(name) { // Add a player to the game
        this.players.push(new Player(name));
    }

    dealCards() { // Deal cards to the players
        let deck = this.deck;
        let player1 = this.players[0];
        let player2 = this.players[1]; // I find it easier to reference the players by name

        deck.shuffle(deck);
        for (let i = 0; i < standardDeckSize; i++) {
            if (i % 2 == 0) { // even numbers; player 2 (goes second)
                player2.drawCard(deck);
            } else { // odd numbers; player 1 (goes first)
                player1.drawCard(deck);
            }
        }
    }

    playGame() {
        let player1 = this.players[0];
        let player2 = this.players[1]; // I find it easier to reference the players by name

        for (let i = 0; i < standardDeckSize / 2; i++) {
            console.log("***** ROUND " + (i + 1) + " *****");
      
            let player1card = player1.flipCard();
            let player2card = player2.flipCard();
      
            console.log("\t" + player1.getName() + " draws: " + player1card.describe());
            console.log("\t" + player2.getName() + " draws: " + player2card.describe());
      
            // Determine this round's winner
            let roundOutput = '';
            if (player1card.getFaceValue() > player2card.getFaceValue()) { // Player 1 wins
                roundOutput = `\t${player1.getName()} wins the round! They have been awarded a point.`;
                player1.incrementScore();
            } else if (player1card.getFaceValue() < player2card.getFaceValue()) { // Player 2 wins
                roundOutput = `\t${player2.getName()} wins the round! They have been awarded a point.`;
                player2.incrementScore();
            } else { // Tie
                roundOutput = "\tThis round is a tie! No point is awarded.";
            }
            console.log("\n" + roundOutput);
      
            // Output scores
            console.log(this.getCurrentScores());
        }
        console.log("***** GAME OVER *****");
        console.log("The final scores are:");
        console.log(this.getCurrentScores());
        console.log(this.getWinner());
    }

    getCurrentScores() {
        let player1 = this.players[0];
        let player2 = this.players[1]; // I find it easier to reference the players by name

        // Return the player's name and score. Highest points return first.
        if (player1.getScore() >= player2.getScore()) return `${player1.getName()}: ${player1.getScore()} points\n${player2.getName()}: ${player2.getScore()} points`; 
        else return `${player2.getName()}: ${player2.getScore()} points\n${player1.getName()}: ${player1.getScore()} points`;
    }

    getWinner() {
        let player1 = this.players[0];
        let player2 = this.players[1]; // I find it easier to reference the players by name

        let winner = '';
        if (player1.getScore() > player2.getScore()) {
            winner = `${player1.getName()} wins the game!`; // Player 1 wins
        } else if (player1.getScore() < player2.getScore()) {
            winner = `${player2.getName()} wins the game!`; // Player 2 wins
        } else {
            winner = `The game is a tie!`; // Tie
        }
        return winner;
    }
}

    // Constants
var suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'] // Card suits
var standardCardValues = intializeStandardCardValues(); // Card values
var standardDeckSize = standardCardValues.size * suits.length; // Deck size
    // Utility
function intializeStandardCardValues() { // Initialize standard card values
    let values = new Map();

    values.set(2, "Two");
    values.set(3, "Three");
    values.set(4, "Four");
    values.set(5, "Five");
    values.set(6, "Six");
    values.set(7, "Seven");
    values.set(8, "Eight");
    values.set(9, "Nine");
    values.set(10, "Ten");
    values.set(11, "Jack");
    values.set(12, "Queen");
    values.set(13, "King");
    values.set(14, "Ace");

    return values;
}

// Run Game below.
let game = new Game();

// Add 2 players to the game
game.addPlayer('Player 1');
game.addPlayer('Player 2');

// Deal cards to the players & play game
game.dealCards();
game.playGame();