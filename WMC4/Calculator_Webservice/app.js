import Calculator from "./Calculator.js";

function main() {
    let calculator = new Calculator('http://localhost:8080');
    let inputNumber1 = document.getElementById('num1');
    let inputNumber2 = document.getElementById('num2');
    let inputOperator = document.getElementById('op');
    let outputEl = document.getElementById('output');

    document.getElementById('calculate').onclick = () => {
        calculator.calculate(Number(inputNumber1.value), Number(inputNumber2.value), inputOperator.value, (result) => {
            outputEl.innerHTML = 'Result: ' + result;
        });
    };
}

main();