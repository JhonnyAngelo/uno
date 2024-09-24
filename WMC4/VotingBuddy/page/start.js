import VotingModel from "./VotingModel.js";
import VotingView from "./VotingView.js";

function main() {
    let viewHandler = new VotingView(new VotingModel('http://127.0.0.1:3000/topics'));

    viewHandler.bind();
    viewHandler.init();
    viewHandler.render();
}

main();