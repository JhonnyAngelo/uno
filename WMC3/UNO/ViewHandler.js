import GameHandler from './GameHandler.js';
import Player from './valueObjects/Player.js';
import {errorMessage} from './help.js';
import Card from './valueObjects/Card.js';

export default function ViewHandler(facade, spritesLocation, viewportId, tableId, deckId) {
    
    this.gameHandler = new GameHandler(facade);
    this.facade = facade;
    this.spritesLocation = spritesLocation;

    this.viewport = document.getElementById(viewportId);
    this.tableContainer = document.getElementById(tableId);
    this.deckContainer = document.getElementById(deckId);
    this.drawButtonEl = null;

    this.wildWindowActive = false;

    this.startGame = function() {
        
        this.setCallBacks();
        this.gameHandler.startGame(new Player('p1', 'user'), new Player('p2', 'pc', true));
        this.renderAll();
    }

    this.setCallBacks = function() {
        this.gameHandler.setCallbackRender(() => this.renderAll());
        this.gameHandler.setCallbackCardPlacement((cardId) => this.animateCardPlacement(cardId));
        this.gameHandler.setCallbackWild(() => this.selectColor());
    }

    this.clearViewport = function() {
        let windowElements = document.querySelectorAll('.window');

        this.tableContainer.innerHTML = '';
        this.deckContainer.innerHTML = '';

        for(let windowEl of windowElements) {
            windowEl.remove();
        }
    }

    this.renderAll = function() {

        console.log('[rendering viewport]');

        this.clearViewport();

        this.deckContainer.append(this.tableContainer);

        this.createAndBindAll();

        this.renderDeck(this.facade.getPlayer('p2').deck);

        this.renderDeck(this.facade.getAvailableCardsDeck(), false);
        this.renderDeck(this.facade.getTableDeck(), false, true);

        this.renderDeck(this.facade.getPlayer('p1').deck);
    }

    this.renderDeck = function(cardDeck, playerDeck = true, topCardOnly = false) {

        if(cardDeck.type == 'CARD_DECK') {
            let cardList = cardDeck.getAllCards();

            let deckEl = document.createElement('div');
            
            deckEl.id = cardDeck.id;
            //deckEl.innerHTML = `<h6>${cardDeck.name}</h6>`;
            
            if(topCardOnly) {
                deckEl.append(this.getCardImg(cardList[cardList.length-1]));

            } else {
                for(let card of cardList)
                    deckEl.append(this.getCardImg(card));
            }

            if(playerDeck) {
                deckEl.className = 'playerDeck';

                if(this.parentIsUser(deckEl.id)) {
                    deckEl.classList.add('user');

                    // cover cards if user can't place them
                    if(this.facade.getPlayer(deckEl.id).isInTurn() == false) {
                        
                        let coverEl = document.createElement('div');
                        coverEl.classList = 'deckCover';
                        deckEl.prepend(coverEl);
                    }

                    this.deckContainer.append(deckEl);

                } else {
                    deckEl.classList.add('opponent');
                    this.tableContainer.before(deckEl);
                }

            } else {
                this.tableContainer.append(deckEl);
            }
        
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
            } else if(card.getChosenColor() == null) {
                imgEl.src += `w_${card.symbol}.png`;
            } else {
                imgEl.src += `w_${card.symbol}_${card.getChosenColor()[0]}.png`;
            }

            imgEl.width = '90';
            imgEl.height = '150';

            imgEl.onclick = () => {

                let parentId = imgEl.parentNode.id;
                let player = this.facade.getPlayer(parentId);

                if(this.parentIsUser(parentId) && player && player.isInTurn()) {

                    this.animateCardPlacement(imgEl.id);
                
                } else if(player) {
                    errorMessage("You're not in turn!");
                }
            }

            return imgEl;

        } else {
            errorMessage('Invalid card passed to getCardImg()!');
            return null;
        }
    }

    ViewHandler.prototype.animateCardPlacement = function(cardId) {
        let imgEl = document.getElementById(cardId);
        let parentId = imgEl.parentNode.id;

        if(this.gameHandler.validCard(this.facade.getCardById(cardId))) {

            imgEl.classList.add('animationSlideDown');
            setTimeout(() => {
                imgEl.classList.remove('animationSlideDown');
                this.gameHandler.makeTurn(parentId, cardId);
                this.renderAll();
            }, 500);
        
        } else {
            errorMessage(`You can't place that card, ${this.facade.getPlayer(parentId).name}!`);
            // another animation (short; left-right-left-right) to make user understand that he can't place you
        }
    }

    ViewHandler.prototype.createAndBindAll = function() {
        this.createAndbindDrawButton();
        this.createAndbindColorSelectBtn();
    }

    ViewHandler.prototype.createAndbindDrawButton = function() {
        this.drawButtonEl = document.createElement('button');
        this.drawButtonEl.id = 'drawButton';
        this.drawButtonEl.type = 'button';

        // sprite
        let imgEl = document.createElement('img');
        imgEl.src = `${this.spritesLocation}/drawDeck.png`;
        imgEl.className = 'sprite';

        this.drawButtonEl.append(imgEl);

        // gif (when hovered over)
        let gifEl = document.createElement('img');
        //gifEl.src = `${this.spritesLocation}/drawDeck_hover.gif`;
        gifEl.className = 'gif';

        this.drawButtonEl.onmouseenter = () => {
            gifEl.src = `${this.spritesLocation}/drawDeck_hover.gif`;
            this.drawButtonEl.append(gifEl);
        }

        this.drawButtonEl.onmouseleave = () => {
            gifEl.src = `${this.spritesLocation}/drawDeck_hover.gif`;
            gifEl.remove();
        }

        this.drawButtonEl.onclick = () => {

            if(this.facade.getPlayerByIndex(0).isInTurn()) {
                let player = this.facade.getPlayerInTurn();
                this.gameHandler.optionalDraw(player);
            }
        };

        this.tableContainer.append(this.drawButtonEl);
    }

    ViewHandler.prototype.createAndbindColorSelectBtn = function() {
        let colorOptions = ['red', 'blue', 'green', 'yellow'];
        let windowEl = document.createElement('div');
        
        windowEl.id = 'colorSelectBox';
        windowEl.classList.add('window');

        let windowImg = document.createElement('img');
        windowImg.id = 'colorSelect';
        windowImg.alt = 'select color';
        windowImg.src = `${this.spritesLocation}/select_color.png`;
        windowEl.append(windowImg);

        for(let color of colorOptions) {
            let colorImgEl = document.createElement('img');
            colorImgEl.color = color;
            colorImgEl.id = `${color}Select`;
            colorImgEl.alt = `select ${color}`;
            colorImgEl.src = `${this.spritesLocation}/select_${color}.png`;
            
            colorImgEl.onmouseenter = () => {
                colorImgEl.src = `${this.spritesLocation}/select_${color}_hover.png`;
            }
    
            colorImgEl.onmouseleave = () => {
                colorImgEl.src = `${this.spritesLocation}/select_${color}.png`;
            }

            colorImgEl.onclick = () => {
                this.facade.getTopCard().setChosenColor(colorImgEl.color);
                this.wildWindowActive = false;
                this.gameHandler.continueGame(true);
                this.renderAll();
            }

            windowEl.append(colorImgEl);
        }

        this.viewport.append(windowEl);
        this.hide('colorSelectBox', this.wildWindowActive == false);
    }

    ViewHandler.prototype.selectColor = function() {
        this.wildWindowActive = true;
        this.gameHandler.stopGame();
        this.renderAll();
    }

    ViewHandler.prototype.hide = function(elementId, hide) {
        let element = document.getElementById(elementId);

        if(hide == true || hide == false) {

            if(element && hide && element.classList.contains('hidden') == false)
                element.classList.add('hidden');
            else if(element && hide == false && element.classList.contains('hidden'))
                element.classList.remove('hidden');

        } else {
            errorMessage('Missing last parameter of hide()!');
        }
    }

    ViewHandler.prototype.parentIsUser = function(parentId) {
        return parentId == this.facade.getPlayerByIndex(0).id;
    }
}