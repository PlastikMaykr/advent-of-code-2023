const fs = require('node:fs');

const data = fs.readFileSync('input.txt', 'utf8');
const dataArr = data
    .split('\r\n')
// .map(d => d.split(''));
// console.log(dataArr);
// console.log('');
// dataArr.forEach(line => console.log(line));

const rotated = rotatePatternRight(dataArr)
    .map(line => line + '#');
// console.log('');
// console.log('rotated');
// rotated.forEach(line => console.log(line));

const groupsReg = /([\.O]*)[#]/gd;
// console.log(groupsReg.toString());

const rotilted = rotated.map(line => tiltLine(line));
// console.log('');
// console.log('rotilted');
// rotilted.forEach(line => console.log(line));

const tilted = rotatePatternLeft(rotilted.map(line => line.slice(0, -1)));
console.log('');
console.log('tilted');
tilted.forEach(line => console.log(line));

const linesCount = tilted.length;
let totalLoad = 0;
for (let i = 0; i < linesCount; i++) {
    const line = tilted[i];
    const rockCount = countRounded(tilted[i]);
    const multiplier = linesCount - i;
    const load = rockCount * multiplier;
    totalLoad += load;
}

console.log({totalLoad});


function tiltLine(line) {
    const tilted = line.replaceAll(groupsReg, rockSlide);
    return tilted;
}

function rockSlide(group, lane, index, line) { // group, lane, index, line
    const laneLen = lane.length;
    const rockCount = countRounded(lane);
    const freeCount = laneLen - rockCount;
    const tilted = '.'.repeat(freeCount) + 'O'.repeat(rockCount) + '#';
    // console.log({lane,laneLen,rockCount, freeCount,tilted});
    return tilted;
}

function countRounded(lane) {
    return lane.split('').filter(char => char === 'O').length;
}

function rotatePatternRight(pattern) {
    // if (i !== 0) break;
    const rowsCount = pattern.length;
    const colsCount = pattern[0].length;
    // console.log({ rowsCount, colsCount });
    let rotated = [...Array(colsCount)].map(d => Array(rowsCount));
    for (let y = rowsCount - 1; y >= 0; y--) {
        for (let x = 0; x < colsCount; x++) {
            // if (y === rowsCount - 1) {
            //     // console.log(unrotated[y][x]);
            //     rotated[x] = Array(rowsCount);
            // }
            // console.log({rowsCount, y, colsCount,x,og:pattern[y][x]});
            rotated[x][rowsCount - 1 - y] = pattern[y][x];
        }
    }
    return rotated.map(d => d.join(''));
}

function rotatePatternLeft(pattern) {
    console.log( pattern[0][0] );
    const rowsCount = pattern.length;
    const colsCount = pattern[0].length;
    // console.log({ rowsCount, colsCount });
    let rotated = [...Array(colsCount)].map(d => Array(rowsCount));
    for (let y = rowsCount - 1; y >= 0; y--) {
        for (let x = 0; x < colsCount; x++) {
            rotated[colsCount - 1 - x][y] = pattern[y][x];
        }
    }
    return rotated.map(d => d.join(''));
}
