import CellState from "./CellState.js";
import Config from "./Config.js";

export default class MinimaxPlayer {
    static alphabeta(board, depth = 4, a = -9999999, b = 9999999, maximizingPlayer = false) {
        let currentScore = board.getScore();
        let nodes = [];
        //Check all possible moves
        let player = maximizingPlayer ? CellState.PLAYER1 : CellState.PLAYER2;
        for (let column = 0; column < board.board[0].length; column++) {
            let nextPossibleBoard = board.placeMove(player, column);
            if (nextPossibleBoard) nodes[column] = nextPossibleBoard;
        }
        if (depth === 0 || nodes.length === 0 || currentScore <= -Config.WINNING_SCORE || currentScore >= Config.WINNING_SCORE) {
            return { columnMove: null, score: currentScore };
        }
        if (maximizingPlayer) {
            let v = { columnMove: null, score: -99999 };
            for (let i = 0; i <= nodes.length - 1; i++) {
                if (!nodes[i]) continue;
                let nextmove = this.alphabeta(nodes[i], depth - 1, a, b, false);
                if (nextmove.score > v.score || v.columnMove == null) {
                    v.columnMove = i;
                    v.score = nextmove.score;
                }
                a = a > nextmove.score ? a : nextmove.score;
                if (b <= a) {
                    break; //(* b cut-off *)
                }
            };
            return v;
        } else {
            let v = { columnMove: null, score: 99999 };
            for (let i = 0; i <= nodes.length - 1; i++) {
                if (!nodes[i]) continue;
                let nextmove = this.alphabeta(nodes[i], depth - 1, a, b, true);
                if (nextmove.score < v.score || v.columnMove == null) {
                    v.columnMove = i;
                    v.score = nextmove.score;
                }
                b = b < nextmove.score ? b : nextmove.score;
                if (b <= a) {
                    break; //(* a cut-off *)
                }
            };
            return v;
        }
    }
}