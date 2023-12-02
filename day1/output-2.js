const fs = require('node:fs');

const data = fs.readFileSync('input.txt', 'utf8');
const dataArr = data.split('\r\n');
// [
//     'two1nine',
//     'eightwothree',
//     'abcone2threexyz',
//     'xtwone3four',
//     '4nineeightseven2',
//     'zoneight234',
//     '7pqrstsixteen'
// ];

const digits = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
let stigid;
//

let lookup = {};
for (let i = 0; i < 9; i++) {
    lookup[digits[i]] = i + 1;
}
// {
//     one: 1,
//     two: 2,
//     three: 3,
//     four: 4,
//     five: 5,
//     six: 6,
//     seven: 7,
//     eight: 8,
//     nine: 9
// };

const pattern = digits.join('|');

const reg = new RegExp(pattern, 'g');
const ger = new RegExp(revStr(pattern));

function replacer(match) {
    // console.log(match);
    return lookup[match];
}
function recalper(match) {
    const hctam = revStr(match)
    // console.log(lookup[hctam]);
    return lookup[hctam];
}
// console.log(dataArr[9].replaceAll(reg, replacer));

function revStr(str) {
    const rts = str;
    return rts.split('').reverse().join('');
}
// console.log(revStr(dataArr[9]));


function calibVals(s) {
    const str = s.replace(reg, replacer);
    // const len = str.length;
    let a;
    for (let i = 0; i < str.length; i++) {
        if (!isNaN(Number(str[i]))) {
            a = str[i];
            break;
        }
    }

    const rts = revStr(s).replace(ger, recalper);
    let b;
    for (let i = 0; i < rts.length; i++) {
    // for (let i = len; i >= 0; i--) {
        if (!isNaN(Number(rts[i]))) {
            b = rts[i];
            break;
        }
    }
    // console.log({s, rts, a, b , sum: a + b});
    return parseInt(a + b);
}

const outputArr = [];
let output = 0;

for (let i = 0; i < dataArr.length; i++) {
    const val = calibVals(dataArr[i]);
    if (isNaN(val)) throw new Error('NAN!', val); // FIXME:
    outputArr.push(val);
    output += val;
}

// console.dir(outputArr);
console.log(output);
