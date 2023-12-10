const fs = require('node:fs');

const data = fs.readFileSync('input.txt', 'utf8');

const dataArr = data
    .split('\r\n');
// console.log(dataArr);

const report = dataArr//[0]
    .map(line => line.split(' ')
        .map(n => parseInt(n))
    );
// console.log(report);

const sequences = [];
for (let i = 0; i < report.length; i++) {
    const history = [report[i]];
    // const layers = [];
    let seq = [null];
    while (!seq.every(n => n === 0)) {
        seq = [];
        for (let i = 1; i < history.at(-1).length; i++) {
            const diff = history.at(-1)[i] - history.at(-1)[i - 1];
            seq.push(diff);
        }
        history.push(seq);
        // console.log({ history, seq });
    }
    sequences.push(history);
}
console.log(sequences);

const predictions = [];
for (let i = 0; i < sequences.length; i++) {
    const history = sequences[i];
    console.log({history});
    for (let j = history.length - 1; j >= 0; j--) {
        // const next = history[j + 1] ? history[j + 1].at(-1) : 0;
        const next = history[j + 1] || history[j]
        const nextFirst = next[0];
        const thisFirst = history[j][0];
        console.log({j, thisFirst, nextFirst});
        history[j].unshift(thisFirst - nextFirst);
    }
    predictions.push(history[0][0]);
}
// console.log(predictions);
const predictSum = predictions.reduce((sum, predict) => sum + predict);
console.log({predictions, predictSum});
