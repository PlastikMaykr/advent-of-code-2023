const { match } = require('node:assert');
const { count } = require('node:console');
const fs = require('node:fs');

const data = fs.readFileSync('output.txt', 'utf8');
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


const notSolved = new RegExp('\\?');
function isSolved(conditions) {
    return !notSolved.test(conditions);
}

for (let row of springRows) {
    let { conditions, groups } = row;
    if (isSolved(conditions)) {
        row.solutions = conditions;
        row.count = 1;
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

        const { done, wip } = findSolutions(current, q, reg);
        console.log({ done, wip });
        count += done.length;
        solutions.push(...done);
        unsolved.push(...wip);
    }
    row.unsolved = unsolved;
    row.solutions = solutions;
    row.count = count;
}
console.log(springRows);

const arrangements = springRows.map(({count}) => count);
const arrangementTotal = arrangements.reduce((sum, num) => sum + num);
console.log({arrangements, arrangementTotal});


function findSolutions(conditions, q, reg) {
    let done = [], wip = [];
    const mutated = [
        replaceAt(conditions, q, '.'),
        replaceAt(conditions, q, '#')
    ];
    mutated.forEach(cond => {
        const matcha = cond.match(reg);
        if (!matcha || matcha[0] !== cond) return;
        isSolved(cond) ? done.push(cond) : wip.push(cond);
    });

    return { done, wip }
}

function buildReg(arr) {
    var ends = '[?\\.]*'
    var mid = '([?#]{'
    var dle = '})[?\\.]+'

    var expr = '^' + ends;
    arr.forEach(num => {
        expr += mid + num + dle;
    })
    // expr += ends + '$';
    expr = replaceAt(expr, expr.length - 1, '*')

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
