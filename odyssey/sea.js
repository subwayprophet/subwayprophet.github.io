import {canvasBackground, getRandomIntInclusive, pickRandomColor} from './canvas.js'
import {Ship} from "./ship.js";
import {Monster} from "./monster.js";
import {soundWindBlow, soundWhirlpool} from "./sound.js";
import {DynamicMusic} from "./musicDynamic.js";
import {Music} from "./music.js";

export class Sea {
    constructor(numShips = 1, numWaves = 200) {
        this.createWaves(numWaves);
        this.createWhirlpool('Charybdis');
        this.createMonster('Scylla');
        //init dynamic music
        this.dynamicMusic = new DynamicMusic(this);
        // this.dynamicMusic.play();

        this.staticMusic = new Music();
        this.isMusicPlaying = true;
        this.playMusic();
    }

    //attributes of the sea
    width = canvasBackground.getBoundingClientRect().width;
    height = canvasBackground.getBoundingClientRect().height;
    color = 'blue';
    minWhirlpools = 1;
    minMonsters = 1;
    maxWhirlpools = 10;
    maxMonsters = 10;

    //entities within the sea
    waves = [];
    ships = [];
    whirlpools = [];
    monsters = [];

    //game state
    player;

    scrollSpeed = 1;

    setPlayer = function (player) {
        let s = this;
        s.player = player;
        s.player.update();
        this.ship = new Ship(40);
        this.ship.create();
        this.ship.situate(this);
        this.ship.sail();
        s.ships.push(this.ship);
    }

    //MAIN GAME LOOP
    currFrame = 0;
    blowWindEveryNFrames = 500;
    tick = function () {
        if(this.isGameOver) return;
        let sea = this;
        let ctx = canvasBackground.getContext('2d');
        ctx.clearRect(0, 0, sea.width, sea.height);
        //set background color
        ctx.fillStyle = sea.color;
        ctx.fillRect(0, 0, sea.width, sea.height);
        //draw entities
        sea.player.update();
        let whirlPoolsEscaped = [];
        let monstersEscaped = [];
        sea.waves.forEach(wave => {
            wave.slosh()
            wave.moveBy(0, sea.scrollSpeed);
        });
        sea.ships.forEach(ship => ship.sail());
        sea.whirlpools.forEach(whirlpool => {
            whirlpool.whirl();
            whirlpool.moveBy(0, sea.scrollSpeed);
            if(whirlpool.x > sea.width || whirlpool.y > sea.height) {
                console.log('escaped from whirlpool ', whirlpool.name);
                whirlPoolsEscaped.push(whirlpool);
            }
        });
        sea.monsters.forEach(monster => {
            monster.terrorize();
            monster.moveBy(0, sea.scrollSpeed);
            if(monster.x > sea.width || monster.y > sea.height) {
                console.log('escaped from monster ', monster.name);
                monstersEscaped.push(monster);
            }
        });
        //maybe make a sound
        if(sea.currFrame % sea.blowWindEveryNFrames === 0 && (Math.random() > 0.5)) {
            soundWindBlow();
            sea.currFrame = 0;
        }
        sea.currFrame++;
        //check for collisions
        sea.checkCollisions();

        //cleanup
        // console.log('whirlPoolsEscaped', whirlPoolsEscaped);
        sea.whirlpools = sea.whirlpools.filter(whirlpool => !whirlPoolsEscaped.includes(whirlpool));
        sea.monsters = sea.monsters.filter(monster => !monstersEscaped.includes(monster));

        //maybe spawn new entities
        // console.log('sea.whirlpools.length', sea.whirlpools.length);
        // console.log('sea.minWhirlpools', sea.minWhirlpools);
        // console.log('sea.maxWhirlpools', sea.maxWhirlpools);
        if(sea.whirlpools.length < sea.minWhirlpools && !(sea.whirlpools.length > sea.maxWhirlpools)) sea.createWhirlpool('Charybdis');
        if(sea.monsters.length < sea.minMonsters && !(sea.monsters.length > sea.maxMonsters)) sea.createMonster('Scylla');

        //if we're alive then score goes up! goal is just to live!!!
        sea.player.score++;

        //loop
        window.requestAnimationFrame(() => sea.tick());
    }

    checkCollisions = function () {
        // console.log('checking collisions');
        let sea = this;
        sea.ships.forEach(ship => {
            sea.whirlpools.forEach(whirlpool => {
                if (whirlpool.isWithinPullRange(ship.currX, ship.currY)) {
                    const pull = whirlpool.calculatePull(ship.currX, ship.currY);
                    ship.moveBy(pull.x, pull.y);
                }
            });
            sea.monsters.forEach(monster => {
                if(monster.isTouching(ship.currX,ship.currY)) {
                    console.log('ship collided with monster');
                    ship.health -= 10;
                    sea.player.health -= monster.damage;
                }
            });
        });
    }

