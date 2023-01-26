import ConnectFour from "./ConnectFour.js";
import CellState from "./CellState.js";
import MinimaxPlayer from "./MinimaxPlayer.js";

class Test {
    test1() {
        let c = new ConnectFour();
        let m;
        c.move(0);
        c.move(1);
        c.move(2);
        c.move(1);
        c.move(3);
        c.move(3);
        c.move(2);
        c.move(4);
        c.move(5);
        c.move(4);
        c.move(4);
        m = c.move(4);
        console.table(c.getBoard());
        console.table(m);
    }
    test2() {
        let board = [
            [CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY],
            [CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY],
            [CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY],
            [CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY],
            [CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY],
            [CellState.EMPTY, CellState.PLAYER1, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY]
        ];
        let c = ConnectFour.createClass(board);
        let mm = MinimaxPlayer.alphabeta(c);
        console.table(mm);
    }
}

let t = new Test();
t.test2();