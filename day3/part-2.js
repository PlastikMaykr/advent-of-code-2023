const fs = require('node:fs');

const data = fs.readFileSync('input.txt', 'utf8');
const dataArr =
    data.split('\r\n').map(d => d + '.');
// [
//     '467..114..',
//     '...*......',
//     '..35..633.',
//     '......#...',
//     '617*......',
//     '.....+.58.',
//     '..592.....',
//     '......755.',
//     '...$.*....',
//     '.664.598..'
// ];

const lineLen = dataArr[0].length;
const sym = '*';

const potGears = new Map();
for (let y = 0; y < dataArr.length; y++) { // lines
    let partNum = '';
    let start = 0;
    let count = 1;
    for (let x = 0; x < lineLen; x++) { // characters
        const char = dataArr[y][x];
        if (!isNaN(char)) {
            // concatenate digit
            if (partNum === '') start = x;
            else count++;
            partNum += char;
        } else {
            if (partNum === '') continue;
            // check concatenated number 
            const checkStart = clamp(start - 1, lineLen);
            const checkEnd = clamp(start + count + 1, lineLen);

            logPart(y, checkStart, checkEnd, partNum);
            y > 0 && logPart(y - 1, checkStart, checkEnd, partNum);
            y < dataArr.length - 1 && logPart(y + 1, checkStart, checkEnd, partNum);

            // reset
            partNum = '';
            start = 0;
            count = 1;
        }
    }
}

function logPart(line, start, end, num) {
    const str = dataArr[line].substring(start, end);
    if (!str.includes(sym)) return;

    // console.log(str);
    for (let char = start, i = 0; char < end; char++, i++) {
        if (str[i] === sym) {
            const key = `${line},${char}`;
            // console.log(key);
            potGears.has(key) || potGears.set(key, []);
            potGears.get(key).push(parseInt(num));
        }
    }
}

function clamp(num, min, max) {
    if (!max) {
        max = min;
        min = 0;
    }
    return num < min ? min : num > max ? max : num;
}

// console.log(potGears);

const gearRatios = [];
let sumRatios = 0;
potGears.forEach(gear => {
    if (gear.length === 2) {
        const gearRatio = gear[0] * gear[1];
        gearRatios.push(gearRatio);
        sumRatios += gearRatio;
    }
});

console.log(gearRatios);
console.log(sumRatios);
