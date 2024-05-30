import {errorMessage} from './help.js';

export default function History() {
    this.entryListAction = [];
    this.entryListScreenshot = [];
}

History.prototype.addActionCardPlacement = function(player, placedCard) {
    let action = {
        type: 'action-place',
        player: player,
        card: placedCard
    };

    if( (player.type == 'PLAYER' || player.type == 'COMPUTER_PLAYER') && placedCard )
        this.entryListAction.push(action);
    else
        errorMessage('Invalid action entry parameters!');
}

History.prototype.addActionCardDraw = function(player, drawCount) {
    let action = {
        type: 'action-draw',
        player: player,
        amount: drawCount
    };

    if( (player.type == 'PLAYER' || player.type == 'COMPUTER_PLAYER') && drawCount >= 2 && drawCount % 2 == 0)
        this.entryListAction.push(action);
    else
        errorMessage('Invalid action entry parameters!');
}

History.prototype.addScreenshot = function(players, tDeck, aDeck) {
    let screenshot = {
        type: 'screenshot',
        playerList: players,
        tableDeck: tDeck,
        availableCardsDeck: aDeck
    };

    if(players && players.length > 2 && tDeck.type == 'CARD_DECK' && aDeck.type == 'CARD_DECK')
        this.entryListScreenshot.push(screenshot);
    else
        errorMessage('Invalid screenshot parameters!');
}

History.prototype.getAction = function(index) {
    return this.entryListAction[index];
}

History.prototype.getScreenshot = function(index) {
    return this.entryListScreenshot[index];
}

History.prototype.getAllActions = function() {
    return this.entryListAction;
}

History.prototype.getScreenshots = function() {
    return this.entryListScreenshot;
}

History.prototype.getEntryMessage = function(entry) {
    switch(entry.type) {
        case 'action-place':
            return `${entry.player} placed `;

        case 'action-draw':
            break;
        
        case 'screenshot':
            break;
    }
}