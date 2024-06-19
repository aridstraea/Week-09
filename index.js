class Card {

    constructor(faceValue, suit) {
        // Card values cannot leave the range of 2-14 (inclusive).
        if (faceValue < 2 || faceValue > 14) throw new IllegalArgumentException("Invalid face value.");
        // Card suits must be one of the following: Hearts, Diamonds, Clubs, Spades
        if (!suits.includes(suit)) throw new Error('Invalid suit.');

        this.suit = suit;
        this.faceValue = faceValue;
    }



    getSuit() {
        return this.suit;
    }

    getFaceValue() {
        return this.faceValue;
    }

    getRank() {
        return standardCardValues.get(this.faceValue);
    }

    describe() {
        let rank = this.getRank();
        return `${rank} of ${this.suit}`;
    }
}

class Deck {

    constructor() {
        console.log('Creating a new deck.');
        this.deck = [];
        for (let i = 0; i < suits.length; i++) {
            console.log('Current Suit: ' + suits[i]);
            for (let j = 2; j <= (standardCardValues.size + 1); j++) {
                console.log('Current Rank: ' + standardCardValues.get(j));
                this.deck.push(new Card(j, suits[i]));
            }
        }
    }

    describe() {
        let cardList = '';
        this.deck.forEach(element => {
            cardList += element.describe() + '\n';
        });
        return cardList;
    }

    getDeck() {
        return this.deck;
    }

    // I found this cool shuffle function on stackoverflow
    // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array 
    shuffle() {
        let deck = this.deck;
        
        let currentIndex = deck.length;

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

    getName() {
        return this.name;
    }

    getScore() {
        return this.score;
    }

    getHand() {
        return this.hand;
    }

    describe() {
        let hand = '';

        this.hand.forEach(element => {
            hand += element.describe() + '\n';
        });

        return `${this.name} has ${this.score} points and the following cards:\n${hand}`;
    }

    incrementScore() {
        this.score++;
    }

    flipCard() {
        return this.hand.shift();
    }

    drawCard(deck) {
        this.hand.push(deck.draw());
    }
}

class Game {
    constructor() {
        this.players = [];
        this.deck = new Deck();
    }

    addPlayer(name) {
        this.players.push(new Player(name));
    }

    dealCards() {
        let deck = this.deck;
        deck.shuffle(deck);

        let player1 = this.players[0];
        let player2 = this.players[1];
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
        let player2 = this.players[1];

        for (let i = 0; i < standardDeckSize / 2; i++) {
            console.log("***** ROUND " + (i + 1) + " *****");
      
            let player1card = player1.flipCard();
            let player2card = player2.flipCard();
      
            console.log("\t" + player1.getName() + " draws: " + player1card.describe());
            console.log("\t" + player2.getName() + " draws: " + player2card.describe());
      
            // Determine this round's winner
            let roundOutput = '';
            if (player1card.getFaceValue() > player2card.getFaceValue()) {
                roundOutput = `\t${player1.getName()} wins the round! They have been awarded a point.`;
                player1.incrementScore();
            } else if (player1card.getFaceValue() < player2card.getFaceValue()) {
                roundOutput = `\t${player2.getName()} wins the round! They have been awarded a point.`;
                player2.incrementScore();
            } else {
                roundOutput = "\tThis round is a tie! No point is awarded.";
            }
            console.log("\n" + roundOutput);
      
            // Output scores
            console.log(this.getCurrentScores(player1, player2));
        }
    }

    getCurrentScores(player1, player2) {
        return `${player1.getName()}: ${player1.getScore()} points\n${player2.getName()}: ${player2.getScore()} points`;
    }

    getWinner() {
        let player1 = this.players[0];
        let player2 = this.players[1];

        let winner = '';
        if (player1.getScore() > player2.getScore()) {
            winner = `${player1.getName()} wins the game!`;
        } else if (player1.getScore() < player2.getScore()) {
            winner = `${player2.getName()} wins the game!`;
        } else {
            winner = `The game is a tie!`;
        }
        return winner;
    }
}

    // Constants
var suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades']
var standardCardValues = intializeStandardCardValues();
var standardDeckSize = standardCardValues.size * suits.length;
    // Utility
function intializeStandardCardValues() {
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

game.dealCards();
game.playGame();
console.log(game.getWinner());
