const fs = require('node:fs');

const data = fs.readFileSync('input0.txt', 'utf8');
const dataArr = data
    .split('\r\n\r\n')
    .map(d => d.split('\r\n'));
// console.log(dataArr);

// const patterns = dataArr.map(pattern => { return { pattern, multi: 100 } });
const pattern = dataArr[1];
console.log(pattern);
// console.log(findPotLines(pattern));

let score = getPotScore(pattern);

console.log(score);

// const output = JSON.stringify(patterns,null,2);
// fs.writeFileSync('output1.txt', output);

function contrastLines(line1, line2) {
    // difference 0 - identical
    // difference 1 - potential smudge
    // difference 2 - no match
    let diff = 0;
    if (line1 !== line2) {
        for (let i = 0; i < line1.length; i++) {
            if (line1[i] !== line2[i]) diff++;
            if (diff > 1) break;
        }
    }
    return diff;
}
function compareLines(line1, line2) {
    const comparison = {
        lines: [line1, line2]
    }
    // difference 0 - identical
    // difference 1 - potential smudge
    // difference 2 - no match
    let diff = 0;
    if (line1 !== line2) {
        for (let i = 0; i < line1.length; i++) {
            if (line1[i] !== line2[i]) diff++;
            if (diff > 1) break;
        }

    }
    comparison.diff = diff;
    return comparison
}

function findLines(pattern) {
    console.log('lines ', pattern);
    const lines = [];
    for (let i = 1; i < pattern.length; i++) {
        if (pattern[i - 1] === pattern[i]) lines.push(i);
    }
    return lines;
}

function findPotLines(pattern) {
    // console.log('lines ', pattern);
    const lines = [];
    for (let i = 1; i < pattern.length; i++) {
        if (contrastLines(pattern[i - 1], pattern[i]) < 2) lines.push(i);
    }
    return lines;
}

function detectPotReflection(pattern, line) { // is line a reflection?
    // console.log(pattern, line);
    let count = 0,
        smuges = 0,
        patUp = pattern[line - 1 - count],
        patDown = pattern[line + count];
    while (patUp && patDown) {
        // console.log({ count, patUp, patDown });
        const diff = contrastLines(patUp, patDown);
        if (diff == 2) {
            return false;
        } else if (diff == 1) {
            smuges++;
        }
        
        if (smuges > 1) return false;

        count++;
        patUp = pattern[line - 1 - count];
        patDown = pattern[line + count];
    }
    return true;
}

function detectReflection(pattern, line) { // is line a reflection?
    console.log(pattern, line);
    let count = 0,
        patUp = pattern[line - 1 - count],
        patDown = pattern[line + count];
    while (patUp && patDown) {
        console.log({ count, patUp, patDown });
        if (patUp !== patDown) return false;

        count++;
        patUp = pattern[line - 1 - count];
        patDown = pattern[line + count];
    }
    return true;
}

function getPotScore(pattern) {
    const lines = findPotLines(pattern);
    console.log(lines);
    let reflection = NaN;
    for (let line of lines) {
        if (detectPotReflection(pattern, line)) {
            reflection = line;
            break;
        }
    }
    return reflection;
}

function getScore(pattern) {
    const lines = findLines(pattern);
    let reflection = NaN;
    for (let line of lines) {
        if (detectReflection(pattern, line)) {
            reflection = line;
            break;
        }
    }
    return reflection;
}

function rotatePattern(pattern) {
    // if (i !== 0) break;
    const rowsCount = pattern.length;
    const colsCount = pattern[0].length;
    // console.log({ rowsCount, colsCount });
    let rotated = Array(colsCount);
    for (let y = rowsCount - 1; y >= 0; y--) {
        const line = pattern[y];
        for (let x = 0; x < colsCount; x++) {
            if (y === rowsCount - 1) {
                // console.log(unrotated[y][x]);
                rotated[x] = Array(rowsCount);
            }

            rotated[x][rowsCount - y] = pattern[y][x];
        }
    }
    return rotated.map(d => d.join(''));
}
