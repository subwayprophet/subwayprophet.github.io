import {canvasBackground, getRandomIntInclusive, pickRandomColor} from './canvas.js'
import {AsteroidField} from './asteroidfield.js';
import {Ship} from './ship.js';
import {DynamicMusic} from "./musicDynamic.js";
import {Music} from "./music.js";

const MAX_COLLISIONS_PER_TICKINTERVAL = 100;
const TICKS_PER_TICKINTERVAL = 5;

export function Space(starCount, planetCount) {
    this.starCount = starCount;
    this.planetCount = planetCount;

    let width = canvasBackground.getBoundingClientRect().width;
    let height = canvasBackground.getBoundingClientRect().height;

    this.stars = [];
    this.planets = [];

    this.staticMusic;
    this.dynamicMusic;

    this.player;
    this.setPlayer = function(player) {
        this.player = player;
        this.player.update();
        this.ship = new Ship(40);
        this.ship.create();
        this.ship.situate(this);
        this.ship.fly();    
    }

    let ctx = canvasBackground.getContext('2d');

    this.asteroidField = new AsteroidField(getRandomIntInclusive(10,11));
    this.asteroidField.createAsteroidField();

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
    this.createPlanets = function() {
        let sp = this;
        let planetsCreated = 0;
        while(planetsCreated < this.planetCount) {
            let x = Math.random() * width;
            let y = Math.random() * height;
            let planet = new Planet(x,y);
            sp.planets.push(planet);
            planetsCreated++;
        }
    }

    this.letThereBeLight = function() {
        let sp = this;
        for(let i=0; i<this.stars.length; i++) {
            let star = this.stars[i];
            //star.shine();
            star.twinkle();
        }
        for(let i=0; i<this.planets.length; i++) {
            let planet = this.planets[i];
            planet.exist();
        }

        //init dynamic music
        this.dynamicMusic = new DynamicMusic(this);
        this.dynamicMusic.play();

        this.staticMusic = new Music();
        this.isMusicPlaying = true;
        this.playMusic();

    }

    this.isTheUniverseOver = false;
    //MAIN GAME LOOP!!!!!!!!!
    this.tick = function() {
        if(this.isTheUniverseOver) return;
        let sp = this;
        sp.player.update();
        sp.stars.forEach(star => star.twinkle());
        sp.asteroidField.update();
        sp.ship.fly();
        sp.checkCollisions();
        window.requestAnimationFrame(function() {
            sp.tick();
        })
    }

    this.end = function() {
        this.isTheUniverseOver = true;
    }

    this.collisionsCounted = 0;
    this.collisionTicks = 0;
    this.checkCollisions = function() {
        let sp = this;
        
        //first remove any objects that should be removed (is this massively efficient??)
        sp.asteroidField.asteroids = sp.asteroidField.asteroids.filter(a => !a.shouldDisappear());

        let asteroids = sp.asteroidField.asteroids;
        let player = this.player;
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

            //check for asteroid-ship collisions...
            let ship = this.ship;
            let shipX = ship.currX;
            let shipY = ship.currY;
            if(!asteroid.isDebris && Math.abs(asteroidX - shipX) < 30 && Math.abs(asteroidY - shipY) < 30) { //todo: get actual bounding shape from ship!
                ship.showDamage();
                player.health--;
            }
            //..and asteroid-shot collisions
            let shots = ship.shots;
            for(let i=0; i<shots.length; i++) {
                let shot = shots[i];
                let shotX = shot.currX;
                let shotY = shot.currY;
                if(Math.abs(asteroidX - shotX) < asteroid.radius && Math.abs(asteroidY - shotY) < asteroid.radius) { //todo: get actual bounding shape from ship!
                    asteroid.getHit(shot.power);
                    sp.collisionsCounted++;
                    player.score++;
                    if(asteroid.shouldExplode()) asteroid.explode();
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
        //add some more asteroids if we're running low
        if(asteroids.length < 5) {
            sp.asteroidField.createAsteroids(5);
            this.dynamicMusic.playBling();
        }
        
        sp.collisionTicks++;
    }

    //also init static music, at least for now -- does this really belong here, though?
    this.currTrackIndex = 0;
    this.trackNames = ['track1','track2'];
    this.isMusicPlaying = false;
    this.playMusic = function(trackName='track1') {
        let sp = this;
        let player = sp.staticMusic.play(trackName);
        if(!sp.isMusicPlaying) sp.staticMusic.stop(false);
        setTimeout(() => {
            player.stop(false);
            if(sp.currTrackIndex >= sp.trackNames.length-1) {
                sp.currTrackIndex = 0;
            } else {
                sp.currTrackIndex++;
            }
            sp.playMusic(sp.trackNames[sp.currTrackIndex]);
        },10000)
    }
    this.stopMusic = function() {
        this.isMusicPlaying = false;
        this.staticMusic.stop(false);
    }
    this.unstopMusic = function() {
        this.isMusicPlaying = true;
        this.staticMusic.unstop();
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
            currFrame++;
            if(currFrame === twinkleFrame) {
                ctx.clearRect(st.x,st.y,3,3);
                //ctx.clearRect(0,0,width,height);
                currFrame = 0;
            }
        }
    }

    class Planet {
        constructor(x,y) {
            this.x = x;
            this.y = y;
            this.hasRings = Math.random() > 0.7;
        }
        hasRings;
        exist = function() {
            let pl = this;
            const color = pickRandomColor();
            const radius = getRandomIntInclusive(2,12);
            const gradient = ctx.createRadialGradient(pl.x,pl.y,0,pl.x,pl.y,radius);
            gradient.addColorStop(0, color);
            gradient.addColorStop(1, 'black');

            //actually draw planet
            ctx.beginPath();
            ctx.arc(pl.x,pl.y,radius,0,Math.PI*2);
            ctx.fillStyle = gradient
            ctx.fill();

            if(pl.hasRings) {
                ctx.beginPath();
                ctx.arc(pl.x,pl.y,radius+2,0,Math.PI*2);
                ctx.strokeStyle = color;
                ctx.stroke();
                //draw another concentric ring...
                if(Math.random() > 0.5) {
                    ctx.beginPath();
                    ctx.arc(pl.x,pl.y,radius+4,0,Math.PI*2);
                    ctx.strokeStyle = 'white';
                    ctx.stroke();
                    if(Math.random() > 0.5) {
                        ctx.beginPath();
                        ctx.arc(pl.x,pl.y,radius+6,0,Math.PI*2);
                        ctx.strokeStyle = color;
                        ctx.stroke();
                    }
                }

            }
        }
    }

}