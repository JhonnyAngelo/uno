// (supposed to be inside the GameHandler)

export default function GameSettings(includeWildForcedSwap, drawCardIncreasesValue, difficulty) { // not shure if I should implement
    this.type = 'GAME_SETTINGS';
    
    // default settings
    this.includeWildForcedSwap = includeWildForcedSwap;
    this.drawCardIncreasesValue = drawCardIncreasesValue; // that means you can e.g. put a draw 4 on a draw 4 and the next player needs to draw 8 cards
    this.difficulty = difficulty;
}