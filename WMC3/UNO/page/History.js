import {errorMessage} from './help.js';
import Card from './valueObjects/Card.js';

export default function History() {
    this.type = 'HISTORY';
    this.entryListAction = [];
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

History.prototype.getAction = function(index) {
    return this.entryListAction[index];
}

History.prototype.getAllActions = function() {
    return this.entryListAction;
}

History.prototype.clone = function(history) {
    for(let i = 0; i < history.entryListAction.length; i++) {
        
        let entry = history.entryListAction[i];
        this.entryListAction[i] = entry;
        if(entry.type == 'action-place')
            this.entryListAction[i].card = new Card(entry.card.id, entry.card.color, entry.card.symbol);
    }
}