import CardDeck from './CardDeck.js';

export default function ComputerPlayer(id = '[PlayerId]') {
    this.type = 'COMPUTER_PLAYER';

    this.id = id;
    this.deck = new CardDeck(`${this.id}'s card deck`);

    this.stateWon = false;
    this.stateSkipped = false;
}

ComputerPlayer.prototype.draw = function(card) {
    this.deck.add(card);
}

ComputerPlayer.prototype.hasNoCard = function() {
    return this.deck.numberOfCards == 0;
}

ComputerPlayer.prototype.hasUNO = function() {
    return this.deck.numberOfCards == 1;
}