import {errorMessage, durstenfeldShuffle} from '../help.js';

export default function CardDeck(name, id) {
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

CardDeck.prototype.getNumberOfCards = function() {
    return this.cardList.length;
}

CardDeck.prototype.getCard = function(id) {
    for(let card of this.cardList)
        if(card.id == id) {
            return card;
        }
    
    errorMessage(`Could not find card with id ${id}!`);
    return null;
}

CardDeck.prototype.getCardIndex = function(id) {

    for(let i = 0; i < this.cardList.length; i++)
        if(this.cardList[i].id == id)
            return i;

    errorMessage(`Could not find card index with id ${id}!`);
    return -1;
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

CardDeck.prototype.findCard = function(card) {
    for(let i = 0; i < this.cardList.length; i++) {
        if(this.cardList[i].equals(card)) {
            return i;
        }
    }
    return -1;
}