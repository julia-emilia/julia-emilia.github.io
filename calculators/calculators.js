export function square(number){
    return number*number;
}
export function chooseEseries(seriesName){
    //Constants
    const E03series = [1.0,2.2,4.7];
    const E06series = [1.0,1.5,2.2,3.3,4.7,6.8];
    const E12series = [1.0,1.2,1.5,1.8,2.2,2.7,3.3,3.9,4.7,5.6,6.8,8.2];
    const E24series = [1.0,1.1,1.2,1.3,1.5,1.6,1.8,2.0,2.2,2.4,2.7,3.0,3.3,3.6,3.9,4.3,4.7,5.1,5.6,6.2,6.8,7.5,8.2];
    //Choose E-series
    let Eseries = E06series;
    switch(seriesName){
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
    return Eseries;
}
//Vout = Rdown/(Rup+Rdown)*Vin
//Vin/vout = (Rup+Rdown)/Rdown
//Vin/vout = Rup/Rdown+1
//Vin/Vout -1 = Rup/Rdown
export function findResistorPair(Vin,Vout,Eseries){
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
export function calcCutoffFrequency(Resistor,Capacitor){
    return 1/(2*Math.PI*Resistor*Capacitor);
}
export function findResistorForFilter(Frequency,Capacitor,Eseries){
    let idealResistor = 1/(2*Math.PI*Frequency*Capacitor);
    let idealResistorOrig = idealResistor;
    let factor = 1;
    while(idealResistorOrig/factor>10){
        factor = factor*10;
    }
    let eta = 1000000;
    let besteta = 1000000;
    let bestindex = 0;
    for(let iterator=0;iterator<Eseries.length;iterator++){
        eta = Math.abs(idealResistor-Eseries[iterator]*factor);
        if(eta<besteta){
            besteta = eta;
            bestindex = iterator;
        }
    }
    return Eseries[bestindex]*factor;
}
function calcVoltageDivider(Rup,Rdown,Vin){
    return Rdown/(Rup+Rdown)*Vin;
}
function calcParallelResistor(R1,R2){
    return R1*R2/(R1+R2);
}

export function calcVoltagedividerPullup(resV1,resV2,resGnd,V1,V2){
    let U_rdown1 = calcVoltageDivider(resV1,calcParallelResistor(resV2,resGnd),V1);
    let U_rdown2 = calcVoltageDivider(resV2,calcParallelResistor(resV1,resGnd),V2);

    //let i_rdown = (U_rdown1+U_rdown2)/resGnd;
    let output = U_rdown1+U_rdown2;
    return output;
}