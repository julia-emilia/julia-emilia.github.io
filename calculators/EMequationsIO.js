import { squareRoot,phasesFromArrow, superSinus, superSinusGraph,phaseToPhaseGraph, motorPhases,sinusGraph, drawLimits } from "./modulation.js";
import { drawHexagon,drawArrow, drawCircle, drawThreePointStar,drawCircleFill,drawGraph} from "./canvasUtils.js";

function GetElectricalFrequency() {
    let pp = document.getElementById("pp").value;
    var n_rpm = document.getElementById("n_rpm").value;
    var outputDiv1 = document.getElementById("f_mech");
    var outputDiv2 = document.getElementById("w_mech");
    var outputDiv3 = document.getElementById("f_el");
    var outputDiv4 = document.getElementById("w_el");
    let f_mech = n_rpm/60;
    let w_mech = f_mech*2*Math.PI;
    let f_el = pp*f_mech;
    let w_el = pp*w_mech;
    outputDiv1.innerHTML = "Mechanical frequency: " + f_mech.toFixed(3) +"&nbsp;Hz";
    outputDiv2.innerHTML = "Mechanical frequency: " + w_mech.toFixed(3) +"&nbsp;rad/s";
    outputDiv3.innerHTML = "Electrial frequency: " + f_el.toFixed(3) +"&nbsp;Hz";
    outputDiv4.innerHTML = "Electrial frequency: " + w_el.toFixed(3) +"&nbsp;rad/s";
}

function hexagonAnimationIO(){
  //Get inputs
  //Get outputs
  
  canvasAnimation();
}


