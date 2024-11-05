export default function Calculator(baseurl) {
    this.baseurl = baseurl;
}

Calculator.prototype.prepareRequest = function(httpMethod, path, params) {
    let xhr = new XMLHttpRequest();
    let url = new URL(path);

    for(let key in params)
        url.searchParams.set(key, params[key]);

    xhr.open(httpMethod, url);

    return xhr;
}

Calculator.prototype.calculate = function(number1, number2, operator, callback) {
    let fullrequest = `${this.baseurl}/?number1=${number1}&number2=${number2}&operator=${encodeURIComponent(operator)}`;
    let xhr = this.prepareRequest('GET', fullrequest);

    console.log(fullrequest);

    //xhr.responseType = 'text';
    xhr.onload = function() {
        alert('Result: ' + xhr.response);
        callback(xhr.response);
    }

    xhr.send();
}