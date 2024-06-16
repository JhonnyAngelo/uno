'use strict';

function QuizView(quizModel, topicId, questionId, answerListId, inputId, resultId) {
    this.topicEl = document.getElementById(topicId);
    this.questionEl = document.getElementById(questionId);
    this.answerListEl = document.getElementById(answerListId);
    this.inputEl = document.getElementById(inputId);
    this.resultEl = document.getElementById(resultId);
    this.quizModel = quizModel;
}

QuizView.prototype.bind = function() {
    this.topicEl.onchange = this.inputEl.onchange = () => {
        console.log('[auto render]');
        this.render(this.topicEl.selectedIndex);
    };
};

QuizView.prototype.render = function(questionIndex) {
    this.topicEl.innerHTML = this.questionEl.innerHTML = this.answerListEl.innerHTML = this.resultEl.innerHTML = '';
    
    setTimeout(() => {
        this.createSelectOptionList();
        this.topicEl.selectedIndex = questionIndex;

        this.questionEl.innerHTML = this.quizModel.getQuestionAt(questionIndex);
        
        this.createAnswerList(questionIndex);

        if(this.inputEl.value) {
            if(this.quizModel.isAnswerOk(questionIndex, Number(this.inputEl.value))) {
                this.resultEl.innerHTML = 'Your guess was <em>OK</em>';
            } else {
                this.resultEl.innerHTML = 'Your guess was <em>FALSE</em>';
            }
        }
    }, 1000);
};

QuizView.prototype.createSelectOptionList = function() {
    let optionList = [];

    for(let i = 0; i < this.quizModel.questionList.length; i++) {
        optionList[i] = document.createElement('option');
        optionList[i].innerHTML = this.quizModel.questionList[i].topic;
        this.topicEl.append(optionList[i]);
    }
};

QuizView.prototype.createAnswerList = function(questionIndex) {
    let liList = [];

    for(let i = 0; i < this.quizModel.getAnswerCount(questionIndex); i++) {
        liList[i] = document.createElement('li');
        liList[i].innerHTML = this.quizModel.getAnswerAt(questionIndex, i+1);
        this.answerListEl.append(liList[i]);
    }
};