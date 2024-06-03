import CardDeck from './valueObjects/CardDeck.js';
import GameSettings from './valueObjects/GameSettings.js';
import UnoDao from './UnoDao.js';
import History from './History.js';
import {errorMessage} from './help.js';

export default function Facade(baseurl) {
    this.playerList = [];
    this.tableDeck = new CardDeck('tableDeck', 'tDeck');
    this.availableCardsDeck = new CardDeck('availableCardsDeck', 'aDeck');
    this.settings = new GameSettings();
    this.unoDao = new UnoDao(baseurl);
    this.history = new History();
}

Facade.prototype.addPlayer = function(player) {
    this.playerList.push(player);
}

Facade.prototype.playerIsUser = function(id) {
    return this.getPlayerIndex(id) == 0;
}

Facade.prototype.reversePlayerList = function() {
    this.playerList.reverse();
}

Facade.prototype.removePlayerCard = function(playerId, cardId) {
    let player = this.getPlayer(playerId);

    console.log(`[player (${player.name}) made a turn]`);
    this.history.addActionCardPlacement(player, player.deck.getCard(cardId));

    return player.removeCard(cardId);
}

Facade.prototype.getSettings = function() {
    return this.settings;
}

Facade.prototype.getTopCard = function() {
    return this.tableDeck.cardList[this.tableDeck.cardList.length - 1];
}

Facade.prototype.getPlayer = function(id) {
    for(let player of this.playerList)
        if(player.id == id) {
            return player;
        }

    errorMessage(`Could not find player with id ${id}!`);
    return null;
}

Facade.prototype.getPlayerByIndex = function(index) {
    return this.playerList[index];
}

Facade.prototype.getPlayerInTurn = function() {
    for(let player of this.playerList)
        if(player.stateInTurn)
            return player;
}

Facade.prototype.getPlayerIndex = function(id) {
    for(let i = 0; i < this.playerList.length; i++)
        if(this.playerList[i].id == id)
            return i;
    
    errorMessage(`Could not find player index with id ${id}!`);
    return -1;
}

Facade.prototype.getPlayerList = function() {
    return this.playerList;
}

Facade.prototype.getPlayerCount = function() {
    return this.playerList.length;
}

Facade.prototype.getTableDeck = function() {
    return this.tableDeck;
}

Facade.prototype.getAvailableCardsDeck = function() {
    return this.availableCardsDeck;
}

Facade.prototype.getCardById = function(id) {
    let deckList = [this.tableDeck, this.availableCardsDeck];
    
    let i = 2;
    for(let player of this.playerList) {
        deckList[i++] = player.deck;
    }

    for(let deck of deckList) {
        for(let card of deck.getAllCards()) {
            if(card.id == id) {
                return card;
            }
        }
    }

    errorMessage(`Could not find card with id ${id} (in any deck)!`);
    return null;
}

Facade.prototype.getActionEntry = function(index) {
    return this.history.getAction(index);
}

Facade.prototype.getAllActionEntries = function() {
    return this.history.getAllActions();
}

Facade.prototype.getEntryMessage = function(entry) {
    return this.history.getEntryMessage(entry);
}

// -------------------------------------------- AJAX -------------------------------------------

Facade.prototype.loadViewport = function(renderCallback) {
    this.unoDao.loadObjects('players', (playerList) => {
        this.playerList = [];
        
        for(let player of playerList)
            this.addPlayer(player);
    });

    this.unoDao.loadObjects('decks', (deckList) => {
        this.tableDeck = [];
        this.availableCardsDeck = [];

        for(let deck of deckList) {
            if(deck.id == 'tDeck')
                this.tableDeck = deck;
            if(deck.id == 'aDeck')
                this.availableCardsDeck = deck;
        }
    });

    renderCallback();
}

Facade.prototype.writePlayer = function(player, callback) {
    this.unoDao.addObject('players', player);
    callback();
}

Facade.prototype.writeDeck = function(deck, callback) {
    this.unoDao.addObject('decks', deck);
    callback();   
}

/* should I even be able to delete players or decks ? */
Facade.prototype.deletePlayer = function(playerId, callback) {
}

Facade.prototype.deleteDeck = function(deckId, callback) {
}


Facade.prototype.loadHistory = function(callback) {
}

Facade.prototype.updateHistory = function(callback) {
}

Facade.prototype.clearHistory = function(entryId, callback) {
}