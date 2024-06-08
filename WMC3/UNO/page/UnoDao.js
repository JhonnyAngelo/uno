import {errorMessage} from './help.js';

export default function UnoDao(baseurl) {
    this.baseurl = baseurl;
}

UnoDao.prototype.loadObjects = function(fileName, callback) {

    if(this.checkFileName(fileName)) {

        let xhr = this.prepareRequest('GET', `/${fileName}`);

        xhr.responseType = 'json';
        xhr.onload = function() {
            callback(xhr.response);
        }

        xhr.send();

    } else {
        callback('');
    }
}

UnoDao.prototype.addObject = function(fileName, object, callback) {
    
    if(this.checkFileName(fileName)) {
    
        let xhr = this.prepareRequest('POST', `/${fileName}`);

        // xhr.setRequestHeader('Content-type', 'application/json');
        xhr.onload = function() {
            callback(xhr.response);
        }

        xhr.send(JSON.stringify(object));
    } else {
        callback('');
    }
}

UnoDao.prototype.deleteObject = function(fileName, id, callback) {
    
    if(this.checkFileName(fileName)) {
    
        let xhr = this.prepareRequest('DELETE', `/${fileName}/${id}`);

        xhr.responseType = 'json';
        xhr.onload = function() {
            callback(xhr.response);
        }

        xhr.send();

    } else {
        callback('');
    }
}

UnoDao.prototype.prepareRequest = function(method, path) {
    let xhr = new XMLHttpRequest();
    let url = new URL(this.baseurl + path);

    xhr.open(method, url);

    return xhr;
}

UnoDao.prototype.checkFileName = function(fileName) {
    if(fileName != 'decks' && fileName != 'players' && fileName != 'settings') {
        errorMessage(`${fileName}.json does not exist! (available: decks/players/settings.json)`);
        return false;
    }
    return true;
}