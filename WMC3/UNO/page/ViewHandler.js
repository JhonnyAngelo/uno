import GameHandler from './GameHandler.js';
import Player from './valueObjects/Player.js';
import GameSettings from './valueObjects/GameSettings.js';
import {errorMessage} from './help.js';

export default function ViewHandler(facade, spritesLocation, viewportId, tableId, deckId) {
    
    this.gameHandler = new GameHandler(facade, new GameSettings(true, true, 1));
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

    this.startTestGame = function(deck1, deck2, topCard) {
        this.startGame();
        this.gameHandler.assignTestDecks(deck1, deck2, topCard);
        this.renderAll();
    }

    this.setCallBacks = function() {
        this.gameHandler.setCallbackRender(() => this.renderAll());
        this.gameHandler.setCallbackCardPlacement((cardId) => this.animateCardPlacement(cardId));
        this.gameHandler.setCallbackWild(() => this.selectColor());
        this.gameHandler.setCallbackForcedSwap(() => this.startDeckSwapAnimation());
        this.gameHandler.setCallbackGameWon((player) => alert(`${player.name} has won!`));
        this.gameHandler.setCallBackReminder((hide) => this.hide('reminderText', hide));
        this.gameHandler.setCallbackShoutUNO(() => alert('UNO !!!')); // function later on should either show UNO or PENALTY

        // avatar
        this.gameHandler.setCallbackAvatarStateIdle(() => document.getElementById('avatar').src = `${this.spritesLocation}/pc/pc_idle.gif`);
        this.gameHandler.setCallbackAvatarStateThinking(() => document.getElementById('avatar').src = `${this.spritesLocation}/pc/pc_thinking.gif`);
        this.gameHandler.setCallbackAvatarStateWon(() => document.getElementById('avatar').src = `${this.spritesLocation}/pc/pc_won.png`);
    }

    this.clearViewport = function() {
        let windowElements = document.querySelectorAll('.window');
        let historyEntryListEl = document.getElementById('entryList');

        this.clearPcAvatarContainer();

        this.tableContainer.innerHTML = '';
        this.deckContainer.innerHTML = '';

        historyEntryListEl.innerHTML = '';

        for(let windowEl of windowElements) {
            windowEl.remove();
        }
    }

    ViewHandler.prototype.clearPcAvatarContainer = function() {
        let cardCounter = document.getElementById('cardCounter');
        let avatarCards = document.getElementById('avatarCards');

        cardCounter.innerHTML = '';
        if(avatarCards) // if avatarCards == null then this is the initial render
            avatarCards.remove();
        else
            this.renderPcAvatar();
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

        this.renderHistory();
        this.bindPauseBtn();

        // testing
        if(this.facade.getPlayerInTurn())
            document.getElementById('playerInTurn').innerHTML = this.facade.getPlayerInTurn().name;
        else
            document.getElementById('playerInTurn').innerHTML = 'NULL';
    }

    this.renderDeck = function(cardDeck, playerDeck = true, topCardOnly = false) {

        if(cardDeck.type == 'CARD_DECK') {

            let deckEl = document.createElement('div');
            deckEl.id = cardDeck.id;
            //deckEl.innerHTML = `<h6>${cardDeck.name}</h6>`;
            
            let deckContainer = document.createElement('div');
            deckContainer.playerId = cardDeck.id;
            deckContainer.className = 'deckContainer';
            deckEl.append(deckContainer);

            let cardList = cardDeck.getAllCards();

            if(topCardOnly) {
                deckContainer.append(this.getCardImg(cardList[cardList.length-1]));

            } else {
                for(let card of cardList)
                    deckContainer.append(this.getCardImg(card));
            }

            if(playerDeck) {
                deckEl.className = 'playerDeck';

                if(this.isUser(deckEl.id)) {
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

            // render PC avatar

            if(playerDeck && this.facade.getPlayer(cardDeck.id).type == 'COMPUTER_PLAYER')
                this.renderAvatarCards(cardDeck);
        
        } else {
            errorMessage('Invalid deck passed to renderDeck()!');
        }
    }

    ViewHandler.prototype.renderPcAvatar = function() {
        let avatarContainer = document.getElementById('avatarContainer');
        let avatar = document.createElement('img');

        avatar.id = 'avatar';
        avatar.alt = 'avatar';
        avatar.src = `${this.spritesLocation}/pc/pc_idle.gif`;
        avatarContainer.prepend(avatar);
    }

    ViewHandler.prototype.renderAvatarCards = function(deck) {

        let cardCounter = document.getElementById('cardCounter');
        let counter;
        let avatarContainer = document.getElementById('avatarContainer');
        
        cardCounter.innerHTML = `<div class="circle"><p><strong>${deck.getNumberOfCards()}</strong></p></div>`;
        counter = document.querySelector('#cardCounter > div');
        if(deck.getNumberOfCards() == 1) {
            counter.style.backgroundColor = 'red';
        } else {
            counter.style.backgroundColor = 'darkturquoise';
        }

        let avatarCards = document.createElement('img');
        avatarCards.id = 'avatarCards';
        avatarCards.alt = "avatar's cards";
        avatarContainer.append(avatarCards);

        if(deck.getNumberOfCards() <= 18) {
            avatarCards.src = `${this.spritesLocation}/pc/avatarCards_${deck.getNumberOfCards()}.png`;
        } else {
            avatarCards.src = `${this.spritesLocation}/pc/avatarCards_18.png`;
        }
    }

    ViewHandler.prototype.renderHistory = function() {
        let buttonImg = document.getElementById('historyBtn');
        let historyContainer = document.getElementById('actionsHistory');
        let backgroundImg = document.getElementById('historyBackground');
        let entryListEl = document.getElementById('entryList');

        if(!buttonImg.src) {
            buttonImg.src = `${this.spritesLocation}/historyBtn.png`;
            backgroundImg.src = `${this.spritesLocation}/history_closed.png`;

            buttonImg.onmouseenter = () => {
                buttonImg.src = `${this.spritesLocation}/historyBtn_hover.png`;
            }
    
            buttonImg.onmouseleave = () => {
                buttonImg.src = `${this.spritesLocation}/historyBtn.png`;
            }

            buttonImg.onclick = () => {
                
                historyContainer.classList.toggle('closed');
                
                if(historyContainer.classList.contains('closed'))
                    backgroundImg.src = `${this.spritesLocation}/history_closed.png`;
                else
                    backgroundImg.src = `${this.spritesLocation}/history.png`;
            }
        }

        for(let entry of this.facade.getAllActionEntries()) {
            let entryEl = document.createElement('div');
            entryEl.className = 'entry';

            let entryText = document.createElement('div');
            entryText.className = 'entryText';

            entryEl.innerHTML = `<img class="entryBackground" alt="action" src="${this.spritesLocation}/history_entry.png">`;

            switch(entry.type) {
                
                case 'action-place':
                    entryText.innerHTML = `<span><strong>${entry.player.name}:</strong> </span>`;
                    entryText.append(this.getCardImg(entry.card));

                    entryEl.append(entryText);
                    entryListEl.prepend(entryEl);
                    break;

                case 'action-draw':
                    entryText.innerHTML = `<span><strong>${entry.player.name}:</strong> +${entry.amount}</span>`;
                    
                    entryEl.append(entryText);
                    entryListEl.prepend(entryEl);
                    break;
            }
        }

        let endSpacing = document.createElement('div');
        endSpacing.className = 'entry';
        entryListEl.append(endSpacing);
    }

    ViewHandler.prototype.bindPauseBtn = function() {
        let pauseEl = document.getElementById('pauseBtn');
        
        if(!pauseEl.src) {
            pauseEl.src = `${this.spritesLocation}/pauseBtn.png`;
            pauseEl.onclick = () => {
                // show Settings window with a button that lets you continue the game
                // this.gameHandler.stopGame();
            }

            pauseEl.onmouseenter = () => {
                pauseEl.src = `${this.spritesLocation}/pauseBtn_hover.png`;
            }

            pauseEl.onmouseleave = () => {
                pauseEl.src = `${this.spritesLocation}/pauseBtn.png`;
            }
        }
    }

    ViewHandler.prototype.bindUNOButton = function() {
        let unoBtnContainer = document.getElementById('uno');
        let unoBtn = document.getElementById('unoBtn');
        let user = this.facade.getPlayerByIndex(0);

        // you need to shout UNO if you are about to place your second to last card
        // or you are about to swap decks with a player who has only 1 card
        if(user.getCardCount() == 2 ||
        (user.deck.findCardBySymbol('wild_forced_swap') && this.gameHandler.getNextPlayer(user.id).getCardCount() == 1) ) {
            
            // button can only be clicked once and if you can place your second to last card
            if(!user.stateShoutedUno && user.stateInTurn && this.gameHandler.recommendCard(user) != null) {
                unoBtn.src = `${this.spritesLocation}/unoBtn_active.gif`;
                unoBtnContainer.className = 'active';
            }

        } else {
            unoBtn.src = `${this.spritesLocation}/unoBtn_inactive.png`;
            unoBtnContainer.className = 'inactive';
        }

        unoBtn.onclick = () => {
            if(unoBtnContainer.classList.contains('active') && unoBtnContainer.classList.contains('inactive') == false) {
                user.stateShoutedUno = true;
                unoBtn.src = `${this.spritesLocation}/unoBtn_inactive.png`;
                unoBtnContainer.className = 'inactive';
            }
        }
    }

    ViewHandler.prototype.getCardImg = function(card) {

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
            
            imgEl.onclick = () => {

                let parentId = imgEl.parentNode.playerId;
                let player = this.facade.getPlayer(parentId);

                if(this.isUser(parentId) && player && player.isInTurn()) {

                    this.animateCardPlacement(imgEl.id);
                
                } else if(player) {
                    errorMessage(`You're not in turn, ${player.name}!`);
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
        let parentId = imgEl.parentNode.playerId;

        if(this.gameHandler.validCard(this.facade.getCardById(cardId))) {

            this.hide('reminderText', true);
            imgEl.classList.add('animationSlideDown');
            setTimeout(() => {
                imgEl.classList.remove('animationSlideDown');
                this.hide(cardId, true); // needed for [ForcedSwap] so that the card doesn't reappear while all other one's are sliding down
                this.gameHandler.makeTurn(parentId, cardId);
            }, 500);
        
        } else {
            imgEl.classList.add('shake');
            setTimeout(() => imgEl.classList.remove('shake'), 250);
            errorMessage(`You can't place that card, ${this.facade.getPlayer(parentId).name}!`);
        }
    }

    ViewHandler.prototype.createAndBindAll = function() {
        this.createAndbindDrawButton();
        this.createAndbindColorSelectBtn();
        this.bindUNOButton();
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

    ViewHandler.prototype.startDeckSwapAnimation = function() {
        let user = this.facade.getPlayerByIndex(0);
        let cardCount = user.getCardCount();
        let animationDuration = cardCount*500 + cardCount/2 * (50*1 + 50*cardCount); // using sum of arithmetic sequence formula

        this.gameHandler.stopGame();

        // start animation for pc avatar
        let playerInTurn = this.gameHandler.playerInTurn;
        if(playerInTurn && playerInTurn.type == 'COMPUTER_PLAYER') {
            // ...
        } else {
            // other animation
        }

        for(let i = 0; i < cardCount; i++) {
            let card = user.deck.cardList[i];
            let cardEl = document.getElementById(card.id);

            setTimeout(() => {
                cardEl.classList.add('animationSlideDown');
                setTimeout(() => {
                    this.hide(cardEl.id, true);
                    cardEl.classList.remove('animationSlideDown');
                    
                    if(i == cardCount-1) {
                        if(playerInTurn && playerInTurn.type == 'PLAYER') {
                            this.gameHandler.continueGame(false);
                        } else {
                            alert('helllo');
                            this.gameHandler.continueGame(true);
                        }
                    }
                }, 500);
            
            }, 50 * (i+1));
        }

        return animationDuration;
    }

    ViewHandler.prototype.selectColor = function() {
        this.wildWindowActive = true;
        this.gameHandler.stopGame();
        this.renderAll();
    }

    ViewHandler.prototype.hide = function(elementId, hide) {
        let element = document.getElementById(elementId);

        if(element && (hide == true || hide == false)) {

            if(hide && element.classList.contains('hidden') == false)
                element.classList.add('hidden');
            else if(hide == false && element.classList.contains('hidden'))
                element.classList.remove('hidden');

        } else {
            errorMessage('Missing last parameter of hide()!');
        }
    }

    ViewHandler.prototype.isUser = function(id) {
        return id == this.facade.getPlayerByIndex(0).id;
    }
}