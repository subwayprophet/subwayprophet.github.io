import {canvas, canvasShip} from './canvas.js';

export function Ship() {
    let ctx = canvasShip.getContext('2d');
    let canvasWidth = canvasShip.getBoundingClientRect().width;
    let canvasHeight = canvasShip.getBoundingClientRect().height;

    this.x0 = canvasWidth/2;
    this.y0 = canvasHeight/2;

    this.x = this.x0;
    this.y = this.y0;

    this.baseWidth = 50;
    this.height = 80;

    this.create = function() {
        this.draw();
        this.addEventListeners();
    }

    this.getCenterX = function() {
        return this.x;
    }
    this.getCenterY = function() {
        return this.y - this.height/2;
    }
    
    this.draw = function() {
        let s = this;
        let xStart = s.x - s.baseWidth/2;
        let yStart = s.y;
        ctx.clearRect(0,0,canvasWidth,canvasHeight);
        ctx.beginPath();
        ctx.moveTo(xStart,yStart);
        ctx.lineTo(s.x, yStart-s.height); //minus means up
        ctx.lineTo(xStart+s.baseWidth, yStart);
        ctx.fillStyle = 'blue';
        ctx.fill();
    }

    this.rotate = function(degrees) {
        ctx.translate(this.getCenterX(),this.getCenterY());
        ctx.rotate(degrees.toRads());
        ctx.translate(this.getCenterX() * -1,this.getCenterY() * -1);
        this.draw();
    }

    this.move = function(distance) {
        this.y += distance;
        this.draw();
    }

    this.addEventListeners = function() {
        let s = this;
        window.addEventListener("keydown", function (event) {
            if (event.defaultPrevented) {
              return; // Do nothing if the event was already processed
            }
          
            switch (event.key) {
              case "Down": // IE/Edge specific value
              case "ArrowDown":
                s.move(5); //y starts at top so y positive is down
              break;
              case "Up": // IE/Edge specific value
              case "ArrowUp":
                s.move(-5);
                break;
              case "Left": // IE/Edge specific value
              case "ArrowLeft":
                // Do something for "left arrow" key press.
                s.rotate(-5);
                break;
              case "Right": // IE/Edge specific value
              case "ArrowRight":
                s.rotate(5);
                break;
              case "Enter":
                //car.accelerateTo(0);
                break;
              case "Esc": // IE/Edge specific value
              case "Escape":
                // Do something for "esc" key press.
                break;
              default:
                return; // Quit when this doesn't handle the key event.
            }
          
            // Cancel the default action to avoid it being handled twice
            event.preventDefault();
          }, true);
    }

}