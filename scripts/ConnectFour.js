import Player from "./Player.js";
import Winner from "./Winner.js";
import CellState from "./CellState.js";
import Cell from "./Cell.js";

export default class ConnectFour {
    constructor(rows = 6, cols = 7, qtt = 4, board = Array(rows).fill().map(() => Array(cols).fill(CellState.EMPTY))) {
        this.rows = rows;
        this.cols = cols;
        this.qtt = qtt;
        this.board = board;
        this.turn = Player.PLAYER1;
    }
    getBoard() {
        return this.board;
    }
    getTurn() {
        return this.turn;
    }
    move(column) {
        if (this.board[0][column] !== CellState.EMPTY) {
            throw new Error("This column is full.");
        }
        if (column < 0 || column > this.cols - 1) {
            throw new Error("This column is not in the board.");
        }
        let r;
        for (r = 0; r < this.rows && this.board[r][column] === CellState.EMPTY; r++)
            ;
        this.board[r - 1][column] = this.turn === Player.PLAYER1 ? CellState.PLAYER1 : CellState.PLAYER2;
        this.turn = this.turn === Player.PLAYER1 ? CellState.PLAYER2 : CellState.PLAYER1;
        let obj = this.endOfGame();
        obj.lastRow = r - 1;
        return obj;
    }
    onBoard({ x, y }) {
        let inLimit = (value, limit) => value >= 0 && value < limit;
        return (inLimit(x, this.rows) && inLimit(y, this.cols));
    }
    endOfGame(matrix = this.board) {
        let check = (i, j) => {
            let piece = matrix[i][j];
            if (piece === CellState.EMPTY) {
                return false;
            }
            let cells = [{ x: -1, y: -1 }, { x: -1, y: 0 }, { x: -1, y: 1 }, { x: 0, y: -1 }, { x: 0, y: 1 }, { x: 1, y: -1 }, { x: 1, y: 0 }, { x: 1, y: 1 }];
            for (let { x, y } of cells) {
                let sequence = [new Cell(i, j)];
                for (let k = 1; ; k++) {
                    let row = i + k * x, col = j + k * y;
                    let cell = new Cell(row, col)
                    if (!this.onBoard(cell)) {
                        break;
                    }
                    if (piece !== matrix[row][col]) {
                        break;
                    }
                    sequence.push(cell);
                    if (sequence.length === this.qtt) {
                        return sequence;
                    }
                }
            }
            return false;
        };
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                let sequence = check(i, j);
                if (sequence) {
                    return { sequence: sequence, winner: matrix[i][j] === CellState.PLAYER1 ? Winner.PLAYER1 : Winner.PLAYER2 };
                }
            }
        }
        return { sequence: null, winner: Winner.NONE };
    }
    placeMove(player, columnMove, newBoard) {
        let temp = newBoard ? new ConnectFour(this.rows, this.cols, this.qtt, this.board) : this;
        for (let i = this.rows - 1; i >= 0; i--) {
            if (temp.board[i][columnMove] === CellState.EMPTY) {
                temp.board[i][columnMove] = player;
                return temp;
            }
        }
        return false;
    }
}
