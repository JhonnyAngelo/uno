import {inArray, errorMessage} from '../help.js';

export default function Card(id, color, symbol) {
    this.id = id;
    this.valid = true; 
    
    // valid color
    if(inArray(color, ['red', 'blue', 'green', 'yellow', 'black'])) {
        this.color = color;
    } else {
        this.color = '[color]';
        this.valid = false;
        errorMessage(`'${color}' is an invalid card color!`);
    }

    // valid symbol
    if(inArray(symbol, ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'draw_2', 'reverse', 'skip', 'wild', 'wild_draw_4', 'wild_forced_swap'])) {
        this.symbol = symbol;
    } else {
        this.symbol = '[symbol]';
        this.valid = false;
        errorMessage(`'${symbol}' is an invalid symbol!`);
    }

    // valid combination of color & symbol
    if( (this.symbol.includes('wild') && this.color != 'black') || (this.color == 'black' && this.symbol.includes('wild') == false) ) {
        this.color = '[color]';
        this.symbol = '[symbol]';
        this.valid = false;
        errorMessage(`Color '${color}' and symbol '${symbol}' do not match!`);
    }

    // color that is chosen by the player (only for wild cards)
    if(this.isWild())
        this.chosenColor = null;

    // card description
    switch (this.symbol) {
        case '0': case '1': case '2': case '3': case '4': case '5': case '6': case '7': case '8': case '9':
            this.description =  `An ordinary UNO card.\n\n
                                You can only put a card with the number ${this.symbol}, the color ${this.color} or a Wild card.`;
            break;
        
        case 'draw_2':
            this.description =  `The next player has to draw 2 cards from the deck,\n
                                unless, he puts another "Draw 2" or a "Wild Draw 4".\n\n
                                In that case, the number of cards that has to be drawn increases for the subsequent player and so on...`;
            break;
        
        case 'reverse':
            this.description =  `This card reverses the direction of gameplay.\n
                                If your game was going clockwise, the Reverse card would make it counterclockwise.\n\n
                                You can only put another Reverse card, one with the color ${this.color} or a Wild card.`;
            break;

        case 'skip':
            this.description =  `This card skips the following player's turn.\n\n
                                You can only put another Reverse card, one with the color ${this.color} or a Wild card.`;
            break;
        
        case 'wild':
            this.description =  `The player with this card can choose a color which becomes mandatory for the next player, unless, he has another Wild card.`;
            break;

        case 'wild_draw_4':
            this.description =  `The next player has to draw 4 cards from the deck, unless, he puts another "Wild Draw 4".\n
                                In that case, the number of cards that has to be drawn increases for the subsequent player and so on...\n\n
                                The last player in row to place this card determines the color for the next player, unless, he has another Wild card.`;
            break;
        
        case 'wild_forced_swap':
            this.description =  `If placed, the player is forced to choose another person to swap cards with.\n\n
                                He also determines the color which becomes mandatory for the next player, unless, he has another Wild card.`;
            break;
        
        default:
          this.description = '[Description]';
    }
}

Card.prototype.isWild = function() {
    return this.color == 'black' && this.symbol.includes('wild');
}

Card.prototype.getChosenColor = function() {
    if(this.isWild())
        return this.chosenColor;
    return null;
}

Card.prototype.setChosenColor = function(color) {
    if(inArray(color, ['red', 'blue', 'green', 'yellow']))
        this.chosenColor = color;
}

Card.prototype.resetChosenColor = function() {
    if(this.isWild())
        this.chosenColor = null;
}