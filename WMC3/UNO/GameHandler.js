import Card from './valueObjects/Card.js';
import CardDeck from './valueObjects/CardDeck.js';
import {errorMessage, inArray} from './help.js';

export default function GameHandler(facade) {
    this.type = 'ACTION_LISTENER';
    
    this.facade = facade;
    this.drawCount = 0;
}

GameHandler.prototype.startGame = function(...players) {

    if(players.length >= 2) {

        for(let player of players) {
            this.addPlayer(player);
        }
        this.assignDecks(this.generateGlobalCardDeck());
        this.facade.getPlayerByIndex(0).stateInTurn = true;
    
    } else {
        errorMessage('There must be at least 2 players!')
    }
}

GameHandler.prototype.addPlayer = function(player) {
    if(player.type == 'PLAYER' || player.type == 'COMPUTER_PLAYER') {
        this.facade.addPlayer(player);
    } else {
        errorMessage('Only Player objects can be added to the GameHandler!');
    }
}

GameHandler.prototype.generateGlobalCardDeck = function() {
    let globalCardDeck = new CardDeck('globalDeck');
    let colorList = ['red', 'blue', 'green', 'yellow', 'black'];
    let symbolList = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'draw_2', 'reverse', 'skip', 'wild', 'wild_draw_4', 'wild_forced_swap'];
    let id = 1;

    // red, blue, green , yellow - 4 main colors with 25 cards each
    for(let color = 0; color < 4; color++) {

        // '0' exists only once for every color
        globalCardDeck.add(new Card(`card${id++}`, colorList[color], symbolList[0]));
        
        // every symbol from '1' to 'Skip' exists twice in the same color
        for(let symbol = 1; symbol < 13; symbol++) {
            for(let i = 0; i < 2; i++) {
                globalCardDeck.add(new Card(`card${id++}`, colorList[color], symbolList[symbol]));
            }
        }
    }

    // there are 3 black or 'Wild' cards each appearing 4 times
    for(let symbol = 13; symbol < 16; symbol++) {
        for(let i = 0; i < 4; i++) {
            globalCardDeck.add(new Card(`card${id++}`, 'black', symbolList[symbol]));
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
    let playerList = this.facade.getPlayerList();
    let tableDeck = this.facade.getTableDeck();
    let availableCardsDeck = this.facade.getAvailableCardsDeck();

    // clear all decks
    for(let player of playerList)
        player.clearDeck();
    tableDeck.clear();
    availableCardsDeck.clear();

    // give each player 7 cards
    for(let player of playerList) {
        for(let i = 0; i < 7; i++) {
            player.draw(cardDeck.remove(0));
        }
    }

    // add one card (that's not a wild card) to the tableDeck
    cardList = cardDeck.getAllCards();
    for(let i = 0; i < cardList.length; i++) {
        if(cardList[i].color != 'black') {
            tableDeck.add(cardDeck.remove(i));
            break;
        }
    }

    // add all remaining cards to the deck of available cards
    cardList = cardDeck.getAllCards();
    for(let i = 0; i < cardList.length-1; i++) {
        availableCardsDeck.add(cardList[i]);
    }
}

GameHandler.prototype.determineEnd = function() {

    // check if a player has no cards - thereby winning the game
    for(let player of this.facade.getPlayerList()) {
        if(player.hasNoCard()) {
            
            player.stateWon = true; // for history entry (to see who won)
            alert(`${player.name} has won!`);
        
            for(let player of this.facade.getPlayerList()) {
                player.stateInTurn = false;
                player.stateSkipped = false;
            }
        }
    }
}

GameHandler.prototype.checkUNO = function() {

    // check if a player has only one card
    for(let player of this.playerList) {
        if(player.hasUNO()) {
            // IMPORTANT:
                // should the player shout UNO somehow (idk, maybe write it or press a button...)?
                // OR: should the screen just shout UNO automatically?

                // - CURRENT IDEA (from david)
                //       you need to press a blinking button (when having only 1 card)
                //       before the next player makes his turn
                //       (for the PC there is a random timer between 2 & 3 seconds
                //       meaning that the player can also catch the PC not saying UNO and make him draw 2 cards)

                // RATHER: you need to press the button before placing your second-to-last card
        }
    }
}

GameHandler.prototype.checkPlayer = function(player) {
    for(let p of this.facade.getPlayerList()) {
        if(player == p)
            return true;
    }
    return false;
}

GameHandler.prototype.assign = function(player) {
    let availableCardsDeck = this.facade.getAvailableCardsDeck();
    let tableDeck = this.facade.getTableDeck();
    let card = null;

    // refill the card deck to draw if it is empty
    if(availableCardsDeck.getNumberOfCards() == 0) {
        while(tableDeck.getNumberOfCards() > 1) {
            availableCardsDeck.add(tableDeck.remove(0));
        }
        availableCardsDeck.shuffle();
    }

    // actual assignment
    if(this.checkPlayer(player)) {
        card = availableCardsDeck.remove(0);
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

GameHandler.prototype.optionalDraw = function(player, renderCallback) {
    
    if(player.optionalDrawPossible && player.stateInTurn && player.stateSkipped == false) {

        console.log(`[player (${player.name}) took a card]`);
        this.assign(player);
        player.optionalDrawPossible = false;
        renderCallback();

        if(this.turnPossible(player) == false) {
            console.log(`[${player.name} can't place a card. Moving on to the next player...]`);
            this.moveTurn(player);
        }

    } else {
        errorMessage("You can't draw a card now!");
    }
}

GameHandler.prototype.makeTurn = function(playerId, cardId) {
    let player = this.facade.getPlayer(playerId);
    let card = player.deck.getCard(cardId);

    if(player.stateSkipped == false && this.validCard(card)) {
        
        this.facade.getTopCard().resetChosenColor();
        this.facade.removePlayerCard(playerId, cardId);
        this.facade.tableDeck.add(card);

        this.checkSpecialCard(card, playerId);
        this.determineEnd();
        this.moveTurn(player);
    
    } else if(this.validCard(card) == false) {
        errorMessage(`You can't place that card!`);
    
    } else {
        errorMessage("You're not in turn! (You were skipped)");
    }
}

GameHandler.prototype.moveTurn = function(currPlayer) {
    currPlayer.stateInTurn = false;
    currPlayer.optionalDrawPossible = true;

    let nextPlayer = this.getNextPlayer(currPlayer.id);
    nextPlayer.stateInTurn = true;
    nextPlayer.optionalDrawPossible = true;
    this.assignDraw(nextPlayer);
}

GameHandler.prototype.getNextPlayer = function(currPlayerId, considerStateSkipped = true) {
    let currIndex = this.facade.getPlayerIndex(currPlayerId);
    let nextPlayer = null;

    if(currIndex >= 0) {
        while(true) {

            if(currIndex == this.facade.getPlayerCount() - 1)
                currIndex = 0;
            else
                currIndex++;

            nextPlayer = this.facade.getPlayerByIndex(currIndex);

            if(considerStateSkipped && nextPlayer.stateSkipped)
                nextPlayer.stateSkipped = false;
            else
                break;
        }
    }

    return nextPlayer;
}

GameHandler.prototype.validCard = function(placedCard) {
    let topCard = this.facade.getTopCard();

    // any wild card automatically counts as a valid turn
    // if the previous card on top of the tableDeck was the Wild card (so only with the color change), only the color is compared
    // else color or symbol have to be equal for it to be valid

    return  placedCard.color == 'black' || topCard.getChosenColor() == placedCard.color || topCard.color == placedCard.color || topCard.symbol == placedCard.symbol;
}

GameHandler.prototype.turnPossible = function(player) {
    if(this.checkPlayer(player)) {
        console.log(`draw: ${player.optionalDrawPossible}\nrecommendation: ${this.recommendCard(player)} - RETURN ${player.optionalDrawPossible || this.recommendCard(player) != null}`);
        return player.optionalDrawPossible || this.recommendCard(player) != null;
    }
    return false;
}

GameHandler.prototype.recommendCard = function(player) {
    for(let card of player.deck.getAllCards())
        if(this.validCard(card))
            return card;
    return null;
}

GameHandler.prototype.checkSpecialCard = function(card, currPlayerId) {
    // create a functionObject/Array
    let specialCards = {};
    specialCards['draw_2'] = () => this.increaseDrawCount(2);
    specialCards['reverse'] = () => this.reverseDirection(currPlayerId);
    specialCards['skip'] = () => this.skipNextPlayer(currPlayerId);

    specialCards['wild'] = () => this.wild();
    specialCards['wild_draw_4'] = () => { this.wild(); this.increaseDrawCount(4); };
    specialCards['wild_forced_swap'] = () => { this.wild(); this.forceASwap(currPlayerId); }

    if(inArray(card.symbol, ['draw_2', 'reverse', 'skip', 'wild', 'wild_draw_4', 'wild_forced_swap'])) {
        specialCards[card.symbol]();
    }
}

GameHandler.prototype.increaseDrawCount = function(number) {
    if(number == 2 || number == 4)
        this.drawCount += number;
    else
        errorMessage(`${number} is an invalid draw count (only 2 or 4)!`);
}

GameHandler.prototype.reverseDirection = function(currPlayerId) {
    if(this.facade.getPlayerCount() == 2)
        this.skipNextPlayer(currPlayerId);
    else
        this.facade.reversePlayerList();
}

GameHandler.prototype.skipNextPlayer = function(currPlayerId) {
    let nextPlayer = this.getNextPlayer(currPlayerId, false);
    nextPlayer.stateSkipped = true;
}

GameHandler.prototype.wild = function() {
    // ask the player to pick one of the 4 main colors

    //for now with an alert
    let color;
    do {
        color = prompt('Select color: ');
    } while(inArray(color, ['red', 'blue', 'green', 'yellow']) == false);

    this.facade.getTopCard().setChosenColor(color);
}

GameHandler.prototype.forceASwap = function(currPlayerId) {
    let currPlayer = this.facade.getPlayer(currPlayerId);

    if(this.facade.getPlayerCount() == 2) {
        currPlayer.swapDeck(this.getNextPlayer(currPlayerId, false));
    }
    // ask the player to pick another player to swap cards with
        // if there are only two players he automatically swaps with his only opponent
}