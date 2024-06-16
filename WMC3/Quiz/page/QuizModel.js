'use strict';

function QuizModel(dao) {
    this.questionList = [];
    this.dao = dao;
}

QuizModel.prototype.addQuestion = function(question) {
    this.questionList.push(question);
};

QuizModel.prototype.getQuestionAt = function(questionIndex) {
    return this.questionList[questionIndex].questionText;
};

QuizModel.prototype.getAnswerAt = function(questionIndex, answerNumber) {
    return this.questionList[questionIndex].answerList[answerNumber-1];
};

QuizModel.prototype.isAnswerOk = function(questionIndex, answerNumber) {
    return this.questionList[questionIndex].correctAnswerIndex == answerNumber-1;
};

QuizModel.prototype.getAnswerCount = function(questionIndex) {
    return this.questionList[questionIndex].answerList.length;
};

QuizModel.prototype.loadQuestions = function(callback) {
    this.dao.loadQuestions((questions) => this.questionList = questions);
    callback();
}