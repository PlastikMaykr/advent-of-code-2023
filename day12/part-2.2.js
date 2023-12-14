const fs = require('node:fs');

const data = fs.readFileSync('output2.txt', 'utf8');
const dataArr = data
    .split('\r\n')
    .map(d => d.split(' '));
console.log(dataArr);

const springRows = [];
for (let [conditions, groups] of dataArr) {
    springRows.push({
        conditions,
        groups: groups.split(',')
    })
}
console.log(springRows[0]);


const counts = fs.readFileSync('output3.txt', 'utf8');
const lastCount = counts.split('\r\n')//.length;
console.log(lastCount, lastCount.length);


// for (let row of springRows) {
for (let i = lastCount.length - 1; i < springRows.length; i++) {
    // console.log(i, springRows[i]);
    const row = springRows[i];

    let { conditions, groups } = row;
    if (!conditions.includes('?')) {
        row.solutions = conditions;
        row.count = 1;

        fs.appendFileSync('output3.txt', '1\r\n');
        continue;
    }

    let unsolved = [conditions];
    let solutions = [];
    let count = 0;
    console.log(conditions.length);
    const reg = buildReg(groups);

    for (let i = 0; i < unsolved.length; i++) {
        const current = unsolved[i];
        const q = current.indexOf('?');

        const currDot = replaceAt(current, q, '.');
        if (reg.test(currDot)) {
            if (currDot.includes('?')) {
                unsolved.push(currDot);
            } else {
                solutions.push(currDot);
                count++;
            }
            console.log(currDot);
        }
        const currHash = replaceAt(current, q, '#');
        if (reg.test(currHash)) {
            if (currHash.includes('?')) {
                unsolved.push(currHash);
            } else {
                solutions.push(currHash);
                count++;
            }
            console.log(currHash);
        }
    }
    row.unsolved = unsolved;
    row.solutions = solutions;
    row.count = count;

    fs.appendFileSync('output3.txt', count + '\r\n');
}
console.log(springRows);

const arrangements = springRows.map(({ count }) => count);
const arrangementTotal = arrangements.reduce((sum, num) => sum + num);
console.log({ arrangements, arrangementTotal });


function buildReg(arr) {
    var ends = '[?\\.]*'
    var mid = '([?#]{'
    var dle = '})[?\\.]+'

    var expr = '^' + ends;
    arr.forEach(num => {
        expr += mid + num + dle;
    })
    // expr += ends + '$';
    expr = replaceAt(expr, expr.length - 1, '*$')

    var reg = new RegExp(expr)
    console.log(reg.toString());
    return reg;
}

function reverse(str) {
    return str.split('').reverse().join();
}
function replaceAt(str, index, replacement) {
    return str.substring(0, index) + replacement + str.substring(index + 1);
}