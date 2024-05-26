import CardDeck from './valueObjects/CardDeck.js';
import GameSettings from './valueObjects/GameSettings.js';
import {errorMessage} from './help.js';

export default function Facade() {
    this.settings = new GameSettings();
    this.playerList = [];
    this.tableDeck = new CardDeck('tableDeck', 'tDeck');
    this.availableCardsDeck = new CardDeck('availableCardsDeck', 'aDeck');
}

Facade.prototype.addPlayer = function(player) {
    this.playerList.push(player);
}

Facade.prototype.reversePlayerList = function() {
    this.playerList.reverse();
}

Facade.prototype.removePlayerCard = function(playerId, cardId) {
    let player = this.getPlayer(playerId);

    console.log(`[player (${player.name}) made a turn]`);

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