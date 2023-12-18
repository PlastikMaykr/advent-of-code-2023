const fs = require('node:fs');

const data = fs.readFileSync('input0.txt', 'utf8');
const dataArr = data
    .split('\r\n');
// console.log(dataArr);


const groupsReg = /([\.O]*)[#]/gd;
const roundedReg = /O/g;
const emptyArr = [];
// console.log(groupsReg.toString());

const dishArr = dataArr.map(line => line.split(''));

const start = performance.now();
// const rotated = rotatePatternRight(dataArr)
//     .map(line => line + '#');
// // console.log('');
// // console.log('rotated');
// // rotated.forEach(line => console.log(line));
// const rotilted = rotated.map(line => tiltLine(line));


// data structures
// TODO: create as much useful data in analisys stage as possible
// TODO: to avoid creating any garbage for GC in spinning cyces;
// TODO: use const sq = '#', rd = 'O', sp = '.'
// TODO: and TypedArrays (Int8Array instead of Array)
// TODO: for fasted array operations (loops included)

// analysis
// TODO: analyze string arrays (unrotated & rotated) with regex
// TODO: so that each line has an array of sqRocks (#) positions
// TODO: and lane ranges

// working arrays of arrays (each char is an item)
// TODO: construct arrays (unrotated & rotated) of arrays for rotating
// TODO: without creating any extra objects in the process

// efficient spinning cycles
// TODO: use reduce to to get rdRocks (O) count in ranges
// TODO: dictaded by sqRocks (#) positions from analysis;
// TODO: use fill on lines with lane ranges from analysis;
// TODO: take into account lanes lengths and rdRocks (O) counts
// TODO: line.fill('.', startLane, startLane + laneLen - sqRocks)
// TODO: line.fill('O', startLane + laneLen - sqRocks, endLane)


console.log(analyze(dishArr));


/* 
let cycled = [...dataArr];
for (let i = 0; i < 100; i++) {
    cycled = spinCycle(cycled);

    show(cycled, 'cycle ' + (i + 1));
}
 */

const end = performance.now();
/* 
// total load calculation
const linesCount = cycled.length;
let totalLoad = 0;
for (let i = 0; i < linesCount; i++) {
    const line = cycled[i];
    const rockCount = countRounded(line);
    const multiplier = linesCount - i;
    const load = rockCount * multiplier;
    totalLoad += load;
}
console.log({ totalLoad });
 */


// time keeping
var time = end - start; // time in ms
var moreThanSecond = time > 1000;
var moreThanMinute = time > 60000;
var timeMod = (time / 1000) % 60;
var timeFormatted = moreThanMinute ?
    `${((time / 1000) - timeMod) / 60}m ${Math.round(timeMod)}s` :
    moreThanSecond ? `${Math.round(time / 10) / 100}s` : `${Math.round(time)}ms`;
console.log(timeFormatted); // "1m 11s"


// array based functions
function analyze(dishArr) {
    const analysys = [];
    for (let i = 0; i < dishArr.length; i++) {
        console.log('');
        const line = dishArr[i];
        const lineStr = line.join('');
        console.log(lineStr);
        const squareRocks = [];
        // line.forEach((char,r) => char === 'O' && squareRocks.push(r));
        line.forEach((char, r) => char === '#' && squareRocks.push(r));
        console.log('# indices', squareRocks);

        let lane = 0;
        const roundedCount = line.reduce((acc, char, index) => {
            if (squareRocks.includes(index)) {
                acc.push(0);
                lane++
            } else if (char === 'O') {
                acc[lane]++
            }
            return acc;
        }, [0]);
        console.log('roundedCount', roundedCount);

        let laneIndex = 0;
        const lanes = line.reduce((acc, char, index) => {
            if (squareRocks.includes(index)) {
                acc.push([index + 1, index + 1]);
                laneIndex++
            } else {
                acc[laneIndex][1]++
            }
            return acc;
        }, [[0, 0]]);
        lanes.forEach((lane) => {
            console.log('lanes', lane, lineStr.substring(...lane));
            // console.log();
        })


        analysys.push(roundedCount);
    }

    return analysys;
}

function spinCycle(rotilted) {
    let rotated;
    // let rotilted = dish;
    for (let i = 0; i < 4; i++) {
        rotated = rotatePatternRight(rotilted)
        // .map(line => line + '#');
        rotilted = rotated.map(line => tiltLine(line + '#').slice(0, -1));
        // show(rotilted, i)
    }
    return rotilted;
}

// regex based functions
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
    return (lane.match(roundedReg) || emptyArr).length;
    // return lane.split('').filter(char => char === 'O').length;
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
    console.log(pattern[0][0]);
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


function show(dish, name) {
    console.log(name);
    dish.forEach(line => console.log(line));
    console.log('');
}
