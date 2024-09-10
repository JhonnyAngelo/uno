function Result(score) {
    this.score = score;
}

function ResultList() {
    this.resultArray = [];
}

ResultList.prototype.addResult = function(result) {
    this.resultArray.push(result);
};

ResultList.prototype.getAverage = function() {
    let sum = 0;
    for(let i of this.resultArray) {
        sum += i.score;
    }
    return sum / this.resultArray.length;
};

function View(resultList, entryID, inputID) {
    this.resultList = resultList;
    this.entryEl = document.getElementById(entryID);
    this.inputEl = document.getElementById(inputID);
}

View.prototype.render = function() {
    let avg = this.resultList.getAverage().toFixed(2);
    let len = this.resultList.resultArray.length;
    
    if(len == 1)
        this.entryEl.innerHTML = `${avg} (${len} entry)`;
    else
        this.entryEl.innerHTML = `${avg} (${len} entries)`;
};

View.prototype.bind = function(buttonID) {
    let buttonEl = document.getElementById(buttonID);
    buttonEl.onclick = () => {
        
        let score = Number(this.inputEl.value);
        this.resultList.resultArray.push(new Result(score));
        
        this.render();
    };
};

function main() {
    let viewHandler = new View(new ResultList(), 'entry', 'score');
    viewHandler.bind('addScore');
}

main();