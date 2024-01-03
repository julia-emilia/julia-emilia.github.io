let name ='Mosh';
function square(number){
    return number*number;
}

//let out = square(5);
//console.log(out);

function outputSquare() {
    var inputValue = document.getElementById("num").value;
    var outputDiv = document.getElementById("output");
    outputDiv.innerHTML = "Square of input: " + square(inputValue);
}

function resistorVoltageDivider() {
    let inputVoltage = document.getElementById("inputVoltage").value;
    let outputVoltage = document.getElementById("outputVoltage").value;
    let outputDiv1 = document.getElementById("pullupRes");
    outputDiv1.innerHTML = "Pullup Resistor: " + square(inputVoltage);
    let outputDiv2 = document.getElementById("pulldownRes");
    outputDiv2.innerHTML = "Pulldown Resistor: " + square(outputVoltage);
}