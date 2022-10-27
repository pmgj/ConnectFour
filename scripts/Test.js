import ConnectFour from "./ConnectFour.js";

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
