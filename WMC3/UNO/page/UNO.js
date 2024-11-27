import ViewHandler from './ViewHandler.js';
import Facade from './Facade.js';
import CardDeck from './valueObjects/CardDeck.js';
import Card from './valueObjects/Card.js';

function start() {
    let viewHandler = new ViewHandler(new Facade('http://127.0.0.1:3000'), 'sprites', 'viewport', 'table', 'decks');
    
    //viewHandler.startGame();
    startTest(viewHandler);
}

function startTest(viewHandler) {
    let deck1 = new CardDeck('testDeck1', 'p1');
    let deck2 = new CardDeck('testDeck2', 'p2');

    let cardList1 = [ // user
        new Card('test01', 'blue', '0'),
        new Card('test02', 'blue', '1'),
        new Card('test03', 'green', '1'),
        new Card('test04', 'green', '1'),
        new Card('test05', 'blue', 'draw_2'),
        new Card('test06', 'blue', 'draw_2'),
        new Card('testFS_User', 'black', 'wild_forced_swap'),
        new Card('testFS_Wild', 'black', 'wild')
    ];
    
    let cardList2 = [ // pc
        new Card('test07', 'blue', '0'),
        new Card('test08', 'blue', '1'),
        new Card('test09', 'green', '1'),
        new Card('test10', 'red', 'draw_2'),
        new Card('test11', 'green', 'draw_2'),
        new Card('test12', 'green', '1'),
        //new Card('test12', 'black', 'wild_draw_4'),
        new Card('testFS_Pc', 'black', 'wild_forced_swap')
    ];

    for(let i = 0; i < cardList1.length; i++) {
        deck1.add(cardList1[i]);
    }

    for(let i = 0; i < cardList2.length; i++) {
        deck2.add(cardList2[i]);
    }

    viewHandler.startGame(deck1, deck2, new Card('top', 'blue', '1'));
}

start();