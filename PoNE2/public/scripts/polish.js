"use strict";
const EMPTY_EXPRESSION = "Empty expression";
const MSG_BAD_INPUT = "Input eronat!";
const MSG_EMPTY_INPUT = "Input gol!";

var flagBadInput = false;
var treeNo = 0;
var msgBoxCount = 0;
const precedence = [
    ["+", "-"],
    ["/", "*"],
];

class BTree {
    constructor() {
        this.data = null;
        this.left = null;
        this.right = null;
    }
}

function findFirstOperator(input) {
    const MAX_POS = 1000;
    var operatorPosition, i, j;
    operatorPosition = input.indexOf("+");
    if (-1 !== operatorPosition) return operatorPosition;
    for (i = 0; i < precedence.length; i++) {
        var minimumPosition = MAX_POS;
        for (j = 0; j < precedence[i].length; j++) {
            operatorPosition = input.indexOf(precedence[i][j]);
            if (-1 !== operatorPosition && operatorPosition < minimumPosition)
                minimumPosition = operatorPosition;
        }
        if (MAX_POS != minimumPosition) return minimumPosition;
    }
    return -1;
}

function makeExprTree(input, tree, showRecursiveTreeView, parentElement) {
    var positionOperator = findFirstOperator(input);

    tree.left = new BTree();
    tree.right = new BTree();
    if (-1 === positionOperator) { // nu contine operator, deci e numar (nod frunza)
        tree.data = parseInt(input);
        tree.left = null;
        tree.right = null;
        console.log("NUMBER IS : @" + input + "@");
        return null;
    }
    // 23 + 49
    tree.data = input[positionOperator]; // + 
    var substrLeft = input.substring(0, positionOperator); // 23
    var substrRight = input.substring(positionOperator + 1, input.length); // 49
    if (true == showRecursiveTreeView) {
        var displayTree = new BTree();
        displayTree.left = null;
        displayTree.right = null;
        displayTree.data = tree.data;
        if (substrLeft) {
            displayTree.left = new BTree();
            displayTree.left.data = substrLeft;
            displayTree.left.left = displayTree.left.right = null;
        }
        if (substrRight) {
            displayTree.right = new BTree();
            displayTree.right.data = substrRight;
            displayTree.right.left = displayTree.right.right = null;
        }
        makeTreeView(displayTree, parentElement);
    }
    console.log("STR LEFT IS  @" + substrLeft + "@");
    console.log("STR RIGHT IS @" + substrRight + "@");

    if (0 !== substrLeft.length)
        makeExprTree(substrLeft, tree.left, showRecursiveTreeView, parentElement);
    if (0 !== substrRight.length)
        makeExprTree(substrRight, tree.right, showRecursiveTreeView, parentElement);
}

function polishPre(tree) { // R S D
    console.log(`Data: ${tree.data}; Left: ${tree.right}; Right: ${tree.left};`);
    if (null === tree.data) return EMPTY_EXPRESSION;
    if (null === tree.left && null === tree.right) return tree.data;
    if (null === tree.right) return tree.data + polishPre(tree.left);
    if (null === tree.left) return tree.data + polishPre(tree.right);
    return tree.data + " " + polishPre(tree.left) + " " + polishPre(tree.right);
    // return tree.data + "~" + polishPre(tree.left) + "~" + polishPre(tree.right);
}

function polishPost(tree) { // S D R
    console.log(`Data: ${tree.data}; Left: ${tree.right}; Right: ${tree.left};`);
    if (null === tree.data) return EMPTY_EXPRESSION; // inputul era gol sau expresia era scrisa eronat
    if (null === tree.left && null === tree.right) return tree.data;
    if (null === tree.right) return tree.data + polishPost(tree.left);
    if (null === tree.left) return tree.data + polishPost(tree.right);
    return polishPost(tree.left) + " " + polishPost(tree.right) + " " + tree.data;
    // return polishPost(tree.left) + "~" + polishPost(tree.right) + "~" + tree.data;
}

function generatePolishPre(input) {
    var myTree = new BTree();
    makeExprTree(input, myTree, false, null);
    return polishPre(myTree);
}

function generatePolishPost(input) {
    var myTree = new BTree();
    makeExprTree(input, myTree, false, null);
    return polishPost(myTree);
}
//#region EVALUATE PREFIX AND POSTFIX
class Stack {
    constructor() {
        this.items = [];
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
        for (var i = 0; i < this.items.length; i++) output += this.items[i] + " ";
        return output;
    }
}

function isNumber(num) {
    return !isNaN(num);
}

function evaluatePostfixExpr(expr) {
    flagBadInput = false;
    var stiva = new Stack();
    var elements = expr.split(" "); // "+2347" - NU ; "+ 23 47" - DA :)
    var valRight, valLeft, currentElement;
    for (var i = 0; i < elements.length; i++) {
        currentElement = elements[i];
        if (isNumber(currentElement)) {
            stiva.push(parseInt(currentElement));
            continue;
        }
        valRight = stiva.pop();
        valLeft = stiva.pop();
        if ("!Underflow!" === valRight || "!Underflow" === valLeft) {
            flagBadInput = true;
            console.log(`Can't evaulate the postfix expression ${expr}`);
            return -1;
        }
        switch (currentElement) {
            case "+":
                stiva.push(valLeft + valRight);
                break;
            case "-":
                stiva.push(valLeft - valRight);
                break;
            case "*":
                stiva.push(valLeft * valRight);
                break;
            case "/":
                stiva.push(valLeft / valRight);
                break;
        }
    }
    return stiva.pop(); // la finalul alg, raspunsul e (singurul) elementul din stiva
}

