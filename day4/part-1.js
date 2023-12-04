const fs = require('node:fs');

const data = fs.readFileSync('input.txt', 'utf8');
const dataArr =
    data.split('\r\n').map(d => d + '.');
    // [
    //     'Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53',
    //     'Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19',
    //     'Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1',
    //     'Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83',
    //     'Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36',
    //     'Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11',
    // ];
// console.log(dataArr);

let totalPoints = 0, pointsArr = [];
dataArr.forEach(card => {
    const [id, win, own] = parseCard(card);
    // console.log(id, win, own);
    let winCount = 0;
    for (let w = 0; w < win.length; w++) {
        for (let o = 0; o < own.length; o++) {
            if (win[w] === own[o]) {
                winCount++;
            }
        }
    }
    const points = Math.floor(Math.pow(2, winCount - 1));
    totalPoints += points;
    pointsArr.push(points);
});

function parseCard(card) {
    let [id, win, own] = card.split(/:|\|/);
    id = id.replace('Card ', '');
    win = win.trim().split(/\s\s|\s/).map(n => parseInt(n));
    own = own.trim().split(/\s\s|\s/).map(n => parseInt(n));
    // console.log(id)
    // console.log(win)
    // console.log(own)
    return [id, win, own];
}

console.log(pointsArr);
console.log(totalPoints);
