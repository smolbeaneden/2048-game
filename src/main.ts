import _ from 'lodash';
import './style.css'

type Board = Array<Array<number | null>>;

interface Point {
    x: number;
    y: number;
}

let score = 0;
class Controller {
    board: Board;
    boardSize: number;
    scoreElement: HTMLElement;
    showElement: HTMLElement;
    boardPositions: Array<Point> =[];


    constructor() {
        this.showElement = <HTMLElement>document.getElementById("show");
        this.scoreElement = <HTMLElement>document.getElementById("score");
        this.boardSize = 3;
        this.board = [];
        this.getDirection();

        for (let i = 0; i <= this.boardSize; i++) {
            this.board[i] = [];
            for (let j = 0; j <= this.boardSize; j++) {
                this.board[i][j] = null;
            }
        }
        console.log(this.board);
    }

    getRandomEmptyPosition(): Point {
        let maxTries = 1000;
        while (maxTries > 0) {
            let x = _.random(this.boardSize);
            let y = _.random(this.boardSize);
            if (this.board[x][y] == null) {
                return {x, y};
            }
            maxTries -= 1;
        }
        alert('Game over!');
        return {x: 0, y: 0};
    }

    show() {
        let cellDivs = "";
        let animate = document.getElementById("cell");

        for (let i = 0; i <= this.boardSize; i++) {
            for (let j = 0; j <= this.boardSize; j++) {
                let cell = document.getElementById("position");
                let x = 5;
                let y = 5;
                cell.style.left = (y + j*5).toString() + 'px' ;
                cell.style.top = (x + i*5).toString() + 'px';
                if (this.board[i][j] == null) {
                    cellDivs += `<div id='cell' id="position" style='background-color:${getColor(this.board[i][j])};'>${this.board[i][j] ?? ''}</div>`;
                }
                else{
                    cellDivs += `<div  id='cell' id ="position" style='background-color:${getColor(this.board[i][j])};'>${this.board[i][j] ?? ''}</div>`;


                }
            }
        }
        this.showElement.innerHTML = cellDivs;
        this.scoreElement.innerHTML = ("Score: " + score.toString());
    }


    getDirection(): void {
        document.onkeydown = (event) => {
            switch (event.key) {
                case "ArrowLeft": // j=0 go through i's
                    this.goThroughBlocks(0, 0, this.boardSize, this.boardSize, "left");
                    this.createPoint();
                    break;
                case "ArrowRight": // j=0 go through i's
                    this.goThroughBlocks(0 ,this.boardSize, this.boardSize, 0, "right");
                    this.createPoint();
                    break;
                case "ArrowUp": // i=0 go through j's
                    this.goThroughBlocks(0, 0, this.boardSize, this.boardSize, "up");
                    this.createPoint();
                    break;
                case "ArrowDown": // i=3 go through j's
                    this.goThroughBlocks(this.boardSize, 0, 0, this.boardSize, "down");
                    this.createPoint();
                    break;
            }
        }
    }

    goThroughBlocks(i: number, j: number, top_i: number, top_j: number, kind: "up" | "down" | "left" | "right"): void { //i: x values, j: y values
        console.log([i, j, top_i, top_j, kind]);
        let top_x: number = top_i;
        let top_y: number = top_j;

        let row: Array<number> = [];
        if (kind == "left") {
            for (let x: number = i; x <= top_x; x++) {
                for (let y: number = j; y <= top_y; y++) {
                    let point: number | null = this.board[x][y];
                    if (point !== null) {
                        this.boardPositions.push({x: x, y: y});
                        row.push(point);
                    }
                }
                console.log(row);
                this.setRowColumn(x, this.moveBlocks(row), "horizontal");
                row = [];
            }

        }

        if (kind == "right") {
            for (let x = i ; x <= top_x; x++) {
                for (let y = j; y >= top_y; y--) {
                    let point : number | null  = this.board[x][y];
                    if (point !== null) {
                        this.boardPositions.push({x: x, y: y});
                        row.push(point);
                    }
                }
                this.setRowColumn(x, (this.moveBlocks(row)).reverse(), "horizontal");
                row = [];
            }
        }
        if (kind == "up") {
            for (let y = j; y <= top_y; y++) {
                for (let x = i; x <= top_x; x++) {
                    let point : number | null = this.board[x][y];
                    if (point !== null) {
                        this.boardPositions.push({x: x, y: y});
                        row.push(point);
                    }
                }
                this.setRowColumn(y, (this.moveBlocks(row)), "vertical");
                row = [];
            }
        }
        if (kind == "down") {
            for (let y = j; y <= top_y; y++) {
                for (let x = i; x >= top_x; x--) {
                    let point: number | null = this.board[x][y];
                    if (point !== null) {
                        this.boardPositions.push({x: x, y: y});
                        row.push(point);
                    }
                }
                this.setRowColumn(y, (this.moveBlocks(row)).reverse(), "vertical");
                row = [];
            }
        }
    }

