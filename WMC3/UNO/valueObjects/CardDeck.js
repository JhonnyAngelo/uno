import Card from './Card.js';
import {errorMessage, durstenfeldShuffle} from '../help.js';

export default function CardDeck(name, id = '[CardDeckId]') {
    this.type = 'CARD_DECK';

    this.id = id;
    this.name = name;
    this.cardList = [];
}

CardDeck.prototype.add = function(card) {
    if(card.valid) {
        this.cardList.push(card);
    } else {
        errorMessage('Only Card objects can be added to the CardDeck!');
    }
}

CardDeck.prototype.shuffle = function() {
    durstenfeldShuffle(this.cardList);
}

CardDeck.prototype.getAllCards = function() {
    return this.cardList;
}

CardDeck.prototype.numberOfCards = function() {
    return this.cardList.length;
}

CardDeck.prototype.getCard = function(index) {
    return this.cardList[index];
}

CardDeck.prototype.remove = function(index) {
    if(index >= 0 && index < this.cardList.length) {
        let removedCard = this.cardList[index];
    
        this.cardList.splice(index, 1);
    
        return removedCard;
    
    } else {
        errorMessage('Invalid index to remove card!');
        return null;
    }
}

CardDeck.prototype.clear = function() {
    this.cardList = [];
}