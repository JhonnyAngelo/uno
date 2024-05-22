import ViewHandler from './ViewHandler.js';
import Facade from './Facade.js';

function start() {
    let viewHandler = new ViewHandler(new Facade(), 'sprites', 'viewport', 'table', 'decks');

    viewHandler.startGame();
}

start();