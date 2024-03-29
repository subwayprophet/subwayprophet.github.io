import {canvasShip,canvasShot,lineToAngle} from './canvas.js';
import {soundLaser, soundExplosion, soundBling} from './sound.js';

export function Ship(radius) {
    let ctx = canvasShip.getContext('2d');
    let canvasWidth = canvasShip.getBoundingClientRect().width;
    let canvasHeight = canvasShip.getBoundingClientRect().height;

    let ship = this;

    this.player; //add later...inelegant...
    
    this.style = 'blue';

    this.x0 = canvasWidth/2;
    this.y0 = canvasHeight/2;

    this.currX = this.x0;
    this.currY = this.y0;

    this.prevX = this.currX;
    this.prevY = this.currY;

    this.orientation = -90;
    this.direction = -90; //initialize to same as orientation; change later based on forces
    this.velX = 0;
    this.velY = 0;
    this.minNonZeroSpeed = 0.01;
    this.maxSpeed = 5;

    this.rocketForce = 5;
    this.retroRocketForce = 5;

    this.maxPower = 100; //shared for all systems or just shots? just shots rn 2023-06-10
    this.currPower = this.maxPower;
    this.singleShotPower = 5;
    this.singleTickRechargePower = 0.1;

    this.mass = 5; //how much to resist force exerted on the rocket
    this.dragCoefficient = 0; //how much to slow down every tick -- presumably zero for pure vacuum

    this.rocketFiring = false;
    this.shots = [];

    this.create = function() {
        this.draw();
        this.addEventListeners();
    }

    this.situate = function(space) {
        this.space = space;
        this.player = space.player;
        this.player.maxPower = this.currPower;
    }

    this.fly = function() {
        let s = this;
        //move me..
        s.move();
        //..and each of my shots..
        for(let i=0; i<s.shots.length; i++) {
            let shot = s.shots[i];
            shot.move();
        }
        //..and recharge..
        this.recharge(this.singleTickRechargePower);
    }

    this.recharge = function(amountToRechargeBy) {
        if((this.currPower + amountToRechargeBy) > this.maxPower) {
            this.currPower = this.maxPower;
        } else {
            this.currPower += amountToRechargeBy;
        }
        //sound cool if power is now full
        if(this.player.power < this.currPower && this.currPower >= this.maxPower) {
            soundBling();
        }
        this.player.power = this.currPower; //...surely this is inelegant...
    }

    this.fireGun = function() {
        if(this.currPower < this.singleShotPower) return; //can't shoot if not enough power to shoot
        console.log('firing shot!');
        let s = this;
        let shot = new Shot(s.currX,s.currY,s.orientation,s.singleShotPower);
        s.shots.push(shot);
        shot.move();
        this.currPower -= s.singleShotPower;
        soundLaser();
    }

    this.showDamage = function() {
        let s = this;
        // console.log('YOU COLLIDED WITH AN ASTEROID!!! LOSESR!!!');
        // console.log('ship centerpoint: ' + this.currX + ', ' + this.currY);
        ctx.beginPath();
        let degrees = 360;
        ctx.arc(s.currX,s.currY,20,0,degrees.toRads());
        ctx.fillStyle = 'white';
        ctx.fill();
    }

    this.fireRocket = function() {
        this.speedUp(this.rocketForce);
        this.rocketFiring = true;
        soundExplosion(60);
    }
    this.fireRetroRocket = function() {
        this.slowDown(this.retroRocketForce);
        this.rocketFiring = true;
    }
    this.drawRocketFire = function() {
        let s = this;
        //offset the rocket fire from the center of the ship
        let x = s.currX - (radius*0.5 * Math.cos(s.orientation.toRads()));
        let y = s.currY - (radius*0.5 * Math.sin(s.orientation.toRads()));
        //first large circle flame...
        ctx.beginPath();
        let degrees = 360;
        ctx.arc(x,y,20,0,degrees.toRads());
        ctx.fillStyle = '#f00';
        ctx.fill();
        //then smaller circle flame, offset a bit more...
        let x2 = x - (radius*0.5 * Math.cos(s.orientation.toRads()));
        let y2 = y - (radius*0.5 * Math.sin(s.orientation.toRads()));
        ctx.beginPath();
        ctx.arc(x2,y2,10,0,degrees.toRads());
        ctx.fillStyle = '#ff0';
        ctx.fill();
        //then even smaller circle flame, offset a bit more...
        let x3 = x2 - (radius*0.5 * Math.cos(s.orientation.toRads()));
        let y3 = y2 - (radius*0.5 * Math.sin(s.orientation.toRads()));
        ctx.beginPath();
        ctx.arc(x3,y3,5,0,degrees.toRads());
        ctx.fillStyle = '#fff';
        ctx.fill();

    }

    this.draw = function() {
        ctx.clearRect(0,0,canvasWidth,canvasHeight);
        let s = this;
        ctx.beginPath();
        if(s.currX > canvasWidth) s.currX = 0;
        if(s.currY > canvasHeight) s.currY = 0;
        if(s.currX < 0) s.currX = canvasWidth;
        if(s.currY < 0) s.currY = canvasHeight;

        //the ship is a triangle!
        //first draw centerline...
        lineToAngle(ctx,s.currX,s.currY,radius,s.orientation);
        //then draw right side...
        lineToAngle(ctx,s.currX,s.currY,radius*0.8,s.orientation-140);
        //then draw left side...
        lineToAngle(ctx,s.currX,s.currY,radius*0.8,s.orientation+140);

        ctx.strokeStyle = s.style;
        ctx.lineWidth = 15;
        ctx.stroke();

        //draw rocket fire if firing rockets
        if(s.rocketFiring) {
            s.drawRocketFire();
            s.rocketFiring = false;
        }
    }

    //todo: wrong?
    this.shove = function(x,y) {
        if(x===0) x=1; //bogus
        if(y===0) y=1; //fix
        let tanTheta = x/y;
        let theta = Math.atan(tanTheta.toRads());
        this.orientation += theta;
    }

    this.rotate = function(degrees) {
        this.orientation += degrees;
        // ctx.translate(s.currX,s.currY);
        // ctx.rotate(degrees.toRads());
        // ctx.translate(-s.currX,-s.currY);
    }

    this.speedUp = function() {
        let newVelX = this.velX + this.currForceX(); 
        let newVelY = this.velY + this.currForceY();

        //don't go over max tho -- sure this is unrealistic in space but game has limited physical space -- and game ticks are discrete and larger than planck time......

        this.velX = this.governSpeed(newVelX,this.velX);
        this.velY = this.governSpeed(newVelY,this.velY);
    }
    this.slowDown = function() {
        let newVelX = this.velX - this.currForceX(); 
        let newVelY = this.velY - this.currForceY(); 
        
        this.velX = this.governSpeed(newVelX,this.velX);
        this.velY = this.governSpeed(newVelY,this.velY);
    }

    this.governSpeed = function(newVel,oldVel) {
        return Math.abs(newVel) > this.maxSpeed ? oldVel : newVel;
    }

    this.currForceX = function() { //the x component of the current force vector (in the direction of this.orientation)
        return Math.cos(this.orientation.toRads()) * this.rocketForce / this.mass;
    }
    this.currForceY = function() { //the y component of the current force vector (in the direction of this.orientation)
        return Math.sin(this.orientation.toRads()) * this.rocketForce / this.mass;
    }

    this.move = function() {
        //fight the drag every damn time you move!
        this.velX = this.applyDrag(this.velX);
        this.velY = this.applyDrag(this.velY);
        this.moveBy(this.velX,this.velY);
    }
    this.applyDrag = function(vel) {
        let newVelAbs = Math.abs(vel) * (1 - this.dragCoefficient/50); //why 50? seems fun while testing?
        let direction = vel < 0 ? -1 : 1;
        return newVelAbs * direction;
    }
    this.moveBy = function(x,y) {
        this.prevX = this.currX;
        this.prevY = this.currY;
        this.currX += x;
        this.currY += y;
        this.draw();
    }
    
    function Shot(x,y,direction,power=5) {
        this.x0 = x;
        this.y0 = y;

        this.currX = this.x0;
        this.currY = this.y0;

        this.prevX = this.currX;
        this.prevY = this.currY;

        this.speed = 8;
        this.direction = direction;

        this.power = power;

        let ctxShot = canvasShot.getContext('2d');
        let canvasShotWidth = canvasShot.width;
        let canvasShotHeight = canvasShot.height;

        this.move = function() {
            let shot = this;
            let hypoteneuse = shot.speed;
            let x = Math.cos(shot.direction.toRads()) * hypoteneuse;
            let y = Math.sin(shot.direction.toRads()) * hypoteneuse;
            shot.moveBy(x,y);
        }
        this.moveBy = function(x,y) {
            this.prevX = this.currX;
            this.prevY = this.currY;
            this.currX += x;
            this.currY += y;
            this.draw();
        }

        this.draw = function() {
            let shot = this;
            //if shot is beyond screen then remove, not draw
            if(shot.currX > canvasShotWidth
                || shot.currY > canvasShotWidth
                || shot.currX < 0
                || shot.currY < 0) {
                    console.log('shot is off screen! removing!');
                    ship.shots = ship.shots.filter(item => item !== shot);
                    console.log('shot removed!');
                    return;
                }
            //shot is not beyond screen, continue drawing
            let degrees = 360;
            ctxShot.clearRect(0,0,canvasShotWidth,canvasShotWidth);
            ctx.beginPath();
            ctx.arc(shot.currX,shot.currY,4,0,degrees.toRads());
            ctx.fillStyle = 'orange';
            ctx.fill();
        }

    }


    this.holdingDownKeys = {};
    this.addEventListeners = function() {
        let s = this;
        window.addEventListener("keydown", function (event) {
            if (event.defaultPrevented) {
              return; // Do nothing if the event was already processed
            }
          
            switch (event.key) {
              case "Down": // IE/Edge specific value
              case "ArrowDown":
                s.fireRetroRocket(); //y starts at top so y positive is down
              break;
              case "Up": // IE/Edge specific value
              case "ArrowUp":
                s.fireRocket();
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
            case " ":
                s.fireGun();
                break;
              case "Enter":
                s.fireGun();
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