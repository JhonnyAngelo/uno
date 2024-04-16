import GameHandler from './GameHandler.js';
import ComputerPlayer from './valueObjects/ComputerPlayer.js';
import Player from './valueObjects/Player.js';

function start() {
    let gameHandler = new GameHandler();

    gameHandler.startGame(new Player('test', 'p1'), new ComputerPlayer('p2'));
}

start();