import GameHandler from './GameHandler.js';
import Player from './valueObjects/Player.js';
import {errorMessage} from './help.js';

export default function ViewHandler(facade, spritesLocation, viewportId, drawButtonId) {
    
    this.gameHandler = new GameHandler(facade);
    this.facade = facade;
    this.spritesLocation = spritesLocation;
    this.viewport = document.getElementById(viewportId);
    this.drawButtonEl = document.getElementById(drawButtonId);

    this.startGame = function() {
        
        this.gameHandler.startGame(new Player('p1', 'user'), new Player('p2', 'pc', true));
        this.renderAll();
        this.bind();
    }

    this.renderAll = function() {
        this.viewport.innerHTML = '';
        this.renderDeck(this.facade.getAvailableCardsDeck(), false);
        this.renderDeck(this.facade.getTableDeck(), false, true);

        this.renderDeck(this.facade.getPlayer('p1').deck);
        this.renderDeck(this.facade.getPlayer('p2').deck);
    }

    this.renderDeck = function(cardDeck, playerDeck = true, topCardOnly = false) {

        if(cardDeck.type == 'CARD_DECK') {
            let cardList = cardDeck.getAllCards();

            let deckEl = document.createElement('div');
            
            deckEl.id = cardDeck.id;
            if(playerDeck)
                deckEl.className = 'playerDeck';

            deckEl.innerHTML = `<h6>${cardDeck.name}</h6>`;
            
            if(topCardOnly) {
                deckEl.append(this.getCardImg(cardList[cardList.length-1]));

            } else {
                for(let card of cardList)
                    deckEl.append(this.getCardImg(card));
            }

            this.viewport.append(deckEl);
        
        } else {
            errorMessage('Invalid deck passed to renderDeck()!');
        }
    }

    this.getCardImg = function(card) {

        if(card.valid) {
            let imgEl = document.createElement('img');

            imgEl.id = card.id;
            imgEl.className = 'card';
            imgEl.alt = `${card.color} - ${card.symbol}`;
            imgEl.src = `${this.spritesLocation}/`;

            if(card.color != 'black') {
                imgEl.src += `${card.color[0]}_${card.symbol}.png`;
            } else {
                imgEl.src += `w_${card.symbol}.png`;
            }

            imgEl.width = '90';
            imgEl.height = '150';

            imgEl.onclick = () => {

                let parentId = imgEl.parentNode.id;
                let player = this.facade.getPlayer(parentId);

                if(player && player.isInTurn()) {
                    
                    imgEl.classList.add('animationSlideDown');
                    setTimeout(() => {
                        imgEl.classList.remove('animationSlideDown');
                        this.gameHandler.makeTurn(parentId, imgEl.id);
                        this.renderAll();
                    }, 500);
                
                } else if(player) {
                    errorMessage("You're not in turn!");
                }
            };

            return imgEl;

        } else {
            errorMessage('Invalid card passed to getCardImg()!');
            return null;
        }
    }

    ViewHandler.prototype.bind = function() {
        
        this.drawButtonEl.onclick = () => {

            let player = this.facade.getPlayerInTurn();
            this.gameHandler.optionalDraw(player, () => this.renderAll());
        };
    }
}