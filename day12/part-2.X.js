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

const timeStart = performance.now();

const rowRaw = '?????#?.?###??????#?.?###??????#?.?###??????#?.?###??????#?.#### 1,1,2,4,1,1,2,4,1,1,2,4,1,1,2,4,1,1,2,4'
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
let solved// = [];


for (let g = 0; g < groups.length; g++) { // g => group
    // if (g > 1) continue;
    const group = groups[g];
    const isLast = g === groups.length - 1;
    unsolved[g] = [];
    // unsolved[g].group = group;

    let filling = '#'.repeat(group);
    if (!isLast) filling += '.'
    console.log('');
    console.log(`The group ${g} # count is ${group}: ${filling}`);
    // var one = /(?<two>[?#]{2,})[\.]+/;
    // var one = /([?#]{2,}?)[?\.]+?/;
    // var regGroup = new RegExp(`([?#]{${group},}?)[?\.]+?`);
    var regGroup = buildGroupExpr(group, isLast)
    for (let [past, cond] of unsolved[g - 1]) {

        //TODO: while (regGroup.test(replaceAt(cond, q, '.')))

        const q = cond.indexOf('?');

        const condDota = replaceAt(cond, q, '.');
        const testDota = reg.test(past + condDota);
        if (testDota) {
            // console.group('Dota')
            // console.log(unsolved[g - 1]);
            // console.log([past,cond]);
            console.log('(', group, ')', g, '/', groups.length - 1, past, condDota);
            // console.groupEnd('Dota')
            if (condDota.indexOf('?') === 1) {
                const moveDot = splitMove([past, condDota], 1);
                unsolved[g - 1].push(moveDot);
            }
            // const [thisGroup, nextGroups] = matchGroup(condDota,regGroup);
            unsolved[g].push(matchGroup(past, condDota, regGroup, filling));
        }

        const condHash = replaceAt(cond, q, '#');
        const testHash = reg.test(past + condHash);
        if (testHash) {
            // const [thisGroup, nextGroups] = matchGroup(condHash,regGroup);
            unsolved[g].push(matchGroup(past, condHash, regGroup, filling));
        }

        // const matchDota = regGroup.exec(condDota);
        // console.log({ past, cond, condDota, regGroup });
        // if (matchDota) {
        //     console.log({ matchDota });
        //     // console.log({ indices: matchDota.indices });
        //     let [solDota, futureDota] = splitAt(condDota, matchDota.indices[0][1]);
        //     const replaDota = solDota.replace(regGroup, filling)
        //     const thisDota = past + replaDota;
        //     console.log({ solDota, replaDota });
        //     console.log({ thisDota, futureDota });
        //     unsolved[g].push([thisDota, futureDota]);
        // }

        // const condHash = replaceAt(cond, q, '#');
        // const testHash = reg.test(condHash);
        // const matchHash = regGroup.exec(condHash);
        // console.log({ past, cond, condHash, regGroup });
        // if (matchHash) {
        //     console.log({ matchHash });
        //     // console.log({ indices: matchHash.indices });
        //     let [solHash, futureHash] = splitAt(condHash, matchHash.indices[0][1]);
        //     const replaHash = solHash.replace(regGroup, filling)
        //     const thisHash = past + replaHash;
        //     console.log({ solHash, replaHash });
        //     console.log({ thisHash, futureHash });
        //     unsolved[g].push([thisHash, futureHash]);
        // }
    }
    if (isLast) {
        solved = new Set(unsolved[g].map(d => d[0] + '.'.repeat(d[1].length)));
    }
}

const solutions = [...solved.keys()].sort();

const timeEnd = performance.now();
const time = Math.round(timeEnd - timeStart);
const moreThanSecond = time > 1000;
const moreThanMinute = time > 60000;
const timeMod = (time / 1000) % 60;
const timeFormatted = moreThanMinute ? `${((time / 1000) - timeMod) / 60}m ${Math.round(timeMod)}s` :
    moreThanSecond ? `${Math.round(time / 10) / 100}s` : `${time}ms`;

function matchGroup(past, condDota, regGroup, hashFill) {
    const matcha = regGroup.exec(condDota);
    if (!matcha) return null;
    // console.log(matcha);

    const dotsStr = matcha.groups.dots;
    const dotsIdx = matcha.indices.groups.dots;
    const hashStr = matcha.groups.hash;
    const hashIdx = matcha.indices.groups.hash;

    const dotsFill = '.'.repeat(dotsStr.length);

    // console.log('\nMatch group report:');
    // console.log({
    //     examined: condDota,
    //     reg: regGroup.toString(),
    //     match: matcha[0],
    //     dotsMatch: [dotsStr, dotsIdx],
    //     hashMatch: [hashStr, hashIdx],
    //     fill: [dotsFill, hashFill],
    // });

    const [, future] = splitAt(condDota, hashIdx[1]);
    const present = past + dotsFill + hashFill;

    return [present, future]
}


const output = {
    conditions,
    groups,
    reg: reg.toString(),
    unsolved,
    solutions,
    count: solved.size,
    time: timeFormatted
};
fs.writeFileSync('outputX.json', JSON.stringify(output, null, 2));



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
    // let expr = `([?#]{${group},}?)`;
    // let expr = `^(?<dots>[\\?\\.]*?)(?<hash>[\\?#]{${group},}?)`;
    // expr += last ? '[?\\.]*$' : '[?\\.]+?';
    // let expr = `^(?<dots>[\\?\\.]*?)(?<hash>[\\?#]{${group}})`;
    let expr = `^(?<dots>[\\?\\.]*?)(?<hash>[\\?#]{${group}}`;
    expr += last ? ')' : '[?\\.])';
    console.log(expr);
    return new RegExp(expr, 'd');
}

function splitAt(str, i = 0) { // ('abcdef', 3) => [ 'abc', 'def' ]
    return [
        str.slice(0, i),
        str.slice(i)
    ]
}

function splitMove(split, v = 0) { // (['abc', 'def'], 2) => [ 'abcde', 'f' ]
    if (!v) return split;
    let [str1, str2] = split;
    const i = str1.length + v;
    return splitAt(str1 + str2, i);
}

function reverse(str) {
    return str.split('').reverse().join();
}

function replaceAt(str, index, replacement) {
    return str.substring(0, index) + replacement + str.substring(index + 1);
}