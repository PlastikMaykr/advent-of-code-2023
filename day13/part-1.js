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
    let score = getScore(pattern);

    if (isNaN(score)) {
        const rotated = rotatePattern(pattern);
        pat.rotated = rotated;
        pat.multi = 1;
        score = getScore(rotated);
    }
    if (isNaN(score)) throw new Error('No reflection detected.')

    pat.score = score * pat.multi;
}
console.log(...patterns);

const sumScores = patterns.map(d => d.score).reduce((acc, cur) => acc + cur);
console.log(sumScores);


function findLines(pattern) {
    console.log('lines ', pattern);
    const lines = [];
    for (let i = 1; i < pattern.length; i++) {
        if (pattern[i - 1] === pattern[i]) lines.push(i);
    }
    return lines;
}

function detectReflection(pattern, line) { // is line a reflection?
    console.log(pattern, line);
    let count = 0,
        patUp = pattern[line - 1 - count],
        patDown = pattern[line + count];
    while (patUp && patDown) {
        console.log({count, patUp, patDown});
        if (patUp !== patDown) return false;
        
        count++;
        patUp = pattern[line - 1 - count];
        patDown = pattern[line + count];
    }
    return true;
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


// const output = JSON.stringify(patterns,null,2);
// fs.writeFileSync('output1.txt', output);
