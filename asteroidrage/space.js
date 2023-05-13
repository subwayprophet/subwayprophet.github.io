import {canvasBackground, getRandomIntInclusive} from './canvas.js'
import {AsteroidField} from './asteroidfield.js';
import {Ship} from './shipSimple.js';

const MAX_COLLISIONS_PER_TICKINTERVAL = 100;
const TICKS_PER_TICKINTERVAL = 5;

export function Space(starCount, planetCount) {
    this.starCount = starCount;
    this.planetCount = planetCount;

    let width = canvasBackground.getBoundingClientRect().width;
    let height = canvasBackground.getBoundingClientRect().height;

    this.stars = [];
    this.planets = [];

    let ctx = canvasBackground.getContext('2d');

    var asteroidField = new AsteroidField(Math.floor(Math.random() * 30));
    asteroidField.createAsteroidField();
    asteroidField.moveRandomly();

    var ship = new Ship(40);
    ship.create();
    ship.fly();


    this.createStars = function() {
        let sp = this;
        let starsCreated = 0;
        while(starsCreated < this.starCount) {
            let x = Math.random() * width;
            let y = Math.random() * height;
            let star = new Star(x,y);
            sp.stars.push(star);
            starsCreated++;
        }
    }

    this.letThereBeLight = function() {
        let sp = this;
        for(let i=0; i<this.stars.length; i++) {
            let star = this.stars[i];
            //star.shine();
            star.twinkle();
        }
    }

    this.collisionsCounted = 0;
    this.collisionTicks = 0;
    this.checkCollisions = function() {
        let sp = this;

        //check for asteroid-ship collisions...
        let asteroids = asteroidField.asteroids;
        for(let i=0; i<asteroids.length; i++) {

            //prevent too-wild explosions from killing the game
            if(sp.collisionsCounted >= MAX_COLLISIONS_PER_TICKINTERVAL) {
                // console.log('RESETTING PER-TICK COLLISION LIMITER');
                this.collisionsCounted = 0;
                break;
            }
            if(sp.collisionTicks >= TICKS_PER_TICKINTERVAL) {
                // console.log('RESETTING PER-TICK COLLISION LIMITER');
                this.collisionTicks = 0;
                break;
            }

            let asteroid = asteroids[i];
            let asteroidX = asteroid.currX;
            let asteroidY = asteroid.currY;
            let shipX = ship.currX;
            let shipY = ship.currY;
            if(Math.abs(asteroidX - shipX) < 30 && Math.abs(asteroidY - shipY) < 30) { //todo: get actual bounding shape from ship!
                ship.explode()
            }
            //..and asteroid-shot collisions
            let shots = ship.shots;
            for(let i=0; i<shots.length; i++) {
                let shot = shots[i];
                let shotX = shot.currX;
                let shotY = shot.currY;
                if(Math.abs(asteroidX - shotX) < asteroid.radius && Math.abs(asteroidY - shotY) < asteroid.radius) { //todo: get actual bounding shape from ship!
                    sp.collisionsCounted++;
                    asteroid.explode()
                }                
            }
            //..and asteroid-asteroid collisions (bounce!) (actually this is boring)
            // asteroids.forEach(a => {
            //     if(a === asteroid) return;
            //     if(Math.abs(a.currX - asteroid.currX) < a.radius && Math.abs(a.currY - asteroid.currY) < a.radius) {
            //         //todo: physics based on mass(radius?) and angle?
            //         a.orientation = getRandomIntInclusive(0,360);
            //         asteroid.orientation = getRandomIntInclusive(0,360);
            //     }
            // })
        }
        
        sp.collisionTicks++;
        window.requestAnimationFrame(function() {
            sp.checkCollisions();
        })
    }

    function Star(x,y) {
        this.x = x;
        this.y = y;

        this.shine = function() {
            let st = this;
            ctx.beginPath();
            ctx.moveTo(st.x,st.y);
            ctx.lineTo(st.x+1,st.y+1); //point?
            ctx.strokeStyle = 'white';
            ctx.stroke();
        }
            
        let twinkleFrame = Math.floor(Math.random() * 50);
        let currFrame = 0;
        this.twinkle = function() {
            let st = this;
            ctx.beginPath();
            ctx.moveTo(st.x,st.y);
            ctx.lineTo(st.x+2,st.y+2); //point?
            ctx.strokeStyle = 'white';
            ctx.stroke();
            window.requestAnimationFrame(function() {
                currFrame++;
                if(currFrame === twinkleFrame) {
                    ctx.clearRect(st.x,st.y,3,3);
                    //ctx.clearRect(0,0,width,height);
                    currFrame = 0;
                }
                st.twinkle();
            })
        }

    }

}