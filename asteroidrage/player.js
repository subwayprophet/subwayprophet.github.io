const LOCALSTORAGE_KEY_HIGHSCORE = 'ast_highScore';

class UI {
    scoreEl;
    setScoreEl = function(el) {
        this.scoreEl = el;
    }
    healthEl;
    setHealthEl = function(el) {
        this.healthEl = el;
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

    this.health = 1000;
    this.power = 0; //init; ship should reset this on tick
    this.maxPower = 100; //default, but ship should set this on ship init
    
    this.highScore;
    
    this.ui = new UI();

    this.update = function() {
        let p = this;
        p.ui.scoreEl.innerText = p.score;
        p.ui.healthEl.innerText = p.health;
        p.ui.highScoreNameEl.innerText = p.highScoreName;
        p.ui.highScoreEl.innerText = p.highScore;
        p.ui.renderPower(this.power,this.maxPower);
        p.checkHighScore();
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




}