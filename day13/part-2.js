const fs = require('node:fs');

const data = fs.readFileSync('input.txt', 'utf8');
const dataArr = data
    .split('\r\n\r\n')
    .map(d => d.split('\r\n'));
// console.log(dataArr);

const patterns = dataArr.map(pattern => { return { pattern, multi: 100 } });
// console.log(patterns);

for (let pat of patterns) {
    const pattern = pat.pattern;
    let score = getPotScore(pattern);

    if (isNaN(score)) {
        const rotated = rotatePattern(pattern);
        pat.rotated = rotated;
        pat.multi = 1;
        score = getPotScore(rotated);
    }
    if (isNaN(score)) throw new Error('No reflection detected.')

    pat.score = score * pat.multi;
}
// console.log(...patterns);

const sumScores = patterns.map(d => d.score).reduce((acc, cur) => acc + cur);
console.log(sumScores);

// const output = JSON.stringify(patterns,null,2);
// fs.writeFileSync('output2.txt', output);

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

function findLines(pattern) {
    // console.log('lines ', pattern);
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

function detectReflection(pattern, line) { // is line a reflection?
    // console.log(pattern, line);
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
    // console.assert(smuges === 1, 'NO SMUGES!');
    return smuges === 1 ? true : false;
    // return true;
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

function getPotScore(pattern) {
    const lines = findPotLines(pattern);
    // console.log(lines);
    let reflection = NaN;
    for (let line of lines) {
        if (detectPotReflection(pattern, line)) {
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
