import {canvas} from './canvas.js';
import {getRandomIntInclusive} from './canvas.js';

export function AsteroidField(asteroidCount) {
    this.asteroidCount = asteroidCount;
    this.asteroids = [];

    let ctx = canvas.getContext('2d');
    let width = canvas.getBoundingClientRect().width;
    let height = canvas.getBoundingClientRect().height;

    this.radius = 50;

    this.createAsteroidField = function() {
        let af = this;
        for(let i=0; i<af.asteroidCount; i++) {
            let radius = af.radius * Math.random();
            let asteroid = new Asteroid(radius);
            af.asteroids.push(asteroid);
            asteroid.draw();
        }
    }

    this.moveRandomly = function() {
        let af = this;
        ctx.clearRect(0,0,width,height);
        for(let i=0; i<af.asteroids.length; i++) {
            let asteroid = af.asteroids[i];
            asteroid.move();
        }
        window.requestAnimationFrame(function() {
            af.moveRandomly();
        })
    }

    function Asteroid(radius) {
        let a = this;
        this.x0 = width * Math.random();
        this.y0 = height * Math.random();

        this.orientation = getRandomIntInclusive(0,360);
        this.speed = Math.random() * 10; //aka movement vector magnitude aka hypotneuse length

        this.currX = this.x0;
        this.currY = this.y0;

        this.prevX = this.currX;
        this.prevY = this.currY;

        //ctx.globalCompositeOperation = 'source-out';

        let jiggleFrame = Math.floor(Math.random() * 50);
        let currFrame = 0;
        this.moveRandomly = function() {
            currFrame++;
            if(currFrame === jiggleFrame) {
                let xDirection = Math.random() > 0.5 ? 1 : -1;
                let yDirection = Math.random() > 0.5 ? 1 : -1;
                let xDelta = Math.random() * 5 * xDirection;
                let yDelta = Math.random() * 5 * yDirection;
                a.moveBy(xDelta,yDelta);   
                currFrame = 0;
            } else {
                a.draw();
            }
        }

        this.explode = function() {
            let a = this;
            console.log('ASTEROID WAS HIT BY SHOT!!');
            console.log('asteroid centerpoint: ' + a.currX + ', ' + a.currY);
            ctx.beginPath();
            let degrees = 360;
            ctx.arc(a.currX,a.currY,radius,0,degrees.toRads());
            ctx.fillStyle = 'white';
            ctx.fill();
        }
    
        this.draw = function() {
            let degrees = 360;
            ctx.beginPath();
            if(a.currX > width) a.currX = 0;
            if(a.currY > height) a.currY = 0;
            if(a.currX < 0) a.currX = width;
            if(a.currY < 0) a.currY = height;
            ctx.arc(a.currX,a.currY,radius,0,degrees.toRads());
            ctx.strokeStyle = 'white';
            ctx.stroke();
        }

        this.move = function() {
            let a = this;
            let hypoteneuse = a.speed;
            let x = Math.cos(a.orientation) * hypoteneuse;
            let y = Math.sin(a.orientation) * hypoteneuse;
            a.moveBy(x,y);
        }
        this.moveBy = function(x,y) {
            this.prevX = this.currX;
            this.prevY = this.currY;
            this.currX += x;
            this.currY += y;
            this.draw();
        }

    }
}