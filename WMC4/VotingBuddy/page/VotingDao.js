export default function VotingDao(baseurl) {
    this.baseurl = baseurl;
}

VotingDao.prototype.load = function(callback) {
    let xhr = this.prepareRequest('GET', '/topics');
    
    xhr.responseType = 'json';
    xhr.onload = function() {
        callback(xhr.response);
    }

    xhr.send();
}

VotingDao.prototype.addTopic = function(topic, callback) {
    let xhr = this.prepareRequest('POST', '/topics');

    xhr.setRequestHeader("Content-type", "application/json");

    xhr.onload = function() {
        callback(xhr.response);
    }

    xhr.send(JSON.stringify(topic));
}

VotingDao.prototype.deleteTopic = function(topicId, callback) {
    let xhr = this.prepareRequest('DELETE', `/topics/${topicId}`);

    xhr.responseType = 'json';
    xhr.onload = function() {
        callback(xhr.response);
    }

    xhr.send();
}

VotingDao.prototype.prepareRequest = function(method, path) {
    let xhr = new XMLHttpRequest();
    let url = new URL(this.baseurl + path);

    xhr.open(method, url);

    return xhr;
}