const fs = require('node:fs');

const data = fs.readFileSync('input.txt', 'utf8');
const dataArr = data
    .split(',');
console.log(dataArr);

// const str = 'HASH';
// const algo = hashAlgorithm(str);
// console.log(algo);

let sum = 0;
for (let i = 0; i < dataArr.length; i++) {
    const str = dataArr[i];
    sum += hashAlgorithm(str);
}
console.log(sum);


function hashAlgorithm(str) {
    const chars = str.split('');
    const result = chars.reduce((acc, cur) => {
        // console.log('');
        // console.log(cur);
        let val = acc + cur.charCodeAt(0);
        // console.log('ACII: ', val);
        val *= 17;
        // console.log('x17: ', val);
        val %= 256;
        // console.log('%256: ', val);

        return val;
    }, 0);
    return result;
}