function canvasAnimation(){
  //Get user inputs
  let VoltDc = parseFloat(document.getElementById("VoltDc").value,10);
  let modFacInput = parseFloat(document.getElementById("modFac").value,10);
  let outputDiv1 = document.getElementById("modFacOutput");
  outputDiv1.innerHTML = modFacInput.toFixed(2);
  // Get the checkbox element by its ID
  let superSinusOperation = false;
  const checkboxUseSuperSinus = document.getElementById("useSuperSinus");
    // Check if the checkbox is checked
    if (checkboxUseSuperSinus.checked) {
      superSinusOperation = true;
      //console.log('Feature is enabled.');
      
    } else {
      superSinusOperation = false;
      //console.log('Feature is disabled.');
      
    }
    //derive limits from Udc
    let superSinusLimit = VoltDc/Math.sqrt(3);
    let hexagonLimit = 2/3*VoltDc;
    let uAmpl = modFacInput*superSinusLimit;
    let uphphAmpl = uAmpl*Math.sqrt(3);
  //scale for display 
  let displayFactor = 50;
  while(displayFactor*VoltDc >150){
    displayFactor = displayFactor*2/3;
  }
  const udcDisplay = displayFactor*VoltDc;
  let superSinusLimitDisplay = displayFactor*superSinusLimit;
  let hexagonLimitDisplay = displayFactor*hexagonLimit;

  //
  let uAmplDisplay = modFacInput*superSinusLimitDisplay;
  

  //Get environment variables
  const time = new Date();
  const canvas = document.getElementById("hexagonCanvas");
  if(canvas.getContext){
  const ctx = canvas.getContext('2d');
  
  ctx.globalCompositeOperation = "destination-over";
  ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas
  let angle = ((2 * Math.PI) / 6) * time.getSeconds() + ((2 * Math.PI) / 6000) * time.getMilliseconds();
  //let angle = 1;

  // canvas center X and Y
  let centerX = 150;
  const centerY = canvas.height / 2;
    //draw descriptions
    ctx.font = "18px Caladea";
  ctx.fillText('DC link voltage: '+VoltDc.toString(10)+ ' V', centerX/2, 50);
  ctx.fillText('Limit for Supersinus: '+superSinusLimit.toFixed(2)+ ' V', centerX/2, 80);
  ctx.fillText('Limit for Block: '+hexagonLimit.toFixed(2)+ ' V', centerX/2, 110);
  
    
    //draw hexagon
    ctx.save();
    ctx.translate(centerX,centerY);
    drawHexagon(ctx,hexagonLimitDisplay);
    ctx.restore();
    //draw circle
    ctx.save();
    ctx.translate(centerX,centerY);
    ctx.strokeStyle = 'grey';
    ctx.setLineDash([10,10]);//dashed
    drawCircle(ctx,udcDisplay/2,'dot-dashed');
    ctx.setLineDash([]);//solid line
    drawCircle(ctx,superSinusLimitDisplay,'dashed');
    ctx.restore();
    
    // Draw arrow
    ctx.save();
    ctx.translate(centerX,centerY);
    ctx.rotate(-angle);
    drawArrow(ctx,uAmplDisplay);
    ctx.restore();

    //// mercedes
    centerX = 400;
    // draw limits
    ctx.save();
    ctx.translate(centerX,centerY);
    drawLimits(ctx,udcDisplay,superSinusLimitDisplay);
    ctx.restore();
    

    //draw star
    let starCenterY = centerY;
    let voltageZero = 0;
    let voltageU = 0;
    let voltageV = 0;
    let voltageW = 0;
    [voltageU,voltageV,voltageW] = phasesFromArrow(uAmplDisplay,angle);
    if(superSinusOperation == true){
    voltageZero = superSinus(voltageU,voltageV,voltageW);
    starCenterY = centerY+voltageZero;
    }else{
      starCenterY = centerY;
    }
    ctx.save();
    ctx.translate(centerX,starCenterY);
    ctx.rotate(-angle);
    drawThreePointStar(ctx,uAmplDisplay);
    ctx.restore();
    //// draw phases referenced to 0-point
    centerX = 650;
    // draw limits
    ctx.save();
    ctx.translate(centerX,centerY);
    drawLimits(ctx,udcDisplay,superSinusLimitDisplay);
    ctx.restore();
    // draw moving dots
    let normAngle =angle%(2*Math.PI);
    let angleDisplay = 200/(2*Math.PI)*normAngle;
    ctx.save();
    ctx.translate(centerX-100+angleDisplay,centerY+voltageZero);
    ctx.fillStyle = 'grey';
    drawCircleFill(ctx,5);
    ctx.restore();
    //phase U
    ctx.save();
    ctx.translate(centerX-100+angleDisplay,centerY+voltageU+voltageZero);
    ctx.fillStyle = 'red';
    drawCircleFill(ctx,5);
    ctx.restore();
    //phase V
    ctx.save();
    ctx.translate(centerX-100+angleDisplay,centerY+voltageV+voltageZero);
    ctx.fillStyle = 'green';
    drawCircleFill(ctx,5);
    ctx.restore();
    //phase W
    ctx.save();
    ctx.translate(centerX-100+angleDisplay,centerY+voltageW+voltageZero);
    ctx.fillStyle = 'blue';
    drawCircleFill(ctx,5);
    ctx.restore();
    //Graphes
    ctx.save();
    ctx.translate(centerX-100,centerY);
    
    //calculate the whole graph then display the three lines
    let angleDisplayArray,UArray,VArray,WArray,U0Array = [];
    if(superSinusOperation == true){
    [angleDisplayArray,UArray,VArray,WArray,U0Array] =superSinusGraph(uAmplDisplay,200);
    }else{
      [angleDisplayArray,UArray,VArray,WArray] =sinusGraph(uAmplDisplay,200);
    }
    ctx.strokeStyle = 'red';
    drawGraph(ctx,angleDisplayArray,UArray);
    ctx.strokeStyle = 'green';
    drawGraph(ctx,angleDisplayArray,VArray);
    ctx.strokeStyle = 'blue';
    drawGraph(ctx,angleDisplayArray,WArray);
    ctx.strokeStyle = 'grey';
    drawGraph(ctx,angleDisplayArray,U0Array);
    ctx.restore();
    //// draw phase-phase voltage
    centerX = 900;
    let uphphRms = uphphAmpl/Math.sqrt(2);
    ctx.fillText('U ph-ph pp:    '+(2*uphphAmpl).toFixed(2)+ ' V', centerX-100, 25);
    ctx.fillText('U ph-ph ampl: '+uphphAmpl.toFixed(2)+ ' V', centerX-100, 50);
    ctx.fillText('U ph-ph rms:  '+uphphRms.toFixed(2)+ ' V', centerX-100, 75);
  
    // draw limits
    ctx.save();
    ctx.translate(centerX,centerY);
    drawLimits(ctx,udcDisplay,superSinusLimitDisplay);
    ctx.restore();
    //phase-phase UV
    ctx.save();
    let voltageUV = voltageU-voltageV;
    ctx.translate(centerX-100+angleDisplay,centerY+voltageU-voltageV);
    ctx.fillStyle = 'yellow';
    drawCircleFill(ctx,5);
    ctx.restore();
    //phase-phase VW
    ctx.save();
    let voltageVW = voltageV-voltageW;
    ctx.translate(centerX-100+angleDisplay,centerY+voltageV-voltageW);
    ctx.fillStyle = 'cyan';
    drawCircleFill(ctx,5);
    ctx.restore();
    //phase-phase WU
    ctx.save();
    ctx.translate(centerX-100+angleDisplay,centerY+voltageW-voltageU);
    ctx.fillStyle = 'magenta';
    drawCircleFill(ctx,5);
    ctx.restore();
    //Graphs
    ctx.save();
    ctx.translate(centerX-100,centerY);
    let [UVArray,VWArray,WUArray] = phaseToPhaseGraph(UArray,VArray,WArray);
    //let UVarray = UArray-VArray;
    ctx.strokeStyle = 'yellow';
    drawGraph(ctx,angleDisplayArray,UVArray);
    ctx.strokeStyle = 'cyan';
    drawGraph(ctx,angleDisplayArray,VWArray);
    ctx.strokeStyle = 'magenta';
    drawGraph(ctx,angleDisplayArray,WUArray);
    ctx.restore();
    //// draw motor phases
    centerX = 1200;
    let uRms = uAmpl/Math.sqrt(2);
    ctx.fillText('U mot pp:    '+(2*uAmpl).toFixed(2)+ ' V', centerX-100, 25);
    ctx.fillText('U mot ampl: '+uAmpl.toFixed(2)+ ' V', centerX-100, 50);
    ctx.fillText('U mot rms:   '+uRms.toFixed(2)+ ' V', centerX-100, 75);
    // draw limits
    ctx.save();
    ctx.translate(centerX,centerY);
    drawLimits(ctx,udcDisplay,superSinusLimitDisplay);
    ctx.restore();
    //motor phase U
    ctx.save();
    ctx.translate(centerX-100+angleDisplay,centerY+2/3*voltageUV+1/3*voltageVW);
    ctx.fillStyle = 'red';
    drawCircleFill(ctx,5);
    ctx.restore();
    //motor phase V
    ctx.save();
    ctx.translate(centerX-100+angleDisplay,centerY-1/3*voltageUV-2/3*voltageVW);
    ctx.fillStyle = 'green';
    drawCircleFill(ctx,5);
    ctx.restore();
    //motor phase W
    ctx.save();
    ctx.translate(centerX-100+angleDisplay,centerY-1/3*voltageUV+1/3*voltageVW);
    ctx.fillStyle = 'blue';
    drawCircleFill(ctx,5);
    ctx.restore();
    //Graphs
    ctx.save();
    ctx.translate(centerX-100,centerY);
    let [UmotArray,VmotArray,WmotArray] = motorPhases(UVArray,VWArray);
    //let UVarray = UArray-VArray;
    ctx.strokeStyle = 'red';
    drawGraph(ctx,angleDisplayArray,UmotArray);
    ctx.strokeStyle = 'green';
    drawGraph(ctx,angleDisplayArray,VmotArray);
    ctx.strokeStyle = 'blue';
    drawGraph(ctx,angleDisplayArray,WmotArray);
    ctx.restore();

    window.requestAnimationFrame(canvasAnimation);
  }
    }
    window.requestAnimationFrame(canvasAnimation);

hexagonAnimationIO();
document.querySelector('#calcElecFreqBtn').addEventListener('click', GetElectricalFrequency);