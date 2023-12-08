const fs = require('node:fs');

const data = fs.readFileSync('input.txt', 'utf8');

const dataArr = data
    .split('\r\n')
    .map(line => line
        .replace(/\w+:\s+/, '')
        .split(/\s+/g)
        .map(n => parseInt(n)));
console.log(dataArr);

let races = [];
for (let i = 0; i < dataArr[0].length; i++) {
    const race ={
        time: dataArr[0][i],
        record: dataArr[1][i]
    }
    races.push(race);
}
console.log({ races });

let wins = [];
for (let i = 0; i < races.length; i++) {
    const { time, record } = races[i];
    let winCounter = 0;
    for (let hold = 1; hold < time - 1; hold++) {
        const move = time - hold;
        const distance = hold * move;
        console.log({ distance, record });
        if (distance > record) winCounter++
    }
    wins.push(winCounter);
}
// console.log({ wins });

const margin = wins.reduce((acc, cur) => acc * cur);
// console.log(margin);
console.log({ wins, margin });
