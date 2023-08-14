import {canvas} from './canvas.js';
import {getRandomIntInclusive} from './canvas.js';
import {pickRandomColor} from './canvas.js';
import {soundExplosion} from "./sound.js";

export function AsteroidField(asteroidCount) {
    this.asteroidCount = asteroidCount;
    this.asteroids = [];

    let ctx = canvas.getContext('2d');
    let width = canvas.getBoundingClientRect().width;
    let height = canvas.getBoundingClientRect().height;

    this.radius = 50;
    this.minAsteroidSize = 20;

    this.createAsteroidField = function() {
        this.createAsteroids(this.asteroidCount)
    }
    this.createAsteroids = function(count) {
        let af = this;
        for(let i=0; i<count; i++) {
            let radius = Math.max(af.radius * Math.random(),this.minAsteroidSize);
            let asteroid = new Asteroid(radius,af);
            af.asteroids.push(asteroid);
            asteroid.draw();
        }
    }

    this.destroyAsteroid = function(asteroid) {
        this.asteroids = this.asteroids.filter(a => a !== asteroid);
    }

    this.debrisFields = [];
    this.createDebrisField = function(sourceAsteroid) {
        this.debrisFields.push(new DebrisField(sourceAsteroid.currX,sourceAsteroid.currY,sourceAsteroid.radius,this))
    }

    this.update = function() {
        let af = this;
        ctx.clearRect(0,0,width,height);
        for(let i=0; i<af.asteroids.length; i++) {
            let asteroid = af.asteroids[i];
            asteroid.move();
        }
    }

function Asteroid(radius,field) {
        let a = this;
        this.x0 = width * Math.random();
        this.y0 = height * Math.random();
        this.radius = radius;

        this.health = this.radius;
        
        this.isDebris = false;
        this.shouldExplode = function() {
            return this.health <= 0;
        }

        this.field = field;

        this.orientation = getRandomIntInclusive(0,360);
        this.speed = getRandomIntInclusive(1,5); //aka movement vector magnitude aka hypotneuse length

        this.currX = this.x0;
        this.currY = this.y0;

        this.prevX = this.currX;
        this.prevY = this.currY;

        this.color = 'white';
        // this.isFancy = Math.random() > 0.7; //todo: improve performance so this doesn't slow everything down horribly...is it acceptable now???
        this.isFancy = true


        this.ticksLifespan = 500; //how many ticks before this asteroid maybe disappears?
        this.ticksLived = 0; //how many ticks has this asteroid lived?

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

        this.getHit = function(power) {
            this.health -= power;
            ctx.beginPath();
            let degrees = 360;
            ctx.arc(a.currX,a.currY,radius,0,degrees.toRads());
            ctx.fillStyle = 'white';
            ctx.fill();
        }

        this.explode = function() {
            let a = this;
            // console.log('ASTEROID WAS HIT BY SHOT!!');
            // console.log('asteroid centerpoint: ' + a.currX + ', ' + a.currY);
            a.field.destroyAsteroid(a);
            a.field.createDebrisField(a);
            soundExplosion();
        }
    
        this.draw = function() {
            //if we're debris then don't proceed beyond the edge of the screen
            if(this.isDebris && (a.currX > width || a.currY > height || a.currX < 0 || a.currY < 0)) {
                this.field.destroyAsteroid(this);
                return;
            }

            let degrees = 360;
            ctx.beginPath();
            if(a.currX > width) a.currX = 0;
            if(a.currY > height) a.currY = 0;
            if(a.currX < 0) a.currX = width;
            if(a.currY < 0) a.currY = height;

            if(this.isFancy) {
                //this looks cool but is too slow -- need to optimize
                const gradient = ctx.createRadialGradient(a.currX,a.currY,0,a.currX,a.currY,a.radius);
                gradient.addColorStop(0, this.color);
                gradient.addColorStop(1, 'black');
                ctx.fillStyle = gradient;
                ctx.arc(a.currX,a.currY,radius,0,degrees.toRads());
                ctx.fill();
            } else {
                //boring but more performant -- but surely this is an issue just because my code is colossally inefficient
                ctx.arc(a.currX,a.currY,radius,0,degrees.toRads());
                ctx.strokeStyle = this.color;
                ctx.stroke();
            }

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
            this.ticksLived++;
        }

        this.shouldDisappear = function() { //todo: awkward naming?
            return this.isDebris && (this.ticksLived >= this.ticksLifespan); //some chance of disappearing if old enough? makes a 'more natural randomish fadeout effect'??
        }

    }

    function DebrisField(x,y,radius,field) {
        this.sourceX = x;
        this.sourceY = y;
        this.radius = radius;
        this.field = field;

        this.initialPiecesOfDebrisCount = radius / 7;

        this.piecesOfDebris = [];


        this.beBorn = function() {
            let df = this;
            for(let i=0; i<df.initialPiecesOfDebrisCount; i++) {
                let radius = df.radius * Math.random();
                let asteroid = new Asteroid(radius,df.field);
                asteroid.currX = df.sourceX; 
                asteroid.currY = df.sourceY;
                asteroid.prevX = df.sourceX; 
                asteroid.prevY = df.sourceY;
                asteroid.speed = asteroid.speed / 5;
                asteroid.color = pickRandomColor();
                asteroid.isDebris = true;
                // this.piecesOfDebris.push(asteroid);
                df.field.asteroids.push(asteroid);
            }
        }

        this.move = function() {
            this.piecesOfDebris.forEach(pod => pod.move());
        }

        this.beBorn();

    }
}