export function squareRoot(){
    
}

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
export function sinusGraph(amplitude,displayLength){
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


    let U = 0;
    let V = 0;
    let W = 0;

    for(let k=0; k<angleArray.length;k++){
    [U,V,W] = phasesFromArrow(amplitude,angleArray[k])
    UArray[k] = U;
    VArray[k] = V;
    WArray[k] = W;
    }
    return [angleDisplayArray,UArray,VArray,WArray];
}

export function superSinusGraph(amplitude,displayLength){
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

    for(let k=0; k<angleArray.length;k++){
    [U,V,W] = phasesFromArrow(amplitude,angleArray[k])
    U0 = superSinus(U,V,W);
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