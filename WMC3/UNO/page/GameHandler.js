import Card from './valueObjects/Card.js';
import CardDeck from './valueObjects/CardDeck.js';
import {errorMessage, inArray, getRandomInt} from './help.js';

export default function GameHandler(facade, settings) {
    this.type = 'ACTION_LISTENER';
    
    this.facade = facade;
    this.settings = settings;

    this.drawCount = 0;
    this.gameStopped = false;
    this.playerInTurn = null;
    this.previousCardWasDrawCard = false;
}

GameHandler.prototype.setCallbackRender = function(callback) { this.renderCallback = callback; }

GameHandler.prototype.setCallbackCardPlacement = function(callback) { this.cardPlacementCallback = callback; }

GameHandler.prototype.setCallbackWild = function(callback) { this.wildCallback = callback; }

GameHandler.prototype.setCallbackGameWon = function(callback) { this.gameWonCallback = callback; }

GameHandler.prototype.setCallbackAvatarStateIdle = function(callback) { this.avatarIdleCallback = callback; }

GameHandler.prototype.setCallbackAvatarStateThinking = function(callback) { this.avatarThinkingCallback = callback; }

GameHandler.prototype.setCallbackAvatarStateWon = function(callback) { this.avatarWonCallback = callback; }

GameHandler.prototype.startGame = function(...players) {

    if(players.length >= 2) {

        for(let player of players) {
            this.addPlayer(player);
        }
        this.assignDecks(this.generateGlobalCardDeck());

        let user = this.facade.getPlayerByIndex(0);
        user.stateInTurn = true;
        this.playerInTurn = user;
    
    } else {
        errorMessage('There must be at least 2 players!')
    }
}

GameHandler.prototype.stopGame = function() {
    if(this.gameStopped == false) {
        
        this.gameStopped = true;
        console.log('\x1b[36m%s\x1b[0m', '[game stopped]');

        for(let player of this.facade.getPlayerList())
            player.stateInTurn = false;

    } else {
        errorMessage('Game is already stopped!');
    }
}

