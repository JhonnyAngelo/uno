import Card from './valueObjects/Card.js';
import CardDeck from './valueObjects/CardDeck.js';
import GameSettings from './valueObjects/GameSettings.js';
import ViewHandler from './ViewHandler.js';
import {errorMessage, inArray} from './help.js';

export default function GameHandler() {
    this.type = 'ACTION_LISTENER';
    
    this.settings = new GameSettings();
    this.playerList = [];
    this.tableDeck = new CardDeck('tableDeck');
    this.availableCardsDeck = new CardDeck('availableCardsDeck');
    this.drawCount = 0;

    this.viewHandler = new ViewHandler('sprites');
}

GameHandler.prototype.startGame = function(...players) {

    for(let player of players) {
        this.addPlayer(player);
    }

    this.assignDecks(this.generateGlobalCardDeck());

    for(let player of this.playerList)
        this.viewHandler.renderDeck(player.deck);

    this.viewHandler.renderDeck(this.tableDeck);
    this.viewHandler.renderDeck(this.availableCardsDeck);
    /*
    console.log(this.tableDeck.cardList);
    console.log(this.playerList[0].deck);
    console.log(this.playerList[1].deck);
    console.log(this.availableCardsDeck.cardList);
    */
}

GameHandler.prototype.addPlayer = function(player) {
    if(player.type == 'PLAYER' || player.type == 'COMPUTER_PLAYER') {
        this.playerList.push(player);
    } else {
        errorMessage('Only Player objects can be added to the GameHandler!');
    }
}

GameHandler.prototype.generateGlobalCardDeck = function() {
    let globalCardDeck = new CardDeck('globalDeck');
    let colorList = ['red', 'blue', 'green', 'yellow', 'black'];
    let symbolList = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'draw_2', 'reverse', 'skip', 'wild', 'wild_draw_4', 'wild_forced_swap'];

    // red, blue, green , yellow - 4 main colors with 25 cards each
    for(let color = 0; color < 4; color++) {

        // '0' exists only once for every color
        globalCardDeck.add(new Card(colorList[color], symbolList[0]));
        
        // every symbol from '1' to 'Skip' exists twice in the same color
        for(let symbol = 1; symbol < 13; symbol++) {
            for(let i = 0; i < 2; i++) {
                globalCardDeck.add(new Card(colorList[color], symbolList[symbol]));
            }
        }
    }

    // there are 3 black or 'Wild' cards each appearing 4 times
    for(let symbol = 13; symbol < 16; symbol++) {
        for(let i = 0; i < 4; i++) {
            globalCardDeck.add(new Card('black', symbolList[symbol]));
        }
    }

    printCards(globalCardDeck.getAllCards());
    globalCardDeck.shuffle();
    printCards(globalCardDeck.getAllCards());

    return globalCardDeck;
}

function printCards(cardList) { // for console testing
    let message = `[generated deck with ${cardList.length} cards]\n`;
    for(let i = 0; i < 112; i++) {
        message += `\n${cardList[i].color} - ${cardList[i].symbol}`;
    }

    console.log(message);
}

GameHandler.prototype.assignDecks = function(cardDeck) {
    let cardList = [];

    // clear all decks
    for(let player of this.playerList)
        player.deck.clear();
    this.tableDeck.clear();
    this.availableCardsDeck.clear();

    // just test
    this.viewHandler.renderDeck(cardDeck);

    // give each player 7 cards
    for(let player of this.playerList) {
        for(let i = 0; i < 7; i++) {
            player.draw(cardDeck.remove(0));
        }
    }

    // add one card (that's not a wild card) to the tableDeck
    cardList = cardDeck.getAllCards();
    for(let i = 0; i < cardList.length; i++) {
        if(cardList[i].color != 'black') {
            this.tableDeck.add(cardDeck.remove(i));
            break;
        }
    }

    // add all remaining cards to the deck of available cards
    cardList = cardDeck.getAllCards();
    for(let i = 0; i < cardList.length-1; i++) {
        this.availableCardsDeck.add(cardList[i]);
    }
}

