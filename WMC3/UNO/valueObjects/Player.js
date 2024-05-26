import Card from './Card.js';
import CardDeck from './CardDeck.js';

export default function Player(id, name, typePC = false) {
    this.type = typePC ? 'COMPUTER_PLAYER' : 'PLAYER';

    this.id = id;
    this.name = name;
    this.deck = new CardDeck(`${this.id}'s card deck`, this.id);
    
    this.stateWon = false;
    this.stateInTurn = false;
    this.stateSkipped = false;
    this.optionalDrawPossible = true;
}

Player.prototype.clearDeck = function() {
    this.deck.clear();
}

Player.prototype.draw = function(card) {
    this.deck.add(card);
}

Player.prototype.removeCard = function(cardId) {
    let index = this.deck.getCardIndex(cardId);

    return this.deck.remove(index);
}

Player.prototype.getCardCount = function() {
    return this.deck.getNumberOfCards();
}

Player.prototype.hasNoCard = function() {
    return this.deck.getNumberOfCards() == 0;
}

Player.prototype.hasUNO = function() {
    return this.deck.getNumberOfCards() == 1;
}

Player.prototype.isInTurn = function() {
    return this.stateInTurn == true;
}

Player.prototype.swapDeck = function(player) {
    let tempDeck = this.deck;

    if(player.type == 'PLAYER' || player.type == 'COMPUTER_PLAYER') {
        this.deck = player.deck;
        player.deck = tempDeck;

        this.deck.id = this.id;
        this.deck.name = `${this.id}'s card deck`;
        player.deck.id = player.id;
        player.deck.name = `${player.id}'s card deck`;
    }
}

Player.prototype.canIncreaseDrawCounter = function(topCard) {
    return  ( topCard.symbol == 'wild_draw_4' && this.canPutDraw4Card() ) ||
            ( topCard.symbol == 'draw_2' && ( this.canPutDraw2Card() || this.canPutDraw4Card() ) );
}

Player.prototype.canPutDraw2Card = function() {
    return this.deck.findCardBySymbol('draw_2') != -1;
}

Player.prototype.canPutDraw4Card = function() {
    return this.deck.findCardBySymbol('wild_draw_4') != -1;
}