export default function Snapshot(stillRunning = false, players = null, tDeck = null, aDeck = null, history = null, playerInTurnId = null) {
    this.id = "1";
    this.gameRunning = stillRunning;
    this.playerList = players;
    this.tableDeck = tDeck;
    this.availableCardsDeck = aDeck;
    this.history = history;
    this.playerInTurnId = playerInTurnId;
}