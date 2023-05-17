import {canvasShip,canvasShot,lineToAngle} from './canvas.js';

export function Ship(radius) {
    let ctx = canvasShip.getContext('2d');
    let canvasWidth = canvasShip.getBoundingClientRect().width;
    let canvasHeight = canvasShip.getBoundingClientRect().height;

    let ship = this;

    this.x0 = canvasWidth/2;
    this.y0 = canvasHeight/2;

    this.currX = this.x0;
    this.currY = this.y0;

    this.prevX = this.currX;
    this.prevY = this.prevY;

    this.orientation = -90;
    this.direction = -90; //initialize to same as orientation; change later based on forces
    this.velX = 0;
    this.velY = 0;
    this.minNonZeroSpeed = 0.01;
    this.maxSpeed = 5;

    this.rocketForce = 5;
    this.retroRocketForce = 5;

    this.mass = 5; //how much to resist force exerted on the rocket
    this.dragCoefficient = 0; //how much to slow down every tick -- presumably zero for pure vacuum

    this.rocketFiring = false;
    this.shots = [];

    this.create = function() {
        this.draw();
        this.addEventListeners();
    }

    this.fly = function() {
        let s = this;
        //move me
        s.move();
        //and each of my shots
        for(let i=0; i<s.shots.length; i++) {
            let shot = s.shots[i];
            shot.move();
        }
        window.requestAnimationFrame(function() {
            s.fly();
        })
    }

    this.fireGun = function() {
        console.log('firing shot!');
        let s = this;
        let shot = new Shot(s.currX,s.currY,s.orientation);
        s.shots.push(shot);
        shot.move();
    }

    this.explode = function() {
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
    }
    this.fireRetroRocket = function() {
        this.slowDown(this.retroRocketForce);
        this.rocketFiring = true;
    }
    this.drawRocketFire = function() {
        let s = this;
        ctx.beginPath();
        let degrees = 360;
        ctx.arc(s.currX,s.currY,20,0,degrees.toRads());
        ctx.fillStyle = '#f00';
        ctx.fill();
    }

    this.draw = function() {
        ctx.clearRect(0,0,canvasWidth,canvasHeight);
        let s = this;
        let degrees = 360;
        ctx.beginPath();
        if(s.currX > canvasWidth) s.currX = 0;
        if(s.currY > canvasHeight) s.currY = 0;
        if(s.currX < 0) s.currX = canvasWidth;
        if(s.currY < 0) s.currY = canvasHeight;
        //circle? hard to use
        //ctx.arc(s.currX,s.currY,radius,0,degrees.toRads());
        //rectangle? no orientation built in
        /*
        let width = radius;
        let height = radius * 2;
        let startX = s.currX - width/2;
        let startY = s.currY - height/2;
        let rightX = startX + width;
        let topY = startY + height;
        ctx.moveTo(startX,startY);
        ctx.lineTo(startX,topY);
        ctx.lineTo(rightX,topY);
        ctx.lineTo(rightX,startY);
        ctx.lineTo(startX,startY);
        ctx.fillStyle = 'blue';
        ctx.fill();
        */
        //thick line? using my current orientation? yes!
        lineToAngle(ctx,s.currX,s.currY,radius,s.orientation);
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 10;
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
    
    function Shot(x,y,direction) {
        this.x0 = x;
        this.y0 = y;

        this.currX = this.x0;
        this.currY = this.y0;

        this.prevX = this.currX;
        this.prevY = this.currY;

        this.speed = 8;
        this.direction = direction;

        this.power = 5;

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
                //actually this needs to run every frame until we get a keyup
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