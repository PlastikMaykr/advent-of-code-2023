const { match } = require('node:assert');
const fs = require('node:fs');

// const data = fs.readFileSync('output2.txt', 'utf8');
// const dataArr = data
//     .split('\r\n')
//     .map(d => d.split(' '));
// console.log(dataArr);

// const springRows = [];
// for (let [conditions, groups] of dataArr) {
//     springRows.push({
//         conditions,
//         groups: groups.split(',')
//     })
// }
// console.log(springRows[0]);

const rowRaw = '.??..??...?##. 1,1,3'
    .split(' ');
const row = {
    conditions: rowRaw[0],
    groups: rowRaw[1].split(',')
};

const conditions = rowRaw[0];
const groups = rowRaw[1].split(',');

console.log({ rowRaw, row });

const reg = buildReg(groups);

let unsolved = { '-1': [['', conditions]] };
let solutions = [];


for (let g = 0; g < groups.length; g++) { // g => group
    // if (g > 1) continue;
    const group = groups[g];
    const isLast = g === groups.length - 1;
    unsolved[g] = [];
    // unsolved[g].group = group;

    let filling = '#'.repeat(group)
    if (!isLast) filling += '.'
    console.log('');
    console.log(`The group ${g} # count is ${group}: ${filling}`);
    // var one = /(?<two>[?#]{2,})[\.]+/;
    // var one = /([?#]{2,}?)[?\.]+?/;
    // var regGroup = new RegExp(`([?#]{${group},}?)[?\.]+?`);
    var regGroup = buildGroupExpr(group, isLast)
    for (let [past, cond] of unsolved[g - 1]) {
        const q = cond.indexOf('?');

        const condDota = replaceAt(cond, q, '.');
        // const testDot = reg.test(condDota);
        const matchDota = regGroup.exec(condDota);
        console.log({ past, cond, condDota, regGroup });
        if (matchDota) {
            console.log({ matchDota });
            // console.log({ indices: matchDota.indices });
            let [solDota, futureDota] = splitAt(condDota, matchDota.indices[0][1]);
            const replaDota = solDota.replace(regGroup, filling)
            const thisDota = past + replaDota;
            console.log({ solDota, replaDota });
            console.log({ thisDota, futureDota });
            unsolved[g].push([thisDota, futureDota]);
        }

        const condHash = replaceAt(cond, q, '#');
        // const testHash = reg.test(condHash);
        const matchHash = regGroup.exec(condHash);
        console.log({ past, cond, condHash, regGroup });
        if (matchHash) {
            console.log({ matchHash });
            // console.log({ indices: matchHash.indices });
            let [solHash, futureHash] = splitAt(condHash, matchHash.indices[0][1]);
            const replaHash = solHash.replace(regGroup, filling)
            const thisHash = past + replaHash;
            console.log({ solHash, replaHash });
            console.log({ thisHash, futureHash });
            unsolved[g].push([thisHash, futureHash]);
        }
    }
    if (isLast) {
        // solutions.push(unsolved[g].flat().filter(d => d !== ''))
        solutions = unsolved[g].map(d => d[0]);
    }
}

function isSolved(springs) {
    return !springs.includes('?');
}

function replacer(group, match, p, offset, str, groups) {
    // const replacer = (group, match, p, offset, str, groups) => {
    // console.log(group)
    // console.log({ group, match, p, offset, str, groups });
    console.log({ str, match, offset });
    const hashGroup = '#'.repeat(group) + '.'
    return hashGroup;
}


const output = {
    conditions,
    groups,
    reg: reg.toString(),
    unsolved,
    solutions,
    count: solutions.length
};
fs.writeFileSync('outputX.json', JSON.stringify(output, null, 2));


// const counts = fs.readFileSync('output3.txt', 'utf8');
// const lastCount = counts.split('\r\n')//.length;
// console.log(lastCount, lastCount.length);

/* 
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
 */

// const arrangements = springRows.map(({ count }) => count);
// const arrangementTotal = arrangements.reduce((sum, num) => sum + num);
// console.log({ arrangements, arrangementTotal });


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

function buildGroupExpr(group, last = false) {
    // /([?#]{2,}?)[?\.]+?/;
    // '([?#]{2,}?)[?\.]+?'
    let expr = `([?#]{${group},}?)`;
    expr += last ? '[?\\.]*$' : '[?\\.]+?';
    console.log(expr);
    return new RegExp(expr, 'd');
}

function splitAt(str, i = 0) { // ('abcdef', 3) => [ 'abc', 'def' ]
    return [
        str.slice(0, i),
        str.slice(i)
    ]
}

function reverse(str) {
    return str.split('').reverse().join();
}

function replaceAt(str, index, replacement) {
    return str.substring(0, index) + replacement + str.substring(index + 1);
}