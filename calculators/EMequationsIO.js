import { phasesFromArrow, superSinus, phaseToPhaseGraph, motorPhases,sinusGraph, drawLimits, blockCommutation,limitToHex, ArrayRms, fourierGoertzel, DFT } from "./modulation.js";
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

  
  canvasAnimation();
}


function canvasAnimation(){
  //Get environment variables
  const time = new Date();
  const canvas = document.getElementById("hexagonCanvas");
  //Get user inputs
  let voltInvDc = parseFloat(document.getElementById("VoltDc").value,10);
  let modFacInput = parseFloat(document.getElementById("modFac").value,10);
  let overModTechnique = document.getElementById("overModTechnique").value;
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
    let blockCommOperation = false;
    let cutOffOperation = false;
    
    
    if(modFacInput>1){
      if (overModTechnique == "block"){
        blockCommOperation = true;
        cutOffOperation = false;
      }else{
        blockCommOperation = false;
        cutOffOperation = true;
      }
    superSinusOperation = true;
    }
    
  if(canvas.getContext){
  const ctx = canvas.getContext('2d');
  
  ctx.globalCompositeOperation = "destination-over";
  ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas
  // change angle
  const speed = 20;
  let angle = ((2 * Math.PI) / speed) * time.getSeconds() + ((2 * Math.PI) / (speed*1000)) * time.getMilliseconds();
  let normAngle =angle%(2*Math.PI);
  // calculate electrical values
  //derive limits from Udc
  let superSinusLimit = voltInvDc/Math.sqrt(3);
  let hexagonLimit = 2/3*voltInvDc;
  let voltCtrlSVAmpl = modFacInput*superSinusLimit;
  let voltCtrlModAmpl = voltCtrlSVAmpl;
  let angleInv = 0;
  if(blockCommOperation == true){
    angleInv = blockCommutation(normAngle);
    voltCtrlModAmpl = hexagonLimit;

  }else{
    if(cutOffOperation==true){
      angleInv = angle;
      voltCtrlModAmpl = limitToHex(angle,voltInvDc,voltCtrlSVAmpl);

    }else{
    angleInv = angle;
    voltCtrlModAmpl = voltCtrlSVAmpl;
    }
   
  }
  let uphphAmpl = voltCtrlSVAmpl*Math.sqrt(3);
  
  let [voltCtrlUInstant,voltCtrlVInstant,voltCtrlWInstant] = phasesFromArrow(voltCtrlModAmpl,angleInv);
  let voltInvZeroInstant = 0;
  if(superSinusOperation == true || blockCommOperation){
    voltInvZeroInstant = superSinus(voltCtrlUInstant,voltCtrlVInstant,voltCtrlWInstant);
   }else{
     voltInvZeroInstant = 0;
   }
   
   let voltInvUInstant = voltCtrlUInstant+voltInvZeroInstant;
   let voltInvVInstant = voltCtrlVInstant+voltInvZeroInstant;
   let voltInvWInstant = voltCtrlWInstant+voltInvZeroInstant;

   //calculate arrays over one period
   let [angleArray,voltInvUArray,voltInvVArray,voltInvWArray,U0Array] =sinusGraph(voltCtrlSVAmpl,200,superSinusOperation,blockCommOperation,cutOffOperation,voltInvDc);
   let [voltMotUVArray,voltMotVWArray,voltMotWUArray] = phaseToPhaseGraph(voltInvUArray,voltInvVArray,voltInvWArray);
   let [voltMotUArray,voltMotVArray,voltMotWArray] = motorPhases(voltMotUVArray,voltMotVWArray);
   //calculate approximate values
   let uphphAmplApprox = Math.max(...voltMotUVArray);
   let voltMotAmplApprox = Math.max(...voltMotUArray);
   let uphphRmsApprox = ArrayRms(voltMotUVArray);
   let voltMotRmsApprox = ArrayRms(voltMotUArray);

   let uphphAmpl1Approx = DFT(voltMotUVArray,1);
   let voltMotAmpl1Approx = DFT(voltMotUArray,1);

   // output numbers - ideal 
   let outputVoltDc= document.getElementById("VoltDcOut");
  outputVoltDc.innerHTML = (voltInvDc).toFixed(2)+" V";
  let outputVoltSupersinus= document.getElementById("VoltSupersinus");
  outputVoltSupersinus.innerHTML = (1/Math.sqrt(3)*voltInvDc).toFixed(2)+" V";
  let outputVoltHexagon= document.getElementById("VoltHexagon");
  outputVoltHexagon.innerHTML = (2/3*voltInvDc).toFixed(2)+" V";
   //Delta
   let outputVoltDeltaPp = document.getElementById("VoltDeltaPp");
   outputVoltDeltaPp.innerHTML = (2*uphphAmpl).toFixed(2)+" V";
   let outputVoltDeltaAmpl = document.getElementById("VoltDeltaAmpl");
   outputVoltDeltaAmpl.innerHTML = (uphphAmpl).toFixed(2)+" V";
   let outputVoltDeltaRms = document.getElementById("VoltDeltaRms");
   outputVoltDeltaRms.innerHTML = (uphphAmpl/Math.sqrt(2)).toFixed(2)+" V";
   //Motor/star
   let outputVoltMotPp = document.getElementById("VoltMotPp");
   outputVoltMotPp.innerHTML = (2*voltCtrlSVAmpl).toFixed(2)+" V";
   let outputVoltMotAmpl = document.getElementById("VoltMotAmpl");
   outputVoltMotAmpl.innerHTML = (voltCtrlSVAmpl).toFixed(2)+" V";
   let outputVoltMotRms = document.getElementById("VoltMotRms");
   outputVoltMotRms.innerHTML = (voltCtrlSVAmpl/Math.sqrt(2)).toFixed(2)+" V";
   
   // output numbers - approximate 
   //Delta
   let outputVoltDeltaPpApprox = document.getElementById("VoltDeltaPpApprox");
   outputVoltDeltaPpApprox.innerHTML = (2*uphphAmplApprox).toFixed(2)+" V";
   let outputVoltDeltaAmplApprox = document.getElementById("VoltDeltaAmplApprox");
   outputVoltDeltaAmplApprox.innerHTML = (uphphAmplApprox).toFixed(2)+" V";
   let outputVoltDeltaRmsApprox = document.getElementById("VoltDeltaRmsApprox");
   outputVoltDeltaRmsApprox.innerHTML = (uphphRmsApprox).toFixed(2)+" V";
   //Motor/star
   let outputVoltMotPpApprox = document.getElementById("VoltMotPpApprox");
   outputVoltMotPpApprox.innerHTML = (2*voltMotAmplApprox).toFixed(2)+" V";
   let outputVoltMotAmplApprox = document.getElementById("VoltMotAmplApprox");
   outputVoltMotAmplApprox.innerHTML = (voltMotAmplApprox).toFixed(2)+" V";
   let outputVoltMotRmsApprox = document.getElementById("VoltMotRmsApprox");
   outputVoltMotRmsApprox.innerHTML = (voltMotRmsApprox).toFixed(2)+" V";
  
   //first order
   let outputVoltDeltaPp1 = document.getElementById("VoltDeltaPp1");
   outputVoltDeltaPp1.innerHTML = (2*uphphAmpl1Approx).toFixed(2)+" V";
   let outputVoltDeltaAmpl1Approx = document.getElementById("VoltDeltaAmpl1");
   outputVoltDeltaAmpl1Approx.innerHTML = (uphphAmpl1Approx).toFixed(2)+" V";
   let outputVoltDeltaRms1Approx = document.getElementById("VoltDeltaRms1");
   outputVoltDeltaRms1Approx.innerHTML = (uphphAmpl1Approx/Math.sqrt(2)).toFixed(2)+" V";

   let outputVoltMotPp1 = document.getElementById("VoltMotPp1");
   outputVoltMotPp1.innerHTML = (2*voltMotAmpl1Approx).toFixed(2)+" V";
   let outputVoltMotAmpl1Approx = document.getElementById("VoltMotAmpl1");
   outputVoltMotAmpl1Approx.innerHTML = (voltMotAmpl1Approx).toFixed(2)+" V";
   let outputVoltMotRms1 = document.getElementById("VoltMotRms1");
   outputVoltMotRms1.innerHTML = (voltMotAmpl1Approx/Math.sqrt(2)).toFixed(2)+" V";
   //scale for display 
  let displayFactor = 50;
  while(displayFactor*voltInvDc >150){
    displayFactor = displayFactor*2/3;
  }
  const voltInvDcDisplay = displayFactor*voltInvDc;
  let superSinusLimitDisplay = displayFactor*superSinusLimit;
  let hexagonLimitDisplay = displayFactor*hexagonLimit;
  let voltCtrlSVAmplDisplay = displayFactor*voltCtrlSVAmpl;
  let voltCtrlModAmplDisplay = displayFactor*voltCtrlModAmpl;
  let voltInvZeroInstantDisplay = displayFactor*voltInvZeroInstant;
  let voltCtrlUInstantDisplay = displayFactor*voltCtrlUInstant;
  let voltCtrlVInstantDisplay = displayFactor*voltCtrlVInstant;
  let voltCtrlWInstantDisplay = displayFactor*voltCtrlWInstant;

  let voltInvUInstantDisplay = displayFactor*voltInvUInstant;
  let voltInvVInstantDisplay = displayFactor*voltInvVInstant;
  let voltInvWInstantDisplay = displayFactor*voltInvWInstant;
  
  let angleArrayDisplay = angleArray;
  let voltInvUArrayDisplay = voltInvUArray.map((currItem) => currItem*displayFactor );
  let voltInvVArrayDisplay = voltInvVArray.map((currItem) => currItem*displayFactor );
  let voltInvWArrayDisplay = voltInvWArray.map((currItem) => currItem*displayFactor );
  let U0ArrayDisplay = U0Array.map((currItem) => currItem*displayFactor );
    
  let voltMotUVArrayDisplay = voltMotUVArray.map((currItem) => currItem*displayFactor );
  let voltMotVWArrayDisplay = voltMotVWArray.map((currItem) => currItem*displayFactor );
  let voltMotWUArrayDisplay = voltMotWUArray.map((currItem) => currItem*displayFactor );
  
  let voltMotUArrayDisplay = voltMotUArray.map((currItem) => currItem*displayFactor );
  let voltMotVArrayDisplay = voltMotVArray.map((currItem) => currItem*displayFactor );
  let voltMotWArrayDisplay = voltMotWArray.map((currItem) => currItem*displayFactor );
  
  // canvas center X and Y
  const centerX1 = 125;
  const centerX2 = 375;
  const centerX3 = 625;
  const centerX4 = 875;
  const centerX5 = 1125;
  const centerY = canvas.height / 2;
    //draw descriptions
    ctx.font = "18px Caladea";
  //ctx.fillText('DC link voltage: '+voltInvDc.toString(10)+ ' V', centerX/2, 50);
  //ctx.fillText('Limit for Supersinus: '+superSinusLimit.toFixed(2)+ ' V', centerX/2, 80);
  //ctx.fillText('Limit for Block: '+hexagonLimit.toFixed(2)+ ' V', centerX/2, 110);
  
    
    //draw hexagon
    //ctx.fillText('U',centerX-5,centerY-150)
    ctx.save();
    ctx.translate(centerX1,centerY);
    ctx.rotate(Math.PI/6)
    drawHexagon(ctx,hexagonLimitDisplay);
    ctx.restore();
    //draw circle
    ctx.save();
    ctx.translate(centerX1,centerY);
    ctx.strokeStyle = 'grey';
    ctx.setLineDash([10,10]);//dashed
    drawCircle(ctx,voltInvDcDisplay/2,'dot-dashed');
    ctx.setLineDash([]);//solid line
    drawCircle(ctx,superSinusLimitDisplay,'dashed');
    ctx.restore();
    ctx.save();
    ctx.translate(centerX1,centerY);
    ctx.beginPath()
    ctx.strokeStyle = 'red';
    ctx.moveTo(0,0);
    ctx.lineTo(0,-100);
    ctx.stroke();
    ctx.rotate(-120*Math.PI/180)
    ctx.beginPath()
    ctx.strokeStyle = 'blue';
    ctx.moveTo(0,0);
    ctx.lineTo(0,-100);
    ctx.stroke();
    ctx.rotate(-120*Math.PI/180)
    ctx.beginPath()
    ctx.strokeStyle = 'green';
    ctx.moveTo(0,0);
    ctx.lineTo(0,-100);
    ctx.stroke();
    ctx.restore();
    
    // Draw arrow
    ctx.save();
    ctx.translate(centerX1,centerY);
    ctx.rotate(-angle);
    drawArrow(ctx,voltCtrlSVAmplDisplay);
    ctx.restore();
    // Draw arrow
    ctx.save();
    ctx.translate(centerX1,centerY);
    ctx.strokeStyle = 'red';
    ctx.rotate(-angleInv);
    drawArrow(ctx,voltCtrlModAmplDisplay);
    ctx.restore();

    //// mercedes
    
    // draw limits
    ctx.save();
    ctx.translate(centerX2,centerY);
    
    drawLimits(ctx,voltInvDcDisplay,superSinusLimitDisplay);
    ctx.restore();
    

    //draw star
    let starCenterX = centerX2;
    let starCenterY = centerY+voltInvZeroInstantDisplay;
    ctx.save();
    ctx.translate(starCenterX,starCenterY);
    ctx.rotate(-angleInv);
    drawThreePointStar(ctx,voltCtrlModAmplDisplay);
    ctx.restore();
    //// draw phases referenced to 0-point

    // draw limits
    ctx.save();
    ctx.translate(centerX3,centerY);
    drawLimits(ctx,voltInvDcDisplay,superSinusLimitDisplay);
    ctx.restore();
    // draw moving dots
    let angleXaxisDisplay = 200/(2*Math.PI)*normAngle;
    ctx.save();
    ctx.translate(centerX3-100+angleXaxisDisplay,centerY+voltInvZeroInstantDisplay);
    ctx.fillStyle = 'grey';
    drawCircleFill(ctx,5);
    ctx.restore();
    //phase U
    ctx.save();
    ctx.translate(centerX3-100+angleXaxisDisplay,centerY+voltInvUInstantDisplay);
    ctx.fillStyle = 'red';
    drawCircleFill(ctx,5);
    ctx.restore();
    //phase V
    ctx.save();
    ctx.translate(centerX3-100+angleXaxisDisplay,centerY+voltInvVInstantDisplay);
    ctx.fillStyle = 'green';
    drawCircleFill(ctx,5);
    ctx.restore();
    //phase W
    ctx.save();
    ctx.translate(centerX3-100+angleXaxisDisplay,centerY+voltInvWInstantDisplay);
    ctx.fillStyle = 'blue';
    drawCircleFill(ctx,5);
    ctx.restore();
    //Graphes
    ctx.save();
    ctx.translate(centerX3-100,centerY);
    
    //calculate the whole graph then display the three lines
   // let angleDisplayArray,voltInvUArrayDisplay,voltInvVArrayDisplay,voltInvWArrayDisplay,U0Array = [];
   
    
    ctx.strokeStyle = 'red';
    drawGraph(ctx,angleArrayDisplay,voltInvUArrayDisplay);
    ctx.strokeStyle = 'green';
    drawGraph(ctx,angleArrayDisplay,voltInvVArrayDisplay);
    ctx.strokeStyle = 'blue';
    drawGraph(ctx,angleArrayDisplay,voltInvWArrayDisplay);
    ctx.strokeStyle = 'grey';
    drawGraph(ctx,angleArrayDisplay,U0ArrayDisplay);
    ctx.restore();
    //// draw phase-phase voltage
    
    //ctx.fillText('U ph-ph pp:    '+(2*uphphAmpl).toFixed(2)+ ' V', centerX-100, 25);
    //ctx.fillText('U ph-ph ampl: '+uphphAmpl.toFixed(2)+ ' V', centerX-100, 50);
    //ctx.fillText('U ph-ph rms:  '+uphphRms.toFixed(2)+ ' V', centerX-100, 75);
    
  
    // draw limits
    ctx.save();
    ctx.translate(centerX4,centerY);
    drawLimits(ctx,voltInvDcDisplay,superSinusLimitDisplay);
    ctx.restore();
    //phase-phase UV
    ctx.save();
    let voltageUV = voltCtrlUInstantDisplay-voltCtrlVInstantDisplay;
    ctx.translate(centerX4-100+angleXaxisDisplay,centerY+voltCtrlUInstantDisplay-voltCtrlVInstantDisplay);
    ctx.fillStyle = 'yellow';
    drawCircleFill(ctx,5);
    ctx.restore();
    //phase-phase VW
    ctx.save();
    let voltageVW = voltCtrlVInstantDisplay-voltCtrlWInstantDisplay;
    ctx.translate(centerX4-100+angleXaxisDisplay,centerY+voltCtrlVInstantDisplay-voltCtrlWInstantDisplay);
    ctx.fillStyle = 'cyan';
    drawCircleFill(ctx,5);
    ctx.restore();
    //phase-phase WU
    ctx.save();
    ctx.translate(centerX4-100+angleXaxisDisplay,centerY+voltCtrlWInstantDisplay-voltCtrlUInstantDisplay);
    ctx.fillStyle = 'magenta';
    drawCircleFill(ctx,5);
    ctx.restore();
    //Graphs
    ctx.save();
    ctx.translate(centerX4-100,centerY);
    
    //let UVarray = UArray-VArray;
    ctx.strokeStyle = 'yellow';
    drawGraph(ctx,angleArrayDisplay,voltMotUVArrayDisplay);
    ctx.strokeStyle = 'cyan';
    drawGraph(ctx,angleArrayDisplay,voltMotVWArrayDisplay);
    ctx.strokeStyle = 'magenta';
    drawGraph(ctx,angleArrayDisplay,voltMotWUArrayDisplay);
    ctx.restore();
    //// draw motor phases
    
    
    //ctx.fillText('U mot pp:    '+(2*voltCtrlModAmpl).toFixed(2)+ ' V', centerX-100, 25);
    //ctx.fillText('U mot ampl: '+voltCtrlModAmpl.toFixed(2)+ ' V', centerX-100, 50);
    //ctx.fillText('U mot rms:   '+voltCtrlSVAmplRms.toFixed(2)+ ' V', centerX-100, 75);
    // draw limits
    ctx.save();
    ctx.translate(centerX5,centerY);
    drawLimits(ctx,voltInvDcDisplay,superSinusLimitDisplay);
    ctx.restore();
    //motor phase U
    ctx.save();
    ctx.translate(centerX5-100+angleXaxisDisplay,centerY+2/3*voltageUV+1/3*voltageVW);
    ctx.fillStyle = 'red';
    drawCircleFill(ctx,5);
    ctx.restore();
    //motor phase V
    ctx.save();
    ctx.translate(centerX5-100+angleXaxisDisplay,centerY-1/3*voltageUV-2/3*voltageVW);
    ctx.fillStyle = 'green';
    drawCircleFill(ctx,5);
    ctx.restore();
    //motor phase W
    ctx.save();
    ctx.translate(centerX5-100+angleXaxisDisplay,centerY-1/3*voltageUV+1/3*voltageVW);
    ctx.fillStyle = 'blue';
    drawCircleFill(ctx,5);
    ctx.restore();
    //Graphs
    ctx.save();
    ctx.translate(centerX5-100,centerY);
    
    //let UVarray = UArray-VArray;
    ctx.strokeStyle = 'red';
    drawGraph(ctx,angleArrayDisplay,voltMotUArrayDisplay);
    ctx.strokeStyle = 'green';
    drawGraph(ctx,angleArrayDisplay,voltMotVArrayDisplay);
    ctx.strokeStyle = 'blue';
    drawGraph(ctx,angleArrayDisplay,voltMotWArrayDisplay);
    ctx.restore();

    window.requestAnimationFrame(canvasAnimation);
  }
    }
    window.requestAnimationFrame(canvasAnimation);

hexagonAnimationIO();
document.querySelector('#calcElecFreqBtn').addEventListener('click', GetElectricalFrequency);