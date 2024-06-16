'use strict';

function start() {
    let dao = new QuizDao('http://127.0.0.1:3000');
    let model = new QuizModel(dao);
    let view = new QuizView(model, 'topic', 'question', 'answerList', 'input', 'result');
    /*
    model.addQuestion(new Question('q0', 'Temp', 'Question?', ['a (correct answer)', 'b', 'c', 'd'], 0));
    model.addQuestion(new Question('q1', 'Sport', 'When did Franz Klammer become Olympic champion?', ['1972', '1976', '1980', '1984'], 1));
    model.addQuestion(new Question('q2', 'Culture', 'In what year was the first film produced in Hollywood?', ['1900', '1910', '1920'], 1));
    */
    model.loadQuestions(() => {
        view.render(0);
        view.bind();
    });
}

start();