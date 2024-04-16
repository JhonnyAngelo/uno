import {inArray, errorMessage} from './help.js';

export default function ViewHandler(spritesLocation) {
    this.spritesLocation = spritesLocation;

    this.getCardImg = function(card) {

        if(card.valid) {
            let imgEl = document.createElement('img');
            imgEl.alt = `${card.color} - ${card.symbol}`;
            imgEl.src = `${this.spritesLocation}/`;

            if(card.color != 'black') {
                imgEl.src += `${card.color[0]}_${card.symbol}.png`;
            } else {
                imgEl.src += `w_${card.symbol}.png`;
            }

            imgEl.width = '90';
            imgEl.height = '150';

            return imgEl;

        } else {
            errorMessage('Invalid card passed to getCardImg()!');
            return null;
        }
    }

    this.renderDeck = function(cardDeck) {

        if(cardDeck.type == 'CARD_DECK') {

            let deckEl = document.createElement('div'); // should be 'ul' actually

            deckEl.innerHTML = `<h6>${cardDeck.name}</h6>`;

            for(let card of cardDeck.getAllCards())
                deckEl.append(this.getCardImg(card));

            document.body.append(deckEl);

            console.log(deckEl);
        
        } else {
            errorMessage('Invalid deck passed to renderDeck()!');
        }
    }
}