export function drawHexagon(ctx,cornerRadius){
    
    ctx.beginPath();
    ctx.moveTo(cornerRadius, 0);
    ctx.rotate(Math.PI/180*60);
    ctx.lineTo(cornerRadius, 0);
    ctx.rotate(Math.PI/180*60);
    ctx.lineTo(cornerRadius, 0);
    ctx.rotate(Math.PI/180*60);
    ctx.lineTo(cornerRadius, 0);
    ctx.rotate(Math.PI/180*60);
    ctx.lineTo(cornerRadius, 0);
    ctx.rotate(Math.PI/180*60);
    ctx.lineTo(cornerRadius, 0);
    ctx.rotate(Math.PI/180*60);
    ctx.lineTo(cornerRadius, 0);
    ctx.stroke();
    
}

export function drawArrow(ctx,radius){ 
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(radius, 0);
    ctx.moveTo(radius-10,-10);
    ctx.lineTo(radius, 0);
    ctx.lineTo(radius-10, 10);
    ctx.stroke();
}

export function drawCircle(ctx,radius,style){
    
    ctx.beginPath();
    ctx.arc ( 0, 0, radius, 0, 2 * Math.PI, false);
    ctx.stroke();
    ctx.closePath();
    
}
export function drawCircleFill(ctx,radius){
    ctx.beginPath();
    ctx.arc ( 0, 0, radius, 0, 2 * Math.PI, false);
    ctx.fill();
}

export function drawThreePointStar(ctx,radius){
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.strokeStyle = 'red';
    drawArrow(ctx,radius);
    ctx.rotate(Math.PI/180*120);
    ctx.strokeStyle = 'blue';
    drawArrow(ctx,radius);
    ctx.rotate(Math.PI/180*120);
    ctx.strokeStyle = 'green';
    drawArrow(ctx,radius);
}

export function drawGraph(ctx,Xarray,Yarray){
    ctx.beginPath()
    ctx.moveTo(Xarray[0],Yarray[0]);
    for(let i = 1; i<Xarray.length;i++){
    ctx.lineTo(Xarray[i],Yarray[i]);
    }
    ctx.stroke();
}