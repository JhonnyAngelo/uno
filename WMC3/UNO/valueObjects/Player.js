import CardDeck from './CardDeck.js';

export default function Player(name = '[player name]', id = '[PlayerId]') {
    this.type = 'PLAYER';

    this.id = id;
    this.name = name;
    this.deck = new CardDeck(`${this.id}'s card deck`);
    
    this.stateWon = false;
    this.stateSkipped = false;
}

Player.prototype.draw = function(card) {
    this.deck.add(card);
}

Player.prototype.hasNoCard = function() {
    return this.deck.numberOfCards == 0;
}

Player.prototype.hasUNO = function() {
    return this.deck.numberOfCards == 1;
}