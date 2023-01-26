import ConnectFour from "./ConnectFour.js";
import MinimaxPlayer from "./MinimaxPlayer.js";

class GUI {
    constructor() {
        this.game = null;
        this.sizes = [{ cols: 5, rows: 4 }, { cols: 6, rows: 5 }, { cols: 7, rows: 6 }, { cols: 8, rows: 7 }, { cols: 9, rows: 7 }, { cols: 10, rows: 7 }, { cols: 8, rows: 8 }];
    }
    play(evt) {
        let td = evt.currentTarget;
        let col = td.cellIndex;
        this.innerPlay(col);
        setTimeout(() => {
            let obj = MinimaxPlayer.alphabeta(this.game);
            this.innerPlay(obj.columnMove);
        }, 2000);
    }
    innerPlay(col) {
        let turn = this.game.getTurn();
        let { winner, lastRow } = this.game.move(col);
        let tbody = document.querySelector("tbody");
        let first = tbody.rows[0].cells[col];
        let image = document.createElement("img");
        image.src = `images/${turn}.svg`;
        first.appendChild(image);
        let td = document.querySelector("td");
        let size = td.offsetHeight + 10; // Including border spacing
        let anim = image.animate([{ top: 0 }, { top: `${lastRow * size}px` }], 1000);
        anim.onfinish = () => {
            let cell = tbody.rows[lastRow].cells[col];
            cell.appendChild(image);
            cell.className = turn;
        };
        this.changeMessage(winner);
    }
    setMessage(message) {
        let msg = document.getElementById("message");
        msg.textContent = message;
    }
    changeMessage(m) {
        let objs = { DRAW: "Draw!", PLAYER2: "Yellow's win!", PLAYER1: "Red's win!" };
        if (objs[m]) {
            this.setMessage(`Game Over! ${objs[m]}`);
        } else {
            let msgs = { PLAYER1: "Red's turn.", PLAYER2: "Yellow's turn." };
            this.setMessage(msgs[this.game.getTurn()]);
        }
    }
    createTable() {
        let index = document.querySelector("select").selectedIndex;
        this.game = new ConnectFour(this.sizes[index].rows, this.sizes[index].cols);
        let board = this.game.getBoard();
        let tbody = document.querySelector("tbody");
        tbody.innerHTML = "";
        for (let i = 0; i < board.length; i++) {
            let tr = document.createElement("tr");
            tbody.appendChild(tr);
            for (let j = 0; j < board[i].length; j++) {
                let td = document.createElement("td");
                td.onclick = this.play.bind(this);
                tr.appendChild(td);
            }
        }
        this.changeMessage();
    }
    registerEvents() {
        let select = document.querySelector("select");
        for (let { rows, cols } of this.sizes) {
            let opt = document.createElement("option");
            opt.text = `${rows} rows x ${cols} columns`;
            select.add(opt);
        }
        select.selectedIndex = 2;
        select.onchange = this.createTable.bind(this);
        let button = document.querySelector("button");
        button.onclick = this.createTable.bind(this);
        this.createTable();
    }
}
let gui = new GUI();
gui.registerEvents();
