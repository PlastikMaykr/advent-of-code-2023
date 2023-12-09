const fs = require('node:fs');

const data = fs.readFileSync('input.txt', 'utf8');

const dataArr = data
    .split('\r\n\r\n');
// console.log(dataArr);

const dirs = dataArr[0].split('');
// console.log(dirs);

const maps = dataArr[1].split('\r\n');
// console.log(maps);

const nodes = {};
for (let line of maps) {
    // console.log(line);
    const reg = /(\w{3})/g;
    // console.log(line.match(reg));
    const [node, L, R] = line.match(reg);
    nodes[node] = { L, R };
}
// console.log(nodes);

let steps = 0;
let pins = Object.keys(nodes).filter(n => n.endsWith('A'));
console.log(pins);
pins.every(n => n.endsWith('Z'));
pins.endWithZ = function() {
    return this.every(n => n.endsWith('Z'));
}

while (!pins.endWithZ()) {
    // while (steps < 10) {
    const index = steps % dirs.length;
    const dir = dirs[index];
    // console.log(index);
    
    for (let i = 0; i < pins.length; i++) {
        const pin = pins[i];
        pins[i] = nodes[pin][dir];
    }
    console.log(pins);

    steps++;
}
console.log(steps);
