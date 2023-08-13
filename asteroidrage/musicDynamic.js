import {beep, soundRocket} from "./sound.js";

export class DynamicMusic {
    constructor(space) {
        this.space = space;
        this.maxInterval = this.interval + this.space.asteroidField.asteroidCount;
    }
    space;


    get pitch() {
        // return Math.max(Math.min(this.space.asteroidField.asteroids.length,800),80);
        // return Math.max(Math.min(this.basePitch - Math.log(this.space.asteroidField.asteroids.filter(a => !a.isDebris).length)*40,800),80);
        let realAsteroidsRemaining = this.space.asteroidField.asteroids.filter(a => !a.isDebris).length;
        let ratioRemaining = realAsteroidsRemaining / this.space.asteroidField.asteroidCount;
        let pitch = this.basePitch / ratioRemaining;
        return Math.min(pitch,this.maxPitch);
    }

    basePitch = 200;
    maxPitch = 800;
    minPitch = 80;
    baseInterval = 400;
    interval = this.baseInterval;
    minInterval = 50;
    maxInterval = 1000;

    get calculatedInterval() {
        let af = this.space.asteroidField;
        let realAsteroidsRemaining = this.space.asteroidField.asteroids.filter(a => !a.isDebris).length;
        let ratioRemaining = realAsteroidsRemaining / this.space.asteroidField.asteroidCount;
        return this.baseInterval * ratioRemaining;
    }
    play = function() {
        let dm = this;
        let loop = setInterval(() => {
            clearInterval(loop);
            let newInterval = dm.calculatedInterval;
            dm.interval = newInterval;
            beep(dm.pitch,0.2);
            dm.play();
        }, dm.interval);
    }

    playBling = function() {
        soundRocket();
    }

}