    end = function() {
        this.isGameOver = true;
    }


    //generators
    createWaves(numWaves) {
        let sea = this;
        let maxWidth = canvasBackground.getBoundingClientRect().width;
        for (let i = 0; i < numWaves; i++) {
            let x = Math.random() * maxWidth;
            let y = Math.random() * maxWidth;
            let width = Math.random() * 100;
            let height = Math.random() * 10;
            let speed = Math.random() * 10;
            let wave = new WaterWave(x, y, width, height, speed);
            sea.waves.push(wave);
        }
    }

    // createShips(numShips) {
    //     let sea = this;
    //     for(let i=0; i<numShips; i++) {
    //         let x = Math.random() * 100;
    //         let y = Math.random() * 100;
    //         let speed = Math.random() * 10;
    //         let ship = new Ship(x,y,speed);
    //         sea.ships.push(ship);
    //     }
    // }
    createWhirlpool(name) {
        console.log('creating whirlpool');
        let sea = this;
        let x = 0
        let y = 0;
        let radius = Math.random() * canvasBackground.getBoundingClientRect().width/5;
        let speed = Math.random() * 10;
        let whirlpool = new Whirlpool(x, y, radius, speed, name);
        sea.whirlpools.push(whirlpool);
    }

    createMonster(name) {
        let sea = this;
        let health = Math.random() * 100;
        let maxHealth = Math.random() * 100;
        //first two construtor params: top right
        let monster = new Monster(name, health, maxHealth)
            .setPosition('top right');
        sea.monsters.push(monster);
    }

    staticMusic;
    dynamicMusic;
    currTrackIndex = 0;
    trackNames = ['track1','track2'];
    isMusicPlaying = false;
    playMusic = function(trackName='track1') {
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
    stopMusic = function() {
        const s = this;
        s.isMusicPlaying = false;
        s.staticMusic.stop(false);
    }
    unstopMusic = function() {
        const s = this;
        s.isMusicPlaying = true;
        s.staticMusic.unstop();
    }
}

class Whirlpool {
    constructor(x, y, radius, speed, name) {
        this.x = x;
        this.y = y;
        this.originalRadius = radius;
        this.radius = radius;
        this.maxRadius = radius * 2;
        this.speed = speed;
        this.name = name;
        this.ctx = canvasBackground.getContext('2d');
    }

    x;
    y;
    originalRadius;
    radius;
    maxRadius;
    speed;
    name;
    damage = 20;
    pullStrength = -5; //negative means 'toward me'

    whirl() {
        this.radius += this.speed;
        if(this.radius > this.maxRadius) this.radius = this.originalRadius;
        this.draw(this.ctx)
    }

    draw(ctx) {
        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    moveBy(dx,dy) {
        this.x += dx;
        this.y += dy;
    }

    isWithinPullRange(x,y) {
        return Math.sqrt((x-this.x)**2 + (y-this.y)**2) < this.radius;
    }
    calculatePull(x,y) {
        let dx = x - this.x;
        let dy = y - this.y;
        let angle = Math.atan2(dy,dx);
        const result = {x: Math.cos(angle) * this.pullStrength, y: Math.sin(angle) * this.pullStrength};
        return result;
    }
}

class WaterWave {
    constructor(x, y, width, height, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.orientation = Math.random();
        this.ctx = canvasBackground.getContext('2d');
    }

    x;
    y;
    width;
    height;
    speed;
    orientation;

    draw(ctx) {
        ctx.fillStyle = '#3cf';
        //draw a few wiggly curves NOT lines
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        for (let i = 0; i < this.width; i++) {
            const cp1x = this.x + i + this.width / 4;
            const cp1y = this.y + Math.sin(i) * this.height;
            const cp2x = this.x + i + (3 * this.width) / 4;
            const cp2y = this.y + Math.sin(i + 1) * this.height;
            const x = this.x + i + this.width;
            const y = this.y + Math.sin(i + 1) * this.height;
            ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
        }
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.lineTo(this.x, this.y + this.height);
        ctx.globalAlpha = 0.2;
        ctx.fill();
    }

    everyNthFrame = 20;
    currFrame = 0;
    slosh() {
        if(this.currFrame % this.everyNthFrame === 0) {
            this.ctx.clearRect(this.x,this.y,this.width,this.height);
            this.x += this.speed * this.orientation * (Math.random() > 0.5 ? 1 : -1);
            this.y += this.speed * this.orientation * (Math.random() > 0.5 ? 1 : -1);
        }
        this.draw(this.ctx);
        this.currFrame++;
    }

    moveBy(dx,dy) {
        this.x += dx;
        this.y += dy;
        if(this.x > canvasBackground.getBoundingClientRect().width) this.x = 0;
        if(this.y > canvasBackground.getBoundingClientRect().height) this.y = 0;
    }
}