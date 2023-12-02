const fs = require('node:fs');

const data = fs.readFileSync('input.txt', 'utf8');
const dataArr = data.split('\r\n');

function calibVals(str) {
    let a, b;
    const len = str.length;
    for (let i = 0; i < len; i++) {
        if (!isNaN(Number(str[i]))) {
            a = str[i];
            break;
        }
    }
    for (let i = len; i >= 0; i--) {
        if (!isNaN(Number(str[i]))) {
            b = str[i];
            break;
        }
    }
    // console.log({ a, b });
    return parseInt(a + b);
}

const outputArr = [];
let output = 0;

for (let i = 0; i < dataArr.length; i++) {
    const val = calibVals(dataArr[i]);
    outputArr.push(val);
    output += val;
}

console.dir(output);
