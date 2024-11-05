import http from 'http';       // ECMAScript modules (ESM)

function calculate(num1, num2, op) {
    num1 = Number(num1)
    num2 = Number(num2)
    switch(op) {
        case "+":
            return num1 + num2;
        case "-":
            return num1 - num2;
        case "*":
            return num1 * num2;
        case "/":
            if(num2 == 0)
                return 0;
            return num1 / num2;
        default:
            return 0;
    }
}

const server = http.createServer(function(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.writeHead(200, {'Content-type': 'text/html'});
    let baseUrl = 'http://' + req.headers.host + '/';
    let whatwgUrl = new URL(req.url, baseUrl);
    let params = whatwgUrl.searchParams;
    let result = calculate(params.get('number1'), params.get('number2'), decodeURIComponent(params.get('operator')));
    console.log('Result' + result);
    res.write(`${result}`);
    res.end();
});

server.listen(8080, () => {
    console.log("Server running on port 8080");
});