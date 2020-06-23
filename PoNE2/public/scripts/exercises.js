"use strict";
//#region EVALUATE PREFIX AND POSTFIX
var flagBadInput;
class Stack {
    constructor() {
        this.items = [];
        this.stepsMessage = ""; // string in care, la final, am toti pasii in aplicarea alg
        this.step = 0; // la ce pas suntem
    }
    push(element) {
        return this.items.push(element);
    }
    pop(element) {
        if (0 === this.items.length) return "!Underflow!";
        return this.items.pop(element);
    }
    peek(element) {
        return this.items[this.items.length - 1];
    }
    isEmpty() {
        return 0 === this.items.length;
    }
    printAll() {
        var output = "";
        if (this.isEmpty())
            return "STIVA GOALA!";
        for (var i = 0; i < this.items.length; i++) output += this.items[i] + " ";
        return output;
    }
    addStep(msg) {
        this.step++;
        this.stepsMessage += `Pasul ${this.step} : ${msg}\n`;
    }
    printSteps() {
        return this.stepsMessage;
    }
}

function isNumber(num) {
    return !isNaN(num);
}

function evaluatePostfixExpr(expr) {
    flagBadInput = false;
    var stiva = new Stack();
    var elements = expr.split(" ");
    var valRight, valLeft, currentElement;
    for (var i = 0; i < elements.length; i++) {
        currentElement = elements[i];
        if (isNumber(currentElement)) {
            stiva.push(parseInt(currentElement));
            stiva.addStep(`Am inserat ${currentElement}`);
            continue;
        }
        valRight = stiva.pop();
        valLeft = stiva.pop();
        stiva.addStep(`Extragem ${valRight} si apoi extragem ${valLeft}`);
        if ("!Underflow!" === valRight || "!Underflow" === valLeft) {
            flagBadInput = true;
            console.log(`Can't evaulate the postfix expression ${expr}`);
            return -1;
        }

        switch (currentElement) {
            case "+":
                stiva.addStep(`Am inserat ${valLeft + valRight}`);
                stiva.push(valLeft + valRight);
                break;
            case "-":
                stiva.addStep(`Am inserat ${valLeft - valRight}`);
                stiva.push(valLeft - valRight);
                break;
            case "*":
                stiva.addStep(`Am inserat ${valLeft * valRight}`);
                stiva.push(valLeft * valRight);
                break;
            case "/":
                stiva.addStep(`Am inserat ${valLeft / valRight}`);
                stiva.push(valLeft / valRight);
                break;
        }
    }
    stiva.addStep(`Am terminat! Rezultatul final este ${stiva.pop()}`);
    return stiva.printSteps();
}

function evaluatePrefixExpr(expr) {
    flagBadInput = false;
    var stiva = new Stack();
    var elements = expr.split(" ");
    var valFirst, valSecond, currentElement;
    for (var i = elements.length - 1; i >= 0; i--) {
        stiva.stepsMessage += `Continutul stivei: ${stiva.printAll()}\n`;
        currentElement = elements[i];

        if (isNumber(currentElement)) {
            stiva.push(parseInt(currentElement));
            stiva.addStep(`Am inserat ${currentElement}`);
            continue;
        }
        valFirst = stiva.pop();
        valSecond = stiva.pop();
        stiva.addStep(`Extragem ${valFirst} si apoi extragem ${valSecond}`);
        if ("!Underflow!" === valFirst || "!Underflow" === valSecond) {
            flagBadInput = true;
            console.log(`Can't evaulate the postfix expression ${expr}`);
            return -1;
        }
        switch (currentElement) {
            case "+":
                stiva.push(valFirst + valSecond);
                break;
            case "-":
                stiva.push(valFirst - valSecond);
                break;
            case "*":
                stiva.push(valFirst * valSecond);
                break;
            case "/":
                stiva.push(valFirst / valSecond);
                break;
        }
    }
    stiva.addStep(`Am terminat! Rezultatul final este ${stiva.pop()}`);
    return stiva.printSteps();
}
//#endregion
const rightAnswers = [8, 44, -5, 23, -22];
const expresii = ["+ 5 / 18 6", "+ 9 * 5 7", "5 7 * 40 -", "20 5 9 15 / * +",
    "78 23 3 * - 35 7 / 4 9 * - +"
];