    moveBlocks(row: Array<number>): Array<number | null> {
        let rowColumn: Array< number | null>;
        rowColumn = [];
        switch (row.length) {
            case 0:
                rowColumn= [null, null, null, null];
                return rowColumn;
            case 1:
                rowColumn = [row[0], null, null, null];
                return rowColumn;
            case 2:
                if (row[0] == row[1]) {
                    score = score + 2 * row[0];
                    rowColumn = [2 * row[0], null, null, null];
                } else {
                    rowColumn = [row[0], row[1], null, null];
                }
                return rowColumn;
            case 3:
                if (row[0] == row[1]) {
                    score = score + 2 * row[0];
                    rowColumn = [2 * row[0], row[2], null, null];

                } else if (row[1] == row[2]) {
                    score = score + 2 * row[1];
                    rowColumn = [row[0], 2 * row[1], null, null];
                } else {
                    rowColumn = [row[0], row[1], row[2], null];
                }
                return rowColumn;

            case 4:
                if (row[0] == row[1]) {
                    score = score + 2 * row[0];
                    if (row[2] == row[3]) {
                        score = score + 2 * row[2];
                        rowColumn = [2 * row[0], 2 * row[2], null, null];
                    } else {
                        rowColumn = [2 * row[0], row[2], row[3], null];
                    }
                } else if (row[1] == row[2]) {
                    score = score + 2 * row[1];
                    rowColumn = [row[0], 2 * row[1], row[3], null];
                } else if (row[2] == row[3]) {
                    score = score + 2 * row[2];
                    rowColumn = [row[0], row[1], 2 * row[2], null];
                }
                else{
                    rowColumn = row;
                }
                return rowColumn;


        }

        throw new Error;

    }


    setRowColumn(xORy: number, rowOrColumn: Array<number | null>, type: "vertical" | "horizontal"): void {

        if (type == "horizontal") {
            for (let i = 0; i <= this.boardSize; i++) {
                this.board[xORy][i] = rowOrColumn[i];
                this.boardPositions.push({x: xORy, y: i});
            }
        }
        if (type == "vertical") {
            for (let i = 0; i <= this.boardSize; i++) {
                this.board[i][xORy] = rowOrColumn[i];
                this.boardPositions.push({x: i, y: xORy});

            }
        }

    }

    createPoint(value: number | null = null): number {
        const point = this.getRandomEmptyPosition();
        const pointValue = value ?? _.sample([2, 2, 2, 2, 4]);

        this.board[point.x][point.y] = pointValue
        console.log('showing',)
        this.show()

        return pointValue
    }
}



function start() {
    score = 0;
    let controller = new Controller;

    controller.createPoint(2)
}

document.getElementById("newGame")?.addEventListener("click", start);
start();


function getColor(number: number | null): string {
    if (number == null) {
        return "#D7ecc1";
    }

    const values: Record<number, string> = {
        2: "#bedbb8",
        4: "#99b194",
        8: "#afd5dd",
        16: "#84acb3",
        32: "#a0a3c6",
        64: "#a486e1",
        128: "#cccf63",
        256: "#bd7987",
        512: "#45afb0",
        1024: "#ffc71c",
        2048: "#65bf69",
        4096: "#fe0c27"
    }
    return values[number] ?? "#2e2e2e";
}