import {canvasMonster, canvasShip} from './canvas.js';

export class Monster {
    constructor(name,health=100,maxHealth=100,numTentacles=1) {
        this.name = name;
        this.health = health;
        this.maxHealth = maxHealth;
        this.tentacles = [];
        for(let i = 0; i < numTentacles; i++) {
            let length = this.ctx.canvas.getBoundingClientRect().width/2;
            let tentacle = new Tentacle(this.x,this.y,length);
            this.tentacles.push(tentacle);
        }
    }

    //attributes of the monster
    name;
    health;
    maxHealth;
    damage = 10;
    tentacles = [];

    //current state of the monster
    x;
    y;

    ctx = canvasMonster.getContext('2d');
    canvasWidth = canvasShip.getBoundingClientRect().width;
    canvasHeight = canvasShip.getBoundingClientRect().height;

    //init stuff
    setPosition(position) {
        //position is 'top right' or 'top left' or 'bottom right' or bottom left' or 'middle right' or 'middle left'
        //translate this to x and y based on current ctx
        let m = this;
        switch(position) {
            case 'top right':
                m.x = m.canvasWidth;
                m.y = 0;
                break;
            case 'top left':
                m.x = 0;
                m.y = 0;
                break;
            case 'bottom right':
                m.x = m.canvasWidth;
                m.y = m.canvasHeight;
                break;
            case 'bottom left':
                m.x = 0;
                m.y = m.canvasHeight;
                break;
            case 'middle right':
                m.x = m.canvasWidth;
                m.y = m.canvasHeight / 2;
                break;
            case 'middle left':
                m.x = 0;
                m.y = m.canvasHeight / 2;
                break;
            default:
                m.x = m.canvasWidth / 2;
                m.y = m.canvasHeight / 2;
        }
        //reset tentacles
        m.tentacles.forEach(t => {
            t.x = m.x;
            t.y = m.y;
        });
        return m;
    }

    terrorize() {
        let m = this;
        // m.move();
        m.draw();
        m.tentacles.forEach(t => t.flail());
    }
    //draw the monster
    draw() {
        let m = this;
        //clear the canvas
        // m.ctx.clearRect(0,0,m.canvasWidth,m.canvasHeight);
        //draw the monster
        m.ctx.fillStyle = 'green';
        m.ctx.beginPath();
        m.ctx.arc(m.x,m.y,50,0,Math.PI*2);
        m.ctx.fill();
    }

    moveBy(dx,dy) {
        let m = this;
        m.x += dx;
        m.y += dy;
        m.tentacles.forEach(t => {
            t.x += dx;
            t.y += dy;
        });
    }

    isTouching(x,y) {
        // console.log('checking if monster is touching x:',x,'y:',y);
        let m = this;
        let threshold = 10;
        let distance = Math.hypot(m.x - x, m.y - y);
        const isMonsterTouching = distance < threshold;
        //is any tentacle touching?
        let isTentacleTouching = false;
        m.tentacles.forEach(t => {
            //see if the tentacle considered as a line (including its thickness) intersects with the incoming x,y
            // console.log('checking tentacle x:',t.x,'y:',t.y,'length:',t.length);
            let endX = t.x + t.length * Math.cos(t.orientation);
            let endY = t.y + t.length * Math.sin(t.orientation);
            // console.log('tentacle endX:',endX,'endY:',endY);
            //check if the x,y is within the tentacle's thickness
            let dx = endX - t.x;
            let dy = endY - t.y;
            let length = Math.hypot(dx,dy);
            let unitX = dx / length;
            let unitY = dy / length;
            // console.log('unitX:',unitX,'unitY:',unitY);
            let thickness = t.thickness;
            let halfThickness = thickness / 2;
            let normalX = unitY;
            let normalY = -unitX;
            // console.log('normalX:',normalX,'normalY:',normalY);
            let distToX = x - t.x;
            let distToY = y - t.y;
            let dot = distToX * normalX + distToY * normalY;
            let distance = Math.abs(dot);
            // console.log('distance:',distance);
            if(distance < halfThickness) {
                // console.log('tentacle is touching!');
                isTentacleTouching = true;
            }
        });
        return isMonsterTouching || isTentacleTouching;
    }
}
class Tentacle {
    constructor(x,y,length) {
        this.x = x;
        this.y = y;
        this.length = length;
    }
    x;
    y;
    length;
    thickness = 10;
    orientation;

    ctx = canvasMonster.getContext('2d');
    flail() {
        this.draw();
    }
    draw() {
        let t = this;
        //clear the canvas
        t.ctx.clearRect(0,0,t.ctx.canvas.getBoundingClientRect().width,t.ctx.canvas.getBoundingClientRect().height);
        t.ctx.strokeStyle = 'red';
        //thicker line
        t.ctx.lineWidth = t.thickness;
        // console.log('drawing tentacle, x:',t.x,'y:',t.y,'length:',t.length);
        //randomize orientation!
        t.orientation = Math.random() * 360;
        //each tentacle should be drawn starting from current x and y (origin) and following the orientation for length
        let endX = t.x + t.length * Math.cos(t.orientation) * (Math.random()) * (Math.random() > 0.5 ? 1 : -1);
        let endY = t.y + t.length * Math.sin(t.orientation) * (Math.random()) * (Math.random() > 0.5 ? 1 : -1);
        // console.log('tentacle endX:',endX,'endY:',endY);
        t.ctx.beginPath();
        t.ctx.moveTo(t.x,t.y);
        t.ctx.lineTo(endX,endY);
        t.ctx.stroke();
    }
}