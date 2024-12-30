const LOCALSTORAGE_KEY_HIGHSCORE = 'ody_scylchar_highScore';

class UI {
    scoreEl;
    setScoreEl = function(el) {
        this.scoreEl = el;
    }
    healthEl;
    healthElInitialWidth;
    setHealthEl = function(el) {
        this.healthEl = el;
        this.healthElInitialWidth = this.healthEl.offsetWidth;
    }
    highScoreEl;
    setHighScoreEl = function(el) {
        this.highScoreEl = el;
    }
    highScoreNameEl;
    setHighScoreNameEl = function(el) {
        this.highScoreNameEl = el;
    }
    powerEl;
    powerElInitialWidth;
    setPowerEl = function(el) {
        this.powerEl = el;
        this.powerElInitialWidth = this.powerEl.offsetWidth;
    }
    playerNameEl;
    setPlayerNameEl = function(el) {
        this.playerNameEl = el;
        this.playerNameEl.innerText = name;
    }
    oldPlayerNameEl;
    setOldPlayerNameEl = function(el) {
        this.oldPlayerNameEl = el;
    }
    gameOverEl;
    setGameOverEl = function(el) {
        this.gameOverEl = el;
    }

    renderPower = function(currPower,maxPower) {
        let ui = this;
        //calculate what pct of max power we are currently at
        let powerPct = currPower / maxPower;
        //set power bar width
        ui.powerEl.style.width = ui.powerElInitialWidth * powerPct;
        //set power bar text
        ui.powerEl.innerText = Math.round(currPower);
        //change color if appropriate
        if(powerPct > 0.75) {
            ui.powerEl.style.backgroundColor = 'green';
            ui.powerEl.style.color = 'white';
        } else if (powerPct > 0.5 && powerPct <= 0.75) {
            ui.powerEl.style.backgroundColor = 'yellow';
            ui.powerEl.style.color = 'black';
        } else {
            ui.powerEl.style.backgroundColor = 'red';
            ui.powerEl.style.color = 'white';
        }
    }
    renderHealth = function(currHealth,maxHealth) {
let ui = this;
        //calculate what pct of max health we are currently at
        let healthPct = currHealth / maxHealth;
        //set health bar width
        ui.healthEl.style.width = ui.healthElInitialWidth * healthPct;
        //set health bar text
        ui.healthEl.innerText = Math.round(currHealth);
        //change color if appropriate
        if(healthPct > 0.75) {
            ui.healthEl.style.backgroundColor = 'green';
            ui.healthEl.style.color = 'white';
        } else if (healthPct > 0.5 && healthPct <= 0.75) {
            ui.healthEl.style.backgroundColor = 'yellow';
            ui.healthEl.style.color = 'black';
        } else {
            ui.healthEl.style.backgroundColor = 'red';
            ui.healthEl.style.color = 'white';
        }
    }

}

class HighScore {
    constructor(name='none',score=0) {
        this.name = name;
        this.score = parseInt(score);
    }
    name;
    score;
}

export function Player(name) {
    this.name = name;
    this.score = 0;

    this.health = 100;
    this.maxHealth = 100;
    this.power = 0; //init; ship should reset this on tick
    this.maxPower = 100; //default, but ship should set this on ship init
    
    this.highScore;
    
    this.ui = new UI();

    this.space;
    this.setSpace = function(space) {
        this.space = space;
    }

    this.update = function() {
        // console.log('updating player');
        let p = this;
        p.ui.scoreEl.innerText = p.score;
        p.ui.healthEl.innerText = p.health;
        p.ui.highScoreNameEl.innerText = p.highScoreName;
        p.ui.highScoreEl.innerText = p.highScore;
        p.ui.renderHealth(this.health,this.maxHealth);
        p.ui.renderPower(this.power,this.maxPower);
        p.checkHighScore();
        p.checkHealth();
    }

    this.checkHighScore = function() {
        //default high score to current high score (if any)
        let p = this;
        let highScoreStr = localStorage.getItem(LOCALSTORAGE_KEY_HIGHSCORE);
        let highScoreObj;
        if(!highScoreStr) {
            highScoreObj = new HighScore();
        } else {
            let highScoreParsed = JSON.parse(highScoreStr);
            highScoreObj = new HighScore(highScoreParsed.name,highScoreParsed.score);
        }
        p.ui.highScoreNameEl.innerText = highScoreObj.name;
        p.ui.highScoreEl.innerText = highScoreObj.score;

        //update high score if we just now beat it
        let highScore = highScoreObj.score;
        if(this.score > highScore) {
            p.ui.scoreEl.style.color = 'red';
            p.ui.highScoreEl.style.color = 'red';
            p.ui.highScoreNameEl.innerText = this.name
            p.ui.highScoreNameEl.style.backgroundColor = 'red'
            localStorage.setItem(LOCALSTORAGE_KEY_HIGHSCORE,JSON.stringify(new HighScore(this.name,this.score)));
        }
    }

    this.checkHealth = function() {
        if(this.health <= 0) {
            this.ui.healthEl.style.color = 'red';
            this.die();
        }
    }

    this.die = function() {
        this.space.end();
        this.space.trackNames = ['funeral']
        this.space.playMusic('funeral');
        // this.space.dynamicMusic.stop();
        this.ui.oldPlayerNameEl.innerText = name;
        this.ui.gameOverEl.show();
    }

}