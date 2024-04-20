import Facade from './Facade.js';
import ViewHandler from './ViewHandler.js';

function start() {
    let facade = new Facade('http://127.0.0.1:3000');
    let view = new ViewHandler(facade);

    view.bindClear('clearForm');
    view.bindAdd('addStudent');
    view.init();
}

start();