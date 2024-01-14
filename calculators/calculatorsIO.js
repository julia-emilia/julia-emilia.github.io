import { square, findResistorPair,findResistorForFilter,calcCutoffFrequency, chooseEseries, calcVoltagedividerPullup } from "./calculators.js";

function outputSquare() {
    
    var inputValue = document.getElementById("num").value;
    var outputDiv = document.getElementById("output");
    outputDiv.innerHTML = "Square of input: " + square(inputValue);
}
function resistorVoltageDivider() {
    //Get inputs
    let inputVoltage = document.getElementById("inputVoltage").value;
    let outputVoltage = document.getElementById("outputVoltage").value;
    let seriesDrop = document.getElementById("seriesDropdown").value;  
    //Calculate
    let Eseries = chooseEseries(seriesDrop);
    let resistors = findResistorPair(inputVoltage,outputVoltage,Eseries);
    let realVout = resistors[1]/(resistors[0]+resistors[1])*inputVoltage;
    //Get outputs
    let outputDiv1 = document.getElementById("pullupRes");
    outputDiv1.innerHTML = "Pullup Resistor: " + resistors[0] + "&nbsp;k&Omega;";
    let outputDiv2 = document.getElementById("pulldownRes");
    outputDiv2.innerHTML = "Pulldown Resistor: " + resistors[1] + "&nbsp;k&Omega;";
    let outputDiv3 = document.getElementById("RealVoltage");
    outputDiv3.innerHTML = "Real Output Voltage: " + realVout.toFixed(3) +"&nbsp;V";
}
function CutoffFrequency(){
    //Get inputs
    let cutoffRes = document.getElementById("CutoffRes").value;
    let cutoffCap = document.getElementById("CutoffCap").value;
    //Calculate
    console.log(cutoffCap)
    console.log(cutoffRes)
    let cutoffFrequency = calcCutoffFrequency(cutoffRes,cutoffCap);   
    //Get outputs
    let outputDiv = document.getElementById("CutoffFrequency");
    outputDiv.innerHTML = "Cutoff Frequency: " + cutoffFrequency.toFixed(2) + "&nbsp;Hz";
    
}
function GetResistorForFilter(){
    //Get inputs
    let filterFrequency = document.getElementById("filterFrequency").value;
    let filterCap = document.getElementById("filterCap").value;
    let seriesDrop = document.getElementById("filterEseriesDrop").value;
    //Calculate
    let Eseries = chooseEseries(seriesDrop);
    let filterResistor= findResistorForFilter(filterFrequency,filterCap,Eseries);
    let realCutoffFrequency = calcCutoffFrequency(filterResistor,filterCap);
    //Get outputs
    let outputDiv1 = document.getElementById("filterResistor");
    outputDiv1.innerHTML = "Resistor value: " + filterResistor/1000 + "&nbsp;kOhm";
    let outputDiv2 = document.getElementById("filterRealFreq");
    outputDiv2.innerHTML = "Real Cutoff frequency: " + realCutoffFrequency.toFixed(2) + "&nbsp;Hz";

}
function pullupVoltagedivider(){
    //Get inputs
    let resV1 = parseInt(document.getElementById("ResV1").value,10);
    let resV2 = parseInt(document.getElementById("ResV2").value,10);
    let resGnd = parseInt(document.getElementById("ResGnd").value,10);
    let V1 = parseInt(document.getElementById("V1").value,10);
    let V2 = parseInt(document.getElementById("V2").value,10);
    //Calculate
    let outputVoltage = calcVoltagedividerPullup(resV1,resV2,resGnd,V1,V2);
    //Get outputs
    let outputDiv1 = document.getElementById("OutputvoltageWithPullup");
    outputDiv1.innerHTML = "Resistor value: " + outputVoltage.toFixed(3) + "&nbsp;V";

}

document.querySelector('#squareButton').addEventListener('click', outputSquare);
document.querySelector('#resistorVoltageDividerButton').addEventListener('click', resistorVoltageDivider);
document.querySelector('#cutoffFrequencyButton').addEventListener('click', CutoffFrequency);
document.querySelector('#GetResistorForFilterbutton').addEventListener('click', GetResistorForFilter);
document.querySelector('#pullupVoltageDivider').addEventListener('click', pullupVoltagedivider);