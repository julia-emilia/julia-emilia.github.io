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
//Vout = Rdown/(Rup+Rdown)*Vin
//Vin/vout = (Rup+Rdown)/Rdown
//Vin/vout = Rup/Rdown+1
//Vin/Vout -1 = Rup/Rdown
function findResistorPair(Vin,Vout,Eseries){
    let quotientOrig = Vin/Vout-1;
    let pullupFactor = 1;
    let threshold = 10-0.5*(10-Eseries[Eseries.length-1]);
    let quotient = quotientOrig;

    while(quotient>threshold){
        pullupFactor = pullupFactor*10;
        quotient = quotientOrig - pullupFactor;
    
    }
    quotient = quotientOrig;
   
    let eta = 100;
    let bestEta = 100;
    let bestUp = 0;
    let bestDown = 0;
    for(let upIndex = 0; upIndex<Eseries.length; upIndex++){
        for(let downIndex = 0; downIndex<Eseries.length;downIndex++){
            eta = Math.abs(pullupFactor*Eseries[upIndex]/Eseries[downIndex] - quotient);
            if (eta < bestEta) {
                bestEta = eta;
                bestUp = upIndex;
                bestDown = downIndex;
            }
       }
    }
    let resistors = [pullupFactor*Eseries[bestUp],Eseries[bestDown]];
    return resistors ;
}

function resistorVoltageDivider() {
    //Constants
    const E03series = [1.0,2.2,4.7];
    const E06series = [1.0,1.5,2.2,3.3,4.7,6.8];
    const E12series = [1.0,1.2,1.5,1.8,2.2,2.7,3.3,3.9,4.7,5.6,6.8,8.2];
    const E24series = [1.0,1.1,1.2,1.3,1.5,1.6,1.8,2.0,2.2,2.4,2.7,3.0,3.3,3.6,3.9,4.3,4.7,5.1,5.6,6.2,6.8,7.5,8.2];
    //Get inputs
    let inputVoltage = document.getElementById("inputVoltage").value;
    let outputVoltage = document.getElementById("outputVoltage").value;
    let seriesDrop = document.getElementById("seriesDropdown").value;
    //Choose E-series
    let Eseries = E06series;
    console.log(seriesDrop)
    switch(seriesDrop){
        case "E03": 
            Eseries = E03series;
            break;
        case "E06": 
            Eseries = E06series;
            break;
        case "E12": 
            Eseries = E12series;
            break;
        case "E24": 
            Eseries = E24series;
            break;
        default:
            Eseries = E03series;
    }
    
    let resistors = findResistorPair(inputVoltage,outputVoltage,Eseries);
    let realVout = resistors[1]/(resistors[0]+resistors[1])*inputVoltage;
    //Get outputs
    let outputDiv1 = document.getElementById("pullupRes");
    outputDiv1.innerHTML = "Pullup Resistor: " + resistors[0] + "&nbsp;k&Omega;";
    let outputDiv2 = document.getElementById("pulldownRes");
    outputDiv2.innerHTML = "Pulldown Resistor: " + resistors[1] + "&nbsp;k&Omega;";
    let outputDiv3 = document.getElementById("RealVoltage");
    outputDiv3.innerHTML = "Real Output Voltage: " + realVout +"&nbsp;V";
}