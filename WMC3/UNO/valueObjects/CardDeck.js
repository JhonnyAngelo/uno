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

CardDeck.prototype.getMostFrequentColor = function() {
    let colorNames = ['red', 'blue', 'green', 'yellow'];
    let colorCount = {
        red: 0,
        blue: 0,
        green: 0,
        yellow: 0,
        black: 0
    };

    for(let card of this.cardList) {
        colorCount[card.color]++;
    }

    if(colorCount.red == 0 && colorCount.blue == 0 && colorCount.green == 0 && colorCount.yellow == 0) {
        return colorNames[getRandomInt(0, 3)];
    
    } else {
        let maxCount = 0;
        let maxColor = 'red';

        for(let key in colorCount) {
            if(colorCount[key] > maxCount) {
                maxCount = colorCount[key];
                maxColor = key;
            }
        }
        return maxColor;
    }
}

CardDeck.prototype.findCard = function(card) {
    for(let i = 0; i < this.cardList.length; i++) {
        if(this.cardList[i].equals(card)) {
            return i;
        }
    }
    return -1;
}

CardDeck.prototype.findCardByColor = function(color) {
    for(let i = 0; i < this.cardList.length; i++) {
        if(this.cardList[i].color == color) {
            return i;
        }
    }
    return -1;
}

CardDeck.prototype.findCardBySymbol = function(symbol) {
    for(let i = 0; i < this.cardList.length; i++) {
        if(this.cardList[i].symbol == symbol) {
            return i;
        }
    }
    return -1;
}