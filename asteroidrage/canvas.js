export let canvas = document.getElementById('canvasMain');
export let canvasShip = document.getElementById('canvasShip');
export let canvasShot = document.getElementById('canvasShot');
export let canvasBackground = document.getElementById('canvasBackground');

Number.prototype.toRads = function() {
    return this * Math.PI / 180;
}

export function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
  }  


export function lineToAngle(ctx,startX,startY,length,angle) {
    let endX = startX + length * Math.cos(angle.toRads());
    let endY = startY + length * Math.sin(angle.toRads());
    ctx.moveTo(startX,startY);
    ctx.lineTo(endX,endY);
}

export function pickRandomColor() {
    let colors = ['red','orange','yellow','green','blue','indigo','violet'];
    return colors[Math.floor(Math.random() * colors.length)];
}