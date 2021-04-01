import { canvas } from './canvas.js'

export class Cell {
    constructor(x,y,grid) {
        //for logic
        this.x = x;
        this.y = y;    
        this.alive = Math.random() > 0.8 ? true : false;
        //this.alive = false;
        this.newAlive = this.alive;
        this.grid = grid;

        //for painting
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.canvasWidth = canvas.getBoundingClientRect().width;
        this.canvasHeight = canvas.getBoundingClientRect().height;
    }

    live() {
        this.alive = true;
    }
    die() {
        this.alive = false;
    }

    becomeAlive() {
        this.newAlive = true;
    }
    becomeDead() {
        this.newAlive = false;
    }

    catchUp() {
        this.alive = this.newAlive;
        if(this.alive) {
            this.paint();
        }
    }

    //this is too dynamic. each cell tick may update the cell state. then the next cell will evaluate based on the new state of other cells
    //but we want to evaluate state for tick t only based on the state of all cells for tick t-1.
    tick() {
        let c = this;
        let neighborsAlive = 0;
        let neighbors = c.neighbors; //don't keep running the getter
        neighbors.forEach(neighbor => {
            if(neighbor.alive) neighborsAlive++;
        })

        //the actual conway rules!
        if(this.alive && neighborsAlive < 2) this.becomeDead();
        if(this.alive && (neighborsAlive === 2 || neighborsAlive === 3)) this.becomeAlive();
        if(this.alive && neighborsAlive > 3) this.becomeDead();
        if(!this.alive && neighborsAlive === 3) this.becomeAlive();
    }

    paintIfAlive() {
        if(this.alive) this.paint();
    }
    paint() {
        //console.log('PAINTING')
        let ctx = this.ctx;
        let x = this.x;
        let y = this.y;
        let width = this.canvasWidth / this.grid.length;
        let height = this.canvasWidth / this.grid[0].length;
        let xPos = x * width;
        let yPos = y * height;
        let borderThickness = 2;
        ctx.beginPath();
        ctx.rect(xPos,yPos,width,height);
        ctx.strokeStyle = 'black';
        ctx.stroke();
        // ctx.beginPath();
        // ctx.rect(xPos+borderThickness,yPos+borderThickness,xPos+width-(borderThickness*2),yPos+height-(borderThickness*2));
        // ctx.fillStyle = 'green';
        // ctx.fill();
        // ctx.fillStyle = 'red';
        // ctx.fillText(x+','+y,xPos,yPos);
        
    }

    get neighbors() {
        let c = this;
        let grid = c.grid;
        let gridLastColIndex = grid.length - 1;
        let gridLastRowIndex = grid[0].length - 1;
        let x = c.x; //local variables are faster?
        let y = c.y;
        let neighbors = [];

        if(x > 0) {
            neighbors.push(grid[x-1][y]);
        }
        if(x > 0 && y < gridLastRowIndex) {
            neighbors.push(grid[x-1][y+1]);
        }
        if(y < gridLastRowIndex) {
            neighbors.push(grid[x][y+1]);
        }
        if(x < gridLastColIndex && y < gridLastRowIndex) {
            neighbors.push(grid[x+1][y+1])
        };
        if(x < gridLastColIndex) {
            neighbors.push(grid[x+1][y])
        };
        if(x < gridLastColIndex && y > 0) {
            neighbors.push(grid[x+1][y-1])
        };
        if(y > 0) {
            neighbors.push(grid[x][y-1])
        };
        if(x > 0 && y > 0) {
            neighbors.push(grid[x-1][y-1])
        };

        return neighbors;
    }

}