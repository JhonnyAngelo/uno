'use strict';

function QuizDao(baseurl) {
    this.baseurl = baseurl;
}

QuizDao.prototype.prepareRequest = function(httpMethod, path, params) {
    let xhr = new XMLHttpRequest();
    let url = new URL(path);

    for(let key in params)
        url.searchParams.set(key, params[key]);

    xhr.open(httpMethod, url);

    return xhr;
}

QuizDao.prototype.loadQuestions = function(callback) {
    let xhr = this.prepareRequest('GET', `${this.baseurl}/questions`);

    xhr.responseType = 'json';
    xhr.onload = function() {
        callback(xhr.response);
    }

    xhr.send();
}

QuizDao.prototype.addQuestion = function(question, callback) {
    let xhr = this.prepareRequest('POST', `${this.baseurl}/questions`);

    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.onload = function() {
        console.log("Add response: ");
        console.log(xhr.response);
        callback(xhr.response);
    }

    xhr.send(JSON.stringify(question));
}

QuizDao.prototype.deleteQuestion = function(id, callback) {
    let xhr = this.prepareRequest('DELETE', `${this.baseurl}/questions/${id}`);

    xhr.responseType = 'json';
    xhr.onload = function() {
        callback(xhr.response);
    }

    xhr.send();
}