function createMessageBox(type, text) {
    // CLOSE BUTTON
    var spanClose = document.createElement("span");
    spanClose.setAttribute("class", "closebtn");
    spanClose.setAttribute("onclick", "this.parentElement.style.display='none';");
    spanClose.innerHTML = "&times;"; // X-ul pe care il apas sa inchid msgboxul
    // TYPE
    var typeElement = document.createElement("strong");
    switch (type) {
        case "error":
            typeElement.innerText = "Eroare!";
            break;
        case "success":
            typeElement.innerText = "Succes!";
            break;
        case "info":
            typeElement.innerText = "Info!";
            break;
        default:
            break;
    }
    // TEXT
    var messageElement = document.createTextNode(" " + text);
    // DIV CONTAINER
    var boxDiv = document.createElement("div");
    boxDiv.setAttribute("class", `alert ${type}`);
    boxDiv.appendChild(spanClose);
    boxDiv.appendChild(typeElement);
    boxDiv.appendChild(messageElement);

    // OLD -> document.body.appendChild(boxDiv);
    document.getElementById("messageBoxArea").appendChild(boxDiv);
}

function deleteAllMessageBoxes() {
    document.getElementById("messageBoxArea").innerHTML = "";

}

function checkAnswer(index, input) {
    deleteAllMessageBoxes();
    if (0 === input.trim().length) {
        createMessageBox("error", "Raspuns gol!");
        return;
    }
    if (isNaN(input)) {
        createMessageBox("error", "Raspunsul nu e numeric!");
        return;
    }
    if (rightAnswers[index] == input) {
        createMessageBox("success", "Raspuns corect!");
        return;
    }
    createMessageBox("error", "Raspuns gresit!");
}

function writeSolution(index, divID, solution) {
    console.log(`index ${index}; divID ${divID}; solution ${solution}`);
    var myStackUL = document.getElementById(divID);
    myStackUL.style.display = "none" === myStackUL.style.display ? "block" : "none";
    if ("none" === myStackUL.style.display) {
        myStackUL = "";
        return;
    }
    var myStackUL = document.getElementById(divID);
    var sentences = solution.split("\n");
    var i;
    for (i = 0; i < sentences.length; i++) {
        var hNode = document.createElement("li");
        hNode.innerText = sentences[i];
        myStackUL.appendChild(hNode);
    }
    // createMessageBox("info", solution);
}

document.getElementById("check1").onclick = () => {
    var input = document.getElementById("input1").value;
    checkAnswer(0, input);
};
document.getElementById("check2").onclick = () => {
    var input = document.getElementById("input2").value;
    checkAnswer(1, input);
};
document.getElementById("check3").onclick = () => {
    var input = document.getElementById("input3").value;
    checkAnswer(2, input);
};
document.getElementById("check4").onclick = () => {
    var input = document.getElementById("input4").value;
    checkAnswer(3, input);
};
document.getElementById("check5").onclick = () => {
    var input = document.getElementById("input5").value;
    checkAnswer(4, input);
};

document.getElementById("help1").onclick = () => {
    writeSolution(0, "solutie1", evaluatePrefixExpr(expresii[0]));
};
document.getElementById("help2").onclick = () => {
    writeSolution(1, "solutie2", evaluatePrefixExpr(expresii[1]));
};
document.getElementById("help3").onclick = () => {
    writeSolution(2, "solutie3", evaluatePostfixExpr(expresii[2]));
};
document.getElementById("help4").onclick = () => {
    writeSolution(3, "solutie4", evaluatePostfixExpr(expresii[3]));
};
document.getElementById("help5").onclick = () => {
    writeSolution(4, "solutie5", evaluatePostfixExpr(expresii[4]));
};