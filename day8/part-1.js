const fs = require('node:fs');

const data = fs.readFileSync('input.txt', 'utf8');

const dataArr = data
    .split('\r\n\r\n');
// console.log(dataArr);

const dirs = dataArr[0].split('');
// console.log(dir);

const maps = dataArr[1].split('\r\n');
// console.log(maps);

const nodes = {};
for (let line of maps) {
    const reg = /([A-Z]{3})/g;
    // console.log(line.match(reg));
    const [node, L, R] = line.match(reg);
    nodes[node] = { L, R };
}
console.log(nodes);

let steps = 0;
let pin = 'AAA';
while (pin !== 'ZZZ') {
    // while (steps < 10) {
    const index = steps % dirs.length;
    const dir = dirs[index];
    // console.log(index);

    pin = nodes[pin][dir];
    console.log(pin);

    steps++;
}
console.log(steps);


/* 
let output = '';
for (let i = 0; i < handsSorted.length; i++) {
    const hand = handsSorted[i];
    let line = `${hand.cards.join('')} ${`${hand.bid}`.padEnd(4)} ${hand.type} ${hand.rank}`;

    output += line + '\r\n';
}
// console.log(output)
fs.writeFileSync('output.txt', output);
 */