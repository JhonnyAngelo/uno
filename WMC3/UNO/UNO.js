import ViewHandler from './ViewHandler.js';
import Facade from './Facade.js';
import CardDeck from './valueObjects/CardDeck.js';
import Card from './valueObjects/Card.js';

function start() {
    let viewHandler = new ViewHandler(new Facade(), 'sprites', 'viewport', 'table', 'decks');

    viewHandler.startGame();
    //startTest(viewHandler);
}

function startTest(viewHandler) {
    let deck1 = new CardDeck('testDeck1', 'p1');
    let deck2 = new CardDeck('testDeck2', 'p2');

    let cardList1 = [
        new Card('test01', 'blue', '0'),/*
        new Card('test02', 'blue', '0'),
        new Card('test03', 'blue', '1'),
        new Card('test04', 'green', '1'),
        new Card('test05', 'green', '1'),*/
        new Card('test06', 'blue', 'draw_2'),
        new Card('test07', 'blue', 'draw_2')
    ];
    
    let cardList2 = [
        new Card('test08', 'blue', '0'),
        new Card('test09', 'red', '0'),
        new Card('test10', 'blue', '1'),
        new Card('test11', 'green', '1'),
        new Card('test12', 'red', 'draw_2'),
        new Card('test13', 'green', 'draw_2'),
        new Card('test14', 'black', 'wild_draw_4')
    ];

    for(let i = 0; i < cardList1.length; i++) {
        deck1.add(cardList1[i]);
    }

    for(let i = 0; i < cardList2.length; i++) {
        deck2.add(cardList2[i]);
    }

    viewHandler.startTestGame(deck1, deck2, new Card('top', 'blue', '1'));
}

start();