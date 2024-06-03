export default function StudentDAO(baseurl) {
    this.baseurl = baseurl;
}

StudentDAO.prototype.loadStudents = function(callback) {
    let xhr = this.prepareRequest('GET', '/students');
    
    xhr.responseType = 'json';
    xhr.onload = function() {
        callback(xhr.response);
    }

    xhr.send();
}

StudentDAO.prototype.addStudent = function(student, callback) {
    let xhr = this.prepareRequest('POST', '/students');

    // weirdly, the only after adding 2 students are both really added ...
    xhr.setRequestHeader("Content-type", "application/json");

    xhr.onload = function() {
        callback(xhr.response);
    }

    xhr.send(JSON.stringify(student));
}

StudentDAO.prototype.deleteStudent = function(studentId, callback) {
    let xhr = this.prepareRequest('DELETE', `/students/${studentId}`);

    xhr.responseType = 'json';
    xhr.onload = function() {
        callback(xhr.response);
    }

    xhr.send();
}

StudentDAO.prototype.prepareRequest = function(method, path) {
    let xhr = new XMLHttpRequest();
    let url = new URL(this.baseurl + path);

    xhr.open(method, url);

    return xhr;
}