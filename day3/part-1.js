const fs = require('node:fs');

const data = fs.readFileSync('input.txt', 'utf8');
const dataArr =
    data.split('\r\n').map(d => d + '.');
    // [ '.+4.5-.1' ]
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
// dataArr = dataArr.map(d => d + '.');
console.log(dataArr);

const symbols = new Set(data.split(''));
symbols.forEach(char => {
    if (
        !char.trim().at(0) ||
        !isNaN(char) ||
        char === '.'
    ) {
        symbols.delete(char);
    }
});
// console.log([...symbols]);

const lineLen = dataArr[0].length;
// console.log(lineLen);

let partNums = [];
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
            let checkStr = '';

            if (y > 0) checkStr += dataArr[y - 1].substring(checkStart, checkEnd);
            checkStr += dataArr[y].substring(checkStart, checkEnd);
            if (y < dataArr.length - 1) checkStr += dataArr[y + 1].substring(checkStart, checkEnd);

            // symbols.forEach(sym => {});
            for (let sym of symbols) {
                // console.log(sym);
                if (checkStr.includes(sym)) {
                    console.log([y, sym, partNum, checkStr]);
                    partNums.push(parseInt(partNum));
                    break;
                }
            }

            // console.assert(partNum === '', [partNum, start, count]);
            // console.log([partNum, start, count]);

            partNum = '';
            start = 0;
            count = 1;
        }
    }
}
// console.log(partNums.length);

function clamp(num, min, max) {
    if (!max) {
        max = min;
        min = 0;
    }
    return num < min ? min : num > max ? max : num;
}

const sumPartNums = partNums.reduce((acc, cur) => acc + cur);
console.log(sumPartNums);
