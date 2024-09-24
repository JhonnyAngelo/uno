export default function VotingDao(baseurl) {
    this.baseurl = baseurl;
}

VotingDao.prototype.load = function(callback) {
    let xhr = this.prepareRequest('GET', '');
    
    xhr.responseType = 'json';
    xhr.onload = function() {
        callback(xhr.response);
    }

    xhr.send();
}

VotingDao.prototype.add = function(topic, callback) {
    let xhr = this.prepareRequest('POST', '');

    xhr.setRequestHeader("Content-type", "application/json");

    xhr.onload = function() {
        callback(xhr.response);
    }

    xhr.send(JSON.stringify(topic));
}

VotingDao.prototype.update = function(topic, callback) {
    let xhr = this.prepareRequest('PUT', `/${topic.id}`);

    xhr.setRequestHeader("Content-type", "application/json");

    xhr.onload = function() {
        callback();
    }

    xhr.send(JSON.stringify(topic));
}

VotingDao.prototype.delete = function(topicId, callback) {
    let xhr = this.prepareRequest('DELETE', `${topicId}`);

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