GameHandler.prototype.continueGame = function(moveTurn) {
    if(this.gameStopped == true) {

        this.gameStopped = false;
        console.log('\x1b[36m%s\x1b[0m', '[game continued]');
    

        if(moveTurn == false)
            this.playerInTurn.stateInTurn = true;
        else if(moveTurn)
            this.moveTurn(this.playerInTurn);
        else
            errorMessage('Missing parameter moveTurn in continueGame()!');

    } else {
        errorMessage('Game is already underway!');
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
            
            if(player.type == 'COMPUTER_PLAYER')
                this.avatarWonCallback();

            player.stateWon = true; // for history entry (to see who won)
            this.gameWonCallback(player);
        
            for(let player of this.facade.getPlayerList()) {
                player.stateInTurn = false;
                player.stateSkipped = false;
            }

            this.stopGame();
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

    return card;
}

GameHandler.prototype.assignDraw = function(player) {
    if(this.checkPlayer(player)) {

        if(this.drawCount > 0) {
            console.log(`[player (${player.name}) draws ${this.drawCount} cards]`);
        }

        while(this.drawCount > 0) {
            this.assign(player);
            this.drawCount--;
        }
    }
}

GameHandler.prototype.optionalDraw = function(player) {
    let assignedCard;

    if(player.optionalDrawPossible && player.stateInTurn && player.stateSkipped == false) {

        console.log(`[player (${player.name}) took a card]`);
        assignedCard = this.assign(player);
        player.optionalDrawPossible = false;
        this.renderCallback();

        if(this.turnPossible(player) == false) {
            console.log(`[Player (${player.name}) can't place a card. Moving on to the next player...]`);
            this.moveTurn(player);
        }

    } else {
        errorMessage(`You can't draw a card now, ${player.name}!`);
    }

    return assignedCard;
}

GameHandler.prototype.makeTurn = async function(playerId, cardId) {
    let player = this.facade.getPlayer(playerId);
    let card = player.deck.getCard(cardId);

    if(player.stateSkipped == false && this.validCard(card)) {
        
        this.facade.getTopCard().resetChosenColor();
        this.facade.removePlayerCard(playerId, cardId);
        this.facade.tableDeck.add(card);

        this.checkSpecialCard(card, playerId);
        this.determineEnd();
        this.moveTurn(player);

        return true;
    
    } else if(this.validCard(card) == false) {
        errorMessage(`Card${cardId} can't be placed now!`);
    
    } else {
        errorMessage(`You're not in turn! (You were skipped)`);
    }

    return false;
}

GameHandler.prototype.moveTurn = function(currPlayer) {
    
    if(this.gameStopped)
        return;
    
    currPlayer.stateInTurn = false;
    currPlayer.optionalDrawPossible = true;

    let nextPlayer = this.getNextPlayer(currPlayer.id);
    nextPlayer.stateInTurn = true;
    this.playerInTurn = nextPlayer;
    nextPlayer.optionalDrawPossible = true;

    if(this.previousCardWasDrawCard == false || !nextPlayer.canIncreaseDrawCounter(this.facade.getTopCard())) {
        this.assignDraw(nextPlayer);
    }

    // start Computer AI if he's in turn
    if(nextPlayer.type == 'COMPUTER_PLAYER') {
        this.computerStart(nextPlayer);
    }
    
    this.renderCallback();
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
    let currPlayer = this.facade.getPlayer(currPlayerId);
    
    // create a functionObject/Array
    let specialCards = {};
    specialCards['draw_2'] = () => this.increaseDrawCount(2)
    specialCards['reverse'] = () => this.reverseDirection(currPlayerId);
    specialCards['skip'] = () => this.skipNextPlayer(currPlayerId);

    specialCards['wild'] = () => this.wild(currPlayerId);
    specialCards['wild_draw_4'] = () => { this.wild(currPlayerId); this.increaseDrawCount(4);}
    specialCards['wild_forced_swap'] = () => { this.forceASwap(currPlayerId); this.wild(currPlayerId);}

    if(inArray(card.symbol, ['draw_2', 'reverse', 'skip', 'wild', 'wild_draw_4', 'wild_forced_swap'])) {
        specialCards[card.symbol]();
    }

    if(inArray(card.symbol, ['draw_2', 'wild_draw_4'])) {
        if(this.settings.drawCardIncreasesValue)
            this.previousCardWasDrawCard = true;
    
    } else if(this.previousCardWasDrawCard) {
        this.assignDraw(currPlayer);
        this.previousCardWasDrawCard = false;

        if(currPlayer.type == 'COMPUTER_PLAYER') {
            this.computerStart(currPlayer);
        }

    } else {
        this.previousCardWasDrawCard = false;
    }
}

GameHandler.prototype.increaseDrawCount = function(number) {
    if(number == 2 || number == 4) {
        this.drawCount += number;
        console.log(`[increased drawCounter by ${number}]`);
    } else {
        errorMessage(`${number} is an invalid draw count (only 2 or 4)!`);
    }
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

GameHandler.prototype.wild = function(playerId) {
    let player = this.facade.getPlayer(playerId);
    let color;

    // swap cards before asking color
    this.renderCallback();
    
    if(this.facade.getPlayerIndex(playerId) == 0) { // player is user
        this.wildCallback();
        
    } else {
        color = player.deck.getMostFrequentColor();
        this.facade.getTopCard().setChosenColor(color);

        // to show the color of the top card
        this.renderCallback();

        return color;
    }
}

GameHandler.prototype.forceASwap = function(currPlayerId) {
    let currPlayer = this.facade.getPlayer(currPlayerId);

    // ask the player to pick another player to swap cards with
    // if there are only two players he automatically swaps with his only opponent
    
    if(this.facade.getPlayerCount() == 2) {
        currPlayer.swapDeck(this.getNextPlayer(currPlayerId, false));
    }
}

// ---------------------------------------- Computer AI ----------------------------------------

GameHandler.prototype.computerStart = function(computerPlayer) {
    this.avatarThinkingCallback();
    
    setTimeout(() => {
        // change img so that pc avatar is looking down
        this.computerChooseCard(computerPlayer);
    }, getRandomInt(500, 1500));
}

GameHandler.prototype.computerChooseCard = function(computerPlayer) {
    let topCard = this.facade.getTopCard();
    let nextPlayer = this.getNextPlayer(computerPlayer.id);

    let wildCards = [
        new Card(0, 'black', 'wild'),
        new Card(0, 'black', 'wild_draw_4'),
        new Card(0, 'black', 'wild_forced_swap')
    ];
    
    let specialCards = [
        new Card(0, topCard.color, 'draw_2'),
        new Card(0, topCard.color, 'reverse'),
        new Card(0, topCard.color, 'skip')
    ];

    switch(this.settings.difficulty) {
        case 1:
            // just pick a random card
            this.computerPlaceRandomCard(computerPlayer);
            break;

        case 2:
            // prioritise draw_2 / wild_draw_4 cards if one was placed or the opponent has just one card left
            let idxDraw2 = computerPlayer.deck.findCardBySymbol('draw_2');
            let idxDraw4 = computerPlayer.deck.findCardBySymbol('wild_draw_4');
            let idxForcedSwap = computerPlayer.deck.findCardBySymbol('wild_forced_swap');

            if(topCard.symbol == 'draw_2' || nextPlayer.hasUNO()) {

                // ... or the opponent has just one card left
                if(nextPlayer.hasUNO()) {
                    idxDraw2 = computerPlayer.deck.findCard(new Card(0, topCard.color, 'draw_2'));

                    if(idxForcedSwap != -1)
                        this.cardPlacementCallback(computerPlayer.deck.cardList[idxForcedSwap].id);
                }

                if(idxDraw2 != -1)
                    this.cardPlacementCallback(computerPlayer.deck.cardList[idxDraw2].id);
                else if(idxDraw4 != -1)
                    this.cardPlacementCallback(computerPlayer.deck.cardList[idxDraw4].id);

            } else if(topCard.symbol == 'wild_draw_4' && idxDraw4 != -1) {
                    this.cardPlacementCallback(computerPlayer.deck.cardList[idxDraw4].id);
            
            // (DONE JUST TEST MAYBE) try forcing a swap if the opponent has significantly less cards
            } else if(computerPlayer.getCardCount() >= 7 && nextPlayer.getCardCount() == computerPlayer.getCardCount() - 5) {
                if(idxForcedSwap != -1)
                    this.cardPlacementCallback(computerPlayer.deck.cardList[idxForcedSwap].id);

                // just pick a random card
            } else {
                this.computerPlaceRandomCard(computerPlayer);
            }

            break;

        default:
            errorMessage(`Difficulty level ${difficulty} does not exist!`);
    }

    setTimeout(this.avatarIdleCallback(), 5000);

    // (0. Place draw_2 if in the previous turn one has been put - same for wild_draw_4)
    // 1. Place wild_draw_4 or draw_2 if the next player has UNO
    
    // if you have fewer cards than the opponent:

    // 3. see if you have any special card(s) you can use and finally place a normal card in the color you need
    // 2. see how many cards the opponent has (if under 3 - use a wild_draw_4)
    // 99. place whatever you can
}

GameHandler.prototype.computerPlaceRandomCard = function(computerPlayer) {
    let drawnCard;
    
    for(let card of computerPlayer.deck.getAllCards()) {
        if(this.validCard(card)) {
            this.cardPlacementCallback(card.id);
            return;
        }
    }
    
    console.log("[PC doesn't have any cards - picking a card from the table...]");
    drawnCard = this.optionalDraw(computerPlayer);
    if(drawnCard)
        this.cardPlacementCallback(drawnCard.id);
}

// ------------------------------------------ Testing ------------------------------------------

GameHandler.prototype.assignTestDecks = function(deck1, deck2, topCard) {
    
    let tableDeck = new CardDeck('tableDeck', 'tDeck');
    let playerList = this.facade.getPlayerList();

    playerList[0].deck.cardList = deck1.cardList;
    playerList[1].deck.cardList = deck2.cardList;

    tableDeck.add(topCard);
    this.facade.tableDeck = tableDeck;
}