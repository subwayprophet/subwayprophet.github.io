export function Player(name) {
    this.name = name;
    this.score = 0;

    this.health = 1000;

    this.scoreEl;
    this.setScoreEl = function(el) {
        this.scoreEl = el;
    }
    this.healthEl;
    this.setHealthEl = function(el) {
        this.healthEl = el;
    }

    this.update = function() {
        let p = this;
        p.scoreEl.innerText = p.score;
        p.healthEl.innerText = p.health;
        window.requestAnimationFrame(function() {
            p.update();
        })
    }

}