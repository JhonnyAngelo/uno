import CardDeck from './valueObjects/CardDeck.js';
import GameSettings from './valueObjects/GameSettings.js';
import UnoDao from './UnoDao.js';
import History from './History.js';
import Snapshot from './Snapshot.js';
import {errorMessage, inArray} from './help.js';

export default function Facade(baseurl) {
    this.playerList = [];
    this.tableDeck = new CardDeck('tableDeck', 'tDeck');
    this.availableCardsDeck = new CardDeck('availableCardsDeck', 'aDeck');
    this.settings = new GameSettings('enabled', 'enabled', 1);
    this.unoDao = new UnoDao(baseurl);
    this.history = new History();

    this.latestSnapshot = null;
}

Facade.prototype.addPlayer = function(player) {
    this.playerList.push(player);
}

Facade.prototype.playerIsUser = function(id) {
    return this.getPlayerIndex(id) == 0;
}

Facade.prototype.getUser = function() {
    for(let player of this.playerList)
        if(player.type == 'PLAYER' && player.name == 'user')
            return player;
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

/*
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
*/

/* playerStats */
Facade.prototype.loadPlayerStats = function(player) {
    this.unoDao.load();
}

Facade.prototype.writePlayerStats = function(player) {
    let playerStats = {
        playerId: player.id,
        gamesWon: player.gamesWon
    }
    this.unoDao.add('players', playerStats);
}

Facade.prototype.deletePlayerStats = function(playerId) {}



/* latest snapshot */
Facade.prototype.loadLatestSnapshot = function() {
    this.unoDao.load('latestSnapshot/1', (snapshot) => this.latestSnapshot = snapshot);
}

Facade.prototype.resumeGame = function() {
    if(this.latestSnapshot) {
        // copy players (separately because they contain another object (CardDeck))
        for(let i = 0; i < this.latestSnapshot.playerList.length; i++)
            this.playerList[i].clone(this.latestSnapshot.playerList[i]);

        // copy decks on the table (separately because they contain other objects (Card))
        this.tableDeck.clone(this.latestSnapshot.tableDeck);
        this.availableCardsDeck.clone(this.latestSnapshot.availableCardsDeck);
        
        // copy players (separately because it contains other objects (Card))
        this.history.clone(this.latestSnapshot.history);

    } else {
        errorMessage('Missing snapshot!');
    }
}

Facade.prototype.saveSnapshot = function(stillRunning = false) {
    if(stillRunning)
        this.latestSnapshot = new Snapshot(stillRunning, this.playerList, this.tableDeck, this.availableCardsDeck, this.history, this.getPlayerInTurn().id);
    else
        this.latestSnapshot = new Snapshot();
    
    this.unoDao.delete('latestSnapshot', '1', (response) => { if(response == null) errorMessage('Failed to delete previous snapshot!') });
    this.unoDao.add('latestSnapshot', this.latestSnapshot, () => console.log('[made snapshot]'));
}



/* settings */
Facade.prototype.saveSettings = function(callback) {
    this.unoDao.delete('settings', '1', (response) => console.log(response));
    this.unoDao.add('settings', this.settings, callback);
}

Facade.prototype.loadSettings = function() {
    this.unoDao.load('settings/1', (loadedSettings) => {

        if(loadedSettings && loadedSettings.type == 'GAME_SETTINGS')
            this.settings = loadedSettings;
        else
            errorMessage('Failed to load settings!');
    });
}