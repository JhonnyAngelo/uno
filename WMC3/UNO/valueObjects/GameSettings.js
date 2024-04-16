// (supposed to be inside the GameHandler)

export default function GameSettings() { // not shure if I should implement
    this.type = 'GAME_SETTINGS';
    
    // default settings
    this.includeWildForcedSwap = true;
    this.drawCardIncreasesValue = true; // that means you can e.g. put a draw 4 on a draw 4 and the next player needs to draw 8 cards
}