GameHandler.prototype.determineEnd = function() {

    // check if a player has no cards - thereby winning the game
    for(let player of this.playerList) {
        if(player.hasNoCard()) {
            player.stateWon = true;
            return;
        }
    }

    if(this.availableCardsDeck.numberOfCards == 0) {
        while(this.tableDeck.numberOfCards > 1) {
            this.availableCardsDeck.add(this.tableDeck.remove(0));
        }
    }
    this.availableCardsDeck.shuffle();
    
    // IMPORTANT:
    // check if the deck of available cards is empty
        // in that case the player with the least amount of cards wins
    // OR (should I do this):
        // in that case the all cards from the table deck (omitting the card at the top) are shuffled and put to the availableCardsDeck
}

GameHandler.prototype.checkUNO = function() {

    // check if a player has only one card
    for(let player of this.playerList) {
        if(player.hasUNO()) {
            // IMPORTANT:
                // should the player shout UNO somehow (idk, maybe write it or press a button...)?
                // OR: should the screen just shout UNO automatically?
        }
    }
}

GameHandler.prototype.checkPlayer = function(player) {
    for(let p of this.playerList) {
        if(player == p)
            return true;
    }
    return false;
}

GameHandler.prototype.assign = function(player) {
    let card = null;

    if(this.checkPlayer(player)) {
        card = this.availableCardsDeck.remove(0);
        player.deck.add(card);
    }
}

GameHandler.prototype.assignDraw = function(player) {
    if(this.checkPlayer(player)) {
        while(this.drawCount > 0) {
            this.assign(player);
            this.drawCount--;
        }
    }
}

GameHandler.prototype.waitForPlayersTurn = function(playerIndex) {
    
    // get the player from the specific index
    if(playerIndex >= 0 && playerIndex < this.playerList.length) {
        let player = this.playerList[playerIndex];

        if(player.stateSkipped == false) {
            this.assignDraw(player);
        }

    } else {
        errorMessage(`${playerIndex} is an invalid index. Can't wait for player's turn.`);
    }
    // check if the player's stateSkipped is true
    // if it isn't, then:

    // assign player x cards if there was/were Draw 2/4 cards placed before
    
    // (the player now needs to know if he can place a card or not)
    // (he can decide to draw a card - even if he doesn't have to neccessarily)
    
    // >> not really how the game works << check if the player has any cards that he could place
        // if he doesn't have any, assign the player in a for-loop as many cards until he has one 
    // ask the player to place a card
}

GameHandler.prototype.validateTurn = function(placedCard) {
    // any wild card automatically counts as a valid turn
    // if the previous card on top of the tableDeck was the Wild card (so only with the color change), only the color is compared
    // else color or symbol have to be equal for it to be valid
    
    return placedCard.color == 'black' || this.tableDeck.color == placedCard.color || this.tableDeck.symbol == placedCard.symbol;
}

GameHandler.prototype.checkSpecialCard = function() {
    let topCard = this.tableDeck.getCard(this.tableDeck.numberOfCards() - 1);

    // create a functionObject/Array
    let specialCards = {};
    specialCards['draw_2'] = () => this.increaseDrawCount(2);
    // ...
    specialCards['wild_draw_4'] = () => { this.wild(); this.increaseDrawCount(4); };
    // ...

    if(inArray(topCard.symbol, ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']) == false) {
        specialCards[topCard.symbol];
        // IMPORTANT: or should it be: ?
        // specialCards[topCard.symbol]();
    }
}

GameHandler.prototype.increaseDrawCount = function(number) {
    if(number == 2 || number == 4)
        this.drawCount += number;
    else
        errorMessage(`${number} is an invalid draw count (only 2 or 4)!`);
}

GameHandler.prototype.reverseDirection = function() {
    // the direction of the gameplay is changed
}

GameHandler.prototype.skipNextPlayer = function() {
    // change the stateSkipped of the subsequent player to true
}

GameHandler.prototype.wild = function() {
    // ask the player to pick one of the 4 main colors
}

GameHandler.prototype.forceASwap = function() {
    // ask the player to pick another player to swap cards with
        // if there are only two players he automatically swaps with his only opponent
}

// IMPORTANT:
// - should playerList be a linked list instead of an array?
// - should ComputerPlayer also be a player?