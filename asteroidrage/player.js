const LOCALSTORAGE_KEY_HIGHSCORE = 'ast_highScore';

export function Player(name) {
    this.name = name;
    this.score = 0;

    this.health = 1000;
    
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

    this.update = function() {
        let p = this;
        p.scoreEl.innerText = p.score;
        p.healthEl.innerText = p.health;
        p.highScoreEl.innerText = p.highScore;
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

}