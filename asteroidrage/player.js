const LOCALSTORAGE_KEY_HIGHSCORE = 'ast_highScore';

export function Player(name) {
    this.name = name;
    this.score = 0;

    this.health = 1000;
    this.power = 0; //init; ship should reset this on tick
    this.maxPower = 100; //default, but ship should set this on ship init
    
    this.highScore = parseInt(localStorage.getItem(LOCALSTORAGE_KEY_HIGHSCORE) || '0');

    this.scoreEl;
    this.setScoreEl = function(el) {
        this.scoreEl = el;
    }
    this.healthEl;
    this.setHealthEl = function(el) {
        this.healthEl = el;
    }
    this.highScoreEl;
    this.setHighScoreEl = function(el) {
        this.highScoreEl = el;
    }
    this.powerEl;
    this.powerElInitialWidth;
    this.setPowerEl = function(el) {
        this.powerEl = el;
        this.powerElInitialWidth = this.powerEl.offsetWidth;
    }

    this.update = function() {
        let p = this;
        p.scoreEl.innerText = p.score;
        p.healthEl.innerText = p.health;
        p.highScoreEl.innerText = p.highScore;
        p.renderPower();
        p.checkHighScore();
        window.requestAnimationFrame(function() {
            p.update();
        })
    }

    this.checkHighScore = function() {
        let highScoreStr = localStorage.getItem(LOCALSTORAGE_KEY_HIGHSCORE);
        if(!highScoreStr) highScoreStr = '0';
        let highScore = parseInt(highScoreStr);
        if(this.score > highScore) {
            this.scoreEl.style.color = 'red';
            localStorage.setItem(LOCALSTORAGE_KEY_HIGHSCORE,this.score);
        }
    }

    this.renderPower = function() {
        let p = this;
        //calculate what pct of max power we are currently at
        let powerPct = this.power / this.maxPower;
        //set power bar width
        p.powerEl.style.width = this.powerElInitialWidth * powerPct;
        //set power bar text
        p.powerEl.innerText = Math.round(p.power);
        //change color if appropriate
        if(powerPct > 0.75) {
            p.powerEl.style.backgroundColor = 'green';
            p.powerEl.style.color = 'white';
        } else if (powerPct > 0.5 && powerPct <= 0.75) {
            p.powerEl.style.backgroundColor = 'yellow';
            p.powerEl.style.color = 'black';
        } else {
            p.powerEl.style.backgroundColor = 'red';
            p.powerEl.style.color = 'white';
        }
    }

}