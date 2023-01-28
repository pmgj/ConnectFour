import Player from "./Player.js";
import Winner from "./Winner.js";
import CellState from "./CellState.js";
import Cell from "./Cell.js";
import Config from "./Config.js";

export default class ConnectFour {
    constructor(rows = 6, cols = 7, qtt = 4) {
        this.rows = rows;
        this.cols = cols;
        this.qtt = qtt;
        this.board = Array(rows).fill().map(() => Array(cols).fill(CellState.EMPTY));
        this.turn = Player.PLAYER1;
        this.winner = Winner.NONE;
    }
    static createClass(board, qtt = 4) {
        let cf = new ConnectFour(board.length, board[0].length, qtt);
        cf.board = JSON.parse(JSON.stringify(board));
        return cf;
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
        if (this.winner !== Winner.NONE) {
            throw new Error("This game has already finished.");
        }
        let r;
        for (r = 0; r < this.rows && this.board[r][column] === CellState.EMPTY; r++)
            ;
        this.board[r - 1][column] = this.turn === Player.PLAYER1 ? CellState.PLAYER1 : CellState.PLAYER2;
        this.turn = this.turn === Player.PLAYER1 ? Player.PLAYER2 : Player.PLAYER1;
        let obj = this.endOfGame();
        this.winner = obj.winner;
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
        if (matrix[0].every(v => v !== CellState.EMPTY)) {
            return { sequence: null, winner: Winner.DRAW };
        }
        return { sequence: null, winner: Winner.NONE };
    }
    placeMove(player, columnMove) {
        let temp = ConnectFour.createClass(this.board);
        for (let i = this.rows - 1; i >= 0; i--) {
            if (temp.board[i][columnMove] === CellState.EMPTY) {
                temp.board[i][columnMove] = player;
                return temp;
            }
        }
        return false;
    }
    getScore() {
        let score = 0;
        let updateScore = (HumanInRow, ComputerInRow) => {
            let points = 0;
            switch (HumanInRow) {
                case 4:
                    points += Config.WINNING_SCORE;
                    break;
                case 3:
                    points += 5;
                    break;
                case 2:
                    points += 1;
                    break;
                default:
                    break;
            }
            switch (ComputerInRow) {
                case 4:
                    points -= Config.WINNING_SCORE;
                    break;
                case 3:
                    points -= 5;
                    break;
                case 2:
                    points -= 1;
                    break;
                default:
                    break;
            }
            return points;
        }
        //Check ROWS
        for (let row = 0; row < this.rows; row++) {
            for (let column = 0; column <= this.cols - 4; column++) {
                let HumanInRow = 0, ComputerInRow = 0;
                for (let offset = column; offset < column + 4; offset++) {
                    if (this.board[row][offset] == CellState.PLAYER1) {
                        HumanInRow++;
                        ComputerInRow = 0;
                    } else if (this.board[row][offset] == CellState.PLAYER2) {
                        ComputerInRow++;
                        HumanInRow = 0;
                    }
                }
                score += updateScore(HumanInRow, ComputerInRow);
                if (score <= -Config.WINNING_SCORE || score >= Config.WINNING_SCORE) return score;
            }
        }
        //Check COLUMNS
        for (let column = 0; column < this.cols; column++) {
            for (let row = 0; row <= this.rows - 4; row++) {
                let HumanInRow = 0, ComputerInRow = 0;
                for (let offset = row; offset < row + 4; offset++) {
                    if (this.board[offset][column] == CellState.PLAYER1) {
                        HumanInRow++;
                        ComputerInRow = 0;
                    } else if (this.board[offset][column] == CellState.PLAYER2) {
                        ComputerInRow++;
                        HumanInRow = 0;
                    }
                }
                score += updateScore(HumanInRow, ComputerInRow);
                if (score <= -Config.WINNING_SCORE || score >= Config.WINNING_SCORE) return score;
            }
        }
        //Check DIAGONALS
        for (let column = 0; column <= this.cols - 4; column++) {
            for (let row = 0; row <= this.rows - 4; row++) {
                let HumanInRow = 0, ComputerInRow = 0;
                for (let offset = row; offset < row + 4; offset++) {
                    if (this.board[offset][(offset - row) + column] == CellState.PLAYER1) {
                        HumanInRow++;
                        ComputerInRow = 0;
                    } else if (this.board[offset][(offset - row) + column] == CellState.PLAYER2) {
                        ComputerInRow++;
                        HumanInRow = 0;
                    }
                }
                score += updateScore(HumanInRow, ComputerInRow);
                if (score <= -Config.WINNING_SCORE || score >= Config.WINNING_SCORE) return score;
            }
        }
        for (let column = this.cols - 1; column >= this.cols - 4; column--) {
            for (let row = 0; row <= this.rows - 4; row++) {
                let HumanInRow = 0, ComputerInRow = 0;
                for (let offset = row; offset < row + 4; offset++) {
                    if (this.board[offset][column - (offset - row)] == CellState.PLAYER1) {
                        HumanInRow++;
                        ComputerInRow = 0;
                    } else if (this.board[offset][column - (offset - row)] == CellState.PLAYER2) {
                        ComputerInRow++;
                        HumanInRow = 0;
                    }
                }
                score += updateScore(HumanInRow, ComputerInRow);
                if (score <= -Config.WINNING_SCORE || score >= Config.WINNING_SCORE) return score;
            }
        }
        return score;
    }
}