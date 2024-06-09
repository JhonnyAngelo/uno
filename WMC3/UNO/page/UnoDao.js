import {errorMessage} from './help.js';

export default function UnoDao(baseurl) {
    this.baseurl = baseurl;
}

UnoDao.prototype.load = function(endpoint, callback) {

    let xhr = this.prepareRequest('GET', `/${endpoint}`);

    xhr.responseType = 'json';
    xhr.onload = function() {
        callback(xhr.response);
    }

    xhr.send();
}

UnoDao.prototype.add = function(endpoint, object, callback) {

    let xhr = this.prepareRequest('POST', `/${endpoint}`);

    // xhr.setRequestHeader('Content-type', 'application/json');
    xhr.onload = function() {
        callback(xhr.response);
    }

    xhr.send(JSON.stringify(object));
}

UnoDao.prototype.delete = function(endpoint, id, callback) {
    
    let xhr = this.prepareRequest('DELETE', `/${endpoint}/${id}`);

    xhr.responseType = 'json';
    xhr.onload = function() {
        callback(xhr.response);
    }

    xhr.send();
}

UnoDao.prototype.prepareRequest = function(method, path) {
    let xhr = new XMLHttpRequest();
    let url = new URL(this.baseurl + path);

    xhr.open(method, url);

    return xhr;
}