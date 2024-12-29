import _ from 'lodash';
import './style.css';

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
    randomPoint: Point;


    constructor() {
        this.showElement = <HTMLElement>document.getElementById("show");
        this.scoreElement = <HTMLElement>document.getElementById("score");
        this.boardSize = 3;
        this.board = [];
        this.getDirection();
        this.randomPoint = {x: 0, y: 0};

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
        return {x:0, y:0};
    }

    show() {
        let cellDivs = "";

        for (let i = 0; i <= this.boardSize; i++) {
            for (let j = 0; j <= this.boardSize; j++) {
                if (i == this.randomPoint.x && j == this.randomPoint.y) {
                    cellDivs += `<div id='newCell'   style=' background-color:${getColor(this.board[i][j])};'>${this.board[i][j] ?? ''}</div>`;
                    console.log("yes",);
                }
                else{
                    cellDivs += `<div id='cell' style=' background-color:${getColor(this.board[i][j])};'>${this.board[i][j] ?? ''}</div>`;
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
        let top_x: number = top_i; //save the number we loop through
        let top_y: number = top_j;

        let row: Array<number> = [];
        if (kind == "left") {
            for (let x: number = i; x <= top_x; x++) {
                for (let y: number = j; y <= top_y; y++) {
                    let point: number | null = this.board[x][y];
                    if (point !== null) {
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
                        row.push(point);
                    }
                }
                this.setRowColumn(y, (this.moveBlocks(row)).reverse(), "vertical");
                row = [];
            }
        }
    }

    moveBlocks(row: Array<number >): Array<number | null> {
        let rowColumn: Array< number | null> = row;
        rowColumn.push(null, null, null, null);
        if (row[0] == row[1] && row[0] !== null){
            rowColumn = [2*row[0], row[2], row[3], null];
            score = score + 2 * row[0];
            if(row[2] == row[3] && row[2] !== null){
                rowColumn = [2*row[0], 2*row[2], null, null];
                score = score + 2 * row[2];
            }
        }
        else if(row[1] == row[2] && row[1] !== null){
            rowColumn = [row[0], 2*row[1], row[3], null];
            score = score + 2 * row[1];
        }
        else if(row[2] == row[3] && row[2] !== null){
            rowColumn = [row[0], row[1], 2*row[2], null];
            score = score + 2 * row[2];
        }
        else{
            rowColumn = [row[0], row[1], row[2], row[3]];
        }
        return rowColumn;
    }

    setRowColumn(xORy: number, rowOrColumn: Array<number | null>, type: "vertical" | "horizontal"): void {

        if (type == "horizontal") {
            for (let i = 0; i <= this.boardSize; i++) {
                this.board[xORy][i] = rowOrColumn[i];
            }
        }
        if (type == "vertical") {
            for (let i = 0; i <= this.boardSize; i++) {
                this.board[i][xORy] = rowOrColumn[i];
            }
        }
    }

    createPoint(value: number | null = null): number {
        this.randomPoint = this.getRandomEmptyPosition();
        const pointValue = value ?? _.sample([2, 2, 2, 2, 4]);

        this.board[this.randomPoint.x][this.randomPoint.y] = pointValue;
        console.log('showing',);
        this.show();

        return pointValue;
    }
}

function start() {
    score = 0;
    let controller = new Controller;

    controller.createPoint(2);
}

document.getElementById("newGame")?.addEventListener("click", start);
start();

function getColor(number: number | null): string {
    if (number == null) {
        return "#bacdb5";
    }

    const values: Record<number, string> = {
        2: "#bfddb9",
        4: "#99b194",
        8: "#afd5dd",
        16: "#84acb3",
        32: "#a0a3c6",
        64: "#dfae81",
        128: "#cccf8a",
        256: "#bd7987",
        512: "#45afb0",
        1024: "#ffc71c",
        2048: "#65bf69",
        4096: "#fe0c27"
    }
    return values[number] ?? "#2e2e2e";
}