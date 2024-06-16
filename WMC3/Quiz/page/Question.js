'use strict';

function Question(id, topic, questionText, answerList, correctAnswerIndex) {
    this.id = id;
    this.topic = topic;
    this.questionText = questionText;
    this.answerList = answerList;
    this.correctAnswerIndex = correctAnswerIndex;
}