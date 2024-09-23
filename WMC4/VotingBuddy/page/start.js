import VotingModel from "./VotingModel.js";
import VotingView from "./VotingView.js";

function main() {
    let viewHandler = new VotingView(new VotingModel());

    viewHandler.bind();
    viewHandler.render();
}

main();