function evaluatePrefixExpr(expr) {
    flagBadInput = false;
    var stiva = new Stack();
    var elements = expr.split(" ");
    var valFirst, valSecond, currentElement;
    for (var i = elements.length - 1; i >= 0; i--) {
        currentElement = elements[i];
        if (isNumber(currentElement)) {
            stiva.push(parseInt(currentElement));
            continue;
        }
        valFirst = stiva.pop();
        valSecond = stiva.pop();
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
    return stiva.pop(); // in the stack, there is only one element left (== the answer)
}
//#endregion
// #region VIEWING
function showPolishPre() {
    deleteAllMessageBoxes();
    var input = document.getElementById("inputExpr").value;
    if (!input) {
        createMessageBox("error", MSG_EMPTY_INPUT);
        return;
    }
    var result = generatePolishPre(input);
    if (result.includes(EMPTY_EXPRESSION)) {
        createMessageBox("error", MSG_BAD_INPUT);
        return;
    }
    document.getElementById("outputExpr").value = result;
}

function showPolishPost() {
    deleteAllMessageBoxes();
    var input = document.getElementById("inputExpr").value;
    if (!input) {
        createMessageBox("error", MSG_EMPTY_INPUT);
        return;
    }
    var result = generatePolishPost(input);
    if (result.includes(EMPTY_EXPRESSION)) {
        console.log("QQQQQQQ");
        createMessageBox("error", MSG_BAD_INPUT);
        return;
    }
    document.getElementById("outputExpr").value = result;
}

function makeTreeView(tree, parentElement) {
    if (null === tree.data) return;
    var hasNoChildren = null === tree.left && null === tree.right;
    if (hasNoChildren) {
        var sonElement = document.createElement("li");
        sonElement.appendChild(document.createTextNode(tree.data));
        parentElement.appendChild(sonElement);
        return;
    }
    var sonElement = document.createElement("li");
    var spanNode = document.createElement("span");
    spanNode.setAttribute("class", "caret");
    spanNode.appendChild(document.createTextNode(tree.data));

    var listChildren = document.createElement("ul");
    listChildren.setAttribute("class", "nested");

    if (null !== tree.left) makeTreeView(tree.left, listChildren);
    if (null !== tree.right) makeTreeView(tree.right, listChildren);

    sonElement.appendChild(spanNode); // ">" pe care dau click sa fac expand/collapse
    sonElement.appendChild(listChildren);
    parentElement.appendChild(sonElement);
}

function debugTreeView() {
    // aici desenez arborele expresiei si arborii prin care se explica pas cu pas
    deleteAllMessageBoxes();
    var input = document.getElementById("inputExpr").value;
    if (!input) {
        createMessageBox("error", MSG_EMPTY_INPUT);
        return;
    }
    var myTree = new BTree();
    //#region Afisez arborele pt intreaga expr
    var parentList = document.getElementById("myUL");
    treeNo = 0;
    parentList.innerHTML = "";
    var listTitle = document.createElement("li");
    listTitle.innerHTML = `Arborele expresiei`;
    parentList.appendChild(listTitle);
    makeExprTree(input, myTree, false, null);
    makeTreeView(myTree, parentList);
    //#endregion

    //#region Afisez subarborii
    var parentListDetailed = document.getElementById("detailedUL");
    var listTitle = document.createElement("li");
    listTitle.innerHTML = `Parcurgerea expresiei arbore cu arbore`;
    parentList.appendChild(listTitle);
    var showRecursiveTreeView = true;
    makeExprTree(input, myTree, showRecursiveTreeView, parentListDetailed);
    //#endregion

    enableTree(); // makes the trees fold/unfold on click
}

function showExprResult() {
    deleteAllMessageBoxes();
    var input = document.getElementById("inputExpr").value;
    if (!input) {
        createMessageBox("error", "Introdu o expresie!");
        return;
    }
    var output = document.getElementById("outputExpr");
    var myTree = new BTree();
    makeExprTree(input, myTree, false, null);
    var exprValue = solveExprTree(myTree); // parcure SRD
    if ("NaN" === exprValue + "") {
        createMessageBox("error", MSG_BAD_INPUT);
        return;
    }
    output.value = `Rezultatul este ${exprValue}`;
}

function solveExprTree(tree) {
    var hasNoChildren = null === tree.left && null === tree.right;
    if (hasNoChildren) return parseInt(tree.data); //"23" -> 23
    switch (tree.data) {
        case "+":
            return solveExprTree(tree.left) + solveExprTree(tree.right);
        case "-":
            return solveExprTree(tree.left) - solveExprTree(tree.right);
        case "*":
            return solveExprTree(tree.left) * solveExprTree(tree.right);
        case "/":
            return solveExprTree(tree.left) / solveExprTree(tree.right);
        default:
            console.log(`RUNTIME ERROR! TREE DATA ${tree.data}`);
    }
}

function createMessageBox(type, text) {
    // CLOSE BUTTON
    var spanClose = document.createElement("span");
    spanClose.setAttribute("class", "closebtn");
    spanClose.setAttribute("onclick", "this.parentElement.style.display='none';");
    spanClose.innerHTML = "&times;";
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

function viewEvaluatePrefixExpr() {
    var input = document.getElementById("inputExpr").value;
    var output = document.getElementById("outputExpr");
    var result = evaluatePrefixExpr(input);
    if (flagBadInput) {
        createMessageBox("error", MSG_BAD_INPUT);
        return;
    }
    output.value = result;
}

function viewEvaluatePostfixExpr() {
    var input = document.getElementById("inputExpr").value;
    var output = document.getElementById("outputExpr");
    var result = evaluatePostfixExpr(input);
    if (flagBadInput) {
        createMessageBox("error", MSG_BAD_INPUT);
        return;
    }
    output.value = result;
}
//#endregion