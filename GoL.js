import { Cell } from './Cell.js'
import { canvas } from './canvas.js'
import { getRandomIntInclusive } from './canvas.js'

export class Game {
    constructor(rows, cols, density, tickInterval) {
        this.grid = this.createGrid(rows, cols, density)
        this.cols = cols;
        this.rows = rows;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.getBoundingClientRect().width;
        this.height = canvas.getBoundingClientRect().height;
        this.density = density;
        this.tickInterval = tickInterval;
    }

    test() {
        let input = document.getElementById('testInput');
        let value = input.value;
        let asArr = value.split(',');
        let x = asArr[0];
        let y = asArr[1];
        this.grid[x][y].becomeAlive();
        this.grid[x][y].paint();
    }

    //dump some new life in randomly!
    invadeRandomly() {
        let startingX = getRandomIntInclusive(0,(this.cols));
        let startingY = getRandomIntInclusive(0,(this.rows));
        let size = getRandomIntInclusive(0,20);
        for(let x=0; x<size; x++) {
            for(let y=0; y<size; y++) {
                this.grid[startingX+x][startingY+y].becomeAlive();
            }
        }
    }

    start() {
        let g = this;
        setInterval(function () {
            if (!g.paused) {
                g.tick();
            }
        }, g.tickInterval)
        g.paused = false;
    }

    pause() {
        this.paused = !this.paused;
    }

    tick() {
        let g = this;
        g.ctx.clearRect(0, 0, g.width, g.height);
        //FIRST evaluate all
        g.grid.forEach(col => {
            col.forEach(cell => {
                cell.tick();
            });
        });
        //THEN run catchup
        g.grid.forEach(col => {
            col.forEach(cell => {
                cell.catchUp();
            });
        });
    }

    createGrid(rows, cols, density) {
        let grid = [];
        for (let x = 0; x < cols; x++) {
            grid[x] = [];
            for (let y = 0; y < rows; y++) {
                let alive = Math.random() > density ? true : false;
                grid[x][y] = new Cell(x, y, grid, alive);
            }
        }
        return grid;
    }

    get countAlive() {
        let allCount = this.grid.reduce((allTotal, col) => {
            let countCol = col.reduce((total, row) => {
                return total + row.alive;
            }, 0);
            return allTotal + countCol;
        }, 0);
        return allCount;
    }
}


//todo: recursify? 
function reduceTwice() {
    let zoople = [[1, 2, 3], 4, 5].reduce((a, b) => {
        debugger
        if (Array.isArray(a)) { return a.reduce((x, y) => { return x + y }) + b; }
        else return a + b;
    }); return zoople;
}