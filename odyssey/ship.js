import {canvasShip,lineToAngle} from './canvas.js';

export class Ship {
    constructor(radius) {
        console.log('creating ship');
        this.radius = radius;
        this.orientation = -90;
        this.direction = -90;
    }

    ctx = canvasShip.getContext('2d');
    canvasWidth = canvasShip.getBoundingClientRect().width;
    canvasHeight = canvasShip.getBoundingClientRect().height;

    ship = this;

    player; //add later...inelegant...

    style = 'blue';

    length = 100;
    beam = 30;
    oarForce = 2;

    x0 = this.canvasWidth / 2;
    y0 = this.canvasHeight / 2;

    currX = this.x0;
    currY = this.y0;

    prevX = this.currX;
    prevY = this.currY;

    orientation;
    direction; //initialize to same as orientation; change later based on forces
    velX = 0;
    velY = 0;
    minNonZeroSpeed = 0.01;
    maxSpeed = 5;

    mass = 5; //how much to resist force exerted on the rocket
    dragCoefficient = 1; //how much to slow down every tick -- presumably zero for pure vacuum

    create = function () {
        let s = this;
        s.draw();
        s.addEventListeners();
    }

    situate = function (space) {
        let s = this;
        s.space = space;
        s.player = space.player;
        s.player.maxPower = s.currPower;
    }

    sail = function () {
        let s = this;
        //move me..
        s.move();
    }

    rowForward = function() {
        const s = this;
        s.speedUp(s.oarForce);
        // this.rocketFiring = true;
        // soundExplosion(60);
    }
    rowBackward = function() {
        const s = this;
        s.slowDown(s.oarForce);
        // this.rocketFiring = true;
    }


    showDamage = function () {
        let s = this;
        // console.log('YOU COLLIDED WITH AN ASTEROID!!! LOSESR!!!');
        // console.log('ship centerpoint: ' + currX + ', ' + currY);
        s.ctx.beginPath();
        let degrees = 360;
        s.ctx.arc(s.currX, s.currY, 20, 0, degrees.toRads());
        s.ctx.fillStyle = 'white';
        s.ctx.fill();
    }

    draw = function () {
        let s = this;
        s.ctx.clearRect(0, 0, s.canvasWidth, s.canvasHeight);

        // console.log('orientation of ship: ' + s.orientation);

        s.ctx.beginPath();
        if (s.currX > s.canvasWidth) s.currX = 0;
        if (s.currY > s.canvasHeight) s.currY = 0;
        if (s.currX < 0) s.currX = s.canvasWidth;
        if (s.currY < 0) s.currY = s.canvasHeight;

        //the ship is a rectangle with pointy ends at front and back!
        //...but with orientation determined by s.orientation
        let frontX = s.currX + s.length * Math.cos(s.orientation.toRads());
        // console.log('frontX: ' + frontX);
        let frontY = s.currY + s.length * Math.sin(s.orientation.toRads());
        // console.log('frontY: ' + frontY);
        let backX = s.currX - s.length * Math.cos(s.orientation.toRads());
        let backY = s.currY - s.length * Math.sin(s.orientation.toRads());
        let leftX = s.currX + s.beam * Math.cos((s.orientation + 90).toRads());
        let leftY = s.currY + s.beam * Math.sin((s.orientation + 90).toRads());
        let rightX = s.currX + s.beam * Math.cos((s.orientation - 90).toRads());
        let rightY = s.currY + s.beam * Math.sin((s.orientation - 90).toRads());
        s.ctx.moveTo(frontX, frontY);
        s.ctx.lineTo(leftX, leftY);
        s.ctx.lineTo(backX, backY);
        s.ctx.lineTo(rightX, rightY);
        s.ctx.lineTo(frontX, frontY);
        s.ctx.strokeStyle = s.style;
        s.ctx.stroke();
        //fill in the ship
        s.ctx.fillStyle = s.style;
        s.ctx.fill();
    }


    rotate = function (degrees) {
        let s = this;
        console.log('rotating ship by ' + degrees + ' degrees');
        s.orientation += degrees;
        console.log('new orientation: ' + s.orientation);
        // ctx.translate(s.currX,s.currY);
        // ctx.rotate(degrees.toRads());
        // ctx.translate(-s.currX,-s.currY);
        s.draw();
    }

