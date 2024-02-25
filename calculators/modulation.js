

export function phasesFromArrow(amplitude,angle){
    angle = angle+Math.PI/2;
    let U = amplitude*Math.cos(angle);
    let V = amplitude*Math.cos(angle+Math.PI*2/3);
    let W = amplitude*Math.cos(angle+Math.PI*4/3);
    return [U,V,W];

}

export function superSinus(U,V,W){
    let maxVoltage = Math.max(U,V,W);
    let minVoltage = Math.min(U,V,W);
    let U0 = -(maxVoltage+minVoltage)/2;
    return U0;
}
export function sinusGraph(amplitudeIn,displayLength,useSuperSinus,useBlockComm,cutOffOperation,voltInvDc){
    let angleArray = [];
    let angleDisplayArray = [];
    const numberOfPoints = 50;
    for(let i=0; i<=numberOfPoints;i++){
        angleArray[i] = i*2*Math.PI/numberOfPoints;
        angleDisplayArray[i] = displayLength/numberOfPoints*i
    }
    //
    let UArray = [];
    let VArray = [];
    let WArray = [];
    let U0Array = [];


    let U = 0;
    let V = 0;
    let W = 0;
    let U0 = 0;
    
let amplitude = amplitudeIn;
    for(let k=0; k<angleArray.length;k++){
        if(useBlockComm == true){
            [U,V,W] = phasesFromArrow(2*voltInvDc/3,blockCommutation(angleArray[k]));
            useSuperSinus = true;
            U0 = superSinus(U,V,W);
        }else{
            if(cutOffOperation==true){
                
                amplitude = limitToHex(angleArray[k],voltInvDc,amplitudeIn);
                useSuperSinus = true;
              }
            [U,V,W] = phasesFromArrow(amplitude,angleArray[k]);
            
            if(useSuperSinus == true){
                U0 = superSinus(U,V,W);
            }else{
                U0 = 0;
            }
        }
    
    UArray[k] = U+U0;
    VArray[k] = V+U0;
    WArray[k] = W+U0;
    U0Array[k] = U0;
    }
    return [angleDisplayArray,UArray,VArray,WArray,U0Array];
}



export function phaseToPhaseGraph(UArray,VArray,WArray){
    let UVArray = [];
    let VWArray = [];
    let WUArray = [];
    for(let i=0; i<UArray.length;i++){
        UVArray[i] = UArray[i] - VArray[i];
        VWArray[i] = VArray[i] - WArray[i];
        WUArray[i] = WArray[i] - UArray[i];

    }

    return [UVArray,VWArray,WUArray];
}
export function motorPhases(UVArray,VWArray){
    let UmotArray = [];
    let VmotArray = [];
    let WmotArray = [];
    for(let i=0; i<UVArray.length;i++){
        UmotArray[i] = 2/3*UVArray[i]+1/3*VWArray[i];
        VmotArray[i] = -(1/3*UVArray[i]+2/3*VWArray[i]);
        WmotArray[i] = -(1/3*UVArray[i]-1/3*VWArray[i]);

    }

    return [UmotArray,VmotArray,WmotArray];

}

export function drawLimits(ctx,udcDisplay,superSinusLimitDisplay){
    ctx.beginPath()
    ctx.strokeStyle = 'grey';
    ctx.setLineDash([10,10]);//dot- dashed
    ctx.moveTo(-100,udcDisplay/2);
    ctx.lineTo(100,udcDisplay/2);
    ctx.stroke();
    ctx.beginPath()
    ctx.moveTo(-100,-udcDisplay/2);
    ctx.lineTo(100,-udcDisplay/2);
    ctx.stroke();
    ctx.strokeStyle = 'grey';
    ctx.beginPath()
    ctx.moveTo(-100,0);
    ctx.lineTo(100,0);
    ctx.stroke();
    ctx.beginPath()
    ctx.setLineDash([]);
    ctx.moveTo(-100,superSinusLimitDisplay);
    ctx.lineTo(100,superSinusLimitDisplay);
    ctx.stroke();
    ctx.beginPath()
    ctx.setLineDash([]);
    ctx.moveTo(-100,-superSinusLimitDisplay);
    ctx.lineTo(100,-superSinusLimitDisplay);
    ctx.stroke();
}

export function blockCommutation(angleSV){
    
    let blockAngle = 0;
    if(angleSV>=0 & angleSV<(Math.PI/3)){
    blockAngle = Math.PI/6;
    }
    if(angleSV>=1*Math.PI/3 && angleSV<2*Math.PI/3){
        blockAngle = 3*Math.PI/6;
    }
    if(angleSV>=2*Math.PI/3 && angleSV<3*Math.PI/3){
        blockAngle = 5*Math.PI/6;
    }
    if(angleSV>=3*Math.PI/3 && angleSV<4*Math.PI/3){
        blockAngle = 7*Math.PI/6;
    }
    if(angleSV>=4*Math.PI/3 && angleSV<5*Math.PI/3){
        blockAngle = 9*Math.PI/6;
    }
    if(angleSV>=5*Math.PI/3 && angleSV<6*Math.PI/3){
        blockAngle = 11*Math.PI/6;
    }
    
    return blockAngle;
}

export function limitToHex(angle,udc,SVAmpl){
    
    let normAngle =angle%(Math.PI/3);
    //console.log(normAngle)
    let sinAngle = Math.sin(normAngle);
    let cosAlpha = Math.cos(normAngle);
    let cosBeta = Math.cos(Math.PI/3-normAngle);
    
    let minAmpl = udc/Math.sqrt(3);
    let hexagonAmpl = minAmpl/cosAlpha;
    if(normAngle<Math.PI/6){
        hexagonAmpl = minAmpl/cosAlpha;
    }else{
        hexagonAmpl = minAmpl/cosBeta;
    }
    let outputAmpl = hexagonAmpl;
    if(SVAmpl<hexagonAmpl){
        outputAmpl = SVAmpl;
    }
    return outputAmpl;
}

export function ArrayRms(inputArray){
    let squares = inputArray.map((x)=> x*x);
    let sum = 0;
    squares.map((x)=> sum= sum+x);
    let mean = sum/inputArray.length;
    let output = Math.sqrt(mean);
    return output;
}

export function fourierGoertzel(signalArray){
    let omega = Math.PI/2;
    let N = signalArray.length-1;
    let U = [];
    U[N+2] = 0;
    U[N+1] = 0;
    let k = N;
    let cosOmega = Math.cos(omega);
    let sinOmega = Math.sin(omega);
    while(k>=1){
        U[k] = signalArray[k]+2*U[k+1]*cosOmega-U[k+2];


        k = k-1;
    }
    let C = signalArray[0]+U[1]*cosOmega-U[2];
    let S = U[1]*sinOmega;

    let ampl = Math.sqrt(C*C+S*S);

    return ampl;
}

export function DFT(signalArray,k){
    //k is the harmonic, 0: average, 1: first order etc.
    let N = signalArray.length;
    let theta = 0;
    let ck = 0;
    for(let j = 0; j<N;j++){
        theta = -2*Math.PI*j*k/N;
        ck = ck + Math.cos(theta)*signalArray[j]; 
    }
    let sk = 0;
    for(let j = 0; j<N;j++){
        theta = -2*Math.PI*j*k/N;
        sk = sk + Math.sin(theta)*signalArray[j]; 
    }
    ck = 2/N*ck;
    sk = 2/N*sk;
    //console.log('c1: ' +c1)
    //console.log('s1: '+ s1)
    let ampl = Math.sqrt(ck*ck+sk*sk)


    return ampl;
}