    speedUp = function () {
        let s = this;
        let newVelX = s.velX + s.currForceX();
        let newVelY = s.velY + s.currForceY();

        //don't go over max tho -- sure this is unrealistic in space but game has limited physical space -- and game ticks are discrete and larger than planck time......

        s.velX = s.governSpeed(newVelX, s.velX);
        s.velY = s.governSpeed(newVelY, s.velY);
    }
    slowDown = function () {
        let s = this;
        let newVelX = s.velX - s.currForceX();
        let newVelY = s.velY - s.currForceY();

        s.velX = s.governSpeed(newVelX, s.velX);
        s.velY = s.governSpeed(newVelY, s.velY);
    }

    governSpeed = function (newVel, oldVel) {
        let s = this;
        return Math.abs(newVel) > s.maxSpeed ? oldVel : newVel;
    }

    currForceX = function () { //the x component of the current force vector (in the direction of orientation)
        let s = this;
        return Math.cos(s.orientation.toRads()) * s.oarForce / s.mass;
    }
    currForceY = function () { //the y component of the current force vector (in the direction of orientation)
        let s = this;
        return Math.sin(s.orientation.toRads()) * s.oarForce / s.mass;
    }

    move = function () {
        let s = this;
        //fight the drag every damn time you move!
        s.velX = s.applyDrag(s.velX);
        s.velY = s.applyDrag(s.velY);
        s.moveBy(s.velX,s.velY);
    }
    applyDrag = function (vel) {
        let s = this;
        let newVelAbs = Math.abs(vel) * (1 - s.dragCoefficient / 50);
        let direction = vel < 0 ? -1 : 1;
        return newVelAbs * direction;
    }
    moveBy = function (x, y) {
        let s = this;
        s.prevX = s.currX;
        s.prevY = s.currY;
        s.currX += x;
        s.currY += y;
        s.draw();
    }


    holdingDownKeys = {};
    addEventListeners = function() {
        console.log('adding event listeners for ship');
        let s = this;
        window.addEventListener("keydown", function (event) {
            if (event.defaultPrevented) {
              return; // Do nothing if the event was already processed
            }
          
            switch (event.key) {
              case "Down": // IE/Edge specific value
              case "ArrowDown":
                s.rowBackward(); //y starts at top so y positive is down
              break;
              case "Up": // IE/Edge specific value
              case "ArrowUp":
                s.rowForward();
                break;
              case "Left": // IE/Edge specific value
                case "ArrowLeft":
                // Do something for "left arrow" key press.
                if(!s.holdingDownKeys['ArrowLeft']) {
                    s.holdingDownKeys['ArrowLeft'] = true;
                    holdDownArrowLeft();
                }
                //actually this needs to run every frame until we get a keyup.....really?
                function holdDownArrowLeft() {
                    s.rotate(-4);
                    if(s.holdingDownKeys['ArrowLeft']) {
                        window.requestAnimationFrame(function() {
                            holdDownArrowLeft();
                        });
                    }
                }
                break;
              case "Right": // IE/Edge specific value
              case "ArrowRight":
                if(!s.holdingDownKeys['ArrowRight']) {
                    s.holdingDownKeys['ArrowRight'] = true;
                    holdDownArrowRight();
                }
                //actually this needs to run every frame until we get a keyup
                function holdDownArrowRight() {
                    s.rotate(4);
                    if(s.holdingDownKeys['ArrowRight']) {
                        window.requestAnimationFrame(function() {
                            holdDownArrowRight();
                        });
                    }
                }
                break;
              case "Esc": // IE/Edge specific value
              case "Escape":
                // Do something for "esc" key press.
                break;
              default:
                return; // Quit when this doesn't handle the key event.
            }
          
            // Cancel the default action to avoid it being handled twice
            event.preventDefault();
          }, true);

          window.addEventListener('keyup',function(event) {
            switch(event.key) {
                case "ArrowLeft":
                    // Do something for "left arrow" key press.
                    s.holdingDownKeys['ArrowLeft'] = false;
                    //actually this needs to run every frame until we get a keyup
                    break;
                case "ArrowRight":
                    // Do something for "left arrow" key press.
                    s.holdingDownKeys['ArrowRight'] = false;
                    //actually this needs to run every frame until we get a keyup
                    break;
            }
          